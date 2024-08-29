import React from 'react';

import { useState, useEffect } from 'react';

import { stylePageTheme } from '../utils/lightUtils'
import { isOnMobile }           from '../utils/windowUtils'
import "../../CSS/footer.css"

function Credit(props) {

  const root = document.documentElement;
  const [light, setLight] = useState(true);
  const [isBas, setIsBas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {

        isOnMobile((result) => {
            setIsMobile(result);
        });

        setTimeout(() => {
            const creditElement = document.querySelector(".credit");
            if (creditElement) {
                creditElement.style.display = "flex";
            }
        }, 500);

        setInterval(() => {

                if (document.documentElement.scrollHeight > window.innerHeight) {
                    setIsBas(false)
                } else if(isMobile == true){
                    setIsBas(true)
                } else {
                    window.location.href.includes("mangaReader") ? setIsBas(false) : setIsBas(true)
                }
            }, 1);

    }, []);

  return (

    <div className={`credit ${isBas ? 'bas' : ''}`}>
      <div className='gauche'>
        <div className="toggleWrapper">

            <input type="checkbox" className="dn" id="dn" onClick={() => {  setLight(!light); stylePageTheme(root, light, props.addOn);}} />

            <label htmlFor="dn" className="toggle">
              <span className="toggle__handler">
                <span className="crater crater--1"></span>
              </span>
              <span className="star star--1"></span>
            </label>

          </div>
        </div>

        <div className="plus">
          <p>About</p>
        </div>

        <style jsx="true">{`
          .credit {
            display: none;
            background-color: var(--color-BS5);
            height: 63px;
            font-size: 17px;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            color: var(--color-000);
          }
          .credit p{
            font-size: 17px;

          }
          .credit.bas {
            position: absolute;
            bottom: 0;
          }
          .plus {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 3vw;
            margin-right: 5%;
          }

          .plus img {
            width: 30px;
            height: 30px;
          }
          .plus p{
            cursor: pointer;
          }
          .plus p{
             cursor: pointer;
           }
        `}</style>

    </div>
  );
}

export default Credit;
