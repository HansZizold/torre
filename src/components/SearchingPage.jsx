import React from "react";

import "./SearchingPage.css";

const SearchingPage = () => {
  return (
    <div className="searching-page">
      <div className="navbar">
        <button className="hamburger-button" aria-label="Toggle navigation">
          <img src="/hamburger.svg" alt="menu" />
        </button>
        <div className="torre">
          <img src="/torre.png" alt="Torre Logo" />
        </div>
      </div>
      <div className="searchbar">
        <p className="search-text">Search</p>
        <p className="people-text">PEOPLE BY NAME</p>
      </div>
      <div className="search-section">
        <input className="search-input" type="text" placeholder="Search people by name" />
      </div>
    </div>
  );
};

export default SearchingPage;
