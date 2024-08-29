import React from 'react';

import { useRef, useState, useEffect }  from "react";
import {Link, useNavigate }                  from "react-router-dom";
import axios                            from "axios";
import Flickity                         from "flickity";

import { getURL, EXPLORE } from '../utils/url';

import "../../CSS/slideShow.css";
import "flickity/css/flickity.css";

// choose so that the js lib run after all is rendered
const TIMEOUT = 1;

const baseURL = getURL();

function stackSlideShowPanels(setIsVisible, flickityRef) {
  const MAX_RETRIES = 500;
  let retries = 0;

  function createFlickity() {
    const carouselElement = document.querySelector(".carousel");

    if (!carouselElement) {

      if (retries < MAX_RETRIES) {
        retries++;
        setTimeout(createFlickity, 50);
        return;
      } else {
        console.log("Échec de la création de Flickity : l'élément .carousel est introuvable.");
        return;
      }
    }

    setIsVisible(true);

    if (flickityRef.current) {
      flickityRef.current.destroy();
    }

    flickityRef.current = new Flickity(carouselElement, {
      prevNextButtons: false,
      wrapAround: true,
      autoPlay: 2500,
      pageDots: "li",
    });

    setTimeout(() => {
      document.querySelectorAll('.carousel-cell-2').forEach(cell => { cell.style.opacity = "1" });
    }, 0);

     if (document.querySelector(".flickity-slider").style.transform != "translateX(0%)") {
        setTimeout(() => {
          createFlickity();
        }, 200);
     }


  }

  createFlickity();

  return () => {
    if (flickityRef.current) {
      flickityRef.current.destroy();
    }
  };
}


function createPanel(id, manga, index) {

  let tags = Object.values(manga.tags).slice(0, -1);

  return (
    <div className={"carousel-cell"+id} key={index}>
      <div className="info">

        <p>Découverte</p>
        <h1 className="text">{manga.name}</h1>
        <div className="tag">
          {tags.map(tag => <p className="text">{tag}</p>)}
        </div>

        <div className="summary">
          <p className="summaryContent">{manga.summary}</p>
        </div>

        <div className="end">
          <Link to={"/series/id="+manga.id}>
          <button>Lire</button>
          </Link>
          <p className="latestChapter">{manga.latest} • </p>
          <p className="text">{manga.status}</p>
        </div>

      </div>
    </div>
    );
}

function SlideShow () {

  const [isVisible, setIsVisible] = useState(false);
  const [post, setPost] = useState(null);

  const flickityRef = useRef(null);
  const navigate = useNavigate();

  const getExplore = async() => {

    await axios.get(baseURL+EXPLORE)
    .then(response => {return response.data})
    .then(response => {setPost(response)})
    .catch(error => {navigate("/NotFound"); return null});
  }

  useEffect(() => {
    getExplore();
    stackSlideShowPanels(setIsVisible, flickityRef);
  }, []);

  if (!post) {return null};

  return (

     <div className="carousel">

      {post.map((manga, index) => (
        createPanel((index === 0) ? "" : "-2", manga, index)
      ))}

    </div>

  );
}

export default SlideShow;