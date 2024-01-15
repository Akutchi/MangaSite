const 	express 	    =   require("express");
const   errors          =   require("./scripts/errors");
const	sql		        = 	require("./scripts/database");
const { sanitize }      =   require("./scripts/security");

let admin   		= 	express.Router();
const ROUTER_NAME   = "ADMIN";


async function get_manga_id(newName) {

    let db = sql.new_connection("admin");
    db.connect();
    const q_verify_name = sql.builder.verify.verify_exist(newName);

    let promise = undefined;
    try {
        promise = (await sql.query(db, q_verify_name));
        if (promise.length == 0) {return null}

    } catch (e) {
        console.log(e);
        db.end();
    }

    db.end();

    return promise[0].MANID;
}

async function modify_explore_bdd(expid, manid) {

    let db = sql.new_connection("admin");
    db.connect();
    const q_modify_explore = sql.builder.modify.explore_table(expid, manid);

    let promise = undefined;
    try {
        promise = (await sql.query(db, q_modify_explore));
        if (promise == undefined) {return Promise.reject(errors.STATES["all"]["broken"]);}

    } catch (e) {
        console.log(e);
        db.end();
    }

    db.end();
    return promise;
}

admin.post("/changeExplore", (req, res) => {

    let modified = false;
    (async() => {

        const sanitized_req = sanitize(req.body);
        const id_shifted_for_bdd = sanitized_req.id.valueOf()+1;

        const manid = await get_manga_id(sanitized_req.title);
        if (manid == null) {res.json({bdd_modified: modified}); return null}

        const change_explore = await modify_explore_bdd(id_shifted_for_bdd, manid);
        if (change_explore.affectedRows == 0) {res.json({bdd_modified: modified}); return null}

        modified = true;
        res.json({bdd_modified: modified});

    })().catch((e)=>{res.json(errors.state_managment(ROUTER_NAME, e))});


    return res;
});


/* this one is not finished */
admin.post("/changeManga", (req, res) => {

    let modified = false;
    (async() => {

        const sanitized_req = sanitize(req.body);
        const id_for_bdd = sanitized_req.id.valueOf();

        res.json({bdd_modified: modified});

    })().catch((e)=>{res.json(errors.state_managment(ROUTER_NAME, e))});


    return res;
});


module.exports = admin;