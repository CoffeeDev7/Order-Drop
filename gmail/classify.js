
function classify(email) {
    const from = email.from.toLowerCase();
    const subject = email.subject.toLowerCase();

    if (from.includes("amazon"))
        return "amazon";

    if (from.includes("flipkart"))
        return "flipkart";

    if (from.includes("ajio"))
        return "ajio";

    if (from.includes("myntra"))
        return "myntra";

    if (from.includes("bewakoof"))
        return "bewakoof";

    if (from.includes("nykaa"))
        return "nykaa";

    if (subject.includes("souled store"))
        return "souled-store";

    return "unknown";
}

module.exports = classify;

