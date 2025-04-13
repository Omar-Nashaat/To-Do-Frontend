import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <>
    <Toaster />
    <App />
  </>
);
