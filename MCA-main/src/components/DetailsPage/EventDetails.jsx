// src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../Modules/Api";
import { Calendar, MapPin, User, Eye } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams(); // Get eventId from URL
  const [event, setEvent] = useState(null);

  let userRole = null;
  const user = JSON.parse(localStorage.getItem("user"));
  userRole = user?.username || null;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(api + `api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch event", err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p className="p-6 text-center">Loading event...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-72">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {event.title}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Details Card */}
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 -mt-12 relative z-10">
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5 text-purple-600" />
              <span>{event.organizer}</span>
            </div>
            {event.views !== undefined && (
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5 text-purple-600" />
                <span>{event.views} views</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-6">
            <span className="text-sm font-semibold mr-2">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${event.status === "approved"
                ? "bg-green-100 text-green-700"
                : event.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {event.status}
            </span>
          </div>

          {/* ✅ Extra Buttons for USER Role */}
          {userRole !== "admin" && (
            <div className="mt-8 flex gap-4">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                onClick={() =>
                  navigate("/calculate", { state: { eventLocation: event.location } })
                }
              >
                Calculate Expense
              </button>
              {/* <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md">
                View on Map
              </button> */}
              {/* <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md">
                Register
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 text-gray-300 text-center py-4">
        © {new Date().getFullYear()} Eventify. All rights reserved.
      </footer>
    </div>
  );
};

export default EventDetails;
