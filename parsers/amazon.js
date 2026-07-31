function parseAmazon(email) {
    const subject = email.subject.toLowerCase();

    let event = "UNKNOWN";

    if (subject.startsWith("ordered"))
        event = "ORDERED";

    else if (subject.startsWith("shipped"))
        event = "SHIPPED";

    else if (subject.startsWith("out for delivery"))
        event = "OUT_FOR_DELIVERY";

    else if (subject.startsWith("arriving today"))
        event = "OUT_FOR_DELIVERY";

    else if (subject.startsWith("delivered"))
        event = "DELIVERED";

    else if (subject.includes("refund"))
        event = "REFUND";

    else if (subject.includes("return"))
        event = "RETURN";

    let item = null;

    const match = email.subject.match(/["“](.*?)["”]/);

    if (match) {
        item = match[1];
    }

    return {
        platform: "amazon",
        event,
        orderId: null,
        item,
        timestamp: email.date,
        raw: email
    };
}

module.exports = parseAmazon;
