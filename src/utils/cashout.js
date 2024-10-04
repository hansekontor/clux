export const getTilloOptions = async () => {
    const response = await fetch("https://dev.cert.cash:4002/tillo/currencies");
    const tilloOptions = await response.json();

    return tilloOptions;
}

export const getTilloBrands = async (country, currency, amount) => {
    const params = new URLSearchParams({country, currency, amount}).toString();
    const response = await fetch("https://dev.cert.cash:4002/tillo/brands?" + params);
    const tilloBrands = await response.json();   

    return tilloBrands;
}
export const getTilloGiftcard = async (brand, currency, amount) => {
    const params = {
        brand, 
        currency,
        value: amount
    };
    const keys = Object.keys(params);
    const query = keys.map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    const baseUrl = "https://dev.cert.cash:4002/tillo/cashout?";
    const url = baseUrl + query;
    console.log("url", url);

    const response = await fetch(url);

    const giftcard = await response.json();
    const link = giftcard.data.url;

    return link;
}