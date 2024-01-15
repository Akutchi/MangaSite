SHA = {
    "explore": 			"6f2811",
    "latest":  			"5e1e2b",
    "information":    	"96bac4",
	"reader":			"3d0941",
    'all':     			"103a52",
	'user':				"04f899",
}

STATE_CODES = {

	// explore-check kept for historical reasons but unsued
	explore: {
		"explore-check": 		`Error 401-${SHA["explore"]} Unauthorized`,
		"explore-get":			`Error 404-${SHA["explore"]} Not%20Found`,
	},

	latest: {
		"latest-get":			`Error 404-${SHA["latest"]} Not%20Found`,
	},

	information: {
		"information-check":	`Error 401-${SHA["information"]} Unauthorized`,
		"information-get":  	`Error 404-${SHA["information"]} Not%20Found`,
	},

    all: {
        "teapot":               `EasterEgg 418-${SHA["all"]} I'm%20a%20teapot`,
        "continue":             `Information 102-${SHA["all"]} Processing`,
		"good":					`Success 201-${SHA["all"]} Created`,
		"broken":				`Broken 500-${SHA["all"]} Internal%20Server20Error`
    },

	user:  {
		"users-get":			`Broken 500-${SHA["user"]} Internal%20Server20Error`,
	},

    BadRequest: (sha) => {return `Error 400-${sha} Bad%20Request`},
}

CHECK_TYPE = {
	isVisible: (param) => { return param == 0; },
	isParamNaN: (param) => { return (Number.isNaN(param)) },
	isParamOverflow: (param, max) => { return (param < 1 || param > max) },
	isParamTeapot: (param) => {return (param == "Teapot") },
}

/**
 * Check validity of the parameter sent to the server.
 * This is the base check, which means that it is used
 * in every router.
 * @param 	{route} 	route the route to be checked
 * @param 	{options} 	options the parameters to be checked
 * @returns {Promise} 	A http-like status-code
 */
async function check_type_base(route, options) {

    options.forEach(param => {
    
        if (CHECK_TYPE.isParamTeapot(param)) return Promise.reject(STATE_CODES.all.teapot);

        param = parseInt(param);
        if (CHECK_TYPE.isParamNaN(param)) return Promise.reject(STATE_CODES.BadRequest(SHA[route]));

    });

    return Promise.resolve(STATE_CODES.all.good);
}

/**
 * Check validity of the parameters sent to the manga route.
 * @param 	{db} 		db an object representing the database connection
 * @param 	{sql} 		sql an object with every prebuild query in it.
 * @param 	{route} 	route the route to be checked
 * @param 	{options} 	options the parameters to be checked
 * @returns {Promise} 	A http-like status-code
 */
async function check_type_manga(db, sql, route, options) {
    
    let param = options.param;

    const max_nb = (await sql.query(db, sql.builder.view.view_size("MANGA")))[0].number;

    if (CHECK_TYPE.isParamOverflow(param, max_nb)) return Promise.reject(STATE_CODES.BadRequest(SHA[route]));

    const state_visible = (await sql.query(db, sql.builder.view.view_state_manga(param)))[0].MANST;

    if (CHECK_TYPE.isVisible(state_visible)) return Promise.reject(STATE_CODES[route][route+"-check"]);

    return Promise.resolve(STATE_CODES.all.good);
}

/**
 * Check validity of the parameters sent to the chapter route.
 * @param {db} 			db an object representing the database connection
 * @param {sql} 		sql an object with every prebuild query in it.
 * @param {route} 		route the route to be checked
 * @param {options} 	options the parameters to be checked
 * @returns {Promise} 	A http-like status-code
 */
async function check_type_chapter(db, sql, route, options) {

    let manid = options.p1;
	let chaid = options.p2;

	const q_view_chapters = sql.builder.view.view_manga_chapters(manid, 0);
	let chapter_array = [];
	(await sql.query(db, q_view_chapters)).forEach(element => {chapter_array.push(element.CHANU)});

	if (chapter_array.find(e => e == chaid) === undefined) return Promise.reject(STATE_CODES.BadRequest(SHA[route]));

	const state_visible = (await sql.query(db, sql.builder.view.view_state_chapter(manid, chaid)))[0].CHSTA;
    if (CHECK_TYPE.isVisible(state_visible)) return Promise.reject(STATE_CODES[route][route+"-check"]);

    return Promise.resolve(STATE_CODES.all.good);
}

/**
 * Create the http-like status code.
 * @param 	{router} 	router The router to be used
 * @param 	{err} 		err error object
 * @returns {Promise} 	A http-like status-code
 */
function state_creation(router, err) {

	let state = {};
	console.error("["+router+"] router. [Exception] =>", err.replace(new RegExp("%20", 'g'), " "));
	const parts = err.split(" ");
	state.type = parts[1].split("-")[0];
	state.endpoint = parts[1].split("-")[1];
	state.message = parts[2].replace(new RegExp("%20", 'g'), " ");

	return state;
}

module.exports = {
    STATES: STATE_CODES,
    ROUTE_SHA: SHA,
    TYPE: CHECK_TYPE,
    state_managment: state_creation,
	base_check: check_type_base,
	manga_check: check_type_manga,
	chapter_check: check_type_chapter,
}