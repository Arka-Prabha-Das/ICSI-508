package models;

public class BookRequest {
    private String title;
    private double price;
    private String details;
    private int authorId;
    private int categoryId;

    public BookRequest(String title, double price, String details, int authorId, int categoryId) {
        this.title = title;
        this.price = price;
        this.details = details;
        this.authorId = authorId;
        this.categoryId = categoryId;
    }

    public String getTitle() {
        return title;
    }

    public double getPrice() {
        return price;
    }

    public String getDetails() {
        return details;
    }

    public int getAuthorId() {
        return authorId;
    }

    public int getCategoryId() {
        return categoryId;
    }
}
