# JSS

A simple JavaScript library for retrieving and setting CSS stylesheet rules.

* Tiny - only 4KB minified
* No dependencies
* MIT Licensed
* Supports FF, Chrome, Safari, Opera, and IE9+

Why generate CSS with JavaScript?

* To set styles that need to be calculated or retrieved
* To set behavioural styles for your widget or plugin so that consumers aren't forced to include a stylesheet for core functionality
* To dynamically apply styles without cluttering your HTML (as is the case with inline styles)
* To set styles on all current and future elements

## Usage

Download and include `jss.js` (or the minified file) in your HTML:

    <script type="text/javascript" src="jss.js"></script>

If your project uses Bower for package management you can run the following command instead:

    bower install jss

**jss.set(selector, properties)** to add a new rule or extend an existing rule:

    jss.set('.demo', {
        'font-size': '15px',
        'color': 'red'
    });

**jss.get([selector])** to retrieve rules added via JSS:

    jss.get('.demo');
    // returns the following:
    {
        'font-size': '15px',
        'color': 'red'
    }
    
    jss.get();
    // returns the following:
    {
        '.demo': {
            'font-size': '15px',
            'color': 'red'
        }
    }
    

**jss.getAll(selector[,sheetname])** to retrieve all rules that are specified using the selector (not necessarily added via JSS):

    jss.getAll('.demo'); // search through whole CSS stack
    // returns the following:
    {
        'font-size': '15px',
        'color': 'red',
        'font-weight': 'bold'
    }
    
    jss.getAll('.demo','this_file_only.css'); // search only the given CSS file (which must be included in the page)

**jss.remove([selector])** to remove rules added via JSS:

    jss.remove('.demo'); // removes all JSS styles matching the selector
    jss.remove();        // removes all JSS styles
