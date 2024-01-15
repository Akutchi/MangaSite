const 	mysql		= 	require("mysql");
const 	fs 			= 	require("fs");
const 	util		=	require("util");
const 	appRoot 	= 	require("app-root-path");
const 	profilesDir	=	appRoot.toString()+"/profiles";

/**
 * Queries a connected database, issueing a promise.
 * `database.query` throws an exception if there is an error.
 * @throws Error
 * @param {database} database database object to query
 * @param {String} query query to send
 * @returns {Promise<Array>} Array of RowDataPackages as a promise
 */
function database_promise_query(database, query) {
	return new Promise((res, rej) => {
		database.query(query, (error, results, fields) => {
			if (error) { rej(error); }
			res(results);
		});
	});
}

/**
 * Returns a new connection with the said profile.
 * @param {String} profile 
 */
function db_connection(profile){

	user_credentials = profile_reader(profile);
		
	return new mysql.createConnection({
		host: "localhost",
		user: user_credentials.username,
		password: user_credentials.password,
		database: "bluesolo"
	});
}

function profile_reader(profile){
	return JSON.parse(fs.readFileSync(`${profilesDir}/${profile}.profile`));
}

/**
 * Class that the client will interpret after a sql request
 * @deprecated
 */
class query_return{
	constructor(message, errorCode=0, errorMessage=''){
		this.message = message;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}
}

/* until here, I reused a previous project */

/*View builder*/

function build_view_count(table) {

	return `SELECT count(${table.slice(0, 3)}ID) AS number FROM ${table}`
}

function build_view_state_manga(manid) {

	return `SELECT MANST FROM MANGA
	WHERE MANID=${manid}`
}

function build_view_state_chapter(manid, chaid) {

	return `SELECT c.CHSTA FROM CHAPTERS AS c
	JOIN MANGA AS m ON m.MANID = c.MANFK
	WHERE m.MANID=${manid} AND c.CHANU=${chaid};`
}


function build_view_explore() {
	return `SELECT man.MANID, man.MANNA, man.MANSU, sta.STANA, e.EXPID FROM MANGA AS man  
	JOIN STATUS_MANGA AS sta ON sta.STAID = man.STAFK
	JOIN EXPLORE AS e ON e.MANFK = man.MANID;`
}

function build_view_authors(manid) {

	return `SELECT aut.AUTNA, aut.AUTSU FROM AUTHORS AS aut
	JOIN WRITTEN_BY AS wri ON wri.AUTID = aut.AUTID
	JOIN MANGA AS m ON m.MANID = wri.MANID 
	WHERE m.MANID="${manid}";` 

}

function build_view_tags(manid) {

	return `SELECT tag.TAGNA FROM TAG AS tag
	JOIN MARQUED_BY AS mar ON mar.TAGID = tag.TAGID
	JOIN MANGA AS m ON m.MANID = mar.MANID 
	WHERE m.MANID=${manid};`

}

function build_view_latest_chapter(manid) {

	return `SELECT cha.CHANU FROM CHAPTERS AS cha
	JOIN MANGA AS m ON m.MANID = cha.MANFK
	WHERE m.MANID=${manid}
	ORDER BY (cha.CHADA) DESC;`

}

function build_view_latest_list() {

	return `SELECT c.CHANU, c.CHADA, m.MANID, m.MANNA FROM MANGA AS m 
	JOIN CHAPTERS AS c ON m.MANID = c.MANFK
	ORDER BY (c.CHADA) DESC;`

}

function build_view_manga(manid) {

	return `SELECT * FROM MANGA AS m
	JOIN YEAR_PUB AS y ON y.YEAID = m.YEAFK
	JOIN STATUS_MANGA AS s ON s.STAID = m.STAFK
	JOIN TYPE_MANGA AS t ON t.TYPID = m.TYPFK
	JOIN MAGAZINE AS ma ON ma.MAGID = m.MAGFK
	WHERE m.MANID=${manid}`

}

function build_view_chapter_manga(manid, chaid) {

	const isChapterFetchFromLatest = (chaid) => {return chaid == 0}
	
	if (isChapterFetchFromLatest(chaid)) {
		return `SELECT c.CHANA, c.CHANU, c.CHAUR FROM CHAPTERS AS c
		JOIN MANGA AS m ON c.MANFK = m.MANID
		WHERE m.MANID=${manid}
		ORDER BY (c.CHADA) DESC`
	}
	
	// fetched from reader
	return `SELECT c.CHANA, c.CHANU, c.CHAUR FROM CHAPTERS AS c
	JOIN MANGA AS m ON c.MANFK = m.MANID
	WHERE m.MANID=${manid} AND c.CHANU=${chaid}`
}


function build_view_hash_for_all_chapters(manid) {

	return `SELECT c.CHANA, c.CHAUR FROM CHAPTERS AS c
	JOIN MANGA AS m ON c.MANFK = m.MANID
	WHERE m.MANID=${manid}
	ORDER BY (c.CHADA) ASC`
}

function build_view_sort(type) {

	const dict = {
					"alphabetically": "m.MANNA",
					"note":			"m.MANNO",
					"team":			"t.TEANA"
	}

	const translation = (type) => {
		try {
			const field = dict[type];
			return field;
		} catch {
			return dict["alphabetical"];
		}
	}

	const additional_fields = (type) => {
		if (type == "team") 
			return `, t.TEANA`
		else if (type == "note")
			return `, m.MANNO`
		
		return ``
	}

	const join_smt = (type) => {
		if (type == "team") 
			return `JOIN HANDLED_BY AS h ON h.MANID = m.MANID JOIN TEAM as t ON t.TEAID = h.TEAID `
		return ``
	}

	return `SELECT m.MANNA, m.MANID ` + additional_fields(type) + ` FROM MANGA AS m ` +
	join_smt(type) +
	`ORDER BY (${translation(type)}) ASC;`

}

/* verify functions */

function build_verify_manga_existence(manga_name) {

	return `SELECT m.MANID FROM MANGA AS m WHERE m.MANNA="${manga_name}";`
}

/* user functions */

function get_user_password(user_login) {

	return `SELECT u.USRPW FROM USERS AS u WHERE u.USRNM = "${user_login}"`;
}

/* helper functions */

function build_chapter_number(obj) {

	if (obj == -1)
		return "Oneshot"
	else if (obj == '?')
		return ""
	
	return `Chapitre ${obj}`
}

/* modify functions */

function modify_explore_table(expid, manid) {

	return `UPDATE EXPLORE SET MANFK=${manid} WHERE EXPID=${expid}`;
}


module.exports = {
	query : database_promise_query,
	new_connection: db_connection,
	builder: {
		view: {
			view_manga:					build_view_manga,
			view_size:					build_view_count,
			view_state_manga:			build_view_state_manga,

			view_manga_chapters:		build_view_chapter_manga,
			view_state_chapter:			build_view_state_chapter,
			view_latest_chapter:		build_view_latest_chapter,
			view_latest:				build_view_latest_list,
			view_hash_for_all_chapters: build_view_hash_for_all_chapters,

			view_explore: 				build_view_explore,
			view_authors:				build_view_authors,
			view_tags:					build_view_tags,

			view_sort:					build_view_sort,
		},

		verify: {
			verify_exist:				build_verify_manga_existence,
		},

		user: {
			get_user_pwd:				get_user_password,
		},

		helper: {
			format_chapter: build_chapter_number,
		},

		modify: {
			explore_table: modify_explore_table,
		}
		
	},
	qreturn: query_return	
};

