import React    from 'react';

import NavBar       from './components/homepage/NavBar';
import Credit       from './components/homepage/Footer';
import AllSeries    from './components/seriespage/AllSeries'
import Trieur       from './components/seriespage/Trieur';

export default function SeriesPage() {

    return (
        <div>
            <NavBar />
            <Trieur/>
            <AllSeries/>
            <Credit addOn="manga"/>
        </div>
    );
}
