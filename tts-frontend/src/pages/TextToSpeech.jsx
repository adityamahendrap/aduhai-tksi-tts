import Nav from "../components/Nav";

function TextToSpeech() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-1/5 w-full flex items-center justify-center">
        <Nav />
      </div>

      <div className="h-4/5 w-full flex flex-col  justify-center mb-24 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Text to Speech</h1>

        <div className="mt-8">
          <label
            for="message"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
          >
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your message here..."
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            class="text-white w-fit bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
