package utils;

import java.sql.*;

public class GenericDAO {
    public static void executeUpdate(String query, Object... params) throws SQLException {
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            setParams(stmt, params);
            stmt.executeUpdate();
        }
    }

    public static ResultSet executeQuery(String query, Object... params) throws SQLException {
        Connection conn = DBConnection.getConnection();
        PreparedStatement stmt = conn.prepareStatement(query);
        setParams(stmt, params);
        return stmt.executeQuery(); // Caller should close ResultSet.
    }

    private static void setParams(PreparedStatement stmt, Object... params) throws SQLException {
        for (int i = 0; i < params.length; i++) {
            stmt.setObject(i + 1, params[i]);
        }
    }
}
