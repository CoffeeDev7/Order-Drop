function parseFlipkart(email) {
    const subject = email.subject.toLowerCase();
    const snippet = email.snippet.toLowerCase();

    let event = "UNKNOWN";

    if (subject.includes("successfully placed"))
        event = "ORDERED";

    else if (subject.includes("has been shipped"))
        event = "SHIPPED";

    else if (subject.includes("has been delivered"))
        event = "DELIVERED";

    else if (subject.includes("return request"))
        event = "RETURN";

    else if (snippet.includes("refund initiated"))
        event = "REFUND";

    let orderId = null;

    const orderMatch = email.snippet.match(/Order ID\s+(OD\d+)/i);

    if (orderMatch)
        orderId = orderMatch[1];

    let item = null;

    if (subject.includes("for")) {
        item = subject.split("for")[1].trim();
    }

    return {
        platform: "flipkart",
        event,
        orderId,
        item,
        timestamp: email.date,
        raw: email
    };
}

module.exports = parseFlipkart;
