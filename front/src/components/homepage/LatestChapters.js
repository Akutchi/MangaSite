import React from 'react';

import { useState, useEffect } from 'react';
import { Link, useNavigate }   from "react-router-dom";
import axios                   from "axios";

import { getURL, LATEST } from '../utils/url.js'

const MINUTES_MILISECONDS = 60000;
const HOURS_MILISECONDS = 3600000;
const DAY_MILISECONDS = 86400000;

const baseURL = getURL();

function formatDate(publicationDuration) {

  let formattedDate;
  const minutesNumber = Math.floor(publicationDuration / MINUTES_MILISECONDS);
  const hoursNumber = Math.floor(publicationDuration / HOURS_MILISECONDS);
  const daysNumber = Math.floor(publicationDuration / DAY_MILISECONDS);

  formattedDate = daysNumber  > 1 ? `${daysNumber} jours` : '1 jour';
  if (minutesNumber < 60) {
    formattedDate = minutesNumber > 1 ? `${minutesNumber} minutes` : '1 minute';
  } else if (hoursNumber < 24) {
    formattedDate = hoursNumber > 1 ? `${hoursNumber} heures` : '1 heure';
  }

  return formattedDate;
}

function formatLatestChapters(seriesObj) {

  let series = [];

  for (let i = 0; i < seriesObj.length; i++) {
      
    const publicationDate = new Date(seriesObj[i].date);
    const publicationDuration = new Date() - publicationDate;
    const formattedDuration = formatDate(publicationDuration);

    const serieInfo = { id: seriesObj[i].id,
                        name: seriesObj[i].name, 
                        chapterNumber: seriesObj[i].number, 
                        publicationAgo : `Il y a ${formattedDuration}`,
                        image: seriesObj[i].frontpage,
                        encoding: seriesObj.encoding,
                        };

    series.push(serieInfo);
  }

  return series;
}

function createChapterPreview(serie, index, setId) {

        let number = serie.chapterNumber.split(" ")[1];
  return (

    <div className='row' key={index}> 
      
      <Link to={"/mangaReader/manga="+serie.id+"&chapter=" + number} onClick={() => {setId(serie.id)}}>
        <img src={'data:image/jpg;'+serie.encoding+','+serie.image} alt={serie.name} />

      </Link>
      <h1 className='serie-name text'>{serie.name}</h1>
  
      <div className='chapter-number'>
        <h4>{serie.chapterNumber}</h4>
      </div>
    </div>
  
  );
}

function LatestChapters() {

  const [post, setPost] = useState(null);
  const [manga_id, setId] = useState(0);

  const navigate = useNavigate();

  const getLatest = async() => {
      
    await axios.get(baseURL+LATEST)
    .then(response => {return response.data})
    .then(response => {setPost(formatLatestChapters(response))})
    .catch(error => {navigate("/NotFound"); return null});
  }

  useEffect(() => {
    getLatest();
  }, []);

  if (!post) {return null};

  return (
    <div id="suite">
      <h2 className="latest">Dernières Sorties</h2>
      <div className="container-preview">

        {post.map((serie, index) => {return createChapterPreview(serie, index, setId)})}

        <style jsx="true">{`

          
          
          .serie-name {
            font-weight: 800;
            font-size: 1.5em;
          }
          
          .chapter-number {
            display: flex;
            gap: 10px;
            font-size: 1.2em;
          }
          
          .chapter-date p {
            color: var(--color-BS2);
          }
          
          h4 {
            font-weight: 600;
          }
        `}</style>

      </div>
    </div>
  );
};

export default LatestChapters;