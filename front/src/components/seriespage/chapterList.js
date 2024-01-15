import React from 'react';

import { Link } from "react-router-dom";

import "../../CSS/chapterList.css"

const formatChapterNumber = (chapter) => {

    if (chapter === undefined) return 0
    else return chapter;
}

function createChapter(manga_id, chapter) {
    let realName = chapter.name.split(" ")[1];
    return(
        <Link to={"/mangaReader/manga="+manga_id+"&chapter="+formatChapterNumber(chapter.number.split(" ")[1])}>
        <div className="button">
            <p className="theChapters">{chapter.number}</p>
            <p>{realName}</p>
        </div>
        </Link>
    );
}



export default function chapterList(props) {

    return(
        <div>
            <div id="Chapitres">
                <div className="rectangle11">
                    <div className="rectangle12">
                        {Object.values(props.data).slice(0, -1).map((chapter) => {return createChapter(props.manga_id, chapter)})}
                    </div>
                </div>
            </div>
        </div>
    );
}