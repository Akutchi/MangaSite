const crypto		= 	require("crypto");

const SANITIZE_DEBUG	=	false;

/* this was reused from a previous project */

/**
 * Returns a SHA-256-hashed password in Hexadecimals
 * @param {String} password To hash
 * @returns Password hash
 */
function hash_password(password){
	return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Sanitizes a string in order to make them inoffensive for the SQL database.
 * @param {String} str 
 */
function sanitize(str){

	const replaceMap = {
		"\"" 	: 	"\\\"",
		"'" 	:	"''",
	}

	for(char in replaceMap){
		str = str.replaceAll(char, replaceMap[char]);
	}

	return str;
}

/**
 * Recursive function that sanitizes a request
 * All fields are browsed and sanitized if needed
 * @param {JSON} req request JSON object
 */
function sanitize_request(req){


	for(key in req){
		if(!req.hasOwnProperty(key)) return; 
		

		if(typeof(req[key]) == "object") req[key] = sanitize_request(req[key]);

		else if(typeof(req[key]) == "string"){	
			req[key] = sanitize(req[key]);
			if(SANITIZE_DEBUG) console.log(`[Security] Sanitizing ${key}`)
		}
		
	}

	return req;
}

/**
 * Checks if a user is connected
 * @param {String} uuid
 */
function isConnected(uuid){
	return global.connected_users.has(uuid); 
}

/**
 * @param {String} uuid 
 * @returns {Boolean} True if uuid has admin privileges
 */
function isAdmin(uuid){
	return global.connected_users.get(uuid).privilege === "administrator";
}

/**
 * 
 * @param {*} uuid 
 * @returns 
 */
function isValidator(uuid){
	return global.connected_users.get(uuid).privilege === "validator" || isAdmin(uuid);
}

/**
 * @param {String} uuid 
 * @returns True if uuid has editor privileges
 */
function isEditor(uuid){
	return global.connected_users.get(uuid).privilege === "editor" || isValidator(uuid);
}

module.exports = {
	hash: hash_password,
	sanitize: sanitize_request,
	connected: isConnected,
	admin: isAdmin,
	validator: isValidator,
	editor: isEditor,
}