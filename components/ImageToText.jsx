import React, { useState } from "react";
import Tesseract from "tesseract.js";

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <h1>Image to Text Extractor</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={extractText} disabled={!image || loading}>
        {loading ? "Extracting..." : "Extract Text"}
      </button>
      {image && (
        <img
          src={image}
          alt="Selected"
          style={{ maxWidth: "100%", marginTop: "20px" }}
        />
      )}
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default ImageToText;
