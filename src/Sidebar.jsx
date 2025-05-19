import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <div className="w-64 h-full bg-gray-900 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Kody's Portfolio</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/">
              <button className="w-full text-left hover:bg-gray-800 p-2 rounded">Home</button>
            </Link>
          </li>

          <li>
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="w-full text-left hover:bg-gray-800 p-2 rounded"
            >
              <span className="inline-flex justify-between items-center w-full">
                <span>My Projects</span>
                <span className="text-xl">{projectsOpen ? '▴' : '▾'}</span>
              </span>
            </button>

            {projectsOpen && (
              <ul className="text-sm ml-4 mt-2 space-y-2">
                <li>
                  <Link to="/death-counter">
                    <button className="w-full text-left hover:bg-gray-800 p-2 rounded">
                      Elden Ring Death Counter
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/text-generator">
                    <button className="w-full text-left hover:bg-gray-800 p-2 rounded">
                      Multi-Model AI Text Generator
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/bigram-model">
                    <button className="w-full text-left hover:bg-gray-800 p-2 rounded">
                      Bigram Language Model
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/synthesis-tracker">
                    <button className="w-full text-left hover:bg-gray-800 p-2 rounded">
                      FFXI Synthesis Tracker
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/ant-swarm">
                    <button className="w-full text-left hover:bg-gray-800 p-2 rounded">
                      Ant Swarm
                    </button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/about-me">
              <button className="w-full text-left hover:bg-gray-800 p-2 rounded">About Me</button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
