import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/books?keyword=${keyword}&pageNumber=${page}`)
      .then((res) => {
        setBooks(res.data.books);
        setPages(res.data.pages);
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
      });
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const addToFavorites = async (bookId) => {
    if (!token) {
      alert('Please log in to add favorites.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/users/favorites',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Book added to favorites!');
    } catch (err) {
      console.error('Failed to add favorite:', err);
      alert('Failed to add favorite.');
    }
  };

  const viewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">📚 Book List</h1>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by title, author, or category..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-outline-primary">Search</button>
      </form>

      {/* 📘 Book Grid */}
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="row">
          {books.map((book) => (
            <div key={book._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">by {book.author}</p>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => viewDetails(book._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => addToFavorites(book._id)}
                  >
                    ❤️ Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧭 Pagination */}
      {pages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {[...Array(pages).keys()].map((x) => (
              <li key={x + 1} className={`page-item ${page === x + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(x + 1)}>
                  {x + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Home;