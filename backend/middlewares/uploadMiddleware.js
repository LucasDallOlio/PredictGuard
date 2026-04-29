import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = process.env.ALLOWED_FILE_TYPES ?
        process.env.ALLOWED_FILE_TYPES.split(',').map(t => t.trim()) :
        ['image/jpeg', 'image/png', 'image/webp'];

    const ok = tiposPermitidos.includes(file.mimetype);
    cb(ok ? null : new Error("Tipo inválido"), ok);
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB por padrão

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSize },
});

export default upload;