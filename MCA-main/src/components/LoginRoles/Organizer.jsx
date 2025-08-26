import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../Modules/Api";

const Organizer = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.userId;

  const organizerName = localStorage.getItem("username") || "Organizer"; // 👈 fallback if not stored

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    organizer: organizerName,
    description: "",
    image: null,
    userId: userId,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch only organizer's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await axios.get(`${api}api/events/user/${userId}`);
        setEvents(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user events", err);
      }
    };
    fetchUserEvents();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const res = await axios.post(api + "api/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEvents([...events, res.data.event]);
      alert("✅ Event submitted!");

      setFormData({
        title: "",
        date: "",
        location: "",
        organizer: organizerName,
        description: "",
        image: null,
        userId: userId,
      });
      setImagePreview(null);
    } catch (err) {
      console.error("❌ Failed to add event", err);
      alert("Failed to submit event!");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Welcome, {organizerName} 🎉</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow rounded p-4 text-center">
            <h2 className="text-lg font-bold">Total Events</h2>
            <p className="text-2xl text-indigo-600">{events.length}</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <h2 className="text-lg font-bold">Approved</h2>
            <p className="text-2xl text-green-600">
              {events.filter((e) => e.status === "approved").length}
            </p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <h2 className="text-lg font-bold">Pending</h2>
            <p className="text-2xl text-yellow-600">
              {events.filter((e) => e.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Add Event Form */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-lg font-bold mb-4">Add Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              className="w-full border p-2 rounded"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              className="w-full border p-2 rounded"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full border p-2 rounded"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border p-2 rounded"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border mt-2"
              />
            )}

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Event
            </button>
          </form>
        </div>

        {/* Events List */}
        <h2 className="text-lg font-bold mb-4">Your Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 shadow rounded flex justify-between items-center"
            >
              <div className="flex gap-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 object-cover rounded border"
                  />
                )}
                <div>
                  <h3 className="font-bold text-indigo-700">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.date} • {event.location}
                  </p>
                  <p className="text-gray-700">{event.description}</p>
                  <p
                    className={`text-xs font-semibold mt-1 ${event.status === "approved"
                      ? "text-green-600"
                      : event.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                      }`}
                  >
                    Status: {event.status}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">👁 {event.views || 0} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organizer;
