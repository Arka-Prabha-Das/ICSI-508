package servlets;

import DAO.AuthorDAO;
import models.Author;
import com.google.gson.Gson;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class AuthorServlet extends HttpServlet {
    private final AuthorDAO authorDAO = new AuthorDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        try {
            // Fetch the list of authors from the DAO
            List<Author> authors = authorDAO.getAllAuthors();

            // Convert the list to JSON
            String jsonResponse = gson.toJson(authors);

            // Send the JSON response
            resp.getWriter().write(jsonResponse);
        } catch (SQLException e) {
            // Handle SQL exceptions
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
