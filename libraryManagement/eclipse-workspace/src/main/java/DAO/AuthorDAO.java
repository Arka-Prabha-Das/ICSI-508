package DAO;

import models.Author;
import utils.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AuthorDAO {
    public List<Author> getAllAuthors() throws SQLException {
        String query = "SELECT * FROM Author";
        List<Author> authors = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
            	//System.out.println("userId from ResultSet: " + rs.getInt("userId"));
                authors.add(new Author(
                    rs.getInt("authorID"),
                    rs.getString("author_name"),
                    rs.getInt("userId")
                ));
            }
        }

        return authors;
    }
}
