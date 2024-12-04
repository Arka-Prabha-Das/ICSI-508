package servlets;

import DAO.BookDAO;
import models.BookDetails;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

public class BookDetailsServlet extends HttpServlet {
    private final BookDAO bookDAO = new BookDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        String bookIdParam = req.getParameter("bookId");
        if (bookIdParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Missing bookId parameter\"}");
            return;
        }

        try {
            int bookId = Integer.parseInt(bookIdParam);

            // Fetch book details and reviews
            BookDetails bookDetails = bookDAO.getBookDetails(bookId);

            // Respond with the details
            String jsonResponse = gson.toJson(bookDetails);
            resp.getWriter().write(jsonResponse);
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        // Read JSON body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        }

        // Parse JSON body
        var requestBody = gson.fromJson(jsonBody.toString(), JsonObject.class);
        int userId =  requestBody.get("userId").getAsInt();
        int bookId = requestBody.get("bookId").getAsInt();
        String reviewDetails = requestBody.get("review").getAsString();

        if (userId <= 0 || bookId <= 0 || reviewDetails == null || reviewDetails.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Invalid parameters\"}");
            return;
        }

        try {
            bookDAO.addReview(userId, bookId, reviewDetails);
            resp.getWriter().write("{\"message\":\"Review added successfully\"}");
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
