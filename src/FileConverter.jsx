import React, { useState } from "react";
import { convertFile } from "./fileConversionUtils";
import { saveAs } from "file-saver";

const FileConverter = () => {
  const [file, setFile] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [conversionType, setConversionType] = useState("pdfToExcel");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setConvertedFiles([]);
  };

  const handleConversionTypeChange = (e) => {
    setConversionType(e.target.value);
  };

  const convertSelectedFile = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const convertedFile = await convertFile(file, conversionType);
      const convertedFileUrl = URL.createObjectURL(convertedFile);
      setConvertedFiles([
        ...convertedFiles,
        { url: convertedFileUrl, file: convertedFile },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error converting file:", error);
      setLoading(false);
    }
  };

  const downloadFile = (file, format) => {
    const extension = format.split("To")[1].toLowerCase();
    saveAs(file, `converted_file.${extension}`);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">File Converter</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border"
        accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,image/jpeg,image/png"
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
          <option value="pdfToExcel">PDF to Excel</option>
          <option value="wordToPdf">Word to PDF</option>
          <option value="pdfToWord">PDF to Word</option>
          <option value="textToPdf">Text to PDF</option>
          <option value="excelToCsv">Excel to CSV</option>
          <option value="csvToExcel">CSV to Excel</option>
          <option value="jpgToPdf">JPG to PDF</option>
          <option value="pdfToJpg">PDF to JPG</option>
          <option value="pngToPdf">PNG to PDF</option>
        </select>
      </div>
      <button
        onClick={convertSelectedFile}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={!file || loading}
      >
        {loading ? "Converting..." : "Convert File"}
      </button>
      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Converted Files:</h2>
          {convertedFiles.map((convertedFile, index) => (
            <div key={index} className="mt-4">
              <a
                href={convertedFile.url}
                download={`converted_file.${conversionType
                  .split("To")[1]
                  .toLowerCase()}`}
                className="block mt-2 underline text-blue-500"
              >
                Download Converted File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileConverter;
