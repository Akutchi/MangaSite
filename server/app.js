/*Includes*/
const 	express 		=	require("express");
const 	cors			= 	require("cors")
const 	uuid			=	require("uuid").v4;
const 	session 		=	require("express-session");	// Session management
const 	https 			= 	require('https');
const	fs 				= 	require('fs');
const	NodeRSA			= 	require('node-rsa');

/*Constants*/
const 	app		= 	express();
const 	port 	= 	process.env.PORT || 3080;
const PROD = false;

const KEY_PATH = "./keys/";
const DOMAIN_NAME_CRT_PATH  = "";

/*Routers*/
const get_manga 	=	require('./routers/get_manga');
const sort 			=	require("./routers/sort");
const get_images 	=	require("./routers/get_images");
const get_chapters	= 	require("./routers/get_chapters");
const check_login	= 	require("./routers/check_user");
const admin			=	require('./routers/admin');

function generateAndWriteKeys() {
	const key = new NodeRSA();
	key.generateKeyPair(4096, 17);
	const PuK = key.exportKey('public');
	const PvK = key.exportKey('private');

	fs.writeFile(KEY_PATH+"config.txt", "Do not modify or erease this file", (err) => {});
	fs.writeFile(KEY_PATH+"PuK.txt", PuK, (err) => {});
	fs.writeFile(KEY_PATH+"PvK.txt", PvK, (err) => {});
}

/* Generate keys */

if (!fs.existsSync(KEY_PATH+"config.txt")) {
	generateAndWriteKeys();
}

/*Allow CORS*/

if(PROD){

	app.use(cors({
		origin: '*',
		methods: ["GET", "POST"],
		credentials: true /*Access-Control-Allow-Credentials*/
	}))  

} else {

	app.use(cors({
		origin: `*`,
		methods: ["GET", "POST"],
		credentials: true /*Access-Control-Allow-Credentials*/
	})) 
}

app.use(session({
	genid: (req)=>{
		console.log("Generating new UUID")
		return uuid();
	 },
	secret: 'azdefrgthy', /*To change to be random*/
	resave: false,
	cookie: {path: "/" , maxAge: 60*60*1000},
	saveUninitialized: true
}));

/* Routers to be used: */
app.use("/", (req, res, next)=>{
	console.log("[App] ", req.method, `[${req.session.id}]`);
	next();
});

app.use(express.json());
app.use("/images", get_images);
app.use("/manga", get_manga);
app.use("/chapters", get_chapters);
app.use("/sort", sort);
app.use("/login", check_login);
app.use("/admin", admin);


if (PROD) {
	https.createServer({
		key: fs.readFileSync(PRIVATE_KEY_PATH),
		cert: fs.readFileSync(DOMAIN_NAME_CRT_PATH),
	}, app).listen(port, function(){
	console.log("Express server listening on port " + port);
	});
	
} else {
	app.listen(port, ()=>{
		setTimeout(() => {console.log("on localhost:"+port)}, 500);	
	})
}

