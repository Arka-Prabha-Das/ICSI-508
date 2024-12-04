import React, { useState } from "react";
import axios from "axios";

const AddBookForm = ({ authors, categories, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    details: "",
    authorId: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/Library_Management/api/books", formData);
      alert("Book added successfully!");
      onBookAdded(); // Refresh book list
      // Clear the form and hide it
      setFormData({
        title: "",
        price: "",
        details: "",
        authorId: "",
        categoryId: "",
      });
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mb-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add a New Book</h2>
      <div className="mb-4">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Details</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Author</label>
        <select
          name="authorId"
          value={formData.authorId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select an Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Book
      </button>
    </form>
  );
};

export default AddBookForm;
