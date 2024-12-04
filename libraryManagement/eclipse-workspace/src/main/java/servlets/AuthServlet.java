package servlets;

import DAO.UserDAO;
import models.User;
import com.google.gson.Gson;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

public class AuthServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Parse JSON body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        }

        // Convert JSON to Map
        var requestBody = gson.fromJson(jsonBody.toString(), Map.class);
        String action = (String) requestBody.get("action");

        if (action == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Missing action parameter.");
            return;
        }

        switch (action.toLowerCase()) {
            case "login":
                handleLogin(req, resp, requestBody);
                break;
            case "logout":
                handleLogout(req, resp);
                break;
            case "register":
                handleRegister(req, resp, requestBody);
                break;
            default:
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid action parameter.");
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp, Map<String, Object> requestBody) throws IOException {
        String email = (String) requestBody.get("email");
        String password = (String) requestBody.get("password");

        try {
            User user = userDAO.getUserByEmail(email);

            if (user != null && user.getPassword().equals(password)) {
                HttpSession session = req.getSession();
                session.setAttribute("userID", user.getUserID());
                session.setAttribute("role", user.getRole());
                
                String token = session.getId();

                Cookie userCookie = new Cookie("userID", String.valueOf(user.getUserID()));
                userCookie.setMaxAge(60 * 60 * 24); // 1 day
                resp.addCookie(userCookie);

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write(String.format(
                        "{\"userID\": %d, \"token\": \"%s\", \"userRole\": \"%s\"}",
                        user.getUserID(),
                        token,
                        user.getRole()
                    ));
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("Invalid email or password.");
            }
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie userCookie = new Cookie("userID", null);
        userCookie.setMaxAge(0);
        resp.addCookie(userCookie);

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write("Logged out successfully.");
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp, Map<String, Object> requestBody) throws IOException {
        String role = (String) requestBody.get("role");
        String name = (String) requestBody.get("name");
        String password = (String) requestBody.get("password");
        String email = (String) requestBody.get("email");

        User user = new User(0, role, name, password, email);
        try {
            userDAO.addUser(user);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("User registered successfully.");
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
