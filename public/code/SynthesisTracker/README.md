# FFXI Synthesis Tracker

Tracks synthesis information for items crafted, materials used, material loss rates, total costs, gil earned or lost per item, and overall profit.

## Features

- **Synthesis Tracking:** Tracks and displays total synthesis attempts, breaks, normal quality (NQ), and high-quality (HQ1-3) results.
- **Materials Tracking:** Shows the materials used or lost, along with both the total and their individual costs.
- **Gil Calculations:** Set the item and material costs prior to crafting, and the total gil earned / spent will update in real-time during the crafting session.
- **Auto-Export Results:** Synthesis results are exported to a log file when cleared to keep a record of your lifetime success rates and profits for each crafted item.
- **In-Game Logs:** Read previously exported results in-game.

## How To Use

- [Download ZIP](https://github.com/Yosna/FFXI-Synthesis-Tracker/archive/refs/heads/main.zip) and extract the **SynthesisTracker** folder to `\Windower\Addons`.
- If you're unable to locate your Windower folder, right click `Windower.exe` and select _Open file location_.
- Type `//lua l synthesistracker` or `//lua load synthesistracker` into the game's chat, or into the Windower console if you omit the `//`.
- Alternatively, navigate to `init.txt` located in `\Windower\Scripts` and add `lua load synthesistracker` at the bottom. Save the `.txt` file and then type `//reload` in the game's chat, or `reload` into the Windower console. The addon will now load automatically every time Windower is initialized.

## Addon Commands - `//st <command>`

- **`//st <on / start>`:** Enable synthesis tracking (enabled by default).
- **`//st <off / stop>`:** Disable synthesis tracking.
- **`//st <clear / c>`:** Clear tracked synthesis results (and export results if auto-export is enabled).
- **`//st <export / e>`:** Export tracked synthesis results.
  - **Note:** Results are exported to `windower\addons\SynthesisTracker\Results\<Character>\<Item>\YYYY-MM-DD.log`
- **`//st <autoexport>`:** Toggles auto-exporting for your tracked synthesis information (enabled by default)
- **`//st <cost>`:** Set the cost of an item or material for gil tracking.
  - **Arguments:**
    - `//st <cost> <item name> <item cost> <cost divisor (optional)>`
  - **Examples:**
    - Input: `//st cost cyan coral 1126125` > Output: `Cyan Coral >> Cost: 1,126,125.00`
    - Input: `//st cost eschite ore 6000000 12` > Output: `Eschite Ore >> Cost: 500,000.00`
  - **Note:** You do not need to wrap the item name in quotes. Everything between `<cost>` and `<item cost>` is concatenated into a string.
- **`//st file`:** Read a previously logged file in-game.

  - **Arguments:**
    - `//st <file> <character> <item name> <YYYY-MM-DD>`
  - **Examples:**
    - `//st file yosna silver thread 2020-12-16`
    - `//st file yosna cursed cuisses today`
  - **Note:** `today` can be used instead of `<YYYY-MM-DD>` and it will display the most recently tracked synthesis results for an item that day.

  ## License

  This project is licensed under the MIT License. See [LICENSE](https://github.com/Yosna/FFXI-Synthesis-Tracker/blob/main/README.md) for details.
