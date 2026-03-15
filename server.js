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
        return res.send('&lt;div class="text-red-500"&gt;Pesan tidak boleh kosong.&lt;/div&gt;');
    }

    // Tampilkan pesan user segera
    const userBubble = `
        &lt;div class="flex justify-end mb-4"&gt;
            &lt;div class="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm"&gt;
                ${userPrompt}
            &lt;/div&gt;
        &lt;/div&gt;
    `;

    try {
        const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "prompt": userPrompt })
        });

        const data = await response.json();
        const aiResponse = data.message || data.response || JSON.stringify(data);

        const aiBubble = `
            &lt;div class="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300"&gt;
                &lt;div class="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-gray-200"&gt;
                    ${aiResponse}
                &lt;/div&gt;
            &lt;/div&gt;
        `;

        // HTMX akan menggabungkan userBubble dan aiBubble ke dalam chat area
        res.send(userBubble + aiBubble);
    } catch (error) {
        console.error(error);
        res.send(userBubble + '&lt;div class="text-red-500"&gt;Maaf, terjadi kesalahan koneksi ke AI.&lt;/div&gt;');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});