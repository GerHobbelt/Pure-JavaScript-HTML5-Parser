# Pure JavaScript HTML5 Parser #

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
 
    HTMLtoDOM.HTMLParser("<p id=test>hello <i>world", {
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
