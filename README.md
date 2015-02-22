# What's this? #

Here is a small pure-JavaScript HTML5 parser that can run on browsers as well as NodeJS with [jsdom](https://github.com/tmpvar/jsdom).

_Credit goes to John Resig for his [code](http://ejohn.org/blog/pure-javascript-html-parser/) written back in 2008 and Erik Arvidsson for his [code](http://erik.eae.net/simplehtmlparser/simplehtmlparser.js) written piror to that._
This code has been updated to work with HTML 5 to fix several problems.

## Usage 

Add htmlparser.js to head tag or require with nodejs.

### DOM Builder ###

    //Returns DocumentFragment.
    var documentfragment = HTMLtoDOM("<p>Hello <b>World");
    
    //If doctype is given then returns HTMLDocument
    var doc = HTMLtoDOM("<!DOCTYPE html><htm><body>test</body></html>");

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
htmlparser2                     : 3.96784 ms/file ± 2.40647
high5                           : 5.06843 ms/file ± 2.82274
htmlparser2-dom                 : 6.91778 ms/file ± 5.43420
libxmljs                        : 7.58246 ms/file ± 9.68441
neutron-html5parser             : 11.7770 ms/file ± 29.4669
parse5                          : 12.3944 ms/file ± 7.95640
html-parser                     : 13.0493 ms/file ± 8.41101
hubbub                          : 15.6221 ms/file ± 8.30366
gumbo-parser                    : 30.6424 ms/file ± 15.7503
htmlparser                      : 31.3679 ms/file ± 185.629
html5                           : 199.505 ms/file ± 251.290
sax                             : <Error>
```
