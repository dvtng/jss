/*
 * JSS 1.0 - JavaScript Stylesheets
 * https://github.com/Box9/jss
 *
 * Copyright (c) 2011, David Tang
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */

var jss = (function (undefined) {
    var jss,
        jssInit,
        Jss,
        // Shortcuts
        doc = document,
        head = doc.head || doc.getElementsByTagName('head')[0],
        sheets = doc.styleSheets;
    
    jss = function () {
        return jssInit.apply(null, arguments);
    };
    
    jss.dfault = null;
    
    
    // Core functions for manipulating stylesheets
    
    jss._sheetToNode = function (sheet) {
        return sheet.ownerNode || sheet.owningElement;
    };
    
    jss._nodeToSheet = function (node) {
        var result = null,
            i;
        
        for (i = 0; i < sheets.length; i++) {
            if (node === jss._sheetToNode(sheets[i])) {
                result = sheets[i];
                break;
            }
        }
        
        return result;
    };
    
    jss._getSheets = function (sheetSelector) {
        var results = [],
            node,
            i;
        
        if (!sheetSelector) {
            results = sheets;
        } else if (typeof sheetSelector == 'number') {
            results = [sheets[sheetSelector]];
        } else if (typeof sheetSelector == 'object') {
            if (sheetSelector.href) {
                for (i = 0; i < sheets.length; i++) {
                    node = jss._sheetToNode(sheets[i]);
                    if (sheetSelector.href && node.href == sheetSelector.href ||
                        sheetSelector.title && node.title == sheetSelector.title) {
                        results.push(sheets[i]);
                    }
                }
            }
        }
        
        return results;
    };
    
    jss._addSheet = function () {
        var styleNode = doc.createElement('style'),
            i;
        
        styleNode.type = 'text/css';
        styleNode.rel = 'stylesheet';
        head.appendChild(styleNode);
        
        return jss._nodeToSheet(styleNode);
    };
    
    jss._removeSheet = function (sheet) {
        var node = jss._sheetToNode(sheet);
        node.parentNode.removeChild(node);
    };
    
    jss._getRules = function (sheet, selector) {
        if (!selector) return sheet.cssRules || sheet.rules;
        
        var results = [],
            rules = jss._getRules(sheet),
            rule,
            i;
        
        for (i = 0; i < rules.length; i++) {
            rule = rules[i];
            // Warning, selectorText may not be correct in IE<9
            // as it splits selectors with ',' into multiple rules
            if (rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                // IE<9 support
                if (!rule.parentStyleSheet)
                    rule.parentStyleSheet = sheet;
                
                results.push(rule);
            }
        }
        
        return results;
    };
    
    jss._addRule = function (sheet, selector) {
        var rule = null;
        
        // Add (empty) rule
        if (sheet.insertRule) {
            sheet.insertRule(selector + ' { }', 0);
        } else if (sheet.addRule) {
            sheet.addRule(selector, null, 0);
        }
        
        // Get added rule
        if (sheet.cssRules) {
            rule = sheet.cssRules[0];
        } else {
            rule = sheet.rules[0];
        }
        
        // IE<9 support
        if (rule && !rule.parentStyleSheet)
            rule.parentStyleSheet = sheet;
        
        return rule;
    };
    
    jss._removeRule = function (rule) {
        var parentSheet = rule.parentStyleSheet;
        if (parentSheet.deleteRule) {
            parentSheet.deleteRule(rule);
        } else if (parentSheet.removeRule) {
            parentSheet.removeRule(rule);
        }
    };
    
    
    // Object structure for some code candy
    
    
    return jss;
})();