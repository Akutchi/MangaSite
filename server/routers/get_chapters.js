const 	express 	=   require("express");
const   sql         =   require("./scripts/database");

let get_chapters	= 	express.Router();

const ROUTER_NAME = "CHAPTERS";

async function getChaptersData(manid) {

    let db = sql.new_connection("viewer");
    db.connect();

    let chapter_data = {};

    try {
        const q_view_chapters_data = sql.builder.view.view_hash_for_all_chapters(manid);
        chapter_data = (await sql.query(db, q_view_chapters_data));

    } catch(e) {
        console.log(e);
        return;
    }
    db.end();

    return chapter_data;

}

get_chapters.get("/hash-daee7686db5c0f8f0317", (req, res) => {

    (async() => {res.json(await getChaptersData(req.query.id))})()
    .catch((e)=>{res.json(errors.state_managment(ROUTER_NAME, e))})

    return res;
});


module.exports = get_chapters;