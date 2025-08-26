import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 for navigation
import Nav from "./Nav";
import api from "../Modules/Api";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate(); // 👈

    // Fetch events on page load
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(api + "api/events");
                setEvents(response.data);
            } catch (error) {
                console.error("❌ Failed to fetch events:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filtered events
    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(filter.toLowerCase()) ||
            event.location.toLowerCase().includes(filter.toLowerCase())
    );

    // ✅ helper to fix base64 prefix issue
    const getImageSrc = (base64) => {
        if (!base64) return null;
        return base64.startsWith("data:image")
            ? base64
            : `data:image/jpeg;base64,${base64}`;
    };

    let userRole = null;

    // ✅ Separate function for handling "View Details"
    const handleViewDetails = async (eventId) => {
        try {
            // update views
            const user = JSON.parse(localStorage.getItem("user"));
            userRole = user?.role || null;

            if (userRole !== null) {
                await axios.patch(`${api}api/events/${eventId}/view`);
                // navigate to details page
                navigate(`/events/${eventId}`);
            } else {
                alert("please login to view")
            }
        } catch (err) {
            console.error("❌ Failed to update views", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Nav />

            {/* Hero Section */}
            <section className="flex min-h-[60vh]">
                <div className="w-1/2 bg-[#4f46e5] flex flex-col justify-center items-start p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        Discover Amazing <br /> Events Near You
                    </h1>
                    <p className="text-lg mb-6">
                        Join thousands of event enthusiasts. Create, discover, and attend
                        incredible events in your area. From conferences to festivals, find
                        your next adventure.
                    </p>
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-100 transition cursor-pointer">
                        Browse Events
                    </button>
                </div>

                <div className="w-1/2 bg-yellow-400 text-white flex justify-center items-center text-3xl font-bold">
                    Events Await
                </div>
            </section>

            {/* Events Section */}
            <section className="flex-grow">
                <div className="m-auto w-fit p-6">
                    <h1 className="font-semibold text-3xl w-fit m-auto">
                        Featured Events
                    </h1>
                    <h2 className="text-xl text-center">
                        Discover amazing events happening around you
                    </h2>

                    {/* Filter Input */}
                    <div className="flex justify-center mt-6">
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Events Grid */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                    {loading ? (
                        <p className="text-center text-gray-500 col-span-full">
                            Loading events...
                        </p>
                    ) : filteredEvents.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">
                            No events found.
                        </p>
                    ) : (
                        filteredEvents.map((event) => (
                            <div
                                key={event._id}
                                className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden"
                            >
                                {/* Event Image */}
                                <div className="h-48 w-full">
                                    {event.image ? (
                                        <img
                                            src={getImageSrc(event.image)}
                                            alt={event.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                                    <p className="text-gray-600 mb-3">{event.description}</p>
                                    <p className="text-sm mb-1">📍 {event.location}</p>
                                    <p className="text-sm mb-3">📅 {event.date}</p>

                                    {/* ✅ Button now calls the separate function */}
                                    <button
                                        onClick={() => handleViewDetails(event._id)}
                                        className="w-full bg-[#4f46e5] hover:bg-purple-700 text-white py-2 rounded-xl transition cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <footer className="bg-gray-800 text-white text-center py-4 mt-6">
                © {new Date().getFullYear()} Event Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
