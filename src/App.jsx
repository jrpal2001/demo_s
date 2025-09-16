import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Toaster from '@/components/common/toaster/Toaster';
import RouteLoader from './routes/Router';
import InterceptorSetup from './components/interceptor/InterceptorSetup';
import { HelmetProvider } from 'react-helmet-async';
function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          <Toaster />
          <InterceptorSetup />
          <ScrollToTop>
            <RouteLoader />
          </ScrollToTop>
        </RTL>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
