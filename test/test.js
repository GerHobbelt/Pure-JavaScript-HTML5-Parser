/*global describe, it*/

var assert = require("assert"),
    fs = require('fs'),
    factory = require('../htmlparser.js'),
    jsdom = require('jsdom'),
    HTMLtoDOM = factory(jsdom.jsdom('').parentWindow);

describe('run consolidated HTMLtoDOM test', function () {
    var html = fetch('test/multiple.html'),
        doc = HTMLtoDOM(html);
    it('it should have two nodes - doctype and html tag', function () {
        assert.equal(2, doc.childNodes.length);
    });
    it('html tag should have two child elements - head and body tag', function () {
        assert.equal(2, doc.childNodes[1].children.length);
    });
});

describe('run element and text test', function () {
    var html = fetch('test/element-and-text.html'),
        df = HTMLtoDOM(html);
    it('it should have exactly one tag', function () {
        assert.equal(1, df.childNodes.length);
    });
    it('it should be a div', function () {
        assert.equal('DIV', df.firstChild.nodeName);
    });
    it('class attribute of div should be "blah"', function () {
        assert.equal('blah', df.firstChild.getAttribute('class'));
    });
    it('div tag should have one text node inside with text "Test"', function () {
        assert.equal(1, df.firstChild.childNodes.length);
        assert.equal(3, df.firstChild.firstChild.nodeType);
        assert.equal('Test', df.firstChild.firstChild.nodeValue);
    });
});

/*Utility functions*/
function fetch(pathToTextFile) {
    return fs.readFileSync(pathToTextFile, {encoding: 'utf8'});
}
