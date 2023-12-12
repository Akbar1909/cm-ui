import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import ThemeProvider from './theme';
import PageSpinner from 'components/PageSpinner';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import ServerStoreProvider from './serverStore/ServerStoreProvider';
import './global.styles.css';
import AppErrorBoundary from 'components/AppErrorBoundary';

// ----------------------------------------------------------------------

export default function App() {
  if (process.env.NODE_ENV === 'production') {
    console.error = () => {};
    console.warn = () => {};
  }

  return (
    <ServerStoreProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Suspense fallback={<PageSpinner />}>
              <AppErrorBoundary>
                <Router />
                <ToastContainer />
              </AppErrorBoundary>
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ServerStoreProvider>
  );
}
