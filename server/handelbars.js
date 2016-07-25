/**
 * Created by amine on 02/05/16.
 */
//Here we register helpers for Handlebars rendering of the page
//Usefuls middleware for dynamic HTML rendering


function registerHelperEval(hbs){
    hbs.registerHelper('eval', function (expr, options) {
        var reg = new RegExp("\\${(\\S+)}", "g");
        var compiled = expr.replace(reg, function (match, pull) {
            return options.hash[pull];
        });
        var evaluated = eval(compiled);
        return evaluated;
    });
}
exports.registerHelperEval = registerHelperEval;

function registerHelperStringify(hbs){
    hbs.registerHelper('stringify', function (expr, options) {
        return JSON.stringify(expr);
    })
}
exports.registerHelperStringify = registerHelperStringify;

function registerHelperSize(hbs){
    hbs.registerHelper('size', function (obj) {
        if (typeof obj != "object") return;
        var size = 0
            , key;
        for (key in obj) {
            size++;
        }
        return size;
    });
}
exports.registerHelperSize = registerHelperSize;

function registerHelperDebug(hbs){
    hbs.registerHelper('debug', function (value) {
        console.log('=================================');
        console.log('Context: ', this);
        console.log('Value: ', JSON.stringify(value, null, 4));
        console.log('=================================');
    });
}
exports.registerHelperDebug = registerHelperDebug;
