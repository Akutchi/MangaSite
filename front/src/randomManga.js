import React    from 'react';

import './CSS/index.css';

import NavBar         from './components/homepage/NavBar';
import Credit         from './components/homepage/Footer';

export default function RandomManga() {
  
    return (
      <div>
        <NavBar  />
        <Credit addOn="home"/>
      </div>
    );
  }
  
  
    

