import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import BooksPage from "./pages/BooksPage";
import ClubsPage from "./pages/ClubsPage";
import PaymentsPage from "./pages/PaymentsPage";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import CardPayment from "./pages/CardPayment";
import ProfilePage from "./pages/ProfilePage";
import ClubDetailsPage from "./pages/ClubDeatilsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/clubs" element={<ProtectedRoute><ClubsPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><CardPayment /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/books/:bookId" element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />
          <Route path="/clubs/:clubId" element={<ProtectedRoute><ClubDetailsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
