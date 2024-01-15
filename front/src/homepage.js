import React    from 'react';

import './CSS/index.css';
import './CSS/flickity.css';

import SlideShow      from './components/homepage/SlideShow';
import NavBar         from './components/homepage/NavBar';
import Credit         from './components/homepage/Footer';
import LatestChapters from './components/homepage/LatestChapters';

export default function Homepage() {
  
    return (
      <div>
        <NavBar  />
        <SlideShow />
        <LatestChapters />
        <Credit addOn="home"/>
      </div>
    );
  }
  
  
    

