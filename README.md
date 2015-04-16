# Neutron HTML5 Parser #

Here is a small pure-JavaScript HTML5 parser that can run on browsers as well as NodeJS with [jsdom](https://github.com/tmpvar/jsdom).

_Credit goes to John Resig for his [code](http://ejohn.org/blog/pure-javascript-html-parser/) written back in 2008 and Erik Arvidsson for his [code](http://erik.eae.net/simplehtmlparser/simplehtmlparser.js) written piror to that._
This code has been updated to work with HTML 5 to fix several problems.

## Use case

For parsing templates on both client and server side.
This library may soon be used internally in [htmlizer](https://github.com/Munawwar/htmlizer).

For only server-side use case, you may like to use [htmlparser2](https://github.com/fb55/htmlparser2) or [high5](https://github.com/fb55/high5). Note: DOCTYPE gets ignored by htmlparser2.

For only client-side use case, you can look into jQuery.parseHTML() or native DOMParser (IE10+).

## Usage

Add htmlparser.js to head tag or require with nodejs.

### DOM Builder ###

    //Returns DocumentFragment.
    var documentfragment = HTMLtoDOM("<p>Hello <b>World");

    //If doctype is given then returns HTMLDocument
    var doc = HTMLtoDOM("<!DOCTYPE html><htm><body>test</body></html>");

    //on NodeJS
    var factory = require('neutron-html5parser'),
        jsdom = require('jsdom'),
        HTMLtoDOM = factory(jsdom.jsdom('').parentWindow);

While this library doesn’t cover the full gamut of possible weirdness that HTML provides, it does handle a lot of the most obvious stuff. All of the following are accounted for:

**Unclosed Tags:**

    HTMLtoDOM("<p><b>Hello") == '<p><b>Hello</b></p>'
**Empty Elements:**

    HTMLtoDOM("<img src=test.jpg>") == '<img src="test.jpg">'

**Block vs. Inline Elements:**

    HTMLtoDOM("<b>Hello <p>John") == '<b>Hello </b><p>John</p>'
**Self-closing Elements:**

    HTMLtoDOM("<p>Hello<p>World") == '<p>Hello</p><p>World</p>'
**Attributes Without Values:**

    HTMLtoDOM("<input disabled>") == '<input disabled="disabled">'

Following should be supported again in future:
~~A couple points are enforced by this method:~~

~~- There will always be a html, head, body, and title element.~~
~~- There will only be one html, head, body, and title element (if the user specifies more, then will be moved to the appropriate locations and merged).~~
~~link and base elements are forced into the head.~~

### Advanced: SAX-style API ###

Handles tag, text, and comments with callbacks. For example, let’s say you wanted to implement a simple HTML to XML serialization scheme – you could do so using the following:

    var results = "";

    HTMLtoDOM.Parser("<p id=test>hello <i>world", {
      start: function( tag, attrs, unary ) {
        results += "<" + tag;

        for ( var i = 0; i < attrs.length; i++ )
          results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';

        results += ">";
      },
      end: function( tag ) {
        results += "</" + tag + ">";
      },
      chars: function( text ) {
        results += text;
      },
      comment: function( text ) {
        results += "<!--" + text + "-->";
      }
    });

    results == '<p id="test">hello <i>world</i></p>"

### Benchmarking

Benchmark done using [htmlparser-benchmark](https://github.com/AndreasMadsen/htmlparser-benchmark).
```
htmlparser2         : 3.77256 ms/file ± 2.29339
high5               : 4.96011 ms/file ± 2.71494
neutron-html5parser : 5.41695 ms/file ± 3.26307
htmlparser2-dom     : 6.43134 ms/file ± 3.63845
libxmljs            : 7.37534 ms/file ± 9.60274
parse5              : 12.2405 ms/file ± 7.82065
html-parser         : 12.6268 ms/file ± 8.30923
hubbub              : 15.0666 ms/file ± 7.80456
htmlparser          : 28.7801 ms/file ± 178.500
gumbo-parser        : 29.8096 ms/file ± 15.5291
html5               : 196.083 ms/file ± 248.159
sax                 : <Error>
```
