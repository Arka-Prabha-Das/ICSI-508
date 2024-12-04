package DAO;

import models.Club;
import utils.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ClubDAO {

    public List<Club> getAllClubs() throws SQLException {
        String query = "SELECT * FROM Clubs";
        List<Club> clubs = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                clubs.add(new Club(
                    rs.getInt("clubID"),
                    rs.getString("clubname"),
                    rs.getString("description")
                ));
            }
        }

        return clubs;
    }

    public List<Club> getMyClubs(int userId) throws SQLException {
    	String query = "SELECT c.*  FROM Clubs c  INNER JOIN Join_Club jc ON c.clubID = jc.clubID  WHERE jc.userID = ?";
        List<Club> clubs = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    clubs.add(new Club(
                        rs.getInt("clubID"),
                        rs.getString("clubname"),
                        rs.getString("description")
                    ));
                }
            }
        }

        return clubs;
    }

    public List<Club> getOtherClubs(int userId) throws SQLException {
        String query = " SELECT c.* FROM Clubs c WHERE c.clubID NOT IN ( SELECT jc.clubID FROM Join_Club jc WHERE jc.userID = ? ) ";
        List<Club> clubs = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    clubs.add(new Club(
                        rs.getInt("clubID"),
                        rs.getString("clubname"),
                        rs.getString("description")
                    ));
                }
            }
        }

        return clubs;
    }

    public void joinClub(int userId, int clubId) throws SQLException {
        String query = "INSERT INTO Join_Club (userID, clubID) VALUES (?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, clubId);
            stmt.executeUpdate();
        }
    }

    public void leaveClub(int userId, int clubId) throws SQLException {
        String query = "DELETE FROM Join_Club WHERE userID = ? AND clubID = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, clubId);
            stmt.executeUpdate();
        }
    }
}
