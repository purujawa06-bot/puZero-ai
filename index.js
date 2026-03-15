const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const API_BASE = 'https://www.puruboy.kozow.com/api/anime/komiku';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Route: Beranda
app.get('/', async (req, res) => {
    try {
        const [popularRes, latestRes] = await Promise.all([
            axios.get(`${API_BASE}/popular?page=1`),
            axios.get(`${API_BASE}/home`)
        ]);
        res.render('index', { 
            popular: popularRes.data.result, 
            latest: latestRes.data.result 
        });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Route: Search (HTMX Fragment)
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        res.render('partials/manga-list', { mangaList: response.data.result });
    } catch (error) {
        res.status(500).send('Error searching');
    }
});

// Route: Detail Manga
app.get('/detail', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(`${API_BASE}/detail?url=${encodeURIComponent(url)}`);
        res.render('detail', { manga: response.data.result, originalUrl: url });
    } catch (error) {
        res.status(500).send('Error fetching detail');
    }
});

// Route: Read Chapter
app.get('/read', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(`${API_BASE}/read?url=${encodeURIComponent(url)}`);
        res.render('read', { chapter: response.data.result });
    } catch (error) {
        res.status(500).send('Error fetching chapter');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});