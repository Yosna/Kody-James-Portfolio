--[[
	Tracks synthesis results, items crafted, materials used, material loss rates, 
	item costs, gil lost, and overall profit.

	Addon Commands: //st <command>
		<on / start>   - Enable synthesis tracking.
		<off / stop>   - Disable synthesis tracking.
		<clear / c>    - Clear tracked synthesis information.
		<export / e>   - Export tracked synthesis information. 
		<autoexport>   - Toggles auto exporting for tracked synthesis information.
		
		<cost>         - Set item cost for gil tracking.
			- Arguments: <cost> <item name> <item cost> <cost divisor (optional)>
			
		<file>         - Read a previously logged file in-game.
			- Arguments: <file> <character> <item name> <YYYY-MM-DD>
			- If "today" is specified instead of a date, the current day is pulled.

	Synthesis tracking and auto-export are both enabled by default.
	
	Results are exported to windower\addons\SynthesisTracker\Results\<Character>\<Item>\YYYY-MM-DD.log

	Gil Tracking Examples:
	-- //st cost eschite ore 6000000 12   > Eschite Ore >> Cost: 500,000.00
	-- //st cost cyan coral 1126125       > Cyan Coral >> Cost: 1,126,125.00
	File Reading Examples: 
	-- //st file yosna silver thread 2020-12-16
	-- //st file yosna cursed cuisses today
]]

_addon.name = 'Synthesis Tracker'
_addon.author = 'Yosna'
_addon.version = '1.3.2'
_addon.command = 'st'

require('tables')
require('logger')
res = require('resources')
packets = require('packets')
config = require('config')
texts = require('texts')
files = require('files')

local defaults = {
	display = {
		synthesis = {
			pos = {
				x = 480,
				y = 520,
			},
			text = {
				font = 'Consolas',
				size = 12,
				alpha = 255,
				red = 255,
				green = 255,
				blue = 255,
			},
			bg = {
				alpha = 200,
				red = 0,
				green = 0,
				blue = 0,
			},
			padding = 3,
		},
		materials = {
			pos = {
				x = 245,
				y = 520,
			},
			text = {
				font = 'Consolas',
				size = 12,
				alpha = 255,
				red = 255,
				green = 255,
				blue = 255,
			},
			bg = {
				alpha = 200,
				red = 0,
				green = 0,
				blue = 0,
			},
			padding = 3,
		},
		costs = {
			pos = {
				x = 1,
				y = 520,
			},
			text = {
				font = 'Consolas',
				size = 12,
				alpha = 255,
				red = 255,
				green = 255,
				blue = 255,
			},
			bg = {
				alpha = 200,
				red = 0,
				green = 0,
				blue = 0,
			},
			padding = 3,
		},
	},
}

settings = config.load(defaults)
config.save(settings)

local text_boxes = T {
	synthesis_display = texts.new(defaults.display.synthesis),
	material_display = texts.new(defaults.display.materials),
	cost_display = texts.new(defaults.display.costs),
}

local conditions = {
	tracking = true,
	auto_export = true,
	exporting = false,
	broken = false,
}

local synthesis = T {
	total  = { results = 0, percent = 0 },
	breaks = { results = 0, percent = 0 },
	NQ     = { results = 0, percent = 0 },
	HQ     = { results = 0, percent = 0 },
	HQ1    = { results = 0, percent = 0 },
	HQ2    = { results = 0, percent = 0 },
	HQ3    = { results = 0, percent = 0 },
}
   
local bag_data = T {
	inventory = { name = 'inventory', 	id = 0, },
	satchel =   { name = 'satchel',     id = 5, },
	sack =      { name = 'sack',        id = 6, },
	case =      { name = 'case',        id = 7, },
}

local items_crafted = T {}
local item_list = T {}
local materials_used = T {}
local material_list = T {}
local materials_remaining = T {}
local costs_to_set = T {}

local function calculate_gil(calculation)
	local earned = 0
	local lost = 0
	for item in items_crafted:it() do
		earned = earned + (item.cost * item.crafted)
	end
	for material in materials_used:it() do
		lost = lost + (material.cost * material.used)
	end
	
	local gil_earned = tonumber(string.format('%.2f', earned))
	local gil_lost = tonumber(string.format('%.2f', lost))
	
	if calculation == 'Earned' then return comma_format(gil_earned)
	elseif calculation == 'Lost' then return comma_format(gil_lost)
	elseif calculation == 'Profit' then return comma_format(gil_earned-gil_lost)
	elseif calculation == 'Cost' then return gil_lost
	elseif calculation == 'Visibility' then
		if gil_earned > 0 or gil_lost > 0 then return true else return false end
	end
end

local function append_boxes(box_type, display_string)
	if box_type == 'Synthesis' then 
		text_boxes.synthesis_display:append(display_string)
	elseif box_type == 'Materials' then 
		text_boxes.material_display:append(display_string)
	elseif box_type == 'Costs' then 
		text_boxes.cost_display:append(display_string)
	end
	if conditions['exporting'] then file:append(display_string) end
end

local function update_display()
	for box in text_boxes:it() do box:clear() end

	append_boxes('Synthesis', 'Synthesis Results:\n')
	append_boxes('Synthesis', string.format('%-8s%3s\n\n',        'Total:',    synthesis.total.results                            ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n\n', 'Breaks:',   synthesis.breaks.results, synthesis.breaks.percent ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n\n', 'NQ:',       synthesis.NQ.results,     synthesis.NQ.percent     ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n',   'HQ:',       synthesis.HQ.results,     synthesis.HQ.percent     ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n',   'HQ1:',      synthesis.HQ1.results,    synthesis.HQ1.percent    ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n',   'HQ2:',      synthesis.HQ2.results,    synthesis.HQ2.percent    ))
	append_boxes('Synthesis', string.format('%-8s%3s%7.2f%%\n',   'HQ3:',      synthesis.HQ3.results,    synthesis.HQ3.percent    ))
	
	append_boxes('Materials', 'Items Crafted:\n')
	for item in items_crafted:it() do
		append_boxes('Materials', string.format('%-22s%3s\n', res.items[item.id].en..':', item.crafted))
	end
	append_boxes('Materials', '\nMaterials Used:\n')
	for material in materials_used:it() do
		append_boxes('Materials', string.format('%-22s%3s\n', res.items[material.id].en..':', material.used))
	end
	append_boxes('Materials', '\nMaterials Remaining:\n')
	for material in materials_remaining:it() do
		append_boxes('Materials', string.format('%-22s%3s\n', res.items[material.id].en..':', material.count))
	end
	
	append_boxes('Costs', 'Gil Stats:\n')
	for item in items_crafted:it() do
		if item.cost > 0 and item.crafted > 0 then 
			local formatted_gil_cost = comma_format(string.format('%.2f', (item.cost * item.crafted)))..' gil'
			local synths_per_item = string.format('%4.1f', synthesis.total.results / item.crafted)..'/i'
			append_boxes('Costs', string.format('%-25s\n', res.items[item.id].en..':'))
			append_boxes('Costs', string.format('%-8s%18s\n', synths_per_item, formatted_gil_cost))
		end
	end
	append_boxes('Costs', ' --------------------- \n')
	for material in materials_used:it() do
		if material.cost > 0 and material.used > 0 then 
			local formatted_gil_cost = comma_format(string.format('%.2f', (material.cost * material.used)))..' gil'
			local lost_per_break = material.used / synthesis.total.results
			local lost_per_synth = string.format('%4.2f', material.used / synthesis.total.results)..'/s'
			append_boxes('Costs', string.format('%-25s\n', res.items[material.id].en..':'))
			append_boxes('Costs', string.format('%-8s%18s\n', lost_per_synth, formatted_gil_cost))
		end
	end
	append_boxes('Costs', ' --------------------- \n')
	append_boxes('Costs', string.format('%-7s%15s%4s\n', 'Earned:', calculate_gil('Earned'), ' gil'))
	append_boxes('Costs', string.format('%-7s%15s%4s\n', 'Lost:', calculate_gil('Lost'), ' gil'))
	append_boxes('Costs', string.format('%-7s%15s%4s\n', 'Profit:', calculate_gil('Profit'), ' gil'))
	
	if #materials_remaining > 0 then 
		for box in text_boxes:it() do box:show() end
	else 
		for box in text_boxes:it() do box:hide() end
	end
	if not calculate_gil('Visibility') then text_boxes.cost_display:hide() end
end

local function check_item_costs()
	for item in items_crafted:it() do
		for item_to_set in costs_to_set:it() do
			if res.items[item.id].en == item_to_set.name then
				item.cost = item_to_set.cost
			end
		end
	end
	for material in materials_used:it() do
		for item_to_set in costs_to_set:it() do
			if res.items[material.id].en == item_to_set.name then
				material.cost = item_to_set.cost
			end
		end
	end
	update_display()
end

local function update_lists()
	for item_crafted in item_list:it() do
		local ignore = items_crafted:find(function(item) return item.id == item_crafted end)
		if not ignore then 
			items_crafted:append({
				id = item_crafted,
				crafted = 1,
				cost = 0,
			})
		else
			for item in items_crafted:it() do
				if item.id == item_crafted then
					item.crafted = item.crafted + 1
				end
			end
		end
	end
	
	for material_used in material_list:it() do
		local ignore = materials_used:find(function(material) return material.id == material_used end)
		if not ignore then
			materials_used:append({
				id = material_used,
				used = 1,
				cost = 0,
				broken = 0,
			})
		else
			for material in materials_used:it() do
				if material.id == material_used then
					material.used = material.used + 1
				end
			end
		end
	end
	
	for material in materials_remaining:it() do
		material.count = 0
		material.found = false
		for bag in bag_data:it() do
			for bag_index = 1, windower.ffxi.get_bag_info(bag.id).max do
				local item = windower.ffxi.get_items(bag.id, bag_index)
				if material.id == item.id then 
					material.count = material.count + item.count
					material.found = true
				end
			end
		end
		if not material.found then material.count = 0 end
	end
	
	item_list:clear()
	material_list:clear()
	
	check_item_costs()
end

local function get_item_data(item)
	item = string.lower(item)
	for index = 1, 65535 do
		if res.items[index] then 
			if (string.lower(res.items[index].en) == item) or (string.lower(res.items[index].enl) == item) then
				return res.items[index]
			end
		end
	end
	for index = 1, 65535 do
		if res.items[index] then 
			if (string.lower(res.items[index].en):contains(item) or res.items[index].enl:contains(item)) then
				return res.items[index]
			end
		end
	end
end

function comma_format(n) --credit http://richard.warburton.it
	local left,num,right = string.match(n,'^([^%d]*%d)(%d*)(.-)$')
	return left..(num:reverse():gsub('(%d%d%d)','%1,'):reverse())..right
end

local function export_synthesis_information()
	conditions['exporting'] = true
	
	local name = windower.ffxi.get_player().name
	local date = os.date('*t')
	
	if #items_crafted > 0 then
		item = res.items[items_crafted[1].id].en
		if tonumber(item[#item]) then item = string.slice(item,0,-4) end
		file_path = 'Results/%s/%s/%s-%s-%s.log':format(name,item,date.year,date.month,date.day)
	else
		file_path = 'Results/%s/No Item Crafted/%s-%s-%s.log':format(name,date.year,date.month,date.day)
	end
	
	file = files.new(file_path)
	if not file:exists() then file:create() else file:append('\n\n\n') end
	
	update_display()
	
	log('Exported Results >> '..file_path)
	conditions['exporting'] = false
end

windower.register_event('outgoing chunk', function(id, data, ...)
	if id == 0x096 and conditions['tracking'] then
		local p = packets.parse('outgoing', data)
		for slot = 1, p['Ingredient count'] do
			local ingredient = p['Ingredient '..slot]
			material_list:append(ingredient)
			local ignore = materials_remaining:find(function(material) return material.id == ingredient end)
			if not ignore then
				materials_remaining:append({
					id = ingredient,
					count = 0,
					found = false,
				})
			end
		end
	end
end)

windower.register_event('incoming chunk', function(id, data, ...)
	if id == 0x06F and conditions['tracking'] then
		synthesis.total.results = synthesis.total.results + 1
		
		local p = packets.parse('incoming', data)
		if p["Result"] == 1 then
			conditions['broken'] = true
			synthesis.breaks.results = synthesis.breaks.results + 1
			material_list:clear()
			for slot = 1, 8 do
				local ingredient = p['Lost Item '..tostring(slot)]
				if ingredient > 0 then material_list:append(ingredient) end
			end
		else
			conditions['broken'] = false
			for item_count = 1, p['Count'] do 
				item_list:append(p['Item'])
			end
		end
		
		if p["Quality"] == 0 then synthesis.NQ.results = synthesis.NQ.results + 1
		elseif p["Quality"] == 1 then synthesis.HQ1.results = synthesis.HQ1.results + 1
		elseif p["Quality"] == 2 then synthesis.HQ2.results = synthesis.HQ2.results + 1
		elseif p["Quality"] == 3 then synthesis.HQ3.results = synthesis.HQ3.results + 1
		end
		
		if p["Quality"] == 1 or p["Quality"] == 2 or p["Quality"] == 3 then
			synthesis.HQ.results = synthesis.HQ.results + 1
		end
		
		for synth in synthesis:it() do
			if synth.results ~= 0 then 
				synth.percent = (synth.results / synthesis.total.results) * 100
			end
		end
		
		update_lists()
	end
end)

windower.register_event('addon command', function(command, ...)
	if string.lower(command) == 'on' or string.lower(command) == 'start' then
		log('Material Tracking: enabled')
		conditions['tracking'] = true
	elseif string.lower(command) == 'off' or string.lower(command) == 'stop' then
		log('Material Tracking: disabled')
		conditions['tracking'] = false
	elseif string.lower(command) == 'clear' or string.lower(command) == 'c' then
		if conditions['auto_export'] then export_synthesis_information() end
		log('Clearing Synthesis Information')
		for synth in synthesis:it() do synth.results = 0 synth.percent = 0 end
		items_crafted:clear()
		materials_used:clear()
		materials_remaining:clear()
		update_display()
	elseif string.lower(command) == 'export' or string.lower(command) == 'e' then 
		export_synthesis_information()
	elseif string.lower(command) == 'autoexport' then
		if conditions['auto_export'] then
			log('Auto-Export: disabled')
			conditions['auto_export'] = false
		else
			log('Auto-Export: enabled')
			conditions['auto_export'] = true
		end
	elseif string.lower(command) == 'cost' then
		if arg[#arg] == 'lost' or arg[#arg-1] == 'lost' then 
			if not tonumber(arg[#arg]) then
				arg[#arg+1] = 1
			end
			arg[#arg-1] = calculate_gil('Cost')
		end
		if not tonumber(arg[#arg-1]) or (tonumber(arg[#arg-1]) and tonumber(arg[#arg-1]) < 100) then
			arg[#arg+1] = 1
		end
		local item_name = get_item_data(table.concat(arg, ' ', 1, #arg-2)).en
		local item_cost = tonumber(arg[#arg-1]) / tonumber(arg[#arg])
		costs_to_set:append({
			name = item_name,
			cost = item_cost
		})
		log(item_name..' >> Cost: '..comma_format(string.format('%.2f', item_cost)))
		check_item_costs()
	elseif string.lower(command) == 'file' then
		local date = os.date('*t')
		
		for index = 1, #arg-1 do
			if not tonumber(arg[index]) then arg[index] = arg[index]:ucfirst() end
		end
		
		local player_name = arg[1]
		local item = get_item_data(table.concat(arg, ' ', 2, #arg-1)).en
		local item_date = arg[#arg]
		
		if string.lower(player_name) == 'me' then player_name = windower.ffxi.get_player().name end
		if tonumber(item[#item]) then item = string.slice(item,0,-4) end
		if string.lower(item_date) == 'today' then item_date = '%s-%s-%s':format(date.year,date.month,date.day) end
		
		local file_path = 'Results/%s/%s/%s.log':format(player_name, item, item_date)
		if files.exists(file_path) then 
			file_path = windower.addon_path..file_path
			
			local file = io.open(file_path, 'r')
			local show_line = false
			
			log('')
			for line in io.lines(file_path) do
				text = file.read(file)
				if text:contains('Results') or text:contains('Crafted') or text:contains('Earned') then 
					show_line = true
				elseif text:contains('Breaks') or text:contains('Used') then 
					show_line = false
				end
				if show_line and text ~= '' then log(text) end
				if text:contains('Profit') then 
					show_line = false
				end
			end
			io.close(file)
		else
			log('Unable to find synthesis information')
		end
	end
end)