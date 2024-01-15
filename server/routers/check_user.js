const 	express 	    =   require("express");
const   errors          =   require("./scripts/errors");
const	sql		        = 	require("./scripts/database");
const   fs              =   require('fs');
const   nodeRSA         =   require('node-rsa');
const { hash,
        sanitize }      =   require("./scripts/security");
const crypto            =   require('crypto');


let check_user		= 	express.Router();
const ROUTER_NAME   = "LOGIN";
const MAX_DELAY     =   5000; // ms

let loggedInUsers = [];
let ValidTokens   = {};

const randomHex = (bytes = 8) => {

    const randomString = crypto.randomBytes(8).toString("hex");
    return randomString;
  }
  

async function get_user_pwd(user_login) {

    let db = sql.new_connection("admin");
    db.connect();
    const q_view_users = sql.builder.user.get_user_pwd(user_login);
    let users_promise = undefined;
    let user_pwd = null;

    try {
        users_promise = (await sql.query(db, q_view_users));
        if (users_promise == undefined) {return Promise.reject(errors.STATES.explore["users-get"]);}

    } catch (e) {
        console.log(e);
        db.end()
    }

    db.end()

    return users_promise[0].USRPW;
}

function isLoginValid(login, pwd) {

    return (login != "" && pwd != "") && (login != undefined && pwd != undefined);
}

function isHashValid(hash, bdd_pwd) {

    return hash === bdd_pwd;
}

function isTimestampValid(timestamp) {

    return Date.now() - timestamp < MAX_DELAY;
}

function loginCheckConditions(login, pwd, timestamp, hash, bdd_pwd) {

    return isLoginValid(login, pwd) && 
           isHashValid(hash, bdd_pwd) &&
           isTimestampValid(timestamp);
}

async function check_auth(splited_message) {

    const login = splited_message[0];
    const pwd = splited_message[1];
    const timestamp = splited_message[2];

    const bdd_pwd = await get_user_pwd(login);
    const hash_pwd = hash(pwd);

    if (loginCheckConditions(login, pwd, timestamp, hash_pwd, bdd_pwd)) {
        return true;
    }

    return false;
}

check_user.get("/getPublic", (req, res) => {

    (async() => {

        const PublicKey = fs.readFileSync("./keys/PuK.txt", {encoding: "utf-8"});
        res.json({public: PublicKey});
    })()
    .catch((e) => {console.log(e); res.json(false)})
    return res;
    
});

check_user.get("/getTime", (req, res) => {

    return res.json({timestamp: Date.now()});
});

check_user.get("/request_auth", (req, res) => {

    const crypted_message = req.query.hash.replaceAll('$2B', '+');

    const PrivateKey = fs.readFileSync("./keys/PvK.txt", {encoding: "utf-8"});

    const key = new nodeRSA(PrivateKey);
    key.setOptions({encryptionScheme: 'pkcs1'});
    const raw_message = sanitize({data: key.decrypt(crypted_message, 'utf8')});

    (async() => {

        const splited_message = raw_message.data.split(":");
        const bdd_auth_result = await check_auth(splited_message);
        const NewToken = randomHex(8);

        if (bdd_auth_result) {

            loggedInUsers.push({'ip': req.headers.origin, token: NewToken});
            console.log(req.headers.origin, " is logged in");
        }
        res.json({auth: bdd_auth_result, token: NewToken});

    })()
    .catch((e) => {console.log(e); res.json(false)})
    return res;
    
});

check_user.get("/redirect", (req, res) => {

    let login_status = false;

    console.log("request redirect ", loggedInUsers);

    (async() => {

        loggedInUsers.forEach((element) => {

            if (req.headers.origin == element.ip) {
                login_status = true;
                console.log(`${req.headers.origin} was already logged, redirect`);
                return true;
            } 
        });
       
        res.json({redirect_response: login_status});
    })()
    .catch((e) => {console.log(e); res.json(false)})
    return res;
    
});

check_user.get("/logout", (req, res) => {

    (async() => {

        loggedInUsers = loggedInUsers.filter((el) => {el == req.headers.origin});
        console.log("log out ", loggedInUsers);
        res.json({status: true});
    })()
    .catch((e) => {console.log(e); res.json(false)})
    return res;
    
});

module.exports = check_user;