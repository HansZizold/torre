import React, { useState, useEffect, useRef } from "react";

import "./SearchingPage.css";

const SearchingPage = () => {
  const containerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowRecentSearches(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const executeSearch = async (term = searchTerm) => {
    try {
      const url = "https://torre.ai/api/entities/_searchStream";
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "X-Torre-Identity": "",
      };
      const body = JSON.stringify({
        query: term,
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
      if (!textResponse.trim()) {
        console.warn("The server returned an empty response.");
        setResults([]);
        setErrorMessage(
          "No results found for your search or there was an issue. Please try again."
        );
        return;
      } else {
        setErrorMessage(null);
      }
      const items = textResponse
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      setResults(items);

      setRecentSearches((prevSearches) => {
        const newSearches = [searchTerm, ...prevSearches];
        return [...new Set(newSearches)].slice(0, 10);
      });
      setShowRecentSearches(true);
    } catch (error) {
      console.error("There was an error in the request:", error);
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    executeSearch(search);
    setShowRecentSearches(false);
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowRecentSearches(false);
          }}
          onFocus={() => {
            setShowRecentSearches(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              executeSearch();
              setShowRecentSearches(false);
            }
          }}
        />

        <div className="recent-searches" ref={containerRef}>
          {showRecentSearches && recentSearches.length > 0 && (
            <ul className="searches">
              {recentSearches.map((search, index) => (
                <li
                  className="search-element"
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-results">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {results.map((result, index) => {
            // Construir la URL usando el "username"
            const profileUrl = `https://torre.ai/${result.username}`;

            return (
              <a
                key={index}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="search-result-item">
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
                      {result.professionalHeadline &&
                      result.professionalHeadline.length > 50
                        ? result.professionalHeadline.substr(0, 47) + "..."
                        : result.professionalHeadline}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchingPage;
