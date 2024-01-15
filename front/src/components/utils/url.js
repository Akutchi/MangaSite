const PROD = false;

const EXPLORE = "manga/explore";
const LATEST = "manga/latest";
const VERIFY_USER = "check_login";
const MANGA_INFO_WITH_ID = "manga/info?id=";
const ALPHABET_SORT = "sort/alphabet";

function getURL() {

    if (PROD) return "https://projetweb.ovh:3080/";

    return "http://localhost:3080/";

}

module.exports = {

    getURL: getURL,
    VERIFY_USER: VERIFY_USER,
    EXPLORE: EXPLORE,
    LATEST: LATEST,
    MANGA_INFO_ID: MANGA_INFO_WITH_ID,
    ALPHABET_SORT: ALPHABET_SORT

}