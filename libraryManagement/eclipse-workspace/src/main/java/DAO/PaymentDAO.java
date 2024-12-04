package DAO;

import utils.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PaymentDAO {

    public void purchaseBook(int userId, int bookId) throws SQLException {
        String paymentQuery = "INSERT INTO Payment (timestamp) VALUES (CURRENT_TIMESTAMP)";
        String createsQuery = "INSERT INTO Creates (paymentID, userID) VALUES (?, ?)";
        String purchaseQuery = "INSERT INTO Purchase (paymentID, userID, bookID) VALUES (?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement paymentStmt = conn.prepareStatement(paymentQuery, PreparedStatement.RETURN_GENERATED_KEYS);
             PreparedStatement createsStmt = conn.prepareStatement(createsQuery);
             PreparedStatement purchaseStmt = conn.prepareStatement(purchaseQuery)) {

            // Insert into Payment table
            paymentStmt.executeUpdate();
            try (ResultSet rs = paymentStmt.getGeneratedKeys()) {
                if (rs.next()) {
                    int paymentId = rs.getInt(1);

                    // Insert into Creates table
                    createsStmt.setInt(1, paymentId);
                    createsStmt.setInt(2, userId);
                    createsStmt.executeUpdate();

                    // Insert into Purchase table
                    purchaseStmt.setInt(1, paymentId);
                    purchaseStmt.setInt(2, userId);
                    purchaseStmt.setInt(3, bookId);
                    purchaseStmt.executeUpdate();
                }
            }
        }
    }

    public List<String> getUserPayments(int userId) throws SQLException {
        String query = " SELECT p.paymentID, p.timestamp, b.title, b.price FROM Payment p INNER JOIN Creates c ON p.paymentID = c.paymentID INNER JOIN Purchase pu ON p.paymentID = pu.paymentID INNER JOIN Books b ON pu.bookID = b.bookID WHERE c.userID = ? ";

        List<String> payments = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    String paymentDetails = String.format(
                        "PaymentID: %d, Book: %s, Price: $%.2f, Date: %s",
                        rs.getInt("paymentID"),
                        rs.getString("title"),
                        rs.getDouble("price"),
                        rs.getString("timestamp")
                    );
                    payments.add(paymentDetails);
                }
            }
        }

        return payments;
    }
}
