import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from '../../pages/Popup/Popup';

createRoot(window.document.querySelector('#app-container')!).render(<Popup />);
