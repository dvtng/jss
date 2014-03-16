module('jss', {
    teardown: function() {
        jss.remove();
    }
});

test('get retrieves styles from the JSS stylesheet', function() {
    var result = jss.get('#qunit-fixture');
    equal(Object.keys(result).length, 0);

    jss.set('#qunit-fixture', { 'color': 'red', 'font-size': '20px' });
    result = jss.get('#qunit-fixture');
    equal(Object.keys(result).length, 2);
    equal(result['color'], 'red');
    equal(result['font-size'], '20px');
});

test('getAll also retrieves styles not part of the JSS stylesheet', function() {
    var result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 1);
    equal(result['display'], 'none');

    jss.set('#qunit-fixture', { 'color': 'red', 'font-size': '20px' });
    result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 3);
    equal(result['color'], 'red');
    equal(result['font-size'], '20px');
    equal(result['display'], 'none');
});

test('remove only removes styles added to the JSS stylesheet', function() {
    jss.set('#qunit-fixture', { 'color': 'red', 'font-size': '20px' });
    var result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 3);

    jss.remove();
    result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 1);
    equal(result['display'], 'none');
});

test('calling remove with a selector only removes styles added to the JSS stylesheet', function() {
    jss.set('#qunit-fixture', { 'color': 'red', 'font-size': '20px' });
    var result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 3);

    jss.remove('#qunit-fixture');
    result = jss.getAll('#qunit-fixture');
    equal(Object.keys(result).length, 1);
    equal(result['display'], 'none');
});

test('calling remove with a selector only removes styles for that selector', function() {
    jss.set('#qunit-fixture', { 'color': 'red' });
    jss.set('#alternative-element', { 'color': 'blue' });
    equal(jss.get('#qunit-fixture')['color'], 'red');
    equal(jss.get('#alternative-element')['color'], 'blue');

    jss.remove('#qunit-fixture');
    equal(Object.keys(jss.get('#qunit-fixture')).length, 0);
    equal(jss.get('#alternative-element')['color'], 'blue');
});