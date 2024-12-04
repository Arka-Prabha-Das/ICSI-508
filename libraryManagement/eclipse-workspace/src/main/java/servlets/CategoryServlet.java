package servlets;

import DAO.CategoryDAO;
import models.Category;
import com.google.gson.Gson;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class CategoryServlet extends HttpServlet {
    private final CategoryDAO categoryDAO = new CategoryDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        try {
            // Fetch the list of categories from the DAO
            List<Category> categories = categoryDAO.getAllCategories();

            // Convert the list to JSON
            String jsonResponse = gson.toJson(categories);

            // Send the JSON response
            resp.getWriter().write(jsonResponse);
        } catch (SQLException e) {
            // Handle SQL exceptions
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
