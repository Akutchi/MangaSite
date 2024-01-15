import React from 'react';

import { useState, useEffect }      from "react";
import { useNavigate, useParams }   from 'react-router-dom';
import axios                        from 'axios';

import List                         from "./chapterList";
import { getURL, MANGA_INFO_ID }    from '../utils/url';

import "../../CSS/mangaInfo.css"
import star from "../../SVG/star.svg"

const baseURL = getURL();

function createTag(tag) {
    return <button>{tag}</button>
}

function createInformation(info) {

    return (
        <div>
            <h3 className="infoTitle text">{info.title} : </h3>
            &nbsp; 
            <div className="tags">
                <p className="text">{info.content}</p>
            </div>
        </div>
    );
}

function createAuthors(authors) {

    const authors_array = Object.values(authors).slice(0, -1);
    let authors_content = [];

    if (authors_array.length == 1) {
        authors_content = 
        <a href='#'>{authors_array[0].name + " " + authors_array[0].surname}</a>

    } else {

        for(let i=0; i < authors_array.length; i++) {
            authors_content.push(
            <a href='#' className="text">{authors_array[i].name + " " + authors_array[i].surname}</a>
            )
        }
    }

    return (
        <div>
            <h3 className="infoTitle text">Auteur : </h3>
            &nbsp; 
            <div className="authorInformation">
                <p>{authors_content}</p>
            </div>
        </div>
    );
}

function createMetadata(info) {

    return (
        <div>
            <div>
                <h3 className="infoTitle text">Année : </h3>
                &nbsp; 
                <div className="metadata">
                    <p className="text">{info.year}</p>
                </div>
            </div>
            <div>
                <h3 className="infoTitle text">Status : </h3>
                &nbsp; 
                <div className="metadata">
                    <p className="text">{info.status}</p>
                </div>
            </div>
        </div>
    );
}

function SwitchGrades(state) {

    let grading = document.getElementById("grading");
    for(let index = 1; index < grading.children.length; index++) {
        grading.children[index].style.display = state;
        if (state == "flex") grading.children[index].style.visibility = "visible";
    }
}

function send(chapter) {

    let parentAnchor = chapter.closest('a');
    if (parentAnchor) {

        let hrefValue = parentAnchor.getAttribute('href');
        window.location.href = hrefValue;
    }
}

function firstChapter() {

    let allChaptersName = document.querySelectorAll(".theChapters");

    for (let i = 0; i < allChaptersName.length; i++) {

        send(allChaptersName[i]);
    }
}

function verifieFirstChapterExistence(atLeastOneChapter, setAtLeastOneChapter) {

    let allChaptersName = document.querySelectorAll(".theChapters");

    if(allChaptersName.length == 0) {

        for (let i = 0; i < 10; i++) {

            if (atLeastOneChapter === null){
                setAtLeastOneChapter(false);
                
            } else {
                setAtLeastOneChapter(null);
            }
        }
    }

    for (let i = 0; i < allChaptersName.length; i++) {

        if (allChaptersName[i].innerHTML in ["Chapitre 0", "Chapitre 1", "Oneshot"]) {
            setAtLeastOneChapter(true);

        } else if (atLeastOneChapter === null) {
            setAtLeastOneChapter(false);

        } else {
            setAtLeastOneChapter(null);
        }

    }
}

function thereIsNoFirstChapter(firstChapterCheck) {

    return firstChapterCheck === false || firstChapterCheck === null;
}

export default function MangaInfo() {

    var [atLeastOneChapter, setAtLeastOneChapter] = useState(null);

    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    const { slug } = useParams();

    const getLatest = async() => {
      
        const id = slug.split("=")[1];
        let param_id = parseInt(id);
        if (Number.isNaN(param_id)) {navigate("/NotFound"); return null}

        await axios.get(baseURL+MANGA_INFO_ID+id)
        .then(response => {return response.data})
        .then(response => {if (response.type == "400") {navigate("/NotFound"); return null} else setPost(response)})
        .catch(error => {navigate("/NotFound"); return null});
    }

    useEffect(() => {

        getLatest();
        verifieFirstChapterExistence(atLeastOneChapter, setAtLeastOneChapter);

    }, []);

    if (!post) {return null};

    const informations = [
        {title:"Titre alternatif", content: post.manga_info.alt_name},
        {title:"Type", content: post.manga_info.type},
        {title:"Magazine", content: post.manga_info.magazine}
    ]

    return (
        <div>
            <div id="information">
                <div className="generalInformation">
                    <div className="mangaInformation">
                        <div className="imageAndFirst">
                            <img src={'data:image/jpg;'+post.encoding+','+post.frontpage} alt={post.manga_info.MANNA} />
                            <button className={`button ${atLeastOneChapter ? '' : 'off'}`} id="firstChapter" onClick={firstChapter}>Lire le premier chapitre</button>
                        </div>
                        
                        <div className="titleInformation">

                            <div className="titleDiv">
                                <p id="title" className="text">{post.manga_info.name}</p>
                                <div className="tagNote">
                                    {Object.values(post.tags).slice(0, -1).map(tag => {return createTag(tag)})}
                                    <div className="score">
                                        <ul id="grading" className="nbr" onMouseEnter={() => SwitchGrades("flex")} onMouseLeave={() => SwitchGrades("none")}>
                                            <li id="note"><img src={star} style={{width: 15}}/><p>{post.manga_info.note}</p></li>
                                            <li>5 - Masterclass</li>
                                            <li>4 - Très bien</li>
                                            <li>3 - Ok</li>
                                            <li>2 - Nul</li>
                                            <li>1 - Horrible</li>
                                            <li>0 - Dégeulasse</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <p id="mangaSummary" className="text">{post.manga_info.summary}</p>

                            {createAuthors(post.authors)}
                            {informations.map((info => createInformation(info)))}
                            &nbsp; 
                            {createMetadata({year: post.manga_info.year, status: post.manga_info.status})}

                        </div>
                    </div>
                </div>
            </div>

            <List data={post.chapters} manga_id={slug.split("=")[1]}/>
        </div>
    );
}



