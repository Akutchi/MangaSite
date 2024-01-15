import React from "react";

import { useState, useEffect }    from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios                      from "axios";

import { getURL } from "../utils/url";
import "../../CSS/lecteur.css";

const baseURL = getURL();

function previousImage(setIndex, index) {

  let div = document.getElementById("lecteur");

    if (index > 0) {
      div.childNodes.item(index).style.display = "none";
      div.childNodes.item(index-1).style.display = "unset";
      setIndex(index-1);

      /*let currentURL = window.location.href;
      let newNumber = 1;
      if (currentURL.match(/\/\d+$/)) {
        let match = currentURL.match(/\/(\d+)$/);
        let currentNumber = parseInt(match[1], 10);
        newNumber = currentNumber - 1;
      }
      let newURL = currentURL.replace(/\/\d*$/, '') + '/' + newNumber;
      window.history.pushState({}, '', newURL);*/
       }
}

function nextImage(setIndex, index, Images) {

  let div = document.getElementById("lecteur");

  if (index < Images.length-1) {
    div.childNodes.item(index).style.display = "none";
    div.childNodes.item(index+1).style.display = "unset";
    setIndex(index+1);
    /*let currentURL = window.location.href;
    let newNumber = 1;
    if (currentURL.match(/\/\d+$/)) {
      let match = currentURL.match(/\/(\d+)$/);
      let currentNumber = parseInt(match[1], 10);
      console.log(currentNumber)
      currentNumber = 0 ? 1 : currentNumber;
      newNumber = currentNumber + 1;
    }
    let newURL = currentURL.replace(/\/\d*$/, '') + '/' + newNumber;
    window.history.pushState({}, '', newURL);*/
  }
}

function getParameterArray(slug) {

  const paramterArray = slug.split("&");
  const paramterArrayValues = [];

  paramterArray.forEach(element => {
    paramterArrayValues.push(element.split("=")[1])
  });

  return paramterArrayValues;

}

export default function ImageCore() {

  const [images, setImages] = useState(null);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  const { slug } = useParams();
  function scrollToTop() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 0) {
      const newScrollY = (currentScrollY/1.05) - 2; // Vous pouvez ajuster la valeur selon vos préférences
      window.scrollTo(0, newScrollY);
      setTimeout(scrollToTop, 1);
    }
  }
  let lecteur;
  function handleClick(event) {
    console.log(event)
    console.log(event.target)
    lecteur = document.querySelector("#lecteur");
    if (event.clientX < lecteur.getBoundingClientRect().left + lecteur.offsetWidth / 2) {
      console.log('Clic du côté gauche!');
      previousImage(setIndex, index, images);
      scrollToTop();
    } else {
      console.log('Clic du côté droit!');
      nextImage(setIndex, index, images);
      scrollToTop();
    }
  }

  const getImages = async() => {

    const parameters = getParameterArray(slug);
    let id = "";
    let chaid = "";
    let query = "";

    switch (parameters.length) {

      case 1:
        id = parseInt(parameters[0]);
        if (Number.isNaN(id)) {navigate("/NotFound"); return null};
        query = "id="+parameters[0];
        break;

      case 2:
        id = parseInt(parameters[0]);
        chaid = parseInt(parameters[1]);
        if (Number.isNaN(id) || Number.isNaN(chaid)) {navigate("/NotFound"); return null}
        query = "id="+parameters[0]+"&chapter="+parameters[1];
        break;

      default:
        query = "id=0";
        break;

    }

    await axios.get(baseURL+"images?"+query)
    .then(response => {return response.data})
    .then(response => {if (response.type == "400" || response.type == "500") {navigate("/NotFound"); return null} else setImages(response)})
    .catch(error => {navigate("/NotFound"); return null});

  }

  useEffect(() => {
    getImages();
  }, []);

  if (!images) {return null};

  return (
      <div>
        <div id="lecteur" onClick={handleClick}>
          {images.map((link, index) => (
              <img
                  key={index}
                  src={link}
                  className={`imgContainer ${index === 0 ? 'visible' : 'hidden'}`}
                  data-index={index}
              />
          ))}
        </div>
      </div>
  );
}
			