const	sql		    = 	require("./scripts/database");
const   express     =   require("express");
const   security    =   require("./scripts/security")
const   errors 		= 	require("./scripts/errors");
const   encode      =   require("./scripts/encoding");


const MAX_SORTIES = 8;
const ROUTER_NAME = "Manga";

let get_manga_router = express.Router();

function notAtTheEnd(index, mangaObject) {

    return index != mangaObject.length-1;
}

/**
 * Get the data from the database in order to create the slideshow.
 * A recursive function was used because the way sql works with
 * node is that several queries results in a nested structure.
 *
 * @param   {sql} sql an object with every prebuild query in it.
 * @param   {mangaObject} mangaObject the route to be checked
 * @param   {index} index the parameters to be checked
 * @returns {complete_manga_JSON} the list of all manga_informations in the slideshow
 */
async function construct_explore_JSON(sql, mangaObject, index) {

    let complete_manga_JSON = [];
    manid = mangaObject[index].MANID;
    let tags, latestChapter;
    let tags_JSON = {};

    if (notAtTheEnd(index, mangaObject)) {

        let partial_manga_JSON_i_1 = await construct_explore_JSON(sql, mangaObject, index+1);
        partial_manga_JSON_i_1.forEach(element => {complete_manga_JSON.push(element)});
    }

    let db = sql.new_connection("viewer");
    db.connect();

    try {

        const q_view_tags = sql.builder.view.view_tags(manid);
        const q_view_latest = sql.builder.view.view_latest_chapter(manid);

        tags = (await sql.query(db, q_view_tags));
        latestChapter = (await sql.query(db, q_view_latest));

    } catch (e) {
        console.log(e);
        return;
    }

    db.end()

    tags.forEach(element => {
        Array.prototype.push.call(tags_JSON, element.TAGNA)
    });

    let partial_manga_JSON_i = {
        expid:      mangaObject[index].EXPID,
        id:         mangaObject[index].MANID,
        name:       mangaObject[index].MANNA,
        tags:       tags_JSON,
        summary:    mangaObject[index].MANSU,
        latest:     sql.builder.helper.format_chapter(latestChapter[0].CHANU),
        status:     mangaObject[index].STANA,
    }

    complete_manga_JSON.push(partial_manga_JSON_i);

    return complete_manga_JSON;
}

async function get_explore(){

    let db = sql.new_connection("viewer");
    db.connect();

    let explore_JSON = {};

    try{

        const q_view_manga = sql.builder.view.view_explore();
        manga = (await sql.query(db, q_view_manga));
        db.end()

        if(manga === undefined) return Promise.reject(errors.STATES.explore["explore-get"]);

        explore_JSON = await construct_explore_JSON(sql, manga, 0);

    }catch(e){
        console.log(e);
        return;
    }

    return explore_JSON;
}

async function get_latest() {

    let db = sql.new_connection("viewer");
    db.connect()

    const q_view_latest = sql.builder.view.view_latest();
    let chapter_list;
    let latest_JSON = {};

    try {
        chapter_list = (await sql.query(db, q_view_latest));
        if(chapter_list === undefined) return Promise.reject(errors.STATES.latest["latest-get"]);

    } catch(e) {
        db.end()
        console.log(e);
        return;
    }
    db.end()

    for (let index = 0; index < MAX_SORTIES; index++) {
        let element = chapter_list[index];

        Array.prototype.push.call(latest_JSON, {
                                                id: element.MANID,
                                                name: element.MANNA,
                                                number: sql.builder.helper.format_chapter(element.CHANU),
                                                frontpage: encode.base64(encode.path_to_images+element.MANID+encode.extension),
                                                date: element.CHADA
                                                })
    }

    latest_JSON["encoding"] = "base64";

    return latest_JSON;
}

async function get_manga_info(manid) {

    let manga, tags, chapter_list, authors;
    let  manga_JSON = {};
    let tags_JSON = {};
    let chapter_JSON = {}
    let authors_JSON = {};

    let db = sql.new_connection("viewer");
    db.connect();

    try {

        const state_global = await errors.base_check("information", [manid]).catch((state) => {return state});
        if (state_global != errors.STATES.all.good) return Promise.reject(state_global);

        const state_global_manga = await errors.manga_check(db, sql, "information", {param:manid, table:"MANGA"}).catch((state) => {return state});
        if (state_global_manga != errors.STATES.all.good) return Promise.reject(state_global_manga);

        const q_view_manga = sql.builder.view.view_manga(manid);
        const q_view_chapters = sql.builder.view.view_manga_chapters(manid, 0);
        const q_view_tags = sql.builder.view.view_tags(manid);
        const q_view_authors = sql.builder.view.view_authors(manid);

        manga = (await sql.query(db, q_view_manga))[0];
        tags = (await sql.query(db, q_view_tags));
        chapter_list = (await sql.query(db, q_view_chapters));
        authors = (await sql.query(db, q_view_authors));

        if(manga === undefined) return Promise.reject(errors.STATES.information["information-get"]);

    } catch (e) {
        db.end()
        console.log(e);
        return e;
    }

    db.end()

    tags.forEach(element => {
        Array.prototype.push.call(tags_JSON, element.TAGNA);
    });

   chapter_list.forEach(element => {
        Array.prototype.push.call(chapter_JSON, {
                                                name: sql.builder.helper.format_chapter(element.CHANA),
                                                number: sql.builder.helper.format_chapter(element.CHANU)
                                                });
    });

    authors.forEach(element => {
        Array.prototype.push.call(authors_JSON, {
                                                name: element.AUTNA,
                                                surname: element.AUTSU
                                                })
    });

    manga_JSON = {
        manga_info: {
            name:       manga.MANNA,
            note:       manga.MANNO,
            summary:    manga.MANSU,
            year:       manga.YEANA,
            status:     manga.STANA,
            alt_name:   manga.MANAL,
            type:       manga.TYPNA,
            magazine:   manga.MAGNA,
        },

        tags:       tags_JSON,
        authors:    authors_JSON,
        chapters:   chapter_JSON,
        frontpage:  encode.base64(encode.path_to_images+manga.MANID+encode.extension),
        encoding:   "base64"
    }

    return manga_JSON;
}



get_manga_router.use("/", (req, res, next) => {
    console.log(`[Get Manga] ${req.method} ${req.url} [${req.session.id}]`);
    next();
});

get_manga_router.get("/explore", (req, res) => {

    (async () => {res.json(await get_explore());})()
    .catch((e)=>{res.json(errors.state_managment(ROUTER_NAME, e))})

    return res;
});

get_manga_router.get("/latest", (req, res) => {

    (async () => {res.json(await get_latest());})()
    .catch((e)=>errors.state_managment(ROUTER_NAME, e))

    return res;
});

get_manga_router.get("/info", (req, res) => {

    req.query = security.sanitize(req.query);

    (async() => {res.json(await get_manga_info(req.query.id));})()
    .catch((e) => {res.json(errors.state_managment(ROUTER_NAME, e))})

    return res;
});


module.exports = get_manga_router;