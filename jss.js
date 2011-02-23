/*
 * JSS v0.1 - JavaScript Stylesheets
 * https://github.com/Box9/jss
 *
 * Copyright (c) 2011, Dai Jun Tang
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */

var jss = (function (doc, undefined) {
    var jss,
        head,
        styleSheets;


    // Shortcuts
    head = doc.head || doc.getElementsByTagName('head')[0];
    styleSheets = doc.styleSheets;
    
    jss = function (selector, props) {
        var modified = 0,
            rules,
            i,
            j,
            propName;

        if (props) {
            // Sets properties on the rule
            if (jss.styleSheet) {
                modified = jss.get(selector, jss.styleSheet, 'set', props).length;
            }
            if (!modified) {
                jss.create(selector);
                jss.get(selector, jss.styleSheet, 'set', props);
            }
            return;
        } else {
            // Returns static, consolidated map of properties
            rules = jss.get(selector);
            props = {};
            for (i = 0; i < rules.length; i++) {
                for (j = 0; j < rules[i].style.length; j++) {
                    propName = rules[i].style[j];
                    props[propName] = rules[i].style[propName];
                }
            }
            return props;
        }
    };
    
    jss.get = function (selector, targetSheet, action /*, actionArgs */) {
        if (!styleSheets) return [];
        
        var sheets = styleSheets,
            sheet,
            rules,
            result = [],
            actionRet,
            actionArgs,
            argsStart = 3,
            i,
            j;
        
        // Normalise args
        if (typeof targetSheet == 'string') {
            action = targetSheet;
            argsStart--;
        } else if (targetSheet !== undefined) {
            sheets = [targetSheet];
        }
        actionArgs = Array.prototype.slice.call(arguments, argsStart);
        selector = selector.toLowerCase();

        for (i = 0; i < sheets.length; i++) {
            // Get rules for stylesheet, continue if not available
            sheet = sheets[i];
            rules = sheet.cssRules || sheet.rules;
            if (!rules) continue;

            for (j = 0; j < rules.length; j++) {
                if (rules[j].selectorText.toLowerCase() == selector) {
                    if (action) {
                        actionRet = jss.actions[action]({
                            args: actionArgs,
                            sheet: sheet,
                            rule: rules[j],
                            rulePos: j
                        });
                        result.push(actionRet === undefined ?
                            rules[j] : actionRet);
                    } else {
                        result.push(rules[j]);
                    }
                }
            }
        }

        return result;
    };

    jss.actions = {
        remove: function (o) {
            var sheet = o.sheet,
                pos = o.rulePos;

            if (sheet.deleteRule) {
                sheet.deleteRule(pos);
            } else if (sheet.removeRule) {
                sheet.removeRule(pos);
            }
        },
        set: function (o) {
            var rule = o.rule,
                props = o.args[0];

            if (!props) return;
            for (var i in props) {
                if (!props.hasOwnProperty(i)) continue;
                rule.style[i] = props[i];
            }
        }
    };
    
    jss.create = function (selector) {
        if (!styleSheets) return;
        
        var styleNode,
            i;

        // Create own stylesheet for jss styles
        if (!jss.styleSheet) {
            styleNode = doc.createElement('style');
            styleNode.type = 'text/css';
            styleNode.rel = 'stylesheet';
            styleNode.media = 'screen';
            styleNode.title = 'jss';
            head.appendChild(styleNode);
            // Find stylesheet object
            for (i = 0; i < styleSheets.length; i++) {
                if (styleNode === (styleSheets[i].ownerNode
                        || styleSheets[i].owningElement)) {
                    jss.styleSheet = styleSheets[i];
                }
            }
        }
        
        // Add (empty) rule
        if (jss.styleSheet.insertRule) {
            jss.styleSheet.insertRule(selector + ' { }', 0);
        } else if (jss.styleSheet.addRule) {
            jss.styleSheet.addRule(selector, null, 0);
        }
    };

    return jss;
})(document);
