function parseBetween(firstTag, secondTag, value) {
    var firstTagBegin = value.indexOf(firstTag);
    var firstTagLength = firstTag.length;
    var firstTagEnd = firstTagBegin + firstTagLength;
    var secondTagBegin = value.indexOf(secondTag, firstTagEnd);
    return value.substring(firstTagEnd, secondTagBegin);
}
exports.parseBetween = parseBetween;
