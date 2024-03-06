const 	express 	=   require("express");
const   axios       =   require("axios");
const   fs          =   require('fs');
var     FormData    =   require('form-data');
const   sql         =   require("./scripts/database");
const   errors 		= 	require("./scripts/errors");

let get_images		= 	express.Router();

const ROUTER_NAME = "IMAGES";
const IMGUR_API_BASE = "";
const IMAGE_PATH = "./tmp";


function isRequestFromLatestChapters(chaid) {
    return chaid == 0;
}

async function check_parameters(db, manid, chaid) {

    const state_global = await errors.base_check("reader", [manid, chaid]).catch((state) => {return state});
    if (state_global != errors.STATES.all.good) {return Promise.reject(state_global)};

    const state_global_manga = await errors.manga_check(db, sql, "reader", {param:manid}).catch((state) => {return state});
    if (state_global_manga != errors.STATES.all.good) {return Promise.reject(state_global_manga)};

    if (!isRequestFromLatestChapters(chaid)) {

        const state_global_chap = await errors.chapter_check(db, sql, "reader", {p1: manid, p2:chaid}).catch((state) => {return state});
        if (state_global_chap != errors.STATES.all.good) return Promise.reject(state_global_chap);
    }

    return errors.STATES.all.good;
}

async function getHashFromBDD(db, manid, chaid) {

    if (isRequestFromLatestChapters(chaid)) {
        const q_view_chapters = sql.builder.view.view_manga_chapters(manid, 0);
        return (await sql.query(db, q_view_chapters))[0].CHAUR;

    }

    const q_view_chapters = sql.builder.view.view_manga_chapters(manid, chaid);
    return (await sql.query(db, q_view_chapters))[0].CHAUR;

}

async function getChapterData(info, manid, chaid) {

    db = sql.new_connection("viewer");

    const response = undefined;

    const state_parameters = await check_parameters(db, manid, chaid);
    if (state_parameters != errors.STATES.all.good) {return Promise.reject(state_parameters)};

    const hash = await getHashFromBDD(db, manid, chaid);

    var form = new FormData();
    var settings = {
    "url": IMGUR_API_BASE + hash + "/images",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "Client-ID " + info[1]
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
    };
    //const response = await axios(settings); // because no access to igmur anymore

    // Test data. Comes from https://brookmiles.ca/
    const AllLinks = [
        {link: "https://brookmiles.ca/2022/01/manga-page-1-final.png"},
        {link: "https://brookmiles.ca/2022/02/manga-page-2-final.png"},
        {link: "https://brookmiles.ca/2022/04/manga-page-3-rough.png"}
    ];

    if (response == undefined) return {data: AllLinks};

    if (response["data"].status == 500 || response["data"]["data"]["error"]) return Promise.reject(errors.STATES["all"]["broken"]);
    return await response["data"];
}


get_images.get("/", (req, res) => {

    const credentials = fs.readFileSync('./imgur_api.txt', 'utf8').split("\n");
    (async() => {getChapterData(credentials, req.query.id, req.query.chapter).then((data) => {

            let ImagesLink = [];
            data["data"].forEach(element => {
                ImagesLink.push(element.link);
            });
            res.send(ImagesLink);
        }
    ).catch((e)=>{res.json(errors.state_managment(ROUTER_NAME, e))})

    })()
});


module.exports = get_images;