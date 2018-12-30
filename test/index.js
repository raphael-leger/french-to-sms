'use strict';

const test = require('tape');
const fixtures = require('./fixture.json');
const frenchToSms = require('..');


test('caseInsensitivity', t => {
    const expectedBonjourOutput = 'bjr';

    t.equal(frenchToSms('bonjour'), expectedBonjourOutput, 'bonjour');
    t.equal(frenchToSms('Bonjour'), expectedBonjourOutput, 'Bonjour');
    t.equal(frenchToSms('BonJOur'), expectedBonjourOutput, 'BonJOur');

    t.end()
});

test('punctuationInsensitive', t => {
    t.equal(frenchToSms('bonjour'), 'bjr', 'bonjour');
    t.equal(frenchToSms('bonjour !'), 'bjr !', 'bonjour !');
    t.equal(frenchToSms('bonjour!'), 'bjr!', 'bonjour!');

    t.end()
});

test('numbersEffectiveness', t => {
    t.equal(frenchToSms('un'), '1', 'un');
    t.equal(frenchToSms('deux'), '2', 'deux');
    t.equal(frenchToSms('dix-sept'), '17', 'dix-sept');
    t.equal(frenchToSms('quarante'), '40', 'quarante');

    t.end()
});

test('accentsInsensitive', t => {

    t.end()
});

test('fixtures', t => {
    for (let input in fixtures) {
        const expectedOutput = fixtures[input];
        t.equal(frenchToSms(input), expectedOutput, input);
    }

    t.end()
});
