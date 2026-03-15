const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk chat (HTMX akan memanggil ini)
app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    
    if (!userPrompt) {
        return res.send('<div class="text-red-500">Pesan tidak boleh kosong.</div>');
    }

    // Template pesan user
    const userBubble = `
        <div class="flex justify-end mb-4">
            <div class="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                ${userPrompt}
            </div>
        </div>
    `;

    try {
        const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "prompt": userPrompt })
        });

        const data = await response.json();
        
        // Memperbaiki ekstraksi jawaban dari struktur JSON API
        let aiText = "";
        if (data.result && data.result.answer) {
            aiText = data.result.answer;
        } else if (data.message) {
            aiText = data.message;
        } else {
            aiText = "Maaf, saya tidak mendapatkan jawaban yang valid.";
        }

        const aiBubble = `
            <div class="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div class="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-gray-200">
                    ${aiText}
                </div>
            </div>
        `;

        // Kirim gabungan pesan user dan AI ke HTMX
        res.send(userBubble + aiBubble);
    } catch (error) {
        console.error(error);
        res.send(userBubble + '<div class="text-red-500 p-2 text-xs">Maaf, terjadi kesalahan koneksi ke AI.</div>');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});