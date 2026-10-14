import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GrainOverlay } from '@/components/ds';
import { RoleProvider, ScrollToTop } from '@/lib/role';
import { CrtStyles, useCrt } from '@/playground/CrtMode';
import Home from '@/pages/Home';

const Work = lazy(() => import('@/pages/Work'));
const WorkDetail = lazy(() => import('@/pages/WorkDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Playground = lazy(() => import('@/pages/Playground'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">
      <span className="inline-flex items-center gap-3">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-ember" />
        Loading
      </span>
    </div>
  );
}

/** Applies the persisted CRT class on <html> at boot. */
function CrtBoot() {
  useCrt();
  return <CrtStyles />;
}

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <ScrollToTop />
        <CrtBoot />
        <GrainOverlay grainOpacity={0.06} scanlineOpacity={0.06} scanlineSpacing={3} zIndex={70} />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </RoleProvider>
    </BrowserRouter>
  );
}
