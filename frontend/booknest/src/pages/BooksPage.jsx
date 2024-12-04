import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import AddBookForm from '../components/AddBookForm';

const BooksPage = () => {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filters, setFilters] = useState({ author: "", price: 100 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingBook, setEditingBook] = useState(null); // Book being edited
  const [userRole, setUserRole] = useState("");
  const [authorNameToIdMap, setAuthorNameToIdMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const userId = parseInt(localStorage.getItem("userId"), 10); // Ensure userId is a number
  const navigate = useNavigate();
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAuthors();
    checkUserRole();

  }, []);

  const handleAddBookToggle = () => {
    setShowAddBookForm((prev) => !prev); // Toggle form visibility
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/books");
      setBooks(response.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  const checkUserRole = () => {
    const role = localStorage.getItem("role");
    setUserRole(role || "");
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Library_Management/api/authors");
      const authorsData = response.data;

      // Create a map of author name to user ID
      const tmpMap = authorsData.reduce((map, author) => {
        map[author.name] = author.userId;
        return map;
      }, {});

      setAuthors(authorsData);
      setAuthorNameToIdMap(tmpMap);
    } catch (err) {
      console.error("Failed to fetch authors:", err);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFilters({ author: "", price: 100 }); // Reset filters
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleEditClick = (book) => {
    setEditingBook(book); // Set book for editing
  };

  const handleEditCancel = () => {
    setEditingBook(null); // Cancel editing
  };

  const handleEditSave = async (updatedBook) => {
    try {
      await axios.put(`http://localhost:8080/Library_Management/api/books`, updatedBook);
      fetchBooks(); 
      setEditingBook(null); 
    } catch (err) {
      console.error("Failed to update book:", err);
    }
  };
  const handleAddBook = async (newBook) => {
    try {
      await axios.post("http://localhost:8080/Library_Management/api/books", newBook);
      fetchBooks();
    } catch (err) {
      console.error("Failed to add book:", err);
    }
  };

  const handlePurchase = (bookId) => {
    navigate(`/payment`, { state: { bookId } });
  };

  const handleViewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const filteredBooks = books.filter((book) => {
    const matchesAuthor = filters.author
      ? book.author === filters.author
      : true;
    const matchesPrice = book.price <= filters.price;
    const matchesCategory = selectedCategory
      ? book.category === selectedCategory
      : true;
    const matchesSearchTerm = searchTerm
      ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesAuthor && matchesCategory && matchesSearchTerm && matchesPrice;
  });

  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Our Collection</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search books by title, author, or category..."
            className="w-full p-4 border rounded shadow"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-6">
          <div>
            <label className="block font-medium">Filter by Author</label>
            <select
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Filter by Price (up to)</label>
            <input
              type="range"
              name="price"
              min="0"
              max="500"
              value={filters.price}
              onChange={handleFilterChange}
              className="w-full"
            />
            <div className="text-center">${filters.price}</div>
          </div>
        </div>
        {editingBook && (
          <div className="mt-10 bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Edit Book: {editingBook.title}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave(editingBook);
              }}
            >
              <div className="mb-4">
                <label className="block font-medium">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  value={editingBook.price}
                  onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Category</label>
                <select
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

{(userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "author") && (
          <div className="mb-6">
            <button
              onClick={handleAddBookToggle}
              className={`px-4 py-2 rounded ${
                showAddBookForm ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {showAddBookForm ? "Cancel" : "Add New Book"}
            </button>
          </div>
        )}

        {/* Add Book Form */}
        {showAddBookForm && (
          <AddBookForm
            authors={authors}
            categories={categories}
            onBookAdded={fetchBooks}
          />
        )}
        <div className="flex gap-[10px]">
          {/* Book List */}

          <div className="flex w-[75%] flex-wrap gap-10 mb-4">
            {filteredBooks.map((book, index) => (
              <div className="flex">
                <img src="./book.webp" alt="book"  className="h-[180px] w-[150px] rounded-tl-lg rounded-bl-lg"/>
              <div
                key={book.id}
                className="p-4 border rounded-r-lg shadow hover:shadow-lg h-[180px] w-[650px] flex justify-between"
                
              >
                <div className="mt-4">
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-gray-500">Author: {book.author}</p>
                  <p className="text-gray-500">Price: ${book.price}</p>
                  <p className="text-gray-500">Category: {book.category}</p>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handlePurchase(book.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Purchase
                  </button>
                  <button
                    onClick={() => handleViewDetails(book.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    View Details
                  </button>
                  {userId === authorNameToIdMap[book.author] && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="w-[25%]">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => handleCategoryClick("")}
                className={`p-4 border rounded-lg shadow ${
                  selectedCategory === "" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`p-4 border rounded-lg shadow ${
                    selectedCategory === category.name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default BooksPage;
