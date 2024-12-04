package models;

public class Review {
    private int id;
    private String details;

    public Review(int id, String details) {
        this.id = id;
        this.details = details;
    }

    public int getId() {
        return id;
    }

    public String getDetails() {
        return details;
    }
}
