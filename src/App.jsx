import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import DeathCounter from './DeathCounter';
import TextGenerator from './TextGenerator';
import BigramModel from './BigramModel';
import SynthesisTracker from './SynthesisTracker';
import AntSwarm from './AntSwarm';
import AboutMe from './AboutMe';
function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 h-full">
        <Routes>
          <Route path="/Kody-James-Portfolio" element={<Home />} />
          <Route path="/death-counter" element={<DeathCounter />} />
          <Route path="/text-generator" element={<TextGenerator />} />
          <Route path="/bigram-model" element={<BigramModel />} />
          <Route path="/synthesis-tracker" element={<SynthesisTracker />} />
          <Route path="/ant-swarm" element={<AntSwarm />} />
          <Route path="/about-me" element={<AboutMe />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
