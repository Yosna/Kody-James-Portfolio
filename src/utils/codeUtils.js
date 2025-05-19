export function getLanguageFromFilename(filename) {
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.ahk')) return 'autohotkey';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.lua')) return 'lua';
  if (filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';

  return '';
}
