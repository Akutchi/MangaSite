import React    from 'react';

import NavBar   from './components/homepage/NavBar';
import Credit   from './components/homepage/Footer';
import Core     from "./components/MangaReader/ImageCore";

export default function mangaReader() {

    return (
        <div>
            <NavBar addOn="manga"/>
            <Core />
            <Credit addOn="home" />
        </div>
    );
}
