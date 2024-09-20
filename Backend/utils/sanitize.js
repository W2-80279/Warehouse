exports.sanitizeData = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/[,.]/g, '').trim();
};
