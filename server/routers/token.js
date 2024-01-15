const 	express 	=   require("express");
const   axios       =   require("axios");
const   fs          =   require('fs');

let get_access_token		= 	express.Router();


function writeNewValuesToProfile(data, old_data) {

    const new_profile = old_data[0] + "\n" +
                        old_data[1] + "\n" +
                        old_data[2] + "\n" + 
                        data["access_token"] + "\n" +
                        data["refresh_token"] + "\n"

    fs.writeFile("./imgur_api.txt", new_profile, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
    });

}

async function generateAcessToken(info) {

    var settings = {
    "url": "https://api.imgur.com/oauth2/token",
    "method": "post",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": {
        "refresh_token": info[4],
        "client_id": info[1],
        "client_secret": info[2],
        "grant_type": "refresh_token"
    }
    };

    const response = await axios(settings);
    writeNewValuesToProfile(response["data"], info);
}

function readImgurFile(generationFunction) {

    let imgur_info;

    imgur_info = fs.readFile('./imgur_api.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        imgur_info = data.split("\n");
        generationFunction(imgur_info);
    });

}

get_access_token.get("/", (req, res) => {
    const data = readImgurFile(generateAcessToken);
});


module.exports = get_access_token;