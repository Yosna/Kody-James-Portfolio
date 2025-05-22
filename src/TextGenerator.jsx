import { useState, useEffect } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { getLanguageFromFilename } from './utils/codeUtils';
import ReactMarkdown from 'react-markdown';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('json', json);

export default function TextGenerator() {
  const [selectedFile, setSelectedFile] = useState('README.md');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}code/TextGenerator/${selectedFile}`)
      .then((res) => res.text())
      .then(setFileContent)
      .catch((err) => setFileContent(`Error loading file: ${err.message}`));
  }, [selectedFile]);

  const isMarkdown = selectedFile.endsWith('.md');

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-gray-900 text-white">
      <div className="flex-1 p-8 bg-[#181c24] text-white">
        <h1 className="text-3xl font-bold mb-4 text-blue-200">Multi-Model AI Text Generator</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">Overview:</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          Multi-Model AI Text Generator is a modular, extensible text generation project built with
          PyTorch. It supports a simple bigram model, plus both LSTM and transformer models,
          allowing for experimentation with different neural network architectures. The project
          features a fully modular codebase, configuration-driven training, and a command-line
          interface for switching between models and behaviors.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">Why I Built It</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          After finishing my bigram model, I wanted to take things further by refactoring and
          expanding the project into a more modular, multi-model framework. I decided to add this as
          a fifth project to my portfolio to showcase my decision-making, the process of turning a
          single script into a scalable codebase, and my ability to implement new features, refactor
          code, and add unit testing—all within a short timeframe.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">How It Works</h2>
        <ul className="list-disc list-inside mb-4 text-gray-200 leading-relaxed">
          <li>Loads and tokenizes text data from multiple files for training.</li>
          <li>
            Supports both bigram LSTM, and transformer models, selectable via CLI and configuration.
          </li>
          <li>Modular model registry allows easy addition of new architectures.</li>
          <li>
            Training, validation, and generation are all configurable through a single{' '}
            <code>config.json</code> file.
          </li>
          <li>Implements checkpointing, early stopping, and resumption for robust training.</li>
          <li>Includes a full suite of unit tests for utility functions.</li>
          <li>
            Generates text by sampling from trained models, with support for multinomial sampling
            and random seed selection.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">What I Learned</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          Through this project, I learned how to design and refactor a codebase for modularity and
          extensibility, manage multiple model architectures, and implement robust training
          workflows. I also gained experience with configuration-driven development, unit testing,
          and building a flexible CLI for machine learning experiments. This project helped me
          understand the importance of clean code organization and reproducibility in AI research.
        </p>
        <p className="mb-6 text-sm text-gray-400 italic">
          Project duration: ~4 days (May 12<sup>th</sup> - May 21<sup>st</sup>, 2025)
        </p>
        <a
          href="https://github.com/Yosna/Multi-Model-AI-Text-Generator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          View on GitHub
        </a>
      </div>
      <div className="flex-1 p-8 bg-[#23293a] border-l border-blue-900 flex justify-center items-center">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 ml-8 mr-8">
            <label htmlFor="fileSelect" className="font-medium text-xl text-blue-200">
              Select a file to view:
            </label>
            <select
              id="fileSelect"
              className="w-[33%] ml-2 border px-2 py-1 rounded bg-gray-700 text-gray-100 border-blue-900"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="README.md">&#x250C;&#x2500; README.md</option>
              <option value="main.py">&#x251C;&#x2500; main.py</option>
              <option value="utils.py">&#x251C;&#x2500; utils.py</option>
              <option value="config.json">&#x2514;&#x2500; config.json</option>
              <optgroup label="&#x2514;&#x2500; /models">
                <option value="models/registry.py">&#x251C;&#x2500; registry.py</option>
                <option value="models/base_model.py">&#x251C;&#x2500; base_model.py</option>
                <option value="models/bigram_model.py">&#x251C;&#x2500; bigram_model.py</option>
                <option value="models/lstm_model.py">&#x251C;&#x2500; lstm_model.py</option>
                <option value="models/transformer_model.py">
                  &#x2514;&#x2500; transformer_model.py
                </option>
              </optgroup>
              <optgroup label="&#x2514;&#x2500; /tests">
                <option value="tests/test_utils.py">&#x2514;&#x2500; test_utils.py</option>
              </optgroup>
            </select>
          </div>
          <div className="w-full h-full overflow-auto">
            {isMarkdown ? (
              <div className="prose prose-invert leading-snug max-w-[96%]">
                <ReactMarkdown>{fileContent}</ReactMarkdown>
              </div>
            ) : (
              <SyntaxHighlighter
                language={getLanguageFromFilename(selectedFile)}
                style={syntaxStyle}
                showLineNumbers={true}
                lineNumberStyle={{
                  minWidth: '2em',
                  textAlign: 'right',
                  padding: '0 8px 0 0',
                }}
                className="syntax-highlighter text-sm"
              >
                {fileContent}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
