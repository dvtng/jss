module('jss-pseudo-selectors', {
    teardown: function() {
        jss.remove();
    }
});

test(':hover', function() {
    jss.set('#jss-test:hover', { 'opacity': '0.5' });
    equal(jss.get('#jss-test:hover')['opacity'], '0.5');
});

test('::before', function() {
    jss.set('#jss-test::before', { 'content': '"before string"', 'opacity': '0.5' });
    ok(/^['"]before string['"]$/.exec(jss.get('#jss-test::before')['content']));
    equal(jss.get('#jss-test::before')['opacity'], '0.5');
});

test('::before when all rules added with JSS are retrieved', function() {
    jss.set('#jss-test::before', { 'content': '"before string"', 'opacity': '0.5' });

    var result = jss.get();
    equal(Object.keys(result).length, 1);
    equal(Object.keys(result['#jss-test::before']).length, 2);
    ok(/^['"]before string['"]$/.exec(result['#jss-test::before']['content']));
    equal(result['#jss-test::before']['opacity'], '0.5');
});

test('::before when rules are retrieved using getAll', function() {
    jss.set('#jss-test::before', { 'content': '"before string"', 'opacity': '0.5' });

    var result = jss.getAll('#jss-test::before');
    equal(Object.keys(result).length, 2);
    ok(/^['"]before string['"]$/.exec(result['content']));
    equal(result['opacity'], '0.5');
});