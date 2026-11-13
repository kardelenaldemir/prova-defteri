import { createRoot } from 'react-dom/client';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './styles.css';
import App from './App';
import { readAppData } from './lib/storage';

// İlk okuma render dışında yapılır; React güncellemeleri depolamayı tekrar başlatmaz.
const initial = readAppData();
createRoot(document.getElementById('root')!).render(<App initial={initial} />);
