var jss = (function (doc) {
    var jss,
        actions;

    jss = function (name, action) {
        var sheet,
            rules,
            result = [],
            actionRet,
            actionArgs = Array.prototype.slice.call(arguments, 2),
            i,
            j;

        name = name.toLowerCase();

        if (doc.styleSheets) {
            for (i = 0; i < doc.styleSheets.length; i++) {
                // Get rules for stylesheet, continue if not available
                sheet = doc.styleSheets[i];
                rules = sheet.cssRules || sheet.rules;
                if (!rules) continue;

                for (j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText.toLowerCase() == name) {
                        if (action) {
                            actionRet = actions[action]({
                                args: actionArgs,
                                sheet: sheet,
                                rule: rules[j],
                                rulePos: j
                            });
                            if (actionRet != null) result.push(actionRet);
                        } else {
                            result.push(rules[j]);
                        }
                    }
                }
            }
        }

        return result;
    };

    actions = {
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

    return jss;
})(document);
