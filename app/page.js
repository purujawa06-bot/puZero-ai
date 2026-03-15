"use client";
import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://puruboy-api.vercel.app/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result.answer);
      } else {
        setResult('Gagal mengambil data dari API.');
      }
    } catch (error) {
      setResult('Terjadi kesalahan koneksi.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Puru Eay - AI Assistant</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', color: 'black' }}
          rows="4"
          placeholder="Tanyakan sesuatu pada Gemini..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
      <div style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap', color: '#333' }}>
        <strong>Respons:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}