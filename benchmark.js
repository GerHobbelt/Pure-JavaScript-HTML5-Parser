var benchmark = require('htmlparser-benchmark');
var HTMLtoDOM = require("./htmlparser.js");

var bench = benchmark(function (html, callback) {
    var noop = function () {};
    HTMLtoDOM.Parser(html, {
        start: noop,
        end: noop,
        chars: noop,
        comment: noop,
        doctype: noop
    });

    callback(null, 'Great');
});

bench.on('progress', function (key) {
    console.log('finished parsing ' + key + '.html');
});

bench.on('result', function (stat) {
    console.log(stat.mean().toPrecision(6) + ' ms/file ± ' + stat.sd().toPrecision(6));
});
