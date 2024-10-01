export const getTilloBrands = async () => {
    const response = await fetch("https://dev.cert.cash:4002/tillo/brands");
    const responseData = await response.json();   
    console.log("responseData", responseData);
    const brandsObj = responseData.data.brands;
    const keys = Object.keys(brandsObj);
    const brandsArray = keys.map(key => brandsObj[key]);

    return brandsArray;
}
export const getTilloGiftcard = async (brand, currency, value) => {
    const params = {
        brand, 
        currency,
        value
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