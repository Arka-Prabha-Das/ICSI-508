package models;

public class User {
    private int userID;
    private String role;
    private String name;
    private String password;
    private String email;

    public User(int userID, String role, String name, String password, String email) {
        this.userID = userID;
        this.role = role;
        this.name = name;
        this.password = password;
        this.email = email;
    }

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
