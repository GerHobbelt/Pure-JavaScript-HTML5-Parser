/*global describe, it*/

var assert = require("assert"),
    fs = require('fs'),
    factory = require('../htmlparser.js'),
    jsdom = require('jsdom'),
    HTMLtoDOM = factory(jsdom.jsdom('').parentWindow);

describe('run consolidated HTMLtoDOM test - multiple.html', function () {
    var html = fetch('test/multiple.html'),
        doc = HTMLtoDOM(html);
    it('it should have two nodes - doctype and html tag', function () {
        assert.equal(2, doc.childNodes.length);
    });
    it('html tag should have two child elements - head and body tag', function () {
        assert.equal(2, doc.childNodes[1].children.length);
    });
});



describe('run element and text test - 01-simple.json', function () {
    runJSONTest('test/01-simple.json');
});

describe('run self-closing tag test - 07-self-closing.json', function () {
    runJSONTest('test/07-self-closing.json');
});

describe('run isolated less than angle bracket - 15-lt-whitespace.json', function () {
    runJSONTest('test/15-lt-whitespace.json');
});

/*Utility functions*/
function fetch(pathToTextFile) {
    return fs.readFileSync(pathToTextFile, {encoding: 'utf8'});
}

function runJSONTest(filePath) {
    var json = JSON.parse(fetch(filePath)),
        next = 0,
        meta = json.expected[next++];

    var handlers = {
        start: function (tagName, attrs, unary) {
            if (!meta) {
                throw new Error('More nodes than expected');
            }
            //it() calls seems to be running asyncronously. So make a closure to current test.
            var exp = meta;
            it('next should be an open tag event', function () {
                assert.equal('opentag', exp.event);
            });

            it('it should be \'' + exp.data[0] + '\' tag', function () {
                assert.equal(exp.data[0], tagName);
            });

            it('it should have ' + (exp.data.length - 1) + ' number of attrbute(s)', function () {
                assert.equal(exp.data.length - 1, attrs.length);
            });

            exp.data.slice(1).forEach(function (expAttr, index) {
                it('attribute number ' + (index + 1) +'\'s name should be ' + expAttr[0], function () {
                    assert.equal(expAttr[0], attrs[index].name);
                });
                it('attribute number ' + (index + 1) +'\'s value should be ' + expAttr[1], function () {
                    assert.equal(expAttr[1], attrs[index].value);
                });
            });

            meta = json.expected[next++]; //Increment
        },
        end: function (tagName) {
            if (!meta) {
                throw new Error('More nodes than expected');
            }
            //it() calls seems to be running asyncronously. So make a closure to current test.
            var exp = meta;
            it('next should be a close tag event', function () {
                assert.equal('closetag', exp.event);
            });

            it('it should be \'' + exp.data[0] + '\' tag', function () {
                assert.equal(exp.data[0], tagName);
            });

            meta = json.expected[next++]; //Increment
        },
        chars: function (text) {
            if (!meta) {
                throw new Error('More nodes than expected');
            }
            //it() calls seems to be running asyncronously. So make a closure to current test.
            var exp = meta;
            it('next should be a text event ', function () {
                assert.equal('text', exp.event);
            });

            it('it should have value ' + exp.data[0], function () {
                assert.equal(exp.data[0], text);
            });

            meta = json.expected[next++]; //Increment
        },
        comment: function (text) {
            if (!meta) {
                throw new Error('More nodes than expected');
            }
            //it() calls seems to be running asyncronously. So make a closure to current test.
            var exp = meta;
            it('next should be a comment event ', function () {
                assert.equal('comment', exp.event);
            });

            it('it should have value ' + exp.data[0], function () {
                assert.equal(exp.data[0], text);
            });

            meta = json.expected[next++]; //Increment
        }
    };

    HTMLtoDOM.Parser(json.html, handlers);
}
