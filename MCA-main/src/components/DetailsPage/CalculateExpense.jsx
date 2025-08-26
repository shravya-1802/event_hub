// src/pages/CalculateExpense.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Calculator, Bus, Car, TrainFront, Bike } from "lucide-react";

const CalculateExpense = () => {
  const location = useLocation();
  const { eventLocation } = location.state || {}; // event.location passed via navigation

  const [userLocation, setUserLocation] = useState("");
  const [distance, setDistance] = useState(null);
  const [transport, setTransport] = useState("car"); // default transport

  // 🚖 Rates per km for different transports
  const rates = {
    car: 10,
    bus: 3,
    train: 2,
    bike: 5,
  };

  // 📍 Option 1: Get location from browser
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation(`${lat},${lng}`);
        },
        (err) => {
          alert("Failed to fetch current location");
          console.error(err);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // 🚗 Dummy calculation
  const calculateDistance = async () => {
    if (!userLocation || !eventLocation) {
      alert("Please provide both locations!");
      return;
    }
    const fakeDistance = Math.floor(Math.random() * 200) + 10; // 10–200 km
    setDistance(fakeDistance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 tracking-tight"
      >
        🚗 Calculate Travel Expense
      </motion.h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        {/* Destination from Event */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin size={18} className="text-red-500" /> Event Destination
          </label>
          <input
            type="text"
            value={eventLocation || ""}
            disabled
            className="mt-2 block w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 font-medium"
          />
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Navigation size={18} className="text-blue-500" /> Your Location
          </label>
          <input
            type="text"
            placeholder="Enter your location manually"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={getCurrentLocation}
            className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
          >
            <Navigation size={18} /> Use My Current Location
          </button>
        </div>

        {/* Transport Options */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Choose Transport:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTransport("car")}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md border ${
                transport === "car"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Car size={18} /> Car
            </button>
            <button
              onClick={() => setTransport("bus")}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md border ${
                transport === "bus"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Bus size={18} /> Bus
            </button>
            <button
              onClick={() => setTransport("train")}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md border ${
                transport === "train"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <TrainFront size={18} /> Train
            </button>
            <button
              onClick={() => setTransport("bike")}
              className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md border ${
                transport === "bike"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Bike size={18} /> Bike
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateDistance}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Calculator size={20} /> Calculate Distance
        </button>

        {/* Result */}
        {distance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-xl shadow-md text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Distance: <span className="text-green-700">{distance} km</span>
            </h2>
            <p className="mt-3 text-lg font-medium text-gray-700">
              🚍 Mode:{" "}
              <span className="capitalize font-bold text-blue-600">
                {transport}
              </span>
            </p>
            <p className="mt-2 text-lg font-medium text-gray-700">
              💰 Estimated Expense:{" "}
              <span className="text-green-700 font-bold">
                ₹{distance * rates[transport]}
              </span>{" "}
              (₹{rates[transport]} per km)
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalculateExpense;
