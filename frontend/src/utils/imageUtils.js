export const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) {
        if (url.includes('via.placeholder.com')) {
            return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200';
        }
        return url;
    }
    return `http://localhost:5000${url}`;
};
