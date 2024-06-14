import React, { useState } from "react";
import Tesseract from "tesseract.js";
import imageCompression from "browser-image-compression";
import { FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";

import ImageCompression from "./ImageCompression"; // Import ImageCompression component
import FeaturesCard from "./FeaturesCard";
import { FaExternalLinkAlt } from "react-icons/fa";

import ImageUpscaling from "./ImageUpscaling"; // Import ImageUpscaling component
import PDFCompression from "./PDFCompression";
import ImageOperations from "./ImageOperations";
import ImageConverter from "./ImageConverter";
import FileConverter from "./FileConverter";
import { IoReloadCircle } from "react-icons/io5";
import { TbTools } from "react-icons/tb";
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
    <div className="flex min-h-screen ">
      {/* Toggle Button for Sidebar (top position on smaller screens) */}
      <button
        className="md:hidden fixed top-4 right-4 z-10 bg-blue-500 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "hide tools" : "show tools"}
      </button>

      {/* Sidebar (top position on smaller screens) */}
      <aside
        className={`bg-gradient-to-t from-cyan-500 to-blue-500 border-r shadow-sm  text-stone-100 p-4 w-full md:w-1/4 lg:w-1/6 ${
          sidebarOpen ? "block" : "hidden"
        } md:block fixed top-0 left-0 h-full md:h-auto md:relative overflow-y-auto`}
      >
        <div className="flex  justify-between items-center mb-4 md:mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-1">
            <TbTools /> Tools
          </h2>
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            {sidebarOpen ? "Close" : "Open"}
          </button>
        </div>
        <ul className="">
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Text Extraction")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300 "
            >
              Text Extraction
              <p className="text-xs text-stone-200">extract text from images</p>
            </button>
          </li>

          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Compression")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300"
            >
              Image Compression
              <p className="text-xs text-stone-200">compress images fast</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Upscaling")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300"
            >
              Image Upscaling
              <p className="text-xs text-stone-200">upscale images</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("PDF compress")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300"
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
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300"
            >
              Image Converter
              <p className="text-xs text-stone-200">covert images</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("Image Operations")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300"
            >
              Image Operations
              <p className="text-xs text-stone-200">bw, crop, etc</p>
            </button>
          </li>
          <li className="mb-2">
            <button
              onClick={() => setSelectedTool("File Converter")}
              className="block w-full text-left p-2 rounded hover:bg-white/40 transition-all duration-300 "
            >
              File Converter
              <p className="text-xs text-stone-200">
                convert files from one to another
              </p>
            </button>
          </li>

          <li className="mb-2">
            <div className="block w-full text-left p-2 rounded hover:shadow-md transition-all duration-300  text-center text-stone-50 font-semibold bg-gradient-to-r from-indigo-500 to-pink-500">
              <a
                href="https://youtubeshortsmusic.netlify.app/"
                className=""
                target="_blank"
              >
                Youtube to mp3, shorts download <FaExternalLinkAlt />
              </a>
            </div>
          </li>
          <li className="mb-2">
            <div className="block w-full text-left p-2 rounded transition-all duration-300  text-center text-stone-50 font-semibold flex justify-center gap-4 ">
              <a
                href="https://www.linkedin.com/in/yogesh-vishwakarma-bb132721a/"
                className=""
                target="_blank"
              >
                <FaLinkedin size={30} />
              </a>
              <a href="https://x.com/TupleMutable" className="" target="_blank">
                <FaSquareXTwitter size={30} />
              </a>
            </div>
          </li>
        </ul>
        {/* <div
          className="bg-gradient-to-tr from-blue-500
         to-blue-600 rounded-lg p-2"
        >
          <h1 className="text-center text-md text-stone-50">
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
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="w-full md:ml-auto p-6 md:w-3/4 md:p-10 lg:w-5/6 h-dvh overflow-scroll ">
        {selectedTool === "Welcome" && (
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-4 text-center md:text-start">
              QuenchTools &rarr; No Ads, No Redirects, Quick Conversion &
              Downloads.
            </h1>
            <p className="text-center md:text-start">
              Select a tool from the sidebar to get started.
            </p>
            <br />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <FeaturesCard
                message={"Extract text from any image."}
                title={"Text Extractor"}
              />
              <FeaturesCard
                message={"Compress any image."}
                title={"Image Compression"}
              />
              <FeaturesCard
                message={"Upscale any image to a higher resolution."}
                title={"Image Upscale"}
              />{" "}
              <FeaturesCard
                message={"Compress PDFs to make them smaller"}
                title={"PDF compression"}
              />
              <FeaturesCard
                message={"Convert images from one to other format"}
                title={"Image Converter"}
              />
              <FeaturesCard
                message={"make images black & white, crop them etc"}
                title={"Image Operations"}
              />
              <FeaturesCard
                message={"Convert files from one to another format"}
                title={"Files Conversion"}
              />
            </div>
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
