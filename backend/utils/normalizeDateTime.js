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

const normalizeTimezone = (value) => {
    const raw = String(value || '').trim();

    if (!raw) {
        return 'local';
    }

    if (raw === 'local' || raw === 'Z') {
        return raw;
    }

    const match = raw.match(/^([+-]?)(\d{1,2}):(\d{2})$/);

    if (!match) {
        return 'local';
    }

    const sign = match[1] === '+' ? '+' : '-';
    const hours = match[2].padStart(2, '0');
    const minutes = match[3];

    return `${sign}${hours}:${minutes}`;
};

export { normalizeDateTime, normalizeTimezone };
