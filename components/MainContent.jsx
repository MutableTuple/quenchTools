// src/components/MainContent.js
import React from "react";

const MainContent = ({
  selectedTool,
  image,
  compressedImage,
  handleImageChange,
  extractText,
  text,
  loading,
}) => {
  return (
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
            disabled={(!image && !compressedImage) || loading}
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
          {(image || compressedImage) && (
            <img
              src={image || compressedImage}
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
        <div>
          <h1 className="text-3xl font-bold mb-4">Image Compression</h1>
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-4 p-2 border"
          />
          {compressedImage && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Compressed Image:</h2>
              <img
                src={compressedImage}
                alt="Compressed"
                className="max-w-full mt-4"
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MainContent;
