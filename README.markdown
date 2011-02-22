# JSS v0.1

A simple JavaScript library for manipulating CSS stylesheets.

* No dependencies.
* Can be used with any CSS selector or property that the browser understands.
* MIT Licensed.

## Usage

Download and include `jss.js` in your HTML:

    <script type="text/javascript" src="jss.js"></script>

Add new or extend existing rule:

    jss('.special', {
        color: 'red',
        fontSize: '2em',
        padding: '10px'
    });

Retrieve existing rule:

    jss('.special');

    // Returns:
    {
        'color': 'red',
        'font-size': '2em',
        'padding-bottom': '10px',
        'padding-left': '10px',
        'padding-right': '10px',
        'padding-top': '10px'
    }

## Why use dynamically generated CSS?

**Calculated/retrieved styles**

Adding styles using JavaScript gives you full flexibility over where the values come from. Client-side user settings, such as `font-size`, can be retrieved from `localStorage` or a cookie, and applied to all relevant elements on a page.

**Behavioural styles**

Many reusable UI components require behavioural, rather than aesthetic, CSS styles. For example, drop-downs, dialogs and tooltips require `position: absolute` to work, slideshows require `overflow: hidden`, and tabs and accordions require non-active panels to have `display: none`.

Without these styles the components won't even work, and so they should be included as part of the component, instead of having an additional stylesheet dependency. Eye-candy CSS, however, should be added on top of this, as a regular stylesheet.

**Why not just use inline styles, like jQuery's `css()`?**

JS-generated inline styles are great for adding element-specific styles such as `top/left` for a tooltip, but they only clutter the HTML for more generic styles during debugging. Styles added using JSS go into their own dynamically-generated stylesheet.

Inline styles also need to be re-applied for any dynamically generated content.
