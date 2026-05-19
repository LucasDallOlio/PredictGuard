const normalizeDateTime = (value) => {
    if (!value) return value;

    if (value instanceof Date && Number.isFinite(value.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        const year = value.getFullYear();
        const month = pad(value.getMonth() + 1);
        const day = pad(value.getDate());
        const hour = pad(value.getHours());
        const minute = pad(value.getMinutes());
        const second = pad(value.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    return value;
};

export default normalizeDateTime;
