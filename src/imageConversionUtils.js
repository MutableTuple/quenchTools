import { createCanvas, loadImage } from "canvas";

export const convertImage = async (file, conversionType) => {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(URL.createObjectURL(file));
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  let mimeType;
  switch (conversionType) {
    case "jpgToPng":
      mimeType = "image/png";
      break;
    case "pngToJpg":
      mimeType = "image/jpeg";
      break;
    case "pngToIco":
      mimeType = "image/x-icon";
      break;
    case "bmpToPng":
      mimeType = "image/png";
      break;
    case "gifToJpg":
      mimeType = "image/jpeg";
      break;
    case "tiffToPng":
      mimeType = "image/png";
      break;
    case "webpToJpg":
      mimeType = "image/jpeg";
      break;
    default:
      mimeType = "image/png";
  }

  const dataUrl = canvas.toDataURL(mimeType);
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeType });
};
