import React from 'react';
import { useState, useEffect } from 'react';

import "../../CSS/trieur.css"

const Trieur = () => {

  const [searchString, setSearchString] = useState('');
  
  useEffect(() => {

    let timeoutId;

   /* const handleMouseOut = () => {
      clearTimeout(timeoutId);

      const isBothElementsOut = [element1, element2, element3, element4].every(el => !el.matches(':hover'));
     
      if (isBothElementsOut) {
        console.log('Both elements have left.');
        timeoutId = setTimeout(() => {
          document.querySelector(".select_wrap").classList.remove("active");
          setTimeout(() => {
            document.querySelector('.select_wrap').style.overflowY = "hidden";
          }, 50);
        }, 250);
      }
    };

    const element1 = document.querySelector('.wrapper');
    const element2 = document.querySelector('.select_wrap');
    const element3 = document.querySelector('.select_ul');
    const element4 = document.querySelector('.select_ul Li');
    document.querySelector(".select_wrap .select_ul").style.transition = "transform 0.35s ease, opacity 0.40s ease";

    element1.addEventListener('mouseout', handleMouseOut);
    element2.addEventListener('mouseout', handleMouseOut);
    element3.addEventListener('mouseout', handleMouseOut);
    element4.addEventListener('mouseout', handleMouseOut);

    return () => {
      // Nettoyage des événements lorsque le composant est démonté
      element1.removeEventListener('mouseout', handleMouseOut);
      element2.removeEventListener('mouseout', handleMouseOut);
      element3.removeEventListener('mouseout', handleMouseOut);
      element4.removeEventListener('mouseout', handleMouseOut);
    };*/
  }, []);

  /*const handleClick = () => {
    if (document.querySelector('.default_option').classList.contains("active")) {
      setTimeout(() => {
        document.querySelector('.select_wrap').style.overflowY = "visible";
      }, 100);
    } else{
      setTimeout(() => {
        document.querySelector('.select_wrap').style.overflowY = "hidden";
      }, 100);
    }
    document.querySelector('.default_option').parentElement.classList.toggle('active');

  };

  const handleSelect = (event) => {
    const currentEl = event.target.innerHTML;
    document.querySelector('.default_option li').innerHTML = "<p>" + currentEl + "<p/>";
    document.querySelector('.select_wrap').classList.remove('active');
    setTimeout(() => {
      document.querySelector('.select_wrap').style.overflowY = "hidden";
    }, 50);
  };*/

  const trie = (value) => {
    setSearchString(value);

    const words = value.split(" ");
    const rows = document.getElementsByClassName("row");
    Array.from(rows).forEach((row) => {
      const titleElement = row.querySelector(".serie-name-text");
      if (
        words.every((word) =>
          titleElement.textContent
            .toLowerCase()
            .includes(word.toLowerCase())
        )
      ) {
        row.style.display = "unset";
      } else {
        row.style.display = "none";
      }
    });
  };
  return (
    <div className="start">
      <div className="recherche">
        <div id="machinPourMettreAGauche">
          <h1>Recherche</h1>
           <div className="suite">
            <input type="text" placeholder="Rechercher" id="rech" value={searchString} onChange={(e) => trie(e.target.value)}></input>
          {/*<div className="wrapper">
            <div className="select_wrap">
              <ul className="default_option" onClick={handleClick}>
                <p id="tri">Trier par:</p>
                <li>
                  <div className="option">
                    <p>Titre</p>
                  </div>
                </li>
              </ul>
              <ul className="select_ul" style={{ transition: "all 0.3s ease 0s" }}>
                <li onClick={handleSelect}>
                  <div className="option">
                    <p>Auteur</p>
                  </div>
                </li>
                <li onClick={handleSelect}>
                  <div className="option">
                    <p>Date de publication</p>
                  </div>
                </li>
                <li onClick={handleSelect}>
                  <div className="option">
                    <p>Note</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>*/}
        </div>
      </div>
      </div>
      <script src="http://code.jquery.com/jquery-3.5.1.min.js"></script>
    </div>
  );
};

export default Trieur;
