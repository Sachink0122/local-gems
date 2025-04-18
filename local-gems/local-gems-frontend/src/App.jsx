import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import RegisterGem from './components/RegisterGem';
import RegisterUser from './components/RegisterUser';
import Admin from './pages/Admin';
import BookGemsPage from './pages/BookGemsPage';
import GemsPage from './pages/GemsPage'; // ✅ Add this line
import Home from './pages/Home';
import UserHomePage from './pages/UserHomePage';
import Welcome from './pages/Welcome';
import PrivateRoute from './utils/PrivateRoute';


const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      {/* {isLoggedIn && (
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/home">Home</Link> |{" "}
          <Link to="/register-user">Register User</Link> |{" "}
          <Link to="/register-gem">Register Gem</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button>
        </nav>
      )} */}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-gem" element={<RegisterGem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gemspage" element={<GemsPage />} />
        <Route path="/user-home" element={<UserHomePage />} />
        <Route path="/book-gems" element={<BookGemsPage/>} />
        <Route path="/gem-details/:id" element={<GemDetailsPage/>} />
        {/* <Route path="/category" element={<CategoryPage/>} /> */}
          
 {/* ✅ Add this line */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
