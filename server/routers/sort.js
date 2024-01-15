const	sql		    = 	require("./scripts/database");
const   express     =   require("express");
const   security    =   require("./scripts/security");
const   encode      =   require("./scripts/encoding");


let sort_manga = express.Router();

async function sort(type) {

    const reverse = (json_obj) => {return (type == "note") ? json_obj.reverse() : json_obj};

    let db = sql.new_connection("viewer");
    db.connect()

    const q_view_sort = sql.builder.view.view_sort(type);
    try {

        manga = (await sql.query(db, q_view_sort));

        if(manga === undefined) return Promise.reject("Aucune sortie n'a été trouvée");

    } catch (e) {
        console.error(e);
        db.end()
        return;
    }

    db.end()

    manga.forEach((element) => {

        element["frontpage"] = encode.base64(encode.path_to_images+element["MANID"]+encode.extension);
        element["encoding"]  = "base64";
    })

    return reverse(JSON.parse(JSON.stringify(manga)));

}


sort_manga.use("/", (req, res, next) => {
    console.log(`[sort Manga] ${req.method} ${req.url} [${req.session.id}]`);
    next();
});

sort_manga.get("/alphabet", (req, res) => { 

    (async () => {res.json(await sort("alphabetically"));})()
    .catch((e)=>console.error("Reject in [Sort] router. [Exception] =>", e))

    return res;
});

sort_manga.get("/note", (req, res) => { 

    (async () => {res.json(await sort("note"));})()
    .catch((e)=>console.error("Reject in [Sort] router. [Exception] =>", e))

    return res;
});

sort_manga.get("/team", (req, res) => {

    (async() => {res.json(await sort("team"));})()
    .catch((e) => console.error("Reject in [Sort] router. [Exception] =>", e))
});


module.exports = sort_manga;