import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [review, setReview] = useState("");
  const userId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/bookDetails", {
        params: { bookId },
      });
      setBookDetails(response.data);
    } catch (err) {
      console.error("Error fetching book details:", err);
    }
  };

  const handleAddReview = async () => {
    try {
      await axios.post("http://localhost:8080/Library_Management/api/bookDetails", {
        userId,
        bookId,
        review,
      });
      setReview("");
      fetchBookDetails(); // Refresh reviews
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <div className="w-[95%] mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{bookDetails.title}</h1>
      <p>Author: {bookDetails.author}</p>
      <p>Category: {bookDetails.category}</p>
      <p>Price: ${bookDetails.price}</p>
      <p>{bookDetails.details}</p>

      <h2 className="text-lg font-semibold mt-6">Reviews</h2>
      <ul className="list-disc pl-6">
        {bookDetails.reviews.map((review) => (
          <li key={review.id}>{review.details}</li>
        ))}
      </ul>

      <div className="mt-6">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Write a review..."
        />
        <button
          onClick={handleAddReview}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>
    </div>
    </>
  );
};

export default BookDetailsPage;
