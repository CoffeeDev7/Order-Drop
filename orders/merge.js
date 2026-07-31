function mergeOrders(events) {

    const orders = new Map();

    for (const event of events) {

        // Skip events that couldn't be parsed
        if (!event.platform)
            continue;

        // Use orderId if available, otherwise fall back to platform+item
        const key =
            event.orderId ||
            `${event.platform}:${event.item}`;

        if (!orders.has(key)) {

            orders.set(key, {
                id: key,
                orderId: event.orderId,
                platform: event.platform,
                item: event.item,

                latestEvent: null,
                status: null,

                history: []
            });

        }

        const order = orders.get(key);

        // Keep first good item
        if (!order.item && event.item)
            order.item = event.item;

        order.history.push(event);

    }

    // Sort events chronologically
    for (const order of orders.values()) {

        order.history.sort(
            (a, b) =>
                new Date(a.timestamp) -
                new Date(b.timestamp)
        );

        order.latestEvent =
            order.history.at(-1).event;

        order.status =
            order.latestEvent;

    }

    return [...orders.values()];
}

module.exports = mergeOrders;
