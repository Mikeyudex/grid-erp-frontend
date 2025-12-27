export const measureTextWidth = (text, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return 0;

    context.font = font;
    return context.measureText(text).width;
};