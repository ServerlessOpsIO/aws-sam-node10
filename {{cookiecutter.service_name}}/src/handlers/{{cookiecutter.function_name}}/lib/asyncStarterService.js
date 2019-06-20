function stripWhitespaces(message) {
    return new Promise((resolve, reject) => {
        setImmediate(() => resolve(message.replace(/\s/g,'')));
    });
}

module.exports = {
    stripWhitespaces
};