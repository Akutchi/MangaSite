import React    from 'react';

import NavBar   from './components/homepage/NavBar';
import Credit   from './components/homepage/Footer';
import Info     from "./components/seriespage/mangaInfo";

export default function mangaPage() {

    return (
        <div>
            <NavBar />
            <Info />
            <Credit addOn="manga"/>
        </div>
    );
}
