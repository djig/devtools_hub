import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Recent from './pages/Recent';
import { tools } from './data/tools';
import { usePageMeta } from './hooks/usePageMeta';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading tool...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { title, description, keywords } = usePageMeta();
  const baseUrl = 'https://engtoolshub.com';

  console.log('🎯 AppContent render:', {
    pathname: location.pathname,
    title,
    keywords: keywords.substring(0, 100) + '...'
  });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${baseUrl}${location.pathname}`} />

        {/* Twitter Card */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:url" content={`${baseUrl}${location.pathname}`} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
      </Helmet>

      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recent" element={<Recent />} />
            {tools.map((tool) => {
              const Component = tool.component;
              return <Route key={tool.id} path={tool.path} element={<Component />} />;
            })}
            <Route
              path="*"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
                  <p className="text-muted-foreground">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
