import { useState, useEffect } from 'react';

export function useProjectFile(projectName, initialFile = 'README.md') {
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}code/${projectName}/${selectedFile}`)
      .then((res) => res.text())
      .then(setFileContent)
      .catch((err) => setFileContent(`Error loading file: ${err.message}`));
  }, [projectName, selectedFile]);

  return { selectedFile, setSelectedFile, fileContent };
}
