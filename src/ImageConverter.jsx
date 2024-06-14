import React, { useState } from "react";
import { saveAs } from "file-saver";
import { convertImage } from "./imageConversionUtils";

const ImageConverter = () => {
  const [image, setImage] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [conversionType, setConversionType] = useState("jpgToPng");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setConvertedImages([]);
  };

  const handleConversionTypeChange = (e) => {
    setConversionType(e.target.value);
  };

  const convertImageFile = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const convertedFile = await convertImage(image, conversionType);
      const convertedImageUrl = URL.createObjectURL(convertedFile);
      setConvertedImages([
        ...convertedImages,
        { url: convertedImageUrl, file: convertedFile },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error converting image:", error);
      setLoading(false);
    }
  };

  const downloadImage = (file, format) => {
    const extension = format.split("To")[1].toLowerCase();
    saveAs(file, `converted_image.${extension}`);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Image Converter</h1>
      <input
        type="file"
        onChange={handleImageChange}
        className="mb-4 p-2 border"
        accept="image/*"
      />
      <div className="flex items-center mb-4">
        <label htmlFor="conversionType" className="mr-2">
          Conversion Type:
        </label>
        <select
          id="conversionType"
          value={conversionType}
          onChange={handleConversionTypeChange}
          className="p-2 border"
        >
          <option value="jpgToPng">JPG to PNG</option>
          <option value="pngToJpg">PNG to JPG</option>
          <option value="pngToIco">PNG to ICO</option>
          <option value="bmpToPng">BMP to PNG</option>
          <option value="gifToJpg">GIF to JPG</option>
          <option value="tiffToPng">TIFF to PNG</option>
          <option value="webpToJpg">WEBP to JPG</option>
        </select>
      </div>
      <button
        onClick={convertImageFile}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={!image || loading}
      >
        {loading ? "Converting..." : "Convert Image"}
      </button>
      {convertedImages.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Converted Images:</h2>
          {convertedImages.map((convertedImage, index) => (
            <div key={index} className="mt-4">
              <img
                src={convertedImage.url}
                alt="Converted"
                className="max-w-full"
              />
              <button
                onClick={() =>
                  downloadImage(convertedImage.file, conversionType)
                }
                className="block mt-2 bg-green-500 text-white p-2 rounded"
              >
                Download Converted Image
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
