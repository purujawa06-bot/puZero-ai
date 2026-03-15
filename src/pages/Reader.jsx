import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings, MessageSquare, ChevronLeft, ChevronRight, Menu, Loader2 } from 'lucide-react';
import { useManga } from '../context/MangaContext';

const Reader = () => {
  const { id } = useParams(); // 'id' contains the encoded chapter link
  const navigate = useNavigate();
  const { fetchChapter } = useManga();
  
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const chapterUrl = decodeURIComponent(id);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadChapter = async () => {
      setLoading(true);
      const data = await fetchChapter(chapterUrl);
      setChapterData(data);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadChapter();
  }, [id]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    let timer;
    if (showControls) {
      timer = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showControls]);

  // Track scroll for page indicator
  useEffect(() => {
    const handleScroll = () => {
      if (!chapterData?.images) return;
      const scrollPos = window.scrollY + (window.innerHeight / 2);
      const elements = document.querySelectorAll('.manga-page');
      
      elements.forEach((el, idx) => {
        if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setCurrentPage(idx + 1);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapterData]);

  const toggleControls = () => setShowControls(!showControls);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Gagal memuat chapter</h2>
        <button onClick={() => navigate(-1)} className="bg-primary px-6 py-2 rounded-lg font-bold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center select-none overflow-x-hidden">
      {/* Reader Area (Vertical Scroll) */}
      <div 
        ref={containerRef}
        className="w-full flex flex-col cursor-pointer"
        onClick={toggleControls}
      >
        {chapterData.images?.map((img, idx) => (
          <div key={idx} className="w-full relative manga-page bg-black flex items-center justify-center min-h-[200px]">
             <img 
              src={img.url} 
              alt={img.alt || `Page ${idx + 1}`} 
              className="w-full h-auto object-contain block"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x900/1a1a1a/e11d48?text=Image+Load+Error";
              }}
            />
          </div>
        ))}
        
        {/* End of Chapter Action */}
        <div className="p-16 flex flex-col items-center gap-6 bg-black border-t border-white/5 w-full">
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium mb-1 italic opacity-60">Selesai membaca</p>
            <p className="text-white font-bold">{chapterData.title}</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={() => navigate(-1)}
              className="bg-secondary/50 text-white px-8 py-3 rounded-xl font-bold text-sm border border-white/10 active:scale-95 transition-transform"
             >
              KEMBALI
            </button>
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Top Bar */}
            <motion.header 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/90 backdrop-blur-md border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1 text-white"><ArrowLeft size={24} /></button>
                <div className="flex flex-col min-w-0">
                  <h1 className="text-xs font-bold truncate w-48 text-white">{chapterData.title}</h1>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">MangaFlow Reader</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="text-muted-foreground hover:text-white"><Settings size={20} /></button>
              </div>
            </motion.header>

            {/* Bottom Bar */}
            <motion.footer 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-4 p-4 pb-8 bg-black/90 backdrop-blur-md border-t border-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <button className="p-2 bg-secondary/50 rounded-lg text-muted-foreground disabled:opacity-20" disabled>
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                    <span className="truncate max-w-[150px]">{chapterData.title}</span>
                    <span>{currentPage} / {chapterData.images?.length || 0}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${(currentPage / (chapterData.images?.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <button className="p-2 bg-secondary/50 rounded-lg text-white disabled:opacity-20" disabled>
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex justify-around items-center pt-2">
                <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <Menu size={18} />
                  <span className="text-[9px] font-bold uppercase">Semua Chapter</span>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button className="flex flex-col items-center gap-1 text-primary">
                  <span className="text-[10px] font-black border-2 border-primary px-1 rounded leading-none">V</span>
                  <span className="text-[9px] font-bold uppercase">Vertikal</span>
                </button>
              </div>
            </motion.footer>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;