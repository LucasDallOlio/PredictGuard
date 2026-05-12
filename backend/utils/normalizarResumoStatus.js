const normalizarResumoStatus = (linhas = [], chave, fallback = 'Indefinido') => {
    return linhas.reduce((acc, item) => {
        const valorStatus = item?.[chave] ?? fallback;
        acc[valorStatus] = Number(item?.count ?? 0);
        return acc;
    }, {});
};

export default normalizarResumoStatus;
