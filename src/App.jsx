import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ImageToText from "../components/ImageToText";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ImageToText />
    </>
  );
}

export default App;
