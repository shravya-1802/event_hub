import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../Modules/Api";

const AdminDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.userId;
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    organizer: "",
    description: "",
    image: null,
    userId: userId
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(api + "api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch events", err);
      }
    };
    fetchEvents();
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

      setEvents([...events, res.data.event]); // add to list
      alert("✅ Event submitted!");

      setFormData({
        title: "",
        date: "",
        location: "",
        organizer: "",
        description: "",
        image: null,
        userId: localStorage.getItem("userId"),
      });
      setImagePreview(null);
    } catch (err) {
      console.error("❌ Failed to add event", err);
      alert("Failed to submit event!");
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(api + `api/events/${id}/status`, { status });
      setEvents(events.map((ev) => (ev._id === id ? res.data : ev)));
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  // Mini dashboard stats
  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === "approved").length,
    rejected: events.filter((e) => e.status === "rejected").length,
    pending: events.filter((e) => e.status === "pending").length,
  };


  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6/">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Welcome,  🎉</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* 📊 Mini Dashboard */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg">Total</h3>
            <p>{stats.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg">Approved</h3>
            <p>{stats.approved}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg">Pending</h3>
            <p>{stats.pending}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow text-center">
            <h3 className="font-bold text-lg">Rejected</h3>
            <p>{stats.rejected}</p>
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
            <input
              type="text"
              name="organizer"
              placeholder="Organizer"
              className="w-full border p-2 rounded"
              value={formData.organizer}
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Event
            </button>
          </form>
        </div>

        {/* Events List */}
        <h2 className="text-lg font-bold mb-4">Events</h2>
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
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.date} - {event.location}
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
              <div className="space-x-3">
                <button
                  onClick={async () => {
                    try {
                      // update views in backend
                      await axios.patch(api + `api/events/${event._id}/view`);
                      // then navigate to event details page
                      navigate(`/events/${event._id}`);
                    } catch (err) {
                      console.error("❌ Failed to update views", err);
                    }
                  }}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>

                <button
                  onClick={() => updateStatus(event._id, "approved")}
                  className="text-green-500 hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(event._id, "rejected")}
                  className="text-red-500 hover:underline"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
