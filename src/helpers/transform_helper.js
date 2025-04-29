

export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    if (string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const transformToCamelCase = (string) => {
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : capitalizeFirstLetter(word);
    }).replace(/\s+/g, '');
};

export const homologateRole = (role) => {
    if (!role) return 'Usuario';
    role = role.toLowerCase();
    if (role === 'admin') return 'Administrador';
    if (role === 'user') return 'Usuario';
    if (role === 'default') return 'Default';
    if (role === 'agent') return 'Agente';
    if (role === 'support') return 'Agente de soporte';
    if (role === 'root') return 'Super usuario';
    return 'Usuario';
};