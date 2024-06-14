// src/components/Sidebar.js
import React from "react";

const Sidebar = ({ sidebarOpen, toggleSidebar, setSelectedTool }) => {
  return (
    <aside
      className={`bg-blue-900 text-white p-4 w-full md:w-1/4 lg:w-1/6 ${
        sidebarOpen ? "block" : "hidden"
      } md:block fixed top-0 left-0 h-full md:h-auto md:relative overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-2xl font-bold">Tools</h2>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          {sidebarOpen ? "Close" : "Open"}
        </button>
      </div>
      <ul>
        <li className="mb-2">
          <button
            onClick={() => setSelectedTool("Text Extraction")}
            className="block w-full text-left p-2 rounded hover:bg-blue-700"
          >
            Text Extraction
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => setSelectedTool("Image Compression")}
            className="block w-full text-left p-2 rounded hover:bg-blue-700"
          >
            Image Compression
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
