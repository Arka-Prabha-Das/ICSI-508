package servlets;

import DAO.PaymentDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

public class PurchaseServlet extends HttpServlet {
    private final PaymentDAO paymentDAO = new PaymentDAO();
    private final Gson gson = new Gson();

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

        JsonObject requestBody = gson.fromJson(jsonBody.toString(), JsonObject.class);

        int userId = requestBody.get("userId").getAsInt();
        int bookId = requestBody.get("bookId").getAsInt();

        if (userId <= 0 || bookId <= 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Invalid parameters\"}");
            return;
        }

        try {
            // Process the purchase
            paymentDAO.purchaseBook(userId, bookId);

            // Respond with success
            resp.getWriter().write("{\"message\":\"Book purchased successfully\"}");
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
