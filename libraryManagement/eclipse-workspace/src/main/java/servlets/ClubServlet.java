package servlets;

import DAO.ClubDAO;
import models.Club;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class ClubServlet extends HttpServlet {
    private final ClubDAO clubDAO = new ClubDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        String userIdParam = req.getParameter("userId");
        if (userIdParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Missing userId parameter");
            return;
        }

        try {
            int userId = Integer.parseInt(userIdParam);

            // Get all clubs
            List<Club> allClubs = clubDAO.getAllClubs();

            // Get user's clubs
            List<Club> myClubs = clubDAO.getMyClubs(userId);

            // Get other clubs
            List<Club> otherClubs = clubDAO.getOtherClubs(userId);

            String jsonResponse = gson.toJson(new ClubsResponse(allClubs, myClubs, otherClubs));
            resp.getWriter().write(jsonResponse);
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        Gson gson = new Gson();

        // Read the JSON body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        }

        // Parse the JSON body
        JsonObject requestBody = gson.fromJson(jsonBody.toString(), JsonObject.class);
        String action = requestBody.get("action").getAsString();
        int userId = requestBody.get("userId").getAsInt();
        int clubId = requestBody.get("clubId").getAsInt();

        // Validate parameters
        if (action == null || userId <= 0 || clubId <= 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Missing or invalid parameters\"}");
            return;
        }

        try {
            if ("join".equals(action)) {
                clubDAO.joinClub(userId, clubId);
                resp.getWriter().write("{\"message\":\"Joined the club successfully\"}");
            } else if ("leave".equals(action)) {
                clubDAO.leaveClub(userId, clubId);
                resp.getWriter().write("{\"message\":\"Left the club successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"Invalid action\"}");
            }
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private static class ClubsResponse {
        List<Club> allClubs;
        List<Club> myClubs;
        List<Club> otherClubs;

        public ClubsResponse(List<Club> allClubs, List<Club> myClubs, List<Club> otherClubs) {
            this.allClubs = allClubs;
            this.myClubs = myClubs;
            this.otherClubs = otherClubs;
        }
    }
}
