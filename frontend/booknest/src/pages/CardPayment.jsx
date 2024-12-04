import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

const CardPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = location.state;
  const userId = parseInt(localStorage.getItem("userId"), 10);

  const [bookDetails, setBookDetails] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");

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

  const validatePayment = () => {
    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Card number must be exactly 16 digits.");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setError("Expiry date must be in MM/YY format.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setError("CVC must be 3 or 4 digits.");
      return false;
    }

    setError("");
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    try {
      await axios.post("http://localhost:8080/Library_Management/api/purchase", {
        userId,
        bookId,
      });
      alert("Payment successful!");
      generateDummyBookPDF();
      navigate("/payments"); // Redirect to payments page
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const generateDummyBookPDF = () => {
    const doc = new jsPDF();
  
    // Add content to the PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Title: ${bookDetails.title}`, 20, 20);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Author: ${bookDetails.author}`, 20, 30);
    doc.text("Publisher: BookNest", 20, 40);
    doc.text("Date: December 2024", 20, 50);
  
    doc.setFontSize(14);
    doc.text("Content:", 20, 70);
    doc.setFontSize(12);
    doc.text(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod sapien non mauris venenatis fermentum. Proin sollicitudin luctus volutpat. Donec aliquam libero vitae metus euismod pellentesque.",
      20,
      80,
      { maxWidth: 170 }
    );
  
    // Generate a new page with more content
    doc.addPage();
    doc.text("This is page 2 of the Dummy Book.", 20, 20);
  
    // Download the PDF
    doc.save("Book.pdf");
  };

  return (
    <div className="w-[95%] mx-auto mt-32 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-gray-100 p-6 rounded shadow">
        {bookDetails ? (
          <>
            <h2 className="text-2xl font-bold mb-4">${bookDetails.price}</h2>
            <p className="text-gray-600">{bookDetails.title}</p>
            <p className="text-gray-500">Author: {bookDetails.author}</p>
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold">Subtotal: ${bookDetails.price}</p>
              <p className="font-semibold">Total: ${bookDetails.price}</p>
            </div>
          </>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>

      {/* Right Section: Payment Form */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Payment</h1>
        <div className="mb-4">
          <label className="block font-medium mb-2">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full p-3 border rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            className="w-full p-3 border rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            className="w-full p-3 border rounded shadow-sm"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 shadow-lg"
        >
          Pay ${bookDetails ? bookDetails.price : ""}
        </button>
      </div>
    </div>
  );
};

export default CardPayment;
