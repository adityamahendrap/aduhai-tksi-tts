import { useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Label({ title }) {
  return (
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
      {title}
    </label>
  );
}

function TextToSpeech() {
  // {
  //   "text":"hello, my name is roberto. nice, to meet you!",
  //   "amplitude": 100, // 0-200, default 100
  //   "speed": 200, // 1-1000, default 200
  //   "pitch": 50, // 0-90, default 50
  //   "pitch_range": 0, // 0-90, default 50
  //   "word_gap": 0, // 0-100
  //   "spell_punctuation": ",.", // spell punc
  //   "voice": "en",
  //   "line_length": 0,
  //   "ignore_punctuation": false
  // }

  const [amplitude, setAmplitude] = useState(100);
  const [speed, setSpeed] = useState(200);
  const [pitch, setPitch] = useState(35);
  const [pitchRange, setPitchRange] = useState(90);
  const [wordGap, setWordGap] = useState(0);
  const [voice, setVoice] = useState("en");
  const [spellPunctuation, setSpellPunctuation] = useState("");
  const [ignorePunctuation, setIgnorePunctuation] = useState(false);
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const send = async () => {
    const url = "http://localhost:8080/tts";
    const data = {
      text: text,
      amplitude: parseInt(amplitude),
      speed: parseInt(speed),
      pitch: parseInt(pitch),
      pitch_range: parseInt(pitchRange),
      word_gap: parseInt(wordGap),
      spell_punctuation: spellPunctuation,
      voice,
      ignore_punctuation: ignorePunctuation,
    };

    try {
      console.log(data);
      const response = await axios.post(url, data, {
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioObjectUrl);

      toast.success("Audio generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate audio");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="h-1/5 w-full flex items-center justify-center">
        <Nav />
      </div>

      <div className="h-4/5 w-full flex flex-col  justify-center mb-24 max-w-3xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center">Text to Speech</h1>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label title="Amplitude" />
            <div className="flex  items-center gap-3">
              <span className="text-sm text-blue-500 font-bold dark:text-white">
                {amplitude}
              </span>
              <input
                type="range"
                id="labels-range-input"
                className="block w-full h-1.5 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                min="0"
                max="200"
                step="1"
                value={amplitude}
                onChange={(e) => setAmplitude(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label title="Speed" />
            <div className="flex  items-center gap-3">
              <span className="text-sm text-blue-500 font-bold dark:text-white">
                {speed}
              </span>
              <input
                type="range"
                id="labels-range-input"
                className="block w-full h-1.5 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                min="1"
                max="1000"
                step="1"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label title="Pitch" />
            <div className="flex  items-center gap-3">
              <span className="text-sm text-blue-500 font-bold dark:text-white">
                {pitch}
              </span>
              <input
                type="range"
                id="labels-range-input"
                className="block w-full h-1.5 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                min="0"
                max="90"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label title="Pitch Range" />
            <div className="flex  items-center gap-3">
              <span className="text-sm text-blue-500 font-bold dark:text-white">
                {pitchRange}
              </span>
              <input
                type="range"
                id="labels-range-input"
                className="block w-full h-1.5 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                min="0"
                max="90"
                step="1"
                value={pitchRange}
                onChange={(e) => setPitchRange(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label title="Word Gap" />
            <div className="flex  items-center gap-3">
              <span className="text-sm text-blue-500 font-bold dark:text-white">
                {wordGap}
              </span>
              <input
                type="range"
                id="labels-range-input"
                className="block w-full h-1.5 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                min="0"
                max="100"
                step="1"
                value={wordGap}
                onChange={(e) => setWordGap(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label title="Ignore Punctuation" />
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={ignorePunctuation}
                onChange={(e) => setIgnorePunctuation(e.target.checked)}
              />
              <div
                className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                ${
                  ignorePunctuation
                    ? "peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                    : ""
                } 
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600`}
              ></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Spell Punctuation
            </label>
            <input
              type="text"
              value={spellPunctuation}
              onChange={(e) => setSpellPunctuation(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter punctuation that should be spelled out"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="countries"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Voice
            </label>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
            >
              <option value="id">Indonesia</option>
              <option value="en">English</option>
              <option value="en-french-1">English (German)</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <textarea
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={send}
            className="text-white w-fit bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Send
          </button>
        </div>

        {audioUrl && (
          <div className="flex flex-col items-center mt-8">
            <Label title={"Generated Audio"} />
            <audio controls src={audioUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TextToSpeech;
