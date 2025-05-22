import React, { useState } from "react";
import logo from "./assets/turners-logo.jpg";
import "./App.css";

// Main component
export default function App() {
  // State to store the uploaded file (image)
  const [file, setFile] = useState(null);
  // State to store the local preview URL of the uploaded image
  const [vehicleImage, setVehicleImage] = useState(null);
  // State to store the prediction result
  const [result, setResult] = useState("");

  // Handles when a user selects an image file
  const handleFileChange = (e) => {
    const image = e.target.files[0]; // Get the first selected file
    setFile(image); // Save it to state
    setVehicleImage(URL.createObjectURL(image)); // Create a temporary image preview
  };

  // Sends the image to the Azure Custom Vision API and updates the result
  const handleUpload = () => {
    const url = import.meta.env.VITE_PREDICTION_URL; // API endpoint from .env
    const predictionKey = import.meta.env.VITE_PREDICTION_KEY; // API key from .env

    fetch(url, {
      method: "POST",
      headers: {
        "Prediction-Key": predictionKey,
        "Content-Type": "application/octet-stream", // Raw binary image
      },
      body: file, // Send the image as request body
    })
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => {
        console.log(data); // Log for debugging
        const top = data.predictions[0]; // Take the top prediction
        setResult(
          top.tagName + " (" + (top.probability * 100).toFixed(1) + "%)"
        ); // Format and save the prediction result
      });
  };

  return (
    <div className="screen">
      {/* Top navigation bar */}
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="container">
        <h1 className="text">Car Type Detector</h1>

        {/* Show uploaded image */}
        <div className="imageContainer">
          {vehicleImage && (
            <img className="image" src={vehicleImage} alt="vehicle" />
          )}
        </div>

        {/* Buttons to choose file and run prediction */}
        <div className="functions">
          <label className="buttons">
            Choose File
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .bmp, .gif" // Acceptable file types
              onChange={handleFileChange}
              hidden // Hide default input appearance
            />
          </label>

          <p onClick={handleUpload} className="buttons">
            Check
          </p>
        </div>

        {/* Show prediction result if available */}
        {result && <p className="result">Prediction: {result}</p>}
      </div>
    </div>
  );
}
