'use strict';

const test = require('tape');
const fixtures = require('./fixture.json');
const frenchToSms = require('..');


test('fixtures', t => {
    for (let input in fixtures) {
        const expectedOutput = fixtures[input];
        t.equal(frenchToSms(input), expectedOutput, input);
    }

    t.end()
});
