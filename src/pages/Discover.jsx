import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Hash, Loader2, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useManga } from '../context/MangaContext';

const CATEGORIES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 
  'Fantasy', 'Horror', 'Mystery', 'Psychological', 
  'Romance', 'Sci-Fi', 'Seinen', 'Shounen', 'Slice of Life'
];

const Discover = () => {
  const { searchManga } = useManga();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        const data = await searchManga(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 p-4 pb-24"
    >
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Discover</h1>
        <p className="text-muted-foreground text-xs">Temukan cerita favoritmu berikutnya</p>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-primary' : 'text-muted-foreground'}`} size={18} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari manga, judul, atau genre..." 
          className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3 pl-10 pr-12 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none text-white placeholder:text-muted-foreground"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin text-primary" size={16} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {query.trim().length > 0 ? (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Hasil Pencarian {results.length > 0 && `(${results.length})`}
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {results.map((manga, idx) => (
                  <Link 
                    to={`/manga/${encodeURIComponent(manga.originalLink)}`} 
                    key={idx} 
                    className="flex gap-4 p-3 bg-secondary/30 rounded-2xl border border-white/5 hover:bg-secondary/50 transition-colors active:scale-[0.98]"
                  >
                    <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                      <img src={manga.thumbnail} alt={manga.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-primary/20">{manga.type}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-1">{manga.title}</h3>
                      <p className="text-muted-foreground text-[10px] line-clamp-2 italic">{manga.description}</p>
                    </div>
                    <div className="flex items-center pr-1 text-muted-foreground/30">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : !loading && query.length > 2 ? (
              <div className="py-20 text-center text-muted-foreground">
                <BookOpen size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm font-medium">Tidak ada hasil ditemukan untuk "{query}"</p>
              </div>
            ) : null}
          </motion.section>
        ) : (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Categories Grid */}
            <section>
              <h2 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <Hash size={18} className="text-primary" /> Jelajah Kategori
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="flex items-center justify-center py-4 px-2 bg-secondary/30 border border-white/5 rounded-xl hover:bg-secondary/60 transition-colors group active:scale-95"
                  >
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{cat}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Filters */}
            <section className="pb-4">
              <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Tag Populer</h2>
              <div className="flex flex-wrap gap-2">
                {['Hot', 'New', 'Completed', 'Top Rated', 'Colored'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setQuery(tag)}
                    className="px-4 py-1.5 bg-secondary/50 text-white/80 text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/5 active:bg-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Discover;