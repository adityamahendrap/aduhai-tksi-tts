import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TextToSpeech from './pages/TextToSpeech';
import SpeechToText from './pages/SpeechToText';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tts" element={<TextToSpeech />} />
        <Route path="/stt" element={<SpeechToText/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
