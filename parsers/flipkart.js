function parseFlipkart(email) {

    const subject = email.subject;

    let event = "UNKNOWN";

    if (/Your Order for/i.test(subject))
        event = "ORDERED";

    else if (/has been shipped/i.test(subject))
        event = "SHIPPED";

    else if (/has been delivered/i.test(subject))
        event = "DELIVERED";

    else if (/return request/i.test(subject))
        event = "RETURN";

    else if (/refund amount/i.test(subject))
        event = "REFUND";

    else if (/Update on your Order/i.test(subject))
        event = "STATUS_UPDATE";

    // -------------------------
    // Extract Order ID
    // -------------------------

    const orderMatch =
        (email.snippet + " " + subject)
            .match(/OD\d{15,}/);

    const orderId =
        orderMatch ? orderMatch[0] : null;

    // -------------------------
    // Extract Item
    // -------------------------

    let item = null;

    let match =
        subject.match(
            /^Your Order for (.*?) has been successfully placed$/i
        );

    if (match)
        item = match[1];

    if (!item) {

        match =
            subject.match(
                /^(.*?) from your order has been/i
            );

        if (match)
            item = match[1];
    }

    if (!item) {

        match =
            subject.match(
                /^The refund amount for your (.*?) order/i
            );

        if (match)
            item = match[1];
    }

    if (!item) {

        match =
            subject.match(
                /^Your return request for (.*?) has been accepted/i
            );

        if (match)
            item = match[1];
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
