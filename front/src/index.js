import React              from 'react';
import ReactDOM           from 'react-dom/client';
import { BrowserRouter,
         Route,
         Routes }         from 'react-router-dom';

import MangaReader    from './mangaReader';
import Homepage       from './homepage';
import MangaPage      from './mangaPage';
import NotFoundError  from './errorPage';
import SeriesPage     from './seriesPage';
import CandidatePage  from './candidatePage';
import RandomManga    from './randomManga';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path='/series' element={<SeriesPage />} />
          <Route path='/series/:slug' element={<MangaPage />} />
          <Route path="/mangaReader/:slug" element={<MangaReader />} />
          <Route path='/recrutement' element={<CandidatePage />} />
          <Route path='/random' element={<RandomManga />} />
          <Route path="/NotFound" element={<NotFoundError />} />
        </Routes>
      </BrowserRouter>    
    </React.StrictMode>
);
