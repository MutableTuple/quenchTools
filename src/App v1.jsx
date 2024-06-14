// src/App.js
import React, { useState } from "react";
import Tesseract from "tesseract.js";

const App = () => {
  const [selectedTool, setSelectedTool] = useState("Welcome");
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const extractText = () => {
    setLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Toggle Button for Sidebar (top position on smaller screens) */}
      <button
        className="md:hidden fixed top-4 right-4 z-10 bg-blue-900 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "Close" : "Open"}
      </button>

      {/* Sidebar (top position on smaller screens) */}
      <aside
        className={`bg-blue-900 text-white p-4 w-full md:w-1/4 lg:w-1/6 ${
          sidebarOpen ? "block" : "hidden"
        } md:block fixed top-0 left-0 h-full md:h-auto md:relative overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-2xl font-bold">Tools</h2>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            {sidebarOpen ? "Close" : "Open"}
          </button>
        </div>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Text Extraction")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Text Extraction
            </button>
          </li>
          {/* Add more tools here */}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-full md:ml-auto p-6 md:w-3/4 md:p-10 lg:w-5/6">
        {selectedTool === "Welcome" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome</h1>
            <p>Select a tool from the sidebar to get started.</p>
          </div>
        )}

        {selectedTool === "Text Extraction" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Text Extraction</h1>
            <input
              type="file"
              onChange={handleImageChange}
              className="mb-4 p-2 border"
            />
            <button
              onClick={extractText}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={!image || loading}
            >
              {loading ? "Extracting..." : "Extract Text"}
            </button>
            {image && (
              <img src={image} alt="Selected" className="max-w-full mt-4" />
            )}
            {text && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">Extracted Text:</h2>
                <p>{text}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
