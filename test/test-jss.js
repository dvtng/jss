module('jss');

test('Adding and removing sheets', function () {
    strictEqual(jss._getSheet(jss), null, 'Default jss sheet is null at first');
    
    var newSheet = jss._addSheet(jss);
    ok(typeof newSheet == 'object' && newSheet !== null, 'Add new sheet');
    
    var defSheet = jss._getSheet(jss);
    ok(typeof defSheet == 'object' && defSheet !== null, 'Default jss sheet added');
    
    jss._removeSheet(jss);
    strictEqual(jss._getSheet(jss), null, 'Default jss sheet removed');
});

test('Add CSS to the default jss sheet', function () {
    // Shorthand for adding a rule to the default jss sheet
    jss('.special', {
        'color': 'red'
    });
    equal($('.special').css('color'), 'red', 'Add color red');
    
    // Equivalent, expanded syntax
    jss('.special', jss).add('background-color', '#aaa');
    equal($('.special').css('background-color'), '#aaa', 'Add background-color');
    
    // .set() only works if the rule exists
    jss('#no', jss).set('color', 'yellow');
    equal($('#no').css('color'), 'red', "Element's color hasn't changed");
    
    jss('#yes', jss).add();
    jss('#yes', jss).set('color', 'yellow');
    equal($('#yes').css('color'), 'yellow', "Element's color has changed");
    
    // Cleanup
    jss._removeSheet(jss);
});

test('Switching stylesheets', function () {
    // To be determined...
});