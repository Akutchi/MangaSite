const fs = require('fs');

const PATH_TO_FRONTPAGES = "../../images_couv/";
const EXTENSION = ".jpg";

/**
 *  Encode an image to be send to the client in base64
 * @param {pathToImage} pathToImage the path to the image to be encoded
 * @returns {String} the encoded image
 */
function encodeBase64(pathToImage) {
    
    const image = fs.readFileSync(pathToImage); 
    const imageBase64 = new Buffer.from(image).toString('base64');

    return imageBase64;
}

module.exports = {

    base64: encodeBase64,
    path_to_images: PATH_TO_FRONTPAGES,
    extension: EXTENSION
}
