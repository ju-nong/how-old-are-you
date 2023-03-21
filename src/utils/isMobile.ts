export default () =>
    navigator.userAgent.match(/ipad|iphone/i) !== null ||
    navigator.userAgent.match(/Android/i) !== null;
