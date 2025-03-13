import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import annyang from "annyang";

function Label({ title }) {
  return (
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
      {title}
    </label>
  );
}

function SpeechToSpeech() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [status, setStatus] = useState("Tekan tombol dan mulai berbicara...");
  const [result, setResult] = useState("Hasil akan muncul di sini...");
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [language, setLanguage] = useState("id");

  const timeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    if (annyang) {
      annyang.setLanguage(language === "id" ? "id-ID" : "en-US");

      annyang.addCallback("result", (phrases) => {
        const finalResult = phrases[0];
        setResult(finalResult);
        setStatus("Berhenti mendengarkan.");
        setIsListening(false);
        setCountdown(null);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (countdownIntervalRef.current)
          clearInterval(countdownIntervalRef.current);
        annyang.abort();

        send(finalResult); // Ensure send is called here with the latest result
      });
    } else {
      setStatus("Browser tidak mendukung annyang.js / Speech Recognition.");
    }
  }, []);

  const send = async (text) => {
    console.log(text);
    const url = "http://localhost:8080/tts";
    const data = {
      text: text,
      voice: language,
    };

    try {
      console.log(data);
      const response = await axios.post(url, data, {
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioObjectUrl);
      console.log(audioObjectUrl);

      toast.success("Audio generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate audio");
    }
  };

  const startListening = () => {
    if (!annyang) return;

    setIsListening(true);
    setStatus("Mendengarkan... (Maksimal 10 detik)");
    setResult("Hasil akan muncul di sini...");
    setCountdown(10);

    annyang.start();

    timeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === null) return 0;
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const stopListening = () => {
    if (!annyang) return;

    annyang.abort();
    setStatus("Waktu habis. Tekan tombol untuk mencoba lagi.");
    setIsListening(false);
    setCountdown(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="h-1/5 w-full flex items-center justify-center">
        <Nav />
      </div>

      <div className="h-4/5 w-full flex flex-col  justify-center mb-24 max-w-3xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center">
          Speech to Speech
        </h1>

        <div className="col-span-2 w-64 flex flex-col items-center mx-auto">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Language
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center mx-auto">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
              isListening ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Mulai Bicara
          </button>

          <p className="mt-4 text-gray-500">{status}</p>

          {isListening && countdown !== null && (
            <p className="mt-2 text-gray-500">
              Waktu tersisa: {countdown} detik
            </p>
          )}

          <div className="mt-4 p-3 border rounded bg-gray-50 text-gray-700">
            {result}
          </div>
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

export default SpeechToSpeech;
