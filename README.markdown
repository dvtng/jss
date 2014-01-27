# JSS v0.3

A simple JavaScript library for getting/setting CSS stylesheet rules.

* Tiny - ~250 lines of code.
* No dependencies.
* MIT Licensed.

## Usage

Download and include `jss.js` in your HTML:

    <script type="text/javascript" src="jss.js"></script>

Add new rule (or extend existing rule):

    jss.set('.special', {
        color: 'red',
        fontSize: '2em',
        padding: '10px'
    });

Retrieve existing rule:

    jss.get('.special');

    // Returns:
    {
        'color': 'red',
        'font-size': '2em',
        'padding-bottom': '10px',
        'padding-left': '10px',
        'padding-right': '10px',
        'padding-top': '10px'
    }

Remove existing rule:

    jss.remove('.special');

## Why generate CSS with JS?

* To set styles that must be calculated or retrieved - for example, setting the user's preferred font-size or color from a cookie.
* To set behavioural, rather than aesthetic, styles (especially for UI widget/plugin developers). Tabs, carousels, tooltips, etc. often require some basic CSS simply to function. Users of the code should not be *forced* to include a stylesheet for core functionality. Eye-candy CSS, of course, should still be added through regular stylesheets.
* It's better than inline styles since CSS rules apply to all current and future elements, and don't clutter the HTML when viewing in Firebug / Developer Tools.
