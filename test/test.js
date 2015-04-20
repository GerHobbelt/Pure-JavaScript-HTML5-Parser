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

describe('run element and text test - 01-simple.html', function () {
    var html = fetch('test/01-simple.html'),
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

describe('run self-closing tag test - 07-self-closing.html', function () {
    var html = fetch('test/07-self-closing.html'),
        df = HTMLtoDOM(html);
    it('root should have exactly 2 immediate children', function () {
        assert.equal(2, df.childNodes.length);
    });
    it('first child should be a anchor tag', function () {
        assert.equal('A', df.firstChild.nodeName);
    });
    it('anchor tag href atrribute should be http://test.com/', function () {
        assert.equal('http://test.com/', df.firstChild.attributes.href.value);
    });
    it('anchor tag should have child text node with "Foo" as it\'s value', function () {
        assert.equal('Foo', df.firstChild.firstChild.nodeValue);
    });
    it('second child should be a hr tag', function () {
        assert.equal('HR', df.childNodes[1].nodeName);
    });
});

describe('run isolated less than angle bracket - 15-lt-whitespace.html', function () {
    var html = fetch('test/15-lt-whitespace.html'),
        df = HTMLtoDOM(html);
    it('it should have exactly one child', function () {
        assert.equal(1, df.childNodes.length);
    });
    it('it should be a text node with "a < b"', function () {
        assert.equal('a < b', df.firstChild.nodeValue);
    });
});

/*Utility functions*/
function fetch(pathToTextFile) {
    return fs.readFileSync(pathToTextFile, {encoding: 'utf8'});
}
