import { Toaster } from "react-hot-toast";
import Nav from "../components/Nav";

function SpeechToSpeech() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="h-1/5 w-full flex items-center justify-center">
        <Nav />
      </div>

      <div className="h-4/5 w-full flex flex-col  justify-center mb-24 max-w-3xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center">Speech to Speech</h1>
      </div>
    </div>
  );
}

export default SpeechToSpeech;
