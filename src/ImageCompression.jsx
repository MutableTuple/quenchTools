import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageCompression = ({
  image,
  handleImageChange,
  loading,
  setLoading,
}) => {
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionRatio, setCompressionRatio] = useState(0.7);

  const handleCompressionRatioChange = (e) => {
    setCompressionRatio(parseFloat(e.target.value));
  };

  const compressImage = async () => {
    setLoading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        maxIteration: 50,
        initialQuality: compressionRatio,
      };

      // Ensure that image is a valid file or blob object before compressing
      if (!image || !(image instanceof Blob || image instanceof File)) {
        throw new Error("The file given is not an instance of Blob or File");
      }

      const compressedFile = await imageCompression(image, options);
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedImageUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error compressing image:", error);
      setLoading(false);
    }
  };

  return (
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
  );
};

export default ImageCompression;
