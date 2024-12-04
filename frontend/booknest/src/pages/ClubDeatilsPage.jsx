import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ClubDetailsPage = () => {
  const { clubId } = useParams(); // Get club ID from the URL
  const [clubDetails, setClubDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubDetails();
    fetchClubMembers();
  }, []);

  const fetchClubDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Library_Management/api/clubs/${clubId}`
      );
      setClubDetails(response.data);
    } catch (err) {
      console.error("Error fetching club details:", err);
    }
  };

  const fetchClubMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Library_Management/api/clubs/${clubId}/members`
      );
      setMembers(response.data);
    } catch (err) {
      console.error("Error fetching club members:", err);
    }
  };

  return (
    <>
      <Navbar />
      <button
          onClick={() => navigate("/clubs")}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Back to Clubs
        </button>
      <div className="w-[95%] mx-auto mt-10">
        {clubDetails ? (
          <div>
            {/* Club Details */}
            <div className="bg-gray-100 p-6 rounded shadow mb-6">
              <h1 className="text-3xl font-bold">{clubDetails.name}</h1>
              <p className="text-gray-700 mt-2">{clubDetails.description}</p>
            </div>

            {/* Club Members */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-semibold mb-4">Members</h2>
              {members.length > 0 ? (
                <ul className="space-y-4">
                  {members.map((member) => (
                    <li
                      key={member.id}
                      className="p-4 border rounded shadow hover:shadow-lg"
                    >
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-gray-500">{member.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found in this club.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading club details...</p>
        )}
        
      </div>
    </>
  );
};

export default ClubDetailsPage;
