/*
 * JSS v0.2 - JavaScript Stylesheets
 * https://github.com/Box9/jss
 *
 * Copyright (c) 2011, Dai Jun Tang
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */

var jss = (function (doc, undefined) {
    var Jss,
        jss,
        _addRule,
        _addSheet,
        // Shortcuts
        head = doc.head || doc.getElementsByTagName('head')[0],
        styleSheets = doc.styleSheets;
    
    Jss = function (selector) {
        var sheet,
            rules,
            rule,
            i,
            j;
        
        this.rules = [];
        
        for (i = 0; i < styleSheets.length; i++) {
            sheet = styleSheets[i];
            rules = sheet.cssRules || sheet.rules;

            for (j = 0; j < rules.length; j++) {
                rule = rules[j];
                // Warning, selectorText may not be correct in IE<9
                // as it splits ',' into multiple selectors
                if (rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                    // IE<9 support
                    if (!rule.parentStyleSheet) rule.parentStyleSheet = sheet;
                    this.rules.push(rule);
                }
            }
        }
        
        this.selector = selector;
        this.length = this.rules.length;
    };
    
    Jss.prototype = {
        get: function () {
            // Returns static, consolidated map of properties
            var props = {},
                propName,
                i,
                j;
            for (i = 0; i < this.rules.length; i++) {
                for (j = 0; j < this.rules[i].style.length; j++) {
                    propName = this.rules[i].style[j];
                    props[propName] = this.rules[i].style[propName];
                }
            }
            return props;
        },
        set: function (props) {
            if (!props) return this;
            
            var styleNode,
                i,
                rule;
            if (!jss.styleSheet) jss.styleSheet = _addSheet('jss');
            // Find if there's a rule in the jss stylesheet
            for (i = 0; i < this.length; i++) {
                if (this.rules[i].parentStyleSheet === jss.styleSheet) {
                    rule = this.rules[i];
                    break;
                }
            }
            if (!rule) {
                // Add rule
                rule = _addRule(jss.styleSheet, this.selector);
                this.rules.push(rule);
                this.length = this.rules.length;
            }
            // Add props
            for (i in props) {
                if (!props.hasOwnProperty(i)) continue;
                rule.style[i] = props[i];
            }
            return this;
        },
        remove: function () {
            var rule,
                parentSheet,
                rules,
                i,
                j;
            for (i = 0; i < this.rules.length; i++) {
                rule = this.rules[i];
                parentSheet = rule.parentStyleSheet;
                rules = parentSheet.cssRules || parentSheet.rules;
                for (j = 0; j < rules.length; j++) {
                    if (rules[j] === rule) {
                        if (parentSheet.deleteRule) {
                            parentSheet.deleteRule(j);
                        } else if (parentSheet.removeRule) {
                            parentSheet.removeRule(j);
                        }
                    }
                }
            }
            this.rules.length = 0;
            this.length = 0;
            return this;
        }
    };
    
    jss = function (selector, props) {
        var ret = new Jss(selector);
        
        if (props) {
            ret.set(props);
        }
        
        return ret;
    };
    
    jss.fn = Jss.prototype;
    
    _addRule = function (sheet, selector) {
        // Add (empty) rule
        if (sheet.insertRule) {
            sheet.insertRule(selector + ' { }', 0);
        } else if (sheet.addRule) {
            sheet.addRule(selector, null, 0);
        }
        // Get added rule
        if (sheet.cssRules) {
            return sheet.cssRules[0];
        } else {
            return sheet.rules[0];
        }
    };
    
    _addSheet = function () {
        var styleNode,
            i;
        styleNode = doc.createElement('style');
        styleNode.type = 'text/css';
        styleNode.rel = 'stylesheet';
        head.appendChild(styleNode);
        // Get added stylesheet object
        for (i = 0; i < styleSheets.length; i++) {
            if (styleNode === (styleSheets[i].ownerNode
                    || styleSheets[i].owningElement)) {
                return styleSheets[i];
            }
        }
    };

    return jss;
})(document);
