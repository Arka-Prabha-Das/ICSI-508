

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ClubsPage = () => {
  const [myClubs, setMyClubs] = useState([]);
  const [otherClubs, setOtherClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/clubs", {
        params: { userId },
      });
      const { myClubs, otherClubs } = response.data;
      setMyClubs(myClubs);
      setOtherClubs(otherClubs);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await axios.post("http://localhost:8080/Library_Management/api/clubs", {
        action: "join",
        userId,
        clubId,
      });
      fetchClubs(); // Refresh the list
    } catch (err) {
      console.error("Error joining club:", err);
    }
  };

  const handleLeaveClub = async (clubId) => {
    try {
      await axios.post("http://localhost:8080/Library_Management/api/clubs", {
        action: "leave",
        userId,
        clubId,
      });
      fetchClubs(); // Refresh the list
    } catch (err) {
      console.error("Error leaving club:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMyClubs = myClubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherClubs = otherClubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Clubs</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search clubs..."
            className="w-full p-4 border rounded shadow"
          />
        </div>

        <h2 className="text-lg font-semibold">My Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredMyClubs.length > 0 ? (
            filteredMyClubs.map((club) => (
              <div key={club.id} className="p-4 border rounded shadow">
                <h3 className="font-bold">{club.name}</h3>
                <p>{club.description}</p>
                <button
                  onClick={() => handleLeaveClub(club.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Leave Club
                </button>
                <button
                  onClick={() => navigate(`${club.id}`)}
                  className="mt-2 ml-6 bg-green-500 text-white px-4 py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No clubs found.</p>
          )}
        </div>

        <h2 className="text-lg font-semibold">Other Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOtherClubs.length > 0 ? (
            filteredOtherClubs.map((club) => (
              <div key={club.id} className="p-4 border rounded shadow">
                <h3 className="font-bold">{club.name}</h3>
                <p>{club.description}</p>
                <button
                  onClick={() => handleJoinClub(club.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Join Club
                </button>
              </div>
            ))
          ) : (
            <p>No clubs found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ClubsPage;

