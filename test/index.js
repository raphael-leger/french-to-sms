'use strict';

const test = require('tape');
const fixtures = require('./fixture.json');
const frenchToSms = require('..');


test('caseInsensitivity', t => {
    t.equal(frenchToSms('bonjour'), 'bjr', 'bonjour => bjr');
    t.equal(frenchToSms('Bonjour'), 'bjr', 'Bonjour => bjr');
    t.equal(frenchToSms('BonJOur'), 'bjr', 'BonJOur => bjr');

    t.end();
});

test('punctuationInsensitive', t => {
    t.equal(frenchToSms('bonjour'), 'bjr', 'bonjour => bjr');
    t.equal(frenchToSms('bonjour !'), 'bjr!', 'bonjour ! => bjr!');
    t.equal(frenchToSms('bonjour!'), 'bjr!', 'bonjour! => bjr!');

    t.end();
});

test('numbersEffectiveness', t => {
    t.equal(frenchToSms('un'), '1', 'un => 1');
    t.equal(frenchToSms('deux'), '2', 'deux => 2');
    t.equal(frenchToSms('dix-sept'), '17', 'dix-sept => 17');
    t.equal(frenchToSms('quarante'), '40', 'quarante => 40');

    t.end();
});

test('fixtures', t => {
    for (let input in fixtures) {
        const expectedOutput = fixtures[input];
        t.equal(frenchToSms(input), expectedOutput, `${input} => ${expectedOutput}`);
    }

    t.end();
});
