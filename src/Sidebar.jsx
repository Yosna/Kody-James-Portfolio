import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Get current theme from body class
  const currentTheme = document.body.classList.contains('dark') ? 'Dark' : 'Light';

  // Function to set theme
  const setTheme = (theme) => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme.toLowerCase());
    localStorage.setItem('color-theme', theme.toLowerCase()); // Save to localStorage
    setThemeDropdownOpen(false);
  };

  // Load theme from localStorage or system preference
  useEffect(() => {
    let savedTheme = localStorage.getItem('color-theme');
    if (!savedTheme) {
      savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme);
  }, []);

  return (
    <div className="w-64 h-full p-4 flex flex-col justify-between bg-sidebar text-primary">
      <div>
        <h2 className="text-2xl font-bold mb-6">Kody's Portfolio</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/">
              <button className="w-full text-left p-2 rounded hover:bg-hover">Home</button>
            </Link>
          </li>

          <li>
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="w-full text-left p-2 rounded hover:bg-hover"
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
                    <button className="w-full text-left p-2 rounded hover:bg-hover">
                      Elden Ring Death Counter
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/text-generator">
                    <button className="w-full text-left p-2 rounded hover:bg-hover">
                      Multi-Model AI Text Generator
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/bigram-model">
                    <button className="w-full text-left p-2 rounded hover:bg-hover">
                      Bigram Language Model
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/synthesis-tracker">
                    <button className="w-full text-left p-2 rounded hover:bg-hover">
                      FFXI Synthesis Tracker
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/ant-swarm">
                    <button className="w-full text-left p-2 rounded hover:bg-hover">
                      Ant Swarm
                    </button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/about-me">
              <button className="w-full text-left p-2 rounded hover:bg-hover">About Me</button>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center relative">
        {themeDropdownOpen && (
          <div className="absolute bottom-16 w-[50%] bg-primary border border-muted rounded shadow z-10 flex flex-col">
            <button
              className={`p-2 hover:bg-hover text-center rounded ${currentTheme === 'Light' ? 'font-bold text-accent' : ''}`}
              onClick={() => setTheme('Light')}
            >
              Light
            </button>
            <button
              className={`p-2 hover:bg-hover text-center rounded ${currentTheme === 'Dark' ? 'font-bold text-accent' : ''}`}
              onClick={() => setTheme('Dark')}
            >
              Dark
            </button>
          </div>
        )}
        <button
          className="w-[75%] p-3 bg-primary hover:bg-hover text-muted font-bold rounded mt-4"
          onClick={() => setThemeDropdownOpen((open) => !open)}
        >
          Color Theme
        </button>
      </div>
    </div>
  );
}
