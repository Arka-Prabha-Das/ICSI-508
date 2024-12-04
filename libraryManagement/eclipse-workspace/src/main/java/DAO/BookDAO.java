package DAO;

import models.Book;
import models.BookDetails;
import models.Review;
import utils.DBConnection;
import utils.GenericDAO;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookDAO {

    public List<Book> getAllBooks() throws SQLException {
    	String query = "SELECT b.bookID, b.title, b.price, b.details,a.author_name AS author,bc.category_name AS category FROM Books b LEFT JOIN AuthorWritesBook awb ON b.bookID = awb.bookID LEFT JOIN Author a ON awb.authorID = a.authorID LEFT JOIN Belongs_To bt ON b.bookID = bt.bookID LEFT JOIN BookCategory bc ON bt.categoryID = bc.categoryID ";

        List<Book> books = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                books.add(new Book(
                    rs.getInt("bookID"),
                    rs.getString("title"),
                    rs.getDouble("price"),
                    rs.getString("details"),
                    rs.getString("author"),
                    rs.getString("category")
                ));
            }
        }

        return books;
    }
    public BookDetails getBookDetails(int bookId) throws SQLException {
        String bookQuery = " SELECT b.bookID, b.title, b.price, b.details, COALESCE(a.author_name, 'Unknown') AS author, COALESCE(bc.category_name, 'Uncategorized') AS category FROM Books b LEFT JOIN AuthorWritesBook awb ON b.bookID = awb.bookID LEFT JOIN Author a ON awb.authorID = a.authorID LEFT JOIN Belongs_To bt ON b.bookID = bt.bookID LEFT JOIN BookCategory bc ON bt.categoryID = bc.categoryID WHERE b.bookID = ? ";

        String reviewsQuery = " SELECT r.reviewID, r.review_details FROM Reviews r INNER JOIN Contain c ON r.reviewID = c.reviewID WHERE c.bookID = ? ";

        BookDetails bookDetails = null;
        List<Review> reviews = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement bookStmt = conn.prepareStatement(bookQuery);
             PreparedStatement reviewStmt = conn.prepareStatement(reviewsQuery)) {

            // Fetch book details
            bookStmt.setInt(1, bookId);
            try (ResultSet rs = bookStmt.executeQuery()) {
                if (rs.next()) {
                    bookDetails = new BookDetails(
                        rs.getInt("bookID"),
                        rs.getString("title"),
                        rs.getDouble("price"),
                        rs.getString("details"),
                        rs.getString("author"),
                        rs.getString("category"),
                        new ArrayList<>()
                    );
                }
            }

            // Fetch reviews
            reviewStmt.setInt(1, bookId);
            try (ResultSet rs = reviewStmt.executeQuery()) {
                while (rs.next()) {
                    reviews.add(new Review(rs.getInt("reviewID"), rs.getString("review_details")));
                }
            }

            if (bookDetails != null) {
                bookDetails.setReviews(reviews);
            }
        }

        return bookDetails;
    }

    public void addReview(int userId, int bookId, String reviewDetails) throws SQLException {
        String reviewQuery = "INSERT INTO Reviews (review_details) VALUES (?)";
        String containQuery = "INSERT INTO Contain (bookID, reviewID) VALUES (?, ?)";
        String submitsQuery = "INSERT INTO Submits (userID, reviewID) VALUES (?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement reviewStmt = conn.prepareStatement(reviewQuery, PreparedStatement.RETURN_GENERATED_KEYS);
             PreparedStatement containStmt = conn.prepareStatement(containQuery);
             PreparedStatement submitsStmt = conn.prepareStatement(submitsQuery)) {

            // Insert into Reviews table
            reviewStmt.setString(1, reviewDetails);
            reviewStmt.executeUpdate();

            int reviewId;
            try (ResultSet rs = reviewStmt.getGeneratedKeys()) {
                if (rs.next()) {
                    reviewId = rs.getInt(1);

                    // Insert into Contain table
                    containStmt.setInt(1, bookId);
                    containStmt.setInt(2, reviewId);
                    containStmt.executeUpdate();

                    // Insert into Submits table
                    submitsStmt.setInt(1, userId);
                    submitsStmt.setInt(2, reviewId);
                    submitsStmt.executeUpdate();
                }
            }
        } 
    }
    public int addBook(Book book) throws SQLException {
        String query = "INSERT INTO Books (title, price, details) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, book.getTitle());
            stmt.setDouble(2, book.getPrice());
            stmt.setString(3, book.getDetails());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1); // Return the generated book ID
                }
            }
        }
        throw new SQLException("Failed to insert book");
    }

    public void addAuthorWritesBook(int bookId, int authorId) throws SQLException {
        String query = "INSERT INTO AuthorWritesBook (bookID, authorID) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, bookId);
            stmt.setInt(2, authorId);
            stmt.executeUpdate();
        }
    }

    public void addBookCategory(int bookId, int categoryId) throws SQLException {
        String query = "INSERT INTO Belongs_To (bookID, categoryID) VALUES (?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, bookId);
            stmt.setInt(2, categoryId);
            stmt.executeUpdate();
        }
    }
    
    public void updateBook(int bookId, String title, double price, String details) throws SQLException {
        String query = "UPDATE Books SET title = ?, price = ?, details = ? WHERE bookID = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, title);
            stmt.setDouble(2, price);
            stmt.setString(3, details);
            stmt.setInt(4, bookId);

            stmt.executeUpdate();
        }
    }

}
