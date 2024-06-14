import React, { useState } from "react";
import Tesseract from "tesseract.js";
import imageCompression from "browser-image-compression";
import ImageCompression from "./ImageCompression"; // Import ImageCompression component
import ImageUpscaling from "./ImageUpscaling"; // Import ImageUpscaling component
import PDFCompression from "./PDFCompression";
import ImageOperations from "./ImageOperations";
import ImageConverter from "./ImageConverter";
import FileConverter from "./FileConverter";
import { IoReloadCircle } from "react-icons/io5";

const App = () => {
  const [selectedTool, setSelectedTool] = useState("Welcome");
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionRatio, setCompressionRatio] = useState(0.7);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [upscaleRatio, setUpscaleRatio] = useState(2); // Default upscale ratio

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Update image state with the file object
    setCompressedImage(null); // Reset compressed image state
    setUpscaledImage(null); // Reset upscaled image state
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
        className={`bg-blue-800 text-white p-4 w-full md:w-1/4 lg:w-1/6 ${
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
              <p className="text-xs text-stone-200">extract text from images</p>
            </button>
          </li>

          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Compression")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Compression
              <p className="text-xs text-stone-200">compress images fast</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Upscaling")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Upscaling
              <p className="text-xs text-stone-200">upscale images</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("PDF compress")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              PDF compress
              <p className="text-xs text-stone-200">
                compress pdf (currently under work)
              </p>
            </button>
          </li>

          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Converter")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Converter
              <p className="text-xs text-stone-200">covert images</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Operations")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700"
            >
              Image Operations
              <p className="text-xs text-stone-200">bw, crop, etc</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("File Converter")}
              className="block w-full text-left p-2 rounded hover:bg-blue-700 "
            >
              File Converter
              <p className="text-xs text-stone-200">
                convert files from one to another
              </p>
            </button>
          </li>
        </ul>
        <div
          className="bg-gradient-to-tr from-blue-500
         to-blue-600 rounded-lg p-2"
        >
          <h1 className="text-center text-md">
            Want to convert youtube to mp3? or download Youtube Shorts?
          </h1>
          <a
            href="https://youtubeshortsmusic.netlify.app/"
            className=""
            target="_blank"
          >
            <div className="bg-stone-50/70 text-stone-700 text-center font-semibold text-md rounded-md p-1">
              check our ad free downloader
            </div>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:ml-auto p-6 md:w-3/4 md:p-10 lg:w-5/6 h-dvh overflow-scroll ">
        {selectedTool === "Welcome" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              No Ads, No Redirects, Quick Conversion & Downloads.
            </h1>
            <p>Select a tool from the sidebar to get started.</p>
            <br />
            <ul>
              <li className="capitalize font-semibold underline underline-offset-4">
                tools we currently have
              </li>
              <br />
              <li>
                <h1 className="font-bold">Text Extractor</h1>
                <li className="">
                  &mdash; Extract text from images eg: png, jpg etc{" "}
                </li>
              </li>
              <br />
              <li>
                <h1 className="font-bold">Image Compression</h1>
                <li className="">&mdash; compress images eg: png, jpg etc </li>
              </li>
              <br />
              <li>
                <h1 className="font-bold">Image Upscale</h1>
                <li className="">&mdash; upscale images eg: png, jpg etc </li>
              </li>
              <br />
              <li>
                <h1 className="font-bold">
                  Compress PDFs (currently under work)
                </h1>
                <li className="">&mdash; compress pdf from large to small </li>
              </li>
              <br />
              <li>
                <h1 className="font-bold"> Image converter</h1>
                <li className="">&mdash; jpg to png </li>
                <li>&mdash; png to jpg </li>
                <li>&mdash; png to ico </li>
                <li>&mdash; bmp to png </li>
                <li>&mdash; gif to jpg </li>
                <li>&mdash; tiff to png </li>
                <li>&mdash; webp to jpg </li>
                <li>&mdash; more coming soon</li>
              </li>
              <br />
              <li>
                <h1 className="font-bold"> Image Operations</h1>
                <li>&mdash; color to black & white </li>
                <li>&mdash; crop images </li>
                <li>&mdash; sharpen images </li>
                <li>&mdash; more coming soon</li>
              </li>
              <br />
              <li>
                <h1 className="font-bold">File Converter</h1>
                <li>&mdash; pdf to xls (excel) </li>
                <li>&mdash; word to pdf </li>
                <li>&mdash; text to pdf </li>
                <li>&mdash; excel (xls) to csv </li>
                <li>&mdash; csv to excel(xls) </li>
                <li>&mdash; jpg to pdf </li>
                <li>&mdash; pdf to jpg </li>
                <li>&mdash; png to pdf </li>
                <li>&mdash; more coming soon</li>
              </li>
            </ul>
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
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="max-w-full mt-4"
              />
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
          <ImageCompression
            image={image}
            handleImageChange={handleImageChange}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {selectedTool === "Image Upscaling" && (
          <ImageUpscaling
            image={image}
            handleImageChange={handleImageChange}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {selectedTool === "PDF compress" && (
          <PDFCompression setLoading={setLoading} />
        )}

        {selectedTool === "Image Operations" && <ImageOperations />}
        {selectedTool === "Image Converter" && <ImageConverter />}
        {selectedTool === "File Converter" && <FileConverter />}
      </main>
    </div>
  );
};

export default App;
