module('jss');

test('Adding and removing sheets', function () {
    var nSheets = jss._getSheets().length;

    // Add new sheet
    var newSheet = jss._addSheet();
    equal(jss._getSheets().length, nSheets + 1, 'New sheet added');

    // Remove new sheet
    jss._removeSheet(newSheet);
    equal(jss._getSheets().length, nSheets, 'New sheet removed');
});

test('Adding and removing rules', function () {
    // Setup
    var sheet = jss._addSheet();
    var i;

    equal(jss._getRules(sheet).length, 0, 'New sheet has no rules');

    // Add a rule
    var rule = jss._addRule(sheet, '.someRule');
    ok(!!rule.style, 'Rule has a style property');
    equal(jss._getRules(sheet).length, 1, 'New rule added');
    equal(jss._getRules(sheet, '.someRule').length, 1, 'Retrieve new rule with selector');
    equal(jss._getRules(sheet, '.someOtherRule').length, 0, 'Retrieve non-existent rule');

    // Add another rule
    var rule2 = jss._addRule(sheet, '.someOtherRule');
    equal(jss._getRules(sheet).length, 2, 'Sheet has two rules');
    equal(jss._getRules(sheet, '.someOtherRule').length, 1, 'Retrieve second rule with selector');

    // Remove rules
    var rules = jss._getRules(sheet);
    jss._removeRule(rules[0]); // Shifting reference
    equal(jss._getRules(sheet).length, 1, 'First rule removed');
    jss._removeRule(rules[0]); // Shifting reference
    equal(jss._getRules(sheet).length, 0, 'Second rule removed');
});
