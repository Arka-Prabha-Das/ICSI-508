package servlets;
import com.google.gson.Gson;
import DAO.BookDAO;
import models.Book;
import models.BookRequest;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class BookServlet extends HttpServlet {
    private final BookDAO bookDAO = new BookDAO();
    private final Gson gson = new Gson();
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        try {
            List<Book> books = bookDAO.getAllBooks();
            String jsonResponse = gson.toJson(books);
            resp.getWriter().write(jsonResponse);
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        // Read the request body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        }

        // Parse the JSON body
        Gson gson = new Gson();
        BookRequest bookRequest = gson.fromJson(jsonBody.toString(), BookRequest.class);

        if (bookRequest.getTitle() == null || bookRequest.getPrice() <= 0 || bookRequest.getAuthorId() <= 0 || bookRequest.getCategoryId() <= 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Invalid input data\"}");
            return;
        }

        try {
            // Add the book to the Books table
            int bookId = bookDAO.addBook(new Book(0, bookRequest.getTitle(), bookRequest.getPrice(), bookRequest.getDetails(), null, null));

            // Add entry to AuthorWritesBook table
            bookDAO.addAuthorWritesBook(bookId, bookRequest.getAuthorId());

            // Add entry to Belongs_To table
            bookDAO.addBookCategory(bookId, bookRequest.getCategoryId());

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"Book added successfully\"}");
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        // Parse JSON request body
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (BufferedReader reader = req.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        }
        final Gson gson = new Gson();

        Map<String, Object> requestBody = gson.fromJson(jsonBody.toString(), Map.class);

        int bookId = ((Double) requestBody.get("id")).intValue();
        String title = (String) requestBody.get("title");
        // double price = ((Double) requestBody.get("price")).doubleValue();
        double price = Double.parseDouble((String) requestBody.get("price"));
        String details = (String) requestBody.get("details");

        if (bookId <= 0 || title == null || price <= 0 || details == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Invalid input data\"}");
            return;
        }

        try {
            bookDAO.updateBook(bookId, title, price, details);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"message\":\"Book updated successfully\"}");
        } catch (SQLException e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
