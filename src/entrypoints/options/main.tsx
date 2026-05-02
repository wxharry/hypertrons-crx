import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '../../pages/Options/Options';
import '../../pages/Options/index.css';

createRoot(window.document.querySelector('#app-container')!).render(<Options />);
