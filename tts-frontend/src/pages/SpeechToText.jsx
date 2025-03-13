import React, { useState, useEffect, useRef } from "react";
import annyang from "annyang";
import { Toaster } from "react-hot-toast";
import Nav from "../components/Nav";

function SpeechToText() {
  const [status, setStatus] = useState("Tekan tombol dan mulai berbicara...");
  const [result, setResult] = useState("Hasil akan muncul di sini...");
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const timeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    if (annyang) {
      annyang.setLanguage("id-ID");

      annyang.addCallback("result", (phrases) => {
        setResult(phrases[0]);
        setStatus("Berhenti mendengarkan.");
        setIsListening(false);
        setCountdown(null);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        annyang.abort();
      });
    } else {
      setStatus("Browser tidak mendukung annyang.js / Speech Recognition.");
    }
  }, []);

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
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="h-1/5 w-full flex items-center justify-center">
        <Nav />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center mx-auto">
        <h1 className="text-2xl font-bold mb-4">Speech to Text</h1>

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
          <p className="mt-2 text-gray-500">Waktu tersisa: {countdown} detik</p>
        )}

        <div className="mt-4 p-3 border rounded bg-gray-50 text-gray-700">
          {result}
        </div>
      </div>
    </div>
  );
}

export default SpeechToText;
