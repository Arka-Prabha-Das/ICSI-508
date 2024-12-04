package models;

import java.util.List;

public class BookDetails {
    private int id;
    private String title;
    private double price;
    private String details;
    private String author;
    private String category;
    private List<Review> reviews;

    public BookDetails(int id, String title, double price, String details, String author, String category, List<Review> reviews) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.details = details;
        this.author = author;
        this.category = category;
        this.reviews = reviews;
    }

    public int getId() {
        return id;
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

    public String getAuthor() {
        return author;
    }

    public String getCategory() {
        return category;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
