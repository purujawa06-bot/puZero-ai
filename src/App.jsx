import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import BottomNav from './components/layout/BottomNav';

// Pages (Lazy Loaded for better performance)
const Home = lazy(() => import('./pages/Home'));
const Discover = lazy(() => import('./pages/Discover'));
const Library = lazy(() => import('./pages/Library'));
const MangaDetail = lazy(() => import('./pages/MangaDetail'));
const Reader = lazy(() => import('./pages/Reader'));

function App() {
  const location = useLocation();
  
  // Sembunyikan BottomNav saat berada di halaman Reader
  const isReaderPage = location.pathname.startsWith('/reader');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Mobile Container Emulator */}
      <main className="w-full max-w-[480px] min-h-screen bg-background relative flex flex-col shadow-2xl border-x border-white/5">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/library" element={<Library />} />
              <Route path="/manga/:id" element={<MangaDetail />} />
              <Route path="/reader/:id/:chapter" element={<Reader />} />
            </Routes>
          </Suspense>
        </AnimatePresence>

        {!isReaderPage && <BottomNav />}
        
        {/* Safe Area Spacer for iOS/Mobile */}
        <div className="h-20 bg-transparent pointer-events-none" />
      </main>
    </div>
  );
}

export default App;