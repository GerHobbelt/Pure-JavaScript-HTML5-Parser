/*global describe, it*/

var assert = require("assert"),
    fs = require('fs'),
    factory = require('../htmlparser.js'),
    jsdom = require('jsdom'),
    HTMLtoDOM = factory(jsdom.jsdom('').parentWindow);

describe('run HTMLtoDOM test', function () {
    var html = fetch('test/test.html'),
        doc = HTMLtoDOM(html);
    it('it should have two nodes - doctype and html tag', function () {
        assert.equal(2, doc.childNodes.length);
    });
    it('html tag should have two child elements - head and body tag', function () {
        assert.equal(2, doc.childNodes[1].children.length);
    });
});

/*Utility functions*/
function fetch(pathToTextFile) {
    return fs.readFileSync(pathToTextFile, {encoding: 'utf8'});
}
