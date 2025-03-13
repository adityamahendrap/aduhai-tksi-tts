import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TextToSpeech from "./pages/TextToSpeech";
import SpeechToText from "./pages/SpeechToText";
import { useEffect } from "react";
import SpeechToSpeech from "./pages/SpeechToSpeech";

function App() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tts" element={<TextToSpeech />} />
        <Route path="/stt" element={<SpeechToText />} />
        <Route path="/sts" element={<SpeechToSpeech />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
