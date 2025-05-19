export default function Home() {
  return (
    <div className="h-full flex-1 p-8 bg-[#23293a] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-200 mb-4">Hi, I'm Kody!</h1>
      <p className="text-lg text-gray-300 mb-6 max-w-2xl text-center">
        I'm a passionate and self-driven developer with a love for AI, game development, and
        building creative tools. My portfolio showcases projects ranging from memory-reading game
        overlays and incremental games to neural network language models and modular AI text
        generators. I enjoy tackling challenging problems, learning new technologies, and turning
        ideas into working code.
      </p>
      <div className="flex flex-wrap gap-4 mb-8">
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">Python</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">JavaScript</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">React</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">AI/ML</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">Lua</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">AutoHotkey v2</span>
        <span className="bg-blue-800 px-3 py-1 rounded text-sm">Web Dev</span>
      </div>
      <div className="text-md text-gray-400 mb-8 max-w-2xl text-center">
        <div>My recent projects include:</div>
        <ul className="list-disc list-inside mt-2 text-gray-400 text-left">
          <li>
            <b>Elden Ring Death Counter</b> - A memory-reading overlay for tracking deaths in real
            time.
          </li>
          <li>
            <b>Multi-Model AI Text Generator</b> - A modular, extensible framework supporting both
            bigram and LSTM models, with full unit testing and configuration-driven design.
          </li>
          <li>
            <b>Bigram Language Model</b> - A character-level neural network for text generation in
            PyTorch.
          </li>
          <li>
            <b>FFXI Synthesis Tracker</b> - A Lua-based addon for tracking crafting stats in Final
            Fantasy XI.
          </li>
          <li>
            <b>Ant Swarm</b> - A text-based incremental game built from scratch in JavaScript.
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        <a
          href="/resume.pdf"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
        <a
          href="https://github.com/Yosna"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/kody-james-75b976362/"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="mailto:kodyjames.yosna@gmail.com"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
        >
          Email
        </a>
      </div>
    </div>
  );
}
