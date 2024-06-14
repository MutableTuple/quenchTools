import React, { useState, useRef, useEffect } from "react";

const ImageOperations = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [operation, setOperation] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const imageDataUrl = event.target.result;
      setImageSrc(imageDataUrl);
    };

    reader.readAsDataURL(file);
  };

  const handleOperation = (operationType) => {
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, image.width, image.height);

      switch (operationType) {
        case "toGrayscale":
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }

          ctx.putImageData(imageData, 0, 0);
          setProcessedImage(canvas.toDataURL());
          setOperation(operationType);
          break;

        case "sharpen":
          const imageData2 = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const data2 = imageData2.data;
          const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
          const katet = Math.round(Math.sqrt(weights.length));
          const half = (katet * 0.5) | 0;
          const alphaFac = 1;

          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const sy = y;
              const sx = x;
              const dstOff = (y * canvas.width + x) * 4;
              let r = 0,
                g = 0,
                b = 0,
                a = 0;

              for (let cy = 0; cy < katet; cy++) {
                for (let cx = 0; cx < katet; cx++) {
                  const scy = sy + cy - half;
                  const scx = sx + cx - half;

                  if (
                    scy >= 0 &&
                    scy < canvas.height &&
                    scx >= 0 &&
                    scx < canvas.width
                  ) {
                    const srcOff = (scy * canvas.width + scx) * 4;
                    const wt = weights[cy * katet + cx];
                    r += data2[srcOff] * wt;
                    g += data2[srcOff + 1] * wt;
                    b += data2[srcOff + 2] * wt;
                    a += data2[srcOff + 3] * wt;
                  }
                }
              }

              data2[dstOff] = r;
              data2[dstOff + 1] = g;
              data2[dstOff + 2] = b;
              data2[dstOff + 3] = a + alphaFac * (255 - a);
            }
          }

          ctx.putImageData(imageData2, 0, 0);
          setProcessedImage(canvas.toDataURL());
          setOperation(operationType);
          break;

        case "crop":
          setIsCropping(true);
          break;

        default:
          break;
      }
    };
  };

  const handleMouseDown = (e) => {
    if (!isCropping) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCropStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseUp = (e) => {
    if (!isCropping) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setCropEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsCropping(false);
  };

  const handleCrop = () => {
    if (!cropStart || !cropEnd) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);

    const imageData = ctx.getImageData(x, y, width, height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(imageData, 0, 0);

    setProcessedImage(canvas.toDataURL());
    setOperation("crop");
  };

  useEffect(() => {
    if (!isCropping) {
      handleCrop();
    }
  }, [isCropping]);

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Image Operations</h1>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4 p-2 border"
      />
      {imageSrc && (
        <>
          <div className="flex items-center mb-4 space-x-2">
            <button
              onClick={() => handleOperation("toGrayscale")}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Convert to Grayscale
            </button>
            <button
              onClick={() => handleOperation("sharpen")}
              className="bg-green-500 text-white p-2 rounded"
            >
              Sharpen Image
            </button>
            <button
              onClick={() => handleOperation("crop")}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Crop Image
            </button>
          </div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`border ${isCropping ? "cursor-crosshair" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
            {processedImage && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold">Processed Image</h2>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full mt-4"
                />
                <button
                  onClick={downloadImage}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Download Processed Image
                </button>
                {operation === "crop" && (
                  <p>Crop the image by dragging and selecting an area.</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageOperations;
