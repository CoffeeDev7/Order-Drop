function mergeOrders(events) {
    const orders = new Map();

    for (const event of events) {

        // Skip events without an orderId for now
        if (!event.orderId)
            continue;

        if (!orders.has(event.orderId)) {
            orders.set(event.orderId, {
                orderId: event.orderId,
                platform: event.platform,
                item: event.item,
                history: []
            });
        }

        const order = orders.get(event.orderId);

        // Keep the first non-null item we find
        if (!order.item && event.item)
            order.item = event.item;

        order.history.push(event);
    }

    return [...orders.values()];
}

module.exports = mergeOrders;
