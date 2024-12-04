import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/Library_Management/api/users?userId=${userId}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8080/Library_Management/api/users", {
        userID: parseInt(userId, 10),
        ...userDetails,
      });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update user details:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
    <Navbar />
    <div className="w-[95%] mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="p-4 border rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!editing}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!editing}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled={!editing}
          />
        </div>
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
