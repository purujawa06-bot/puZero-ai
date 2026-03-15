import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Share2, Bookmark, Play, ChevronRight, ListFilter, Loader2 } from 'lucide-react';
import { useManga } from '../context/MangaContext';

const MangaDetail = () => {
  const { id } = useParams(); // 'id' contains the encoded originalLink
  const navigate = useNavigate();
  const { fetchDetail, toggleFavorite, favorites, addToHistory } = useManga();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  const mangaUrl = decodeURIComponent(id);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const data = await fetchDetail(mangaUrl);
      setManga(data);
      setLoading(false);
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Manga Tidak Ditemukan</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-medium">Kembali</button>
      </div>
    );
  }

  const isFavorited = favorites.some(f => f.link === mangaUrl || f.originalLink === mangaUrl);

  const handleStartReading = () => {
    if (manga.chapters && manga.chapters.length > 0) {
      const firstChapter = manga.chapters[manga.chapters.length - 1]; // Usually oldest is at the end
      navigate(`/reader/${encodeURIComponent(firstChapter.link)}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-background relative"
    >
      {/* Sticky Header */}
      <header className="fixed top-0 w-full max-w-[480px] z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleFavorite({ 
              title: manga.title, 
              thumbnail: manga.thumbnail, 
              link: mangaUrl,
              type: manga.info?.jenis_komik 
            })}
            className={`p-2 backdrop-blur-md rounded-full border border-white/10 transition-colors ${isFavorited ? 'bg-primary text-white' : 'bg-black/40 text-white'}`}
          >
            <Bookmark size={18} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img src={manga.thumbnail} alt={manga.title} className="w-full h-full object-cover scale-105 blur-[2px] opacity-30 absolute inset-0" />
        <img src={manga.thumbnail} alt={manga.title} className="w-full h-full object-contain relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-20" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 z-30">
          <div className="flex flex-wrap gap-2">
            {manga.genres?.slice(0, 3).map(genre => (
              <span key={genre} className="px-2 py-1 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold rounded uppercase border border-primary/30">
                {genre}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-md">{manga.title}</h1>
          <div className="flex items-center gap-3 text-sm overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="bg-secondary px-2 py-0.5 rounded text-xs font-bold">{manga.info?.jenis_komik}</span>
            <span className="text-muted">•</span>
            <span className="text-muted font-medium">{manga.info?.status}</span>
            <span className="text-muted">•</span>
            <span className="text-muted font-medium">{manga.chapters?.length || 0} Chapters</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 flex flex-col gap-6 -mt-2 relative z-30">
        {/* Main Action Button */}
        <button 
          onClick={handleStartReading}
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-transform active:scale-95"
        >
          <Play size={20} fill="currentColor" /> BACA SEKARANG
        </button>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-2xl border border-white/5 text-xs">
          <div>
            <p className="text-muted mb-1">Pengarang</p>
            <p className="font-bold">{manga.info?.pengarang || '-'}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Konsep Cerita</p>
            <p className="font-bold">{manga.info?.konsep_cerita || '-'}</p>
          </div>
        </div>

        {/* Synopsis */}
        <section>
          <h2 className="text-lg font-bold mb-2">Sinopsis</h2>
          <p className="text-muted text-sm leading-relaxed text-justify opacity-90">
            {manga.description}
          </p>
        </section>

        {/* Chapters List */}
        <section className="pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Daftar Chapter</h2>
            <button className="text-muted p-1"><ListFilter size={18} /></button>
          </div>
          
          <div className="flex flex-col gap-2">
            {manga.chapters?.map((ch, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  addToHistory({ 
                    title: manga.title, 
                    thumbnail: manga.thumbnail, 
                    link: mangaUrl 
                  }, ch.title);
                  navigate(`/reader/${encodeURIComponent(ch.link)}`);
                }}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 border border-white/5 transition-colors group active:bg-secondary"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-bold text-sm">{ch.title}</span>
                  <span className="text-[10px] text-muted">{ch.date}</span>
                </div>
                <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default MangaDetail;