function formatDateFR(isoString) {
    const date = new Date(isoString);

    return `le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
}

export { formatDateFR };
