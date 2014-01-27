/*
 * JSS v0.3 - JavaScript Stylesheets
 * https://github.com/Box9/jss
 *
 * Copyright (c) 2011, David Tang
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */
var jss = (function(undefined) {
    var adjSelAttrRgx = /((?:\.|#)[^\.\s#]+)((?:\.|#)[^\.\s#]+)/g;

	function getRules(sheet, selector) {
		var rules = sheet.cssRules || sheet.rules || [];
		var results = [];
        // Browsers report selectors in lowercase - TODO check how true this is cross-browser
		selector = selector.toLowerCase();
		for (var i = 0; i < rules.length; i++) {
			// IE8 will split comma-delimited selectors into multiple rules, breaking our matching
			var selectorText = rules[i].selectorText;
			// Note - certain rules (e.g. @rules) don't have selectorText
            if (selectorText && (selectorText == selector || selectorText == swapAdjSelAttr(selector))) {
            	results.push({
            		sheet: sheet,
            		index: i,
            		style: rules[i].style
            	});
            }
		}
		return results;
	}

	function addRule(sheet, selector) {
        var rules = sheet.cssRules || sheet.rules || [];
        var index = rules.length;
        if (sheet.insertRule) {
            sheet.insertRule(selector + ' { }', index);
        } else if (sheet.addRule) {
            sheet.addRule(selector, null, index);
        }
        return {
        	sheet: sheet,
        	index: index,
        	style: rules[index].style
        };
    };

    function removeRule(rule) {
        var sheet = rule.sheet;
        if (sheet.deleteRule) {
            sheet.deleteRule(rule.index);
        } else if (sheet.removeRule) {
            sheet.removeRule(rule.index);
        }
    }

	function extend(dest, src) {
		for (var key in src) {
			if (!src.hasOwnProperty(key))
				continue;
			dest[key] = src[key];
		}
		return dest;
	}

	function aggregateStyles(rules) {
		var aggregate = {};
		for (var i = 0; i < rules.length; i++) {
			extend(aggregate, declaredProperties(rules[i].style));
		}
		return aggregate;
	}

	function declaredProperties(style) {
		var declared = {};
		for (var i = 0; i < style.length; i++) {
			declared[style[i]] = style[style[i]];
		}
		return declared;
	}

	// IE9 stores rules with attributes (classes or ID's) adjacent in the opposite order as defined
    // causing them to not be found, so this method swaps [#|.]sel1[#|.]sel2 to become [#|.]sel2[#|.]sel1
    function swapAdjSelAttr(selector) {
        var swap = '';
        var lastIndex = 0;
            
        while ((match = adjSelAttrRgx.exec(selector)) != null) {
            if (match[0] === '')
            	break;
            swap += selector.substring(lastIndex, match.index);
            swap += selector.substr(match.index + match[1].length, match[2].length);
            swap += selector.substr(match.index, match[1].length);
            lastIndex = match.index + match[0].length;
        }
        swap += selector.substr(lastIndex);
        
        return swap;
    };

	var Jss = function(doc) {
        this.doc = doc;
        this.head = this.doc.head || this.doc.getElementsByTagName('head')[0];
        this.sheets = this.doc.styleSheets || [];
    };

    Jss.prototype = {
    	get: function(selector) {
    		return this.defaultSheet ? aggregateStyles(getRules(this.defaultSheet, selector)) : {};
    	},
    	getAll: function(selector) {
    		var properties = {};
    		for (var i = 0; i < this.sheets.length; i++) {
    			extend(properties, aggregateStyles(getRules(this.sheets[i], selector)));
    		}
    		return properties;
    	},
    	set: function(selector, properties) {
    		if (!this.defaultSheet) {
    			this.defaultSheet = this._createSheet();
    		}
    		var rules = getRules(this.defaultSheet, selector);
    		if (!rules.length) {
    			rules = [addRule(this.defaultSheet, selector)];
    		}
    		for (var i = 0; i < rules.length; i++) {
    			extend(rules[i].style, properties);
    		}
    	},
    	remove: function(selector) {
    		if (!this.defaultSheet)
    			return;
    		var rules = getRules(this.defaultSheet, selector);
    		for (var i = 0; i < rules.length; i++) {
    			removeRule(rules[i]);
    		}
    		return rules.length;
    	},
    	_createSheet: function() {
			var styleNode = this.doc.createElement('style');
	        styleNode.type = 'text/css';
	        styleNode.rel = 'stylesheet';
	        this.head.appendChild(styleNode);
	        return this._getSheetForNode(styleNode);
    	},
    	_getSheetForNode: function(node) {
	        for (var i = 0; i < this.sheets.length; i++) {
	            if (node === this._getNodeForSheet(this.sheets[i])) {
	                return this.sheets[i];
	            }
	        }
	        return null;
    	},
    	_getNodeForSheet: function(sheet) {
            return sheet.ownerNode || sheet.owningElement;
    	}
    };

    var exports = new Jss(document);
    exports.forDocument = function(doc) {
    	return new Jss(doc);
    };
    return exports;
})();