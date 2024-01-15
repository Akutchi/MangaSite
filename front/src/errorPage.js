import React    from 'react';

import NavBar   from './components/homepage/NavBar';
import Credit   from './components/homepage/Footer';

import notFound from "./SVG/404.png"

export default function NotFoundError() {

    return(
        <div>
            <NavBar />
            <img className="404Img" src={notFound} style={{position: "absolute", left: "40%", height: "48%", top: "20%"}}/>
            <Credit />

        </div>

       
    );
}
    