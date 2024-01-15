import React from 'react';

import { useState, useEffect }  from 'react';
import { Link, useNavigate }    from 'react-router-dom';
import axios                    from "axios";

import { getURL, ALPHABET_SORT } from '../utils/url';

const baseURL = getURL();

function formatAllChapters(seriesObj) {

  let series = [];

  for (let i = 0; i < seriesObj.length; i++) {
      
    const serieInfo = { 
                        id: seriesObj[i].MANID,
                        name: seriesObj[i].MANNA, 
                        image: seriesObj[i].frontpage,
                        encoding: seriesObj[i].encoding
                      };

    series.push(serieInfo);
  }

  return series;
}

function createChapterPreview(serie, index) {

  return (

    <div className='row' key={index}> 
      
      {<Link to={"/series/id="+serie.id}>
        <img src={'data:image/jpg;'+serie.encoding+','+serie.image} alt={serie.name} />
        <p className='serie-name-text'>{serie.name}</p>
      </Link>}
  
      <div className='chapter-number'>
      </div>
    </div>
  
  );
}

function parentElementIsActive() {

  return document.querySelector('.default_option').parentElement.classList.contains("active");
}

function setParentElementToActive() {

      document.querySelector('.default_option').parentElement.classList.toggle('active');
}

function exit(timeoutId) {


        const elem_list = [
                          document.querySelector('.wrapper'), 
                          document.querySelector('.select_wrap'),
                          document.querySelector('.select_ul'),
                          document.querySelector('.select_ul Li')
                          ];

        const handleMouseOut = () => {

            clearTimeout(timeoutId);

            const isBothElementsOut = elem_list.every(el => !el.matches(':hover'));

            if (isBothElementsOut) {

                timeoutId = setTimeout(() => {
                    if(!document.querySelector(".select_wrap")) return;
                    document.querySelector(".select_wrap").classList.remove("active");
                    setTimeout(() => {
                        document.querySelector('.select_wrap').style.overflowY = "hidden";
                    }, 50);
                }, 250);
            }
        };

        document.querySelector(".select_wrap .select_ul").style.transition = "transform 0.40s ease-out, opacity 0.40s ease";

        elem_list.forEach(element => element.addEventListener('mouseout', handleMouseOut));

        return () => {
            // clean the component
            elem_list.forEach(element => element.removeEventListener('mouseout', handleMouseOut));
        };
    };

const handleSelect = (event) => {

    const currentEl = event.target.innerHTML;
    document.querySelector('.default_option li').innerHTML = "<p>" + currentEl + "<p/>";
    document.querySelector('.select_wrap').classList.remove('active');

    setTimeout(() => {
        document.querySelector('.select_wrap').style.overflowY = "hidden";
    }, 50);
};

const handleClick = () => {

    if (parentElementIsActive()) {

        setTimeout(() => {
            document.querySelector('.select_wrap').style.overflowY = "hidden";
        }, 90);

    } else {

        setTimeout(() => {
            document.querySelector('.select_wrap').style.overflowY = "visible";
        }, 130);
    }

    setParentElementToActive();

};

function AllSeries() {

  const [post, setPost] = useState(null);
  const [manga_id, setId] = useState(0);

  const navigate = useNavigate();

  const getLatest = async() => {
      
    await axios.get(baseURL+ALPHABET_SORT)
    .then(response => {return response.data})
    .then(response => {setPost(formatAllChapters(response))})
    .catch(error => {navigate("/NotFound"); return null});
  }

  let timeoutId;

  useEffect(() => {
    getLatest();

  }, []);

  if (!post) {return null};

  return (
    <div id="suite">
        <div className="head">
          <h2 className="latest">Nos séries</h2>
            <div className="wrapper" onClick={exit(timeoutId)}>
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
            </div>
          </div>
          
          <div className="container-preview">

          {post.map((serie, index) => {return createChapterPreview(serie, index, setId)})}

        </div>

      <style jsx="true">{`
        .head {
          display: flex;
          padding: 0em 9em 0em 8em;
          justify-content: space-between;
          align-items: flex-end;
        }
        @media screen and (max-width: 1090px)
          {
              .head {
              padding: 0em 4em 0em 4em;
                flex-direction: column;
                align-items: center;
              }
          }
        
      `}</style>

    </div>
  );
};

export default AllSeries;