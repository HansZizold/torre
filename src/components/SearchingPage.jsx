import React, { useState, useEffect } from "react";

import "./SearchingPage.css";

const SearchingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    console.log(recentSearches);
  }, [recentSearches]);

  const executeSearch = async () => {
    try {
      const url = "https://torre.ai/api/entities/_searchStream";
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "X-Torre-Identity": "",
      };
      const body = JSON.stringify({
        query: searchTerm,
        identityType: "person",
        limit: 20,
        meta: true,
        excluding: [],
        excludedPeople: [],
        excludeContacts: true,
      });
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      const textResponse = await response.text();
      const items = textResponse
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      setResults(items);

      setRecentSearches(prevSearches => {
        const newSearches = [searchTerm, ...prevSearches];
        return [...new Set(newSearches)].slice(0, 10);
      });

    } catch (error) {
      console.error("There was an error in the request:", error);
    }
  };

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
        <input
          className="search-input"
          type="text"
          placeholder="Type the name and hit Enter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              executeSearch();
            }
          }}
        />
        <div className="search-results">
          {results.map((result, index) => (
            <div key={index} className="search-result-item">
              <div className="result-image-container">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={`${result.name}'s profile`}
                    className="result-image"
                  />
                ) : (
                  <div className="result-placeholder">
                    {result.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="result-info-container">
                <div className="result-name">{result.name}</div>
                <div className="result-professional-headline">
                  {result.professionalHeadline && result.professionalHeadline.length > 50
                    ? result.professionalHeadline.substr(0, 47) + "..."
                    : result.professionalHeadline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchingPage;
