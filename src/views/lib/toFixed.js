module.exports = function (valStr, num) {
    num = (num === undefined ? 2 : num);
    if (isNaN(Number(valStr))) {

        return '';
    }

    var pIndex = valStr.indexOf('.');
    if (0 === num && pIndex === valStr.length - 1) {
        return valStr.substring(0, valStr.length - 1);
    }
    if (pIndex > -1 && (valStr.length - 1) - pIndex > num) {
        return valStr.substring(0, pIndex + num + 1);
    }
    return valStr;
}
