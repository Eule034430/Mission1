import React, { useState } from "react";
import logo from "./assets/turners-logo.jpg";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setVehicleImage(URL.createObjectURL(image));
  };

  const handleUpload = () => {
    const url = import.meta.env.VITE_PREDICTION_URL;
    const predictionKey = import.meta.env.VITE_PREDICTION_KEY;

    fetch(url, {
      method: "POST",
      headers: {
        "Prediction-Key": predictionKey,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const top = data.predictions[0];
        setResult(
          top.tagName + " (" + (top.probability * 100).toFixed(1) + "%)"
        );
      });
  };

  return (
    <div className="screen">
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="container">
        <h1 className="text">Car Type Detector</h1>

        <div className="imageContainer">
          {vehicleImage && (
            <img className="image" src={vehicleImage} alt="vehicle" />
          )}
        </div>
        <div className="functions">
          <label className="buttons">
            Choose File
            <input
              type="file"
               accept=".jpg, .jpeg, .png, .bmp, .gif"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <p onClick={handleUpload} className="buttons">
            Check
          </p>
        </div>
        {result && <p className="result">Prediction: {result}</p>}
      </div>
    </div>
  );
}
