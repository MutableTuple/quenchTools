import React, { useState } from "react";
import Tesseract from "tesseract.js";
import imageCompression from "browser-image-compression";

const App = () => {
  const [selectedTool, setSelectedTool] = useState("Welcome");
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionRatio, setCompressionRatio] = useState(0.7); // Default compression ratio
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [upscaleRatio, setUpscaleRatio] = useState(2); // Default upscale ratio

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setCompressedImage(null); // Reset compressed image state on image change
    setUpscaledImage(null); // Reset upscaled image state on image change
  };

  const handleCompressionRatioChange = (e) => {
    setCompressionRatio(parseFloat(e.target.value));
  };

  const compressImage = async () => {
    setLoading(true);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      maxIteration: 50,
      initialQuality: compressionRatio,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedImageUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error compressing image:", error);
      setLoading(false);
    }
  };

  const handleUpscaleRatioChange = (e) => {
    setUpscaleRatio(parseFloat(e.target.value));
  };

  const upscaleImage = async () => {
    setLoading(true);
    try {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width * upscaleRatio;
        canvas.height = img.height * upscaleRatio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const upscaledImageUrl = canvas.toDataURL("image/jpeg");
        setUpscaledImage(upscaledImageUrl);
        setLoading(false);
      };
    } catch (error) {
      console.error("Error upscaling image:", error);
      setLoading(false);
    }
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
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Compression")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Compression
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Upscaling")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Upscaling
            </button>
          </li>
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

        {selectedTool === "Image Compression" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Image Compression</h1>
            <input
              type="file"
              onChange={handleImageChange}
              className="mb-4 p-2 border"
            />
            {image && (
              <>
                <div className="flex items-center mb-4">
                  <label htmlFor="compressionRatio" className="mr-2">
                    Compression Ratio:
                  </label>
                  <input
                    type="range"
                    id="compressionRatio"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={compressionRatio}
                    onChange={handleCompressionRatioChange}
                    className="mr-2"
                  />
                  <span>{compressionRatio}</span>
                </div>
                <button
                  onClick={compressImage}
                  className="bg-blue-500 text-white p-2 rounded"
                  disabled={!image || loading}
                >
                  {loading ? "Compressing..." : "Compress Image"}
                </button>
                {compressedImage && (
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold">Compressed Image:</h2>
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="max-w-full mt-4"
                    />
                    <a
                      href={compressedImage}
                      download="compressed_image.jpg"
                      className="block mt-2 underline text-blue-500"
                    >
                      Download Compressed Image
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedTool === "Image Upscaling" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Image Upscaling</h1>
            <input
              type="file"
              onChange={handleImageChange}
              className="mb-4 p-2 border"
            />
            {image && (
              <>
                <div className="flex items-center mb-4">
                  <label htmlFor="upscaleRatio" className="mr-2">
                    Upscale Ratio:
                  </label>
                  <input
                    type="number"
                    id="upscaleRatio"
                    min="1"
                    value={upscaleRatio}
                    onChange={handleUpscaleRatioChange}
                    className="mr-2 p-2 border"
                  />
                </div>
                <button
                  onClick={upscaleImage}
                  className="bg-blue-500 text-white p-2 rounded"
                  disabled={!image || loading}
                >
                  {loading ? "Upscaling..." : "Upscale Image"}
                </button>
                {upscaledImage && (
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold">Upscaled Image:</h2>
                    <img
                      src={upscaledImage}
                      alt="Upscaled"
                      className="max-w-full mt-4"
                    />
                    <a
                      href={upscaledImage}
                      download="upscaled_image.jpg"
                      className="block mt-2 underline text-blue-500"
                    >
                      Download Upscaled Image
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
