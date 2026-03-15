import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useManga } from '../context/MangaContext';

const Home = () => {
  const { fetchHome, fetchPopular } = useManga();
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [popularData, homeData] = await Promise.all([
        fetchPopular(1),
        fetchHome()
      ]);
      setTrending(popularData.slice(0, 5));
      setLatest(homeData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 p-4"
    >
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MangaFlow</h1>
          <p className="text-muted text-xs">Read your favorite manga daily</p>
        </div>
        <Link to="/library" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Star className="text-primary" size={20} fill="currentColor" />
        </Link>
      </header>

      {/* Trending Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <Flame size={20} className="text-primary" /> Terpopuler
          </h2>
          <Link to="/discover" className="text-primary text-xs font-medium flex items-center">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {trending.map((manga, idx) => (
            <Link 
              to={`/manga/${encodeURIComponent(manga.originalLink)}`} 
              key={idx}
              className="flex-none w-56 snap-start"
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-2 group shadow-lg">
                <img 
                  src={manga.thumbnail} 
                  alt={manga.title} 
                  className="object-cover w-full h-full transition-transform group-active:scale-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1 text-[10px] text-white/80 mb-1">
                    <span className="bg-primary px-1.5 py-0.5 rounded uppercase font-bold text-white">{manga.type}</span>
                    <span className="ml-auto font-medium text-white/90">{manga.update_info}</span>
                  </div>
                  <h3 className="font-bold text-sm truncate text-white">{manga.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Updates */}
      <section className="mb-4">
        <h2 className="font-semibold text-lg mb-4">Update Terbaru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {latest.map((manga, idx) => (
            <Link to={`/manga/${encodeURIComponent(manga.originalLink)}`} key={idx} className="flex gap-3 items-center p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                <img src={manga.thumbnail} alt={manga.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-sm font-bold truncate leading-tight">{manga.title}</h3>
                <div className="flex items-center gap-2">
                   <span className="text-primary text-[11px] font-bold bg-primary/10 px-1.5 py-0.5 rounded">{manga.chapter}</span>
                   <span className="text-[10px] text-muted-foreground">{manga.type}</span>
                </div>
                <p className="text-muted text-[10px] truncate opacity-70">{manga.update_info}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;