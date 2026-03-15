import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, History, Bookmark, Grid, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useManga } from '../context/MangaContext';
import { clsx } from 'clsx';

const Library = () => {
  const [activeTab, setActiveTab] = useState('favorites');
  const { favorites, history, toggleFavorite } = useManga();

  const currentData = activeTab === 'favorites' ? favorites : history;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-background pb-24"
    >
      <header className="p-4 pt-6 bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Perpustakaan</h1>
          <div className="flex gap-2">
            <button className="p-2 bg-secondary/50 rounded-lg text-muted-foreground"><Grid size={18} /></button>
          </div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300",
              activeTab === 'favorites' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <Bookmark size={16} fill={activeTab === 'favorites' ? "currentColor" : "none"} /> Favorit
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300",
              activeTab === 'history' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <History size={16} /> Riwayat
          </button>
        </div>
      </header>

      <main className="p-4">
        <AnimatePresence mode="wait">
          {currentData.length > 0 ? (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {currentData.map((manga, idx) => (
                <div key={idx} className="flex flex-col gap-2 group relative">
                  <Link to={`/manga/${encodeURIComponent(manga.link)}`} className="relative aspect-[3/4.5] rounded-xl overflow-hidden border border-white/5 shadow-lg bg-secondary/20">
                    <img 
                      src={manga.thumbnail} 
                      alt={manga.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    
                    {activeTab === 'history' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-2">
                        <div className="flex items-center gap-1 mb-1">
                           <Clock size={10} className="text-primary" />
                           <span className="text-[9px] text-white/90 font-bold uppercase truncate">{manga.lastRead}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-full" />
                        </div>
                      </div>
                    )}

                    {activeTab === 'favorites' && manga.type && (
                       <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-[8px] font-black rounded text-white uppercase shadow-md">{manga.type}</span>
                    )}
                  </Link>
                  
                  <div className="flex justify-between items-start gap-1 px-1">
                    <h3 className="text-[11px] font-bold text-white line-clamp-2 leading-tight flex-1">{manga.title}</h3>
                    {activeTab === 'favorites' && (
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(manga); }}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {activeTab === 'favorites' && (
                <Link to="/discover" className="aspect-[3/4.5] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all bg-secondary/10 active:scale-95">
                  <BookOpen size={24} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cari Manga</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6 border border-white/5">
                {activeTab === 'favorites' ? <Bookmark size={32} className="text-muted-foreground/30" /> : <History size={32} className="text-muted-foreground/30" />}
              </div>
              <h2 className="text-white font-bold text-lg mb-1">Belum ada data</h2>
              <p className="text-muted-foreground text-xs px-12 leading-relaxed">
                {activeTab === 'favorites' 
                  ? "Daftar favoritmu masih kosong. Mulailah menandai manga yang kamu sukai!" 
                  : "Kamu belum membaca manga apapun. Yuk, jelajahi ribuan judul sekarang!"}
              </p>
              <Link to="/discover" className="mt-6 bg-primary text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                Jelajahi Sekarang
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Library;