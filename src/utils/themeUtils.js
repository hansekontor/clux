export const resolveThemeColor = (theme, colorProp) => {
    if (!colorProp) return "inherit";

    // Support nested paths like "text.primary" or "grey.500"
    const path = colorProp.split(".");
    let value = theme.color;

    for (let key of path) {
        if (!value || !value[key]) return colorProp; // fallback to raw value
        value = value[key];
    }

    return value;
};