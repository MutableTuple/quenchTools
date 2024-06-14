import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PDFCompression = ({ setLoading, loading }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(2); // Default compression level
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [error, setError] = useState(null);

  // Function to convert File to Uint8Array
  const fileToByteArray = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        resolve(byteArray);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setCompressedPdf(null); // Reset compressed PDF state
  };

  const handleCompressionLevelChange = (e) => {
    setCompressionLevel(Number(e.target.value));
  };

  const compressPdf = async () => {
    setLoading(true);
    try {
      if (!pdfFile) {
        throw new Error("No PDF file selected");
      }

      const pdfBytes = await fileToByteArray(pdfFile);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize(); // Ensure width and height are retrieved
        const scaleRatio = 1 / compressionLevel;

        if (
          typeof width === "number" &&
          typeof height === "number" &&
          typeof compressionLevel === "number" &&
          !isNaN(scaleRatio) &&
          scaleRatio > 0
        ) {
          page.scale(scaleRatio);
        } else {
          console.error(
            "Invalid compression level or scale ratio:",
            compressionLevel,
            scaleRatio
          );
          setError("Invalid compression level or scale ratio");
        }
      });

      const compressedPdfBytes = await pdfDoc.save();
      const compressedPdfUrl = URL.createObjectURL(
        new Blob([compressedPdfBytes], { type: "application/pdf" })
      );
      setCompressedPdf(compressedPdfUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error compressing PDF:", error);
      setError(error.message || "Error compressing PDF");
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">PDF Compression</h1>
      <input
        type="file"
        onChange={handlePdfChange}
        className="mb-4 p-2 border"
        accept="application/pdf"
      />
      {pdfFile && (
        <>
          <div className="flex items-center mb-4">
            <label htmlFor="compressionLevel" className="mr-2">
              Compression Level:
            </label>
            <input
              type="number"
              id="compressionLevel"
              min="1"
              value={compressionLevel}
              onChange={handleCompressionLevelChange}
              className="mr-2 p-2 border"
            />
          </div>
          <button
            onClick={compressPdf}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Compressing..." : "Compress PDF"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {compressedPdf && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Compressed PDF:</h2>
              <embed
                src={compressedPdf}
                type="application/pdf"
                className="max-w-full mt-4"
                height="600px"
              />
              <a
                href={compressedPdf}
                download="compressed_pdf.pdf"
                className="block mt-2 underline text-blue-500"
              >
                Download Compressed PDF
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFCompression;
