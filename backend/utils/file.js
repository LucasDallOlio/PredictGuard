import fs from 'fs';
import path from 'path';

async function deleteFile(nomeDoArquivo) {
    const uploadPath = process.env.UPLOAD_PATH || '';
    const filePath = path.join(uploadPath, nomeDoArquivo);

    try {
        await fs.promises.unlink(filePath);
        return true;
    } catch (err) {
        if (err && err.code === 'ENOENT') {
            return false;
        }

        console.error('Erro ao excluir:', err);
        return false;
    }
}

export {
    deleteFile
}