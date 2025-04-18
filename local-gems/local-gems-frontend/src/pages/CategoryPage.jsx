import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './CategoryPage.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gems, setGems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const res = await axios.get(`http://localhost:5000/api/gems/category/${category}`);
      setGems(res.data);
    } catch (error) {
      console.error('Error fetching gems by category:', error);
    }
  };

  const handleBook = async (gem) => {
    const userId = localStorage.getItem('userId');
    const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);

    await axios.post(`http://localhost:5000/api/notifications/send/${gem._id}`, {
      userId,
      name: userRes.data.name,
      email: userRes.data.email,
      mobile: userRes.data.mobile,
      message: `Hi ${gem.name}, ${userRes.data.name} would like to book you!`,
    });

    alert('Booking notification sent!');
  };

  return (
    <div className="category-page">
      <h2>Explore Categories</h2>
      <input
        type="text"
        placeholder="Search category..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="category-list">
        {categories
          .filter(cat => cat.toLowerCase().includes(search))
          .map((category, idx) => (
            <button key={idx} onClick={() => handleCategoryClick(category)}>
              {category}
            </button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <h3>Gems in "{selectedCategory}"</h3>
          <div className="gem-cards">
            {gems.map(gem => (
              <div key={gem._id} className="gem-card">
                <h4>{gem.name}</h4>
                <p>Email: {gem.email}</p>
                <p>Mobile: {gem.mobile}</p>
                <p>Talent: {gem.talent}</p>
                <p>Location: {gem.location}</p>
                <p>Category: {gem.category}</p>
                <p>Experience: {gem.experience}</p>
                <a href={gem.socialLink} target="_blank" rel="noreferrer">Social Link</a>
                <button onClick={() => handleBook(gem)}>Book</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
