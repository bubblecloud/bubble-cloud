/**
 * Parses substring between given begin string and end string.
 * @param beginString the begin string
 * @param endString the end string
 * @param originalString the original string
 * @returns the substring or null if either tag is not found
 */
export function parseBetween(beginString, endString, originalString): string {
    var beginIndex: number = originalString.indexOf(beginString);
    if (beginIndex === -1) {
        return null;
    }
    var beginStringLength: number = beginString.length;
    var substringBeginIndex: number = beginIndex + beginStringLength;
    var substringEndIndex: number = originalString.indexOf(endString, substringBeginIndex);
    if (substringEndIndex === -1) {
        return null;
    }
    return originalString.substring(substringBeginIndex, substringEndIndex);
}