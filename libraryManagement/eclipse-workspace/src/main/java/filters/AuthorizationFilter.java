package filters;

import DAO.UserDAO;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;

public class AuthorizationFilter implements Filter {
    private final UserDAO userDAO = new UserDAO();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(false);
        String path = httpRequest.getServletPath();

        // Skip session validation for /api/auth requests
        if (path.equals("/api/auth")) {
            chain.doFilter(request, response);
            return;
        }
        
        if (path.contains("/api/books")) {
            chain.doFilter(request, response);
            return;
        }
        if (session == null || session.getAttribute("userID") == null) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Unauthorized access. Please log in.");
            return;
        }

        int userID = (int) session.getAttribute("userID");
        String requiredRole = httpRequest.getHeader("X-Required-Role"); // Role sent in headers
        if (requiredRole == null) {
            chain.doFilter(request, response); // No role restriction for the endpoint
            return;
        }

        try {
            String userRole = userDAO.getUserRoleById(userID);
            if (userRole != null && userRole.equalsIgnoreCase(requiredRole)) {
                chain.doFilter(request, response); // Role matches, proceed
            } else {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.getWriter().write("Access denied. Insufficient permissions.");
            }
        } catch (SQLException e) {
            httpResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpResponse.getWriter().write("Internal server error: " + e.getMessage());
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}
