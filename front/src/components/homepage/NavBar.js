import React from 'react';

import { Link, useNavigate }    from 'react-router-dom';
import { useState, useEffect }  from 'react';
import { OnMainLogoClick,
         OnMouseEnterNavBar,
         OnMouseLeaveNavBar }   from '../utils/navBarUtils'
import { isOnMobile }           from '../utils/windowUtils'
import axios                    from "axios";

import { getURL, MANGA_INFO, LATEST, ALPHABET_SORT } from '../utils/url';

import '../../CSS/navBar.css'
import home   from '../../SVG/home.svg';
import book   from '../../SVG/book.svg';
import join   from '../../SVG/join.svg';
import random from '../../SVG/random.svg';

const baseURL = getURL();

let randomnumber;
let maxRandom;
let navBarOptions = [
  { name: "Accueil", link: "#", icon: home, path: "" },
  { name: "Nos séries", link: "#", icon: book, path: "series" },
  { name: "Nous rejoindre", link: "#", icon: join, path: "recrutement" },
  {
    name: "Manga aléatoire",
    link: "#",
    icon: random,
    path: "./mangaReader/manga=" + randomnumber + "&chapter=1",

  },
]
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNavOption(option, index) {
  randomnumber = getRandomNumber(1, maxRandom);
  navBarOptions = [
    { name: "Accueil", link: "#", icon: home, path: "" },
    { name: "Nos séries", link: "#", icon: book, path: "series" },
    { name: "Nous rejoindre", link: "#", icon: join, path: "recrutement" },
    {
      name: "Manga aléatoire",
      link: "#",
      icon: random,
      path: "./mangaReader/manga=" + randomnumber + "&chapter=1",

    },
  ]
  return (
    <p key={index}>
      <Link to={"/" + option.path} className="links">
        <img src={option.icon} alt='' className='icons' />
        {option.name}
      </Link>
    </p>
  );
}
function formatLatestChapters(seriesObj) {

  let series = [];

  for (let i = 0; i < seriesObj.length; i++) {

    const publicationDate = new Date(seriesObj[i].date);
    const publicationDuration = new Date() - publicationDate;

    const serieInfo = { id: seriesObj[i].id,
      name: seriesObj[i].name,
      image: seriesObj[i].frontpage,
      encoding: seriesObj.encoding,
    };

    series.push(serieInfo);
  }

  return series;
}

function createChapterInput(serie, index, setId) {

  return (

      <div className='search-row' key={index}>

        <Link to={"/series/id="+serie.id} className = "lol" onClick={() => {setId(serie.id)}}>
          <img className={'manga-search-img'} src={'data:image/jpg;'+serie.encoding+','+serie.image} alt={serie.name} />
          <h1 className='manga-name-search'>{serie.name}</h1>
        </Link>
      </div>

  );
}

function QueryNull() {

  return document.querySelector(".manga-searching") === null;
}

function QueryUndedined() {

  return document.querySelector(".manga-searching") === undefined;
}

function noQuery() {

  return QueryNull() || QueryUndedined();
}

function queryContainsSearch(words, elements) {

  return words.every((word) =>
            elements.textContent
                .toLowerCase()
                .includes(word.toLowerCase())
        )
}

function sortSearchBarResults(value, setSearchString) {

  setSearchString(value);

  if(value === ""){

    if (QueryNull()) return;

    document.querySelector(".manga-searching").style.display = "none"
    value = '%$'

  } else {
      document.querySelector(".manga-searching").style.display = "flex"
  }

  if(noQuery()){
    return;
  }

  const words = value.split(" ");
  const search = document.querySelector(".search");
  const rows = search.getElementsByClassName("search-row");

  Array.from(rows).forEach((row) => {

    const titleElement = row.querySelector(".manga-name-search");

    if (queryContainsSearch(words, titleElement)) {
      row.style.display = "flex";
    } else {
      row.style.display = "none";
    }
  });
};


export default function NavBar(props) {

  const root = document.documentElement;
  const [light, setLight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [post, setPost] = useState(null);
  const [manga_id, setId] = useState(0);
  const [searchString, setSearchString] = useState('');

  const navigate = useNavigate();

  const getAll = async() => {

    let post;
    await axios.get(baseURL+ALPHABET_SORT)
        .then(response => {return response.data})
        .then(response => {post = response})
        .catch(error => {navigate("/NotFound"); return null});

        maxRandom = post.length;
  }

  const getLatest = async() => {
    randomnumber = getRandomNumber(1, 40);

    await axios.get(baseURL+LATEST)
        .then(response => {return response.data})
        .then(response => {setPost(formatLatestChapters(response))})
        .catch(error => {navigate("/NotFound"); return null});
  }

  useEffect(() => {

    getAll();
    getLatest();

    isOnMobile((result) => {
      setIsMobile(result);
    });

    setTimeout(() => {
      sortSearchBarResults("", setSearchString);
    }, 600);

    setInterval(() => {
      if (document.querySelector(".navBar") === null) {
        return
      } else if(document.querySelector(".navBar").style.transform !== `translateY(0%)`) {
        sortSearchBarResults("", setSearchString);
      }
    }, 10);

  }, []);

  if (!post) {return null};

  return (

    sortSearchBarResults,
    <div>

        <div className="logo" onClick={() => OnMainLogoClick(isMobile)}
                              onMouseEnter={() => OnMouseEnterNavBar(light, isMobile)}
                              onMouseLeave={() => OnMouseLeaveNavBar(light, isMobile)}>
        <img src={book}/>

        </div>

      <div className="navBar" id="liste"  onMouseEnter={() => OnMouseEnterNavBar(light)}
                                          onMouseLeave={() => OnMouseLeaveNavBar(light)}>

        <div className="lien">
          {navBarOptions.map((option, index) => { return createNavOption(option, index) })}
        </div>

        <div className="search">
          <div className="group">
            <input value={searchString} onChange={(e) => sortSearchBarResults(e.target.value, setSearchString)}
                                        type="text"></input>

            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Rechercher</label>
          </div>
          <div className="manga-searching">
            {post.map((serie, index) => {return createChapterInput(serie, index, setId)})}
          </div>
        </div>
      </div>
    </div>
  );
}
