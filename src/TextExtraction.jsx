import React, { useState } from "react";
import Tesseract from "tesseract.js";

const TextExtraction = ({ image, handleImageChange, loading, setLoading }) => {
  const [text, setText] = useState("");

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

  return (
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
      {image && <img src={image} alt="Selected" className="max-w-full mt-4" />}
      {text && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default TextExtraction;
