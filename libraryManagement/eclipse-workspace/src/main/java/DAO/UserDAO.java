package DAO;

import models.User;
import utils.GenericDAO;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import utils.DBConnection;

public class UserDAO {
    public void addUser(User user) throws SQLException {
        String query = "INSERT INTO Users (role, name, password, email) VALUES (?, ?, ?, ?)";
        GenericDAO.executeUpdate(query, user.getRole(), user.getName(), user.getPassword(), user.getEmail());
    }

    public List<User> getAllUsers() throws SQLException {
        String query = "SELECT * FROM Users";
        try (ResultSet rs = GenericDAO.executeQuery(query)) {
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                users.add(new User(
                        rs.getInt("userID"),
                        rs.getString("role"),
                        rs.getString("name"),
                        rs.getString("password"),
                        rs.getString("email")
                ));
            }
            return users;
        }
    }
    
    public String getUserRoleById(int userID) throws SQLException {
        String query = "SELECT role FROM Users WHERE userID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userID);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("role");
                }
            }
        }
        return null;
    }
    
    public User getUserByEmail(String email) throws SQLException {
        String query = "SELECT userID, role, name, password, email FROM Users WHERE email = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("userID"),
                        rs.getString("role"),
                        rs.getString("name"),
                        rs.getString("password"),
                        rs.getString("email")
                    );
                }
            }
        }
        return null;
    }
    public User getUserById(int userId) throws SQLException {
        String query = "SELECT * FROM Users WHERE userID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("userID"),
                        rs.getString("role"),
                        rs.getString("name"),
                        rs.getString("password"),
                        rs.getString("email")
                    );
                }
            }
        }
        return null;
    }
    
    public boolean updateUser(User user) throws SQLException {
        String query = "UPDATE Users SET name = ?, email = ?, password = ? WHERE userID = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());
            stmt.setInt(4, user.getUserID());
            return stmt.executeUpdate() > 0;
        }
    }
}
