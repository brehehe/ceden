/**
 * 
 * This Script Take from this
 */

/* - lang.js - */
// http://www.fbi.gov/portal_javascripts/lang.js?original=1
function oc(a) {
    var o = {};
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = ''
    }
    return o
}
var VALID_LANGS = oc([
    "en",
    "id",
    "ja",
    "de",
    "zh-CN",
    "zh-TW",
    "ar",
    "ko"
/**
    "af",
    "sq",
    "ar",
    "be",
    "bg",
    "ca",
    "zh-CN",
    "zh-TW",
    "hr",
    "cs",
    "da",
    "nl",
    "et",
    "tl",
    "fi",
    "fr",
    "gl",
    "de",
    "el",
    "ht",
    "iw",
    "hi",
    "hu",
    "is",
    "id",
    "ga",
    "it",
    "ja",
    "ko",
    "lv",
    "lt",
    "mk",
    "ms",
    "mt",
    "no",
    "fa",
    "pl",
    "pt",
    "ro",
    "ru",
    "sr",
    "sk",
    "sl",
    "es",
    "sw",
    "sv",
    "th",
    "tr",
    "uk",
    "vi",
    "cy",
    "yi"
**/
]);
var lang = navigator.language;
if (typeof (lang) == "string") {
    if (lang.length > 2) {
        lang = lang.substring(0, 2)
    }
    if (lang in VALID_LANGS) {
    }
}
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'id'}, 'google_translate_element')
}
(function (jQuery) {
    jQuery(document).ready(function () {
        // jQuery('.bahasaalert').prepend('<div id="google_translate_element"></div>');
        jQuery('.bahasaalert').append('<div id="google_translate_element"></div>');
        (function () {
            var trans = document.createElement('script');
            trans.type = 'text/javascript';
            trans.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(trans, s)
        })()
    })
})(jQuery);
