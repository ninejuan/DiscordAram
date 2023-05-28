function format(millis) {
    try {
        var s = Math.floor((millis / 1000) % 60);
        var m = Math.floor((millis / (1000 * 60)) % 60);
        var h = Math.floor((millis / (1000 * 60 * 60)) % 24);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return h + ":" + m + ":" + s + " | " + Math.floor((millis / 1000)) + " 초"
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}
module.exports.format = format;