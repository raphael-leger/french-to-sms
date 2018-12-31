'use strict';

const test = require('tape');
const fixtures = require('./fixture.json');
const frenchToSms = require('..');


test('caseInsensitivity', t => {
    const expectedBonjourOutput = 'bjr';

    t.equal(frenchToSms('bonjour'), expectedBonjourOutput, 'bonjour');
    t.equal(frenchToSms('Bonjour'), expectedBonjourOutput, 'Bonjour');
    t.equal(frenchToSms('BonJOur'), expectedBonjourOutput, 'BonJOur');

    t.end();
});

test('punctuationInsensitive', t => {
    t.equal(frenchToSms('bonjour'), 'bjr', 'bonjour');
    t.equal(frenchToSms('bonjour !'), 'bjr !', 'bonjour !');
    t.equal(frenchToSms('bonjour!'), 'bjr!', 'bonjour!');

    t.end();
});

test('numbersEffectiveness', t => {
    t.equal(frenchToSms('un'), '1', 'un');
    t.equal(frenchToSms('deux'), '2', 'deux');
    t.equal(frenchToSms('dix-sept'), '17', 'dix-sept');
    t.equal(frenchToSms('quarante'), '40', 'quarante');

    t.end();
});

test('accentsInsensitive', t => {

    t.end();
});

test('fixtures', t => {
    for (let input in fixtures) {
        const expectedOutput = fixtures[input];
        t.equal(frenchToSms(input), expectedOutput, `${input} => ${expectedOutput}`);
    }

    t.end();
});

test('completeSentences', t => {
    t.equal(
        frenchToSms(
            `La carotte représente après la pomme de terre le principal légume-racine cultivé dans le monde2. C'est une racine riche en carotène.`
        ),
        'la carote reprézent apré la pom 2 ter lprincipal légum racine cultiV ds lmonde2. cé une racine rich en carotN.'
    );

    t.equal(
        frenchToSms(
            `Le tofu ou fromage de soja est un aliment d'origine chinoise, issu du caillage du lait de soja. C'est une pâte blanche, molle, peu odorante et au goût plutôt neutre, constituant une base importante de l'alimentation asiatique, et aussi consommé par des végétariens et végétaliens occidentaux.`
        ),
        'ltofu ou fromaj 2 soja é 1 alimen dorigine chinoiz, issu du caillaj du lè 2 soja. cé une pate blanch, moll, pE odorante é o goût +to nutr, constituan une baz importante 2 lalimentation asiatik, é o6 consomé par D VGtari1 é VGtali1 occidento.'
    );

    t.equal(
        frenchToSms(
            `L’aubergine est une espèce de plantes de la famille des Solanaceae, originaire d'Asie. Ce sont des plantes herbacées annuelles, largement cultivées pour leurs fruits comestibles comme plantes potagères ou maraîchères. L'espèce a été domestiquée en Asie depuis l'époque préhistorique. Le terme désigne également le fruit.`
        ),
        'lobergine é une spece 2 plante dla fami D solanacea, originR dasi. s st D plante erbacé anuLs, largemen cultiVs pr leurs frui comestib kom plante potagRs ou marèchRs. lépèce a été domestiqué en asi dpui lépok préhistorik. lterm Dsign égalmen lfrui.'
    );

    t.end();
});
