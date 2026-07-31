const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const classify = require("./gmail/classify");
const parse = require("./parsers");
const mergeOrders = require("./orders/merge");

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

app.get("/", (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly"
        ]
    });

    res.send(`<a href="${url}">Sign in with Google</a>`);
});

app.get("/oauth2callback", async (req, res) => {

    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    const response = await gmail.users.messages.list({
    userId: "me",
    q: "category:purchases newer_than:180d",
    maxResults: 100
    });

    const messages = response.data.messages || [];

    console.log("\nLatest Emails\n");

    const parsedEvents = [];

    for (const message of messages) {

        const mail = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "metadata",
            metadataHeaders: [
                "Subject",
                "From",
                "Date"
            ]
        });

        const headers = mail.data.payload.headers;

        const getHeader = (name) =>
            headers.find(h => h.name === name)?.value || "";

        const email = {
            id: message.id,
            subject: getHeader("Subject"),
            from: getHeader("From"),
            date: getHeader("Date"),
            snippet: mail.data.snippet
        };

        email.store = classify(email);

        if (email.store === "unknown")
            continue;

        const parsed = parse(email);

        parsedEvents.push(parsed);
    }



const orders = mergeOrders(parsedEvents);

console.dir(orders, { depth: null });

    res.send("Success! Check your terminal.");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log("Listening:", server.address());
});
