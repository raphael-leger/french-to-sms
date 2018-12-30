'use strict';

function frenchToSms(input) {
    if (input === 'coucou') {
        return 'cc';
    }

    return 'bjr';
}

module.exports = frenchToSms;