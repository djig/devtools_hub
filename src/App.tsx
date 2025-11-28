import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Recent from './pages/Recent';
import { tools } from './data/tools';

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

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
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
    </BrowserRouter>
  );
}

export default App;
