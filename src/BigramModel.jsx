import { useState, useEffect } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageFromFilename } from './utils/codeUtils';
import ReactMarkdown from 'react-markdown';

export default function BigramModel() {
  const [selectedFile, setSelectedFile] = useState('README.md');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    fetch(`/Kody-James-Portfolio/code/BigramModel/${selectedFile}`)
      .then((res) => res.text())
      .then(setFileContent)
      .catch((err) => setFileContent(`Error loading file: ${err.message}`));
  }, [selectedFile]);

  const isMarkdown = selectedFile.endsWith('.md');

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-gray-900 text-white">
      <div className="flex-1 p-8 bg-[#181c24] text-white">
        <h1 className="text-3xl font-bold mb-4 text-blue-200">Bigram Language Model</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">Overview:</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          This project is a simple character-level neural network built with PyTorch. It predicts
          the next character in a sequence based on the current character, learning
          character-to-character relationships from any input text. The project demonstrates
          foundational NLP concepts like embeddings, tokenization, and text generation, all in a
          minimal, easy-to-understand codebase.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">Why I Built It</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          I have been fascinated by AI ever since early 2023, so I wanted to try and learn more
          about it to see how far I could get. Building a bigram model seemed like a great way to
          get hands-on experience with neural networks and natural language processing.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">How It Works</h2>
        <ul className="list-disc list-inside mb-4 text-gray-200 leading-relaxed">
          <li>Reads a text file and builds a vocabulary of unique characters.</li>
          <li>Encodes the text as sequences of character indices.</li>
          <li>
            Uses a single embedding layer to learn transition probabilities between characters
            (bigram model).
          </li>
          <li>
            Trains the model using cross-entropy loss and the Adam optimizer, with early stopping to
            prevent overfitting.
          </li>
          <li>
            After training, can generate new text one character at a time, starting from a random
            seed character.
          </li>
          <li>
            All hyperparameters and training options are controlled via a single configuration
            dictionary.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-300">What I Learned</h2>
        <p className="mb-4 leading-relaxed text-gray-200">
          Through this project, I learned the fundamentals of building and training neural networks
          with PyTorch, including data encoding, embedding layers, and loss computation. I also
          gained experience with text generation, model evaluation, and managing training workflows
          in Python. This project gave me a much deeper understanding of how language models work at
          a low level.
        </p>
        <p className="mb-6 text-sm text-gray-400 italic">
          Project duration: ~9 days (May 2<sup>nd</sup> - May 11<sup>th</sup>, 2025)
        </p>
        <a
          href="https://github.com/Yosna/Bigram-Language-Model"
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
              Select file:
            </label>
            <select
              id="fileSelect"
              className="w-[33%] ml-2 border px-2 py-1 rounded bg-gray-700 text-gray-100 border-blue-900"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="README.md">&#x250C;&#x2500; README.md</option>
              <option value="main.py">&#x2514;&#x2500; main.py</option>
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
