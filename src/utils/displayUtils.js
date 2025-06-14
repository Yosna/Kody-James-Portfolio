import { useThemeMode } from '../hooks/useThemeMode';
import { useProjectFile } from '../hooks/useProjectFile';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ghcolors as lightSyntaxStyle,
  dracula as darkSyntaxStyle,
  nightOwl as midnightSyntaxStyle,
  nord as glacierSyntaxStyle,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageFromFilename } from './codeUtils';
import ReactMarkdown from 'react-markdown';

const syntaxStyles = {
  light: lightSyntaxStyle,
  dark: darkSyntaxStyle,
  midnight: midnightSyntaxStyle,
  glacier: glacierSyntaxStyle,
};

export {
  useThemeMode,
  useProjectFile,
  SyntaxHighlighter,
  syntaxStyles,
  getLanguageFromFilename,
  ReactMarkdown,
};
