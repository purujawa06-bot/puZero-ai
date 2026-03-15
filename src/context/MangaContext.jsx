import React, { createContext, useContext, useState, useEffect } from 'react';

const MangaContext = createContext();

const API_BASE_URL = 'https://www.puruboy.kozow.com/api/anime/komiku';

export const MangaProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('manga_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('manga_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('manga_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('manga_history', JSON.stringify(history));
  }, [history]);

  const toggleFavorite = (manga) => {
    setFavorites(prev => {
      const isExist = prev.find(m => m.link === manga.link);
      if (isExist) {
        return prev.filter(m => m.link !== manga.link);
      }
      return [...prev, manga];
    });
  };

  const addToHistory = (manga, chapter) => {
    setHistory(prev => {
      const filtered = prev.filter(m => m.link !== manga.link);
      return [{ ...manga, lastRead: chapter, timestamp: Date.now() }, ...filtered].slice(0, 20);
    });
  };

  // API Methods
  const fetchHome = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/home`);
      const data = await res.json();
      return data.success ? data.result : [];
    } catch (error) {
      console.error("Error fetching home:", error);
      return [];
    }
  };

  const fetchPopular = async (page = 1) => {
    try {
      const res = await fetch(`${API_BASE_URL}/popular?page=${page}`);
      const data = await res.json();
      return data.success ? data.result : [];
    } catch (error) {
      console.error("Error fetching popular:", error);
      return [];
    }
  };

  const fetchDetail = async (url) => {
    try {
      const res = await fetch(`${API_BASE_URL}/detail?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      return data.success ? data.result : null;
    } catch (error) {
      console.error("Error fetching detail:", error);
      return null;
    }
  };

  const fetchChapter = async (url) => {
    try {
      const res = await fetch(`${API_BASE_URL}/read?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      return data.success ? data.result : null;
    } catch (error) {
      console.error("Error fetching chapter:", error);
      return null;
    }
  };

  const searchManga = async (query) => {
    try {
      const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      return data.success ? data.result : [];
    } catch (error) {
      console.error("Error searching manga:", error);
      return [];
    }
  };

  return (
    <MangaContext.Provider value={{ 
      favorites, 
      history, 
      toggleFavorite, 
      addToHistory,
      fetchHome,
      fetchPopular,
      fetchDetail,
      fetchChapter,
      searchManga
    }}>
      {children}
    </MangaContext.Provider>
  );
};

export const useManga = () => useContext(MangaContext);