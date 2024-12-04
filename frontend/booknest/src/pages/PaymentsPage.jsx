import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const userId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/payments", {
        params: { userId },
      });
      setPayments(response.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="w-[95%] mx-auto mt-10">

      <h1 className="text-3xl font-bold text-center mb-6">My Payments</h1>

      {payments.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>You have not made any purchases yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Payment ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Book Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                const [paymentID, title, price, date] = payment.split(", ");
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-800">{paymentID.split(": ")[1]}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{title.split(": ")[1]}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{price.split(": ")[1]}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{date.split(": ")[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default PaymentsPage;
