import React, { useState } from "react";

const ImageUpscaling = ({ image, handleImageChange, loading, setLoading }) => {
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [upscaleRatio, setUpscaleRatio] = useState(2); // Default upscale ratio

  const handleUpscaleRatioChange = (e) => {
    setUpscaleRatio(parseFloat(e.target.value));
  };

  const upscaleImage = async () => {
    setLoading(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(image);
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

  return (
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
  );
};

export default ImageUpscaling;
