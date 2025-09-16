import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Spinner from './components/common/spinner/Spinner.jsx';
import { persistor, store } from './store/Store';
import { PersistGate } from 'redux-persist/integration/react';
import './style.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Suspense>
    </Provider>
  </StrictMode>,
);
