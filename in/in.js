var _inJ_value_default = "";
var _inJ_value_inside = "";

// add body margin to ?. 
// responsive ??

function _inJ() {
    console.log("jQuery loaded");
    _$ = jQuery;
    // do load onclick
    _$(document).on("click tap touchstart", function (e) {
        // console.log(e.target);
        _inJ_click_value = _$(e.target).html(); // or var clickedBtnID = this.id
        console.log(_inJ_click_value);
        // html ok
        if (_$(e.target).is("img")) {
            // change modal image
            console.log("Target is image");
        } else if (_$(e.target).is("a")) {
            console.log("Target is a href");
        } else {
            _inJ_cch = (_inJ_click_value.match(/<div/g) || []).length;
            console.log(_inJ_cch);
            if (_inJ_cch < 1) {
                _inJ_value = prompt("Rubah Content", _inJ_click_value);
                if (_inJ_value === null) {
                    return; //break out of the function early
                }
                _$(e.target).html(_inJ_value);
            }
        }
    });
}

if (typeof jQuery == 'undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    jqTag.onload = _inJ;
    headTag.appendChild(jqTag);
} else {
    _inJ();
}
