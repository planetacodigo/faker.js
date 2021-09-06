// since we are requiring the top level of faker, load all locales by default
var Faker = require('./lib');
var faker = new Faker({ locale: 'es_MX' });
module['exports'] = faker;