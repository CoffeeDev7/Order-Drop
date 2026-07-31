const parseAmazon = require("./amazon");
const parseFlipkart = require("./flipkart");

function parse(email) {
    switch (email.store) {
        case "amazon":
            return parseAmazon(email);

        case "flipkart":
            return parseFlipkart(email);

        default:
            return email;
    }
}

module.exports = parse;
