(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.faker = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// since we are requiring the top level of faker, load all locales by default
var Faker = require('./lib');
var faker = new Faker({ locale: 'es_MX' });
module['exports'] = faker;
},{"./lib":19}],2:[function(require,module,exports){
/**
 *
 * @namespace faker.address
 */
function Address (faker) {
  var f = faker.fake,
    Helpers = faker.helpers;

  /**
   * Generates random zipcode from format. If format is not specified, the
   * locale's zip format is used.
   *
   * @method faker.address.zipCode
   * @param {String} format
   */
  this.zipCode = function(format) {
    // if zip format is not specified, use the zip format defined for the locale
    if (typeof format === 'undefined') {
      var localeFormat = faker.definitions.address.postcode;
      if (typeof localeFormat === 'string') {
        format = localeFormat;
      } else {
        format = faker.random.arrayElement(localeFormat);
      }
    }
    return Helpers.replaceSymbols(format);
  }

  /**
   * Generates random zipcode from state abbreviation. If state abbreviation is
   * not specified, a random zip code is generated according to the locale's zip format.
   * Only works for locales with postcode_by_state definition. If a locale does not
   * have a postcode_by_state definition, a random zip code is generated according
   * to the locale's zip format.
   *
   * @method faker.address.zipCodeByState
   * @param {String} state
   */
  this.zipCodeByState = function (state) {
    var zipRange = faker.definitions.address.postcode_by_state[state];
    if (zipRange) {
      return faker.datatype.number(zipRange);
    }
    return faker.address.zipCode();
  }

  /**
   * Generates a random localized city name. The format string can contain any
   * method provided by faker wrapped in `{{}}`, e.g. `{{name.firstName}}` in
   * order to build the city name.
   *
   * If no format string is provided one of the following is randomly used:
   *
   * * `{{address.cityPrefix}} {{name.firstName}}{{address.citySuffix}}`
   * * `{{address.cityPrefix}} {{name.firstName}}`
   * * `{{name.firstName}}{{address.citySuffix}}`
   * * `{{name.lastName}}{{address.citySuffix}}`
   * * `{{address.cityName}}` when city name is available
   *
   * @method faker.address.city
   * @param {String} format
   */
  this.city = function (format) {
    var formats = [
      '{{address.cityPrefix}} {{name.firstName}}{{address.citySuffix}}',
      '{{address.cityPrefix}} {{name.firstName}}',
      '{{name.firstName}}{{address.citySuffix}}',
      '{{name.lastName}}{{address.citySuffix}}'
    ];

    if (!format && faker.definitions.address.city_name) {
      formats.push('{{address.cityName}}');
    }

    if (typeof format !== "number") {
      format = faker.datatype.number(formats.length - 1);
    }

    return f(formats[format]);

  }

  /**
   * Return a random localized city prefix
   * @method faker.address.cityPrefix
   */
  this.cityPrefix = function () {
    return faker.random.arrayElement(faker.definitions.address.city_prefix);
  }

  /**
   * Return a random localized city suffix
   *
   * @method faker.address.citySuffix
   */
  this.citySuffix = function () {
    return faker.random.arrayElement(faker.definitions.address.city_suffix);
  }

  /**
   * Returns a random city name
   * 
   * @method faker.address.cityName
   */
  this.cityName = function() {
    return faker.random.arrayElement(faker.definitions.address.city_name);
  }

  /**
   * Returns a random localized street name
   *
   * @method faker.address.streetName
   */
  this.streetName = function () {
    var result;
    var suffix = faker.address.streetSuffix();
    if (suffix !== "") {
      suffix = " " + suffix
    }

    switch (faker.datatype.number(1)) {
      case 0:
        result = faker.name.lastName() + suffix;
        break;
      case 1:
        result = faker.name.firstName() + suffix;
        break;
    }
    return result;
  }

  //
  // TODO: change all these methods that accept a boolean to instead accept an options hash.
  //
  /**
   * Returns a random localized street address
   *
   * @method faker.address.streetAddress
   * @param {Boolean} useFullAddress
   */
  this.streetAddress = function (useFullAddress) {
    if (useFullAddress === undefined) { useFullAddress = false; }
    var address = "";
    switch (faker.datatype.number(2)) {
      case 0:
        address = Helpers.replaceSymbolWithNumber("#####") + " " + faker.address.streetName();
        break;
      case 1:
        address = Helpers.replaceSymbolWithNumber("####") +  " " + faker.address.streetName();
        break;
      case 2:
        address = Helpers.replaceSymbolWithNumber("###") + " " + faker.address.streetName();
        break;
    }
    return useFullAddress ? (address + " " + faker.address.secondaryAddress()) : address;
  }

  /**
   * streetSuffix
   *
   * @method faker.address.streetSuffix
   */
  this.streetSuffix = function () {
    return faker.random.arrayElement(faker.definitions.address.street_suffix);
  }

  /**
   * streetPrefix
   *
   * @method faker.address.streetPrefix
   */
  this.streetPrefix = function () {
    return faker.random.arrayElement(faker.definitions.address.street_prefix);
  }

  /**
   * secondaryAddress
   *
   * @method faker.address.secondaryAddress
   */
  this.secondaryAddress = function () {
    return Helpers.replaceSymbolWithNumber(faker.random.arrayElement(
      [
        'Apt. ###',
        'Suite ###'
      ]
    ));
  }

  /**
   * county
   *
   * @method faker.address.county
   */
  this.county = function () {
    return faker.random.arrayElement(faker.definitions.address.county);
  }

  /**
   * country
   *
   * @method faker.address.country
   */
  this.country = function () {
    return faker.random.arrayElement(faker.definitions.address.country);
  }

  /**
   * countryCode
   *
   * @method faker.address.countryCode
   * @param {string} alphaCode default alpha-2
   */
  this.countryCode = function (alphaCode) {
    
    if (typeof alphaCode === 'undefined' || alphaCode === 'alpha-2') {
      return faker.random.arrayElement(faker.definitions.address.country_code);
    }

    if (alphaCode === 'alpha-3') {
      return faker.random.arrayElement(faker.definitions.address.country_code_alpha_3);
    }
      
    return faker.random.arrayElement(faker.definitions.address.country_code);

  }

  /**
   * state
   *
   * @method faker.address.state
   * @param {Boolean} useAbbr
   */
  this.state = function (useAbbr) {
    return faker.random.arrayElement(faker.definitions.address.state);
  }

  /**
   * stateAbbr
   *
   * @method faker.address.stateAbbr
   */
  this.stateAbbr = function () {
    return faker.random.arrayElement(faker.definitions.address.state_abbr);
  }

  /**
   * latitude
   *
   * @method faker.address.latitude
   * @param {Double} max default is 90
   * @param {Double} min default is -90
   * @param {number} precision default is 4
   */
  this.latitude = function (max, min, precision) {
    max       = max || 90
    min       = min || -90
    precision = precision || 4

    return faker.datatype.number({
      max: max,
      min: min,
      precision: parseFloat((0.0).toPrecision(precision) + '1')
    }).toFixed(precision);
  }

  /**
   * longitude
   *
   * @method faker.address.longitude
   * @param {Double} max default is 180
   * @param {Double} min default is -180
   * @param {number} precision default is 4
   */
  this.longitude = function (max, min, precision) {
    max       = max || 180
    min       = min || -180
    precision = precision || 4

    return faker.datatype.number({
      max: max,
      min: min,
      precision: parseFloat((0.0).toPrecision(precision) + '1')
    }).toFixed(precision);
  }

  /**
   *  direction
   *
   * @method faker.address.direction
   * @param {Boolean} useAbbr return direction abbreviation. defaults to false
   */
  this.direction = function (useAbbr) {
    if (typeof useAbbr === 'undefined' || useAbbr === false) {
      return faker.random.arrayElement(faker.definitions.address.direction);
    }
    return faker.random.arrayElement(faker.definitions.address.direction_abbr);
  }

  this.direction.schema = {
    "description": "Generates a direction. Use optional useAbbr bool to return abbreviation",
    "sampleResults": ["Northwest", "South", "SW", "E"]
  };

  /**
   * cardinal direction
   *
   * @method faker.address.cardinalDirection
   * @param {Boolean} useAbbr return direction abbreviation. defaults to false
   */
  this.cardinalDirection = function (useAbbr) {
    if (typeof useAbbr === 'undefined' || useAbbr === false) {
      return (
        faker.random.arrayElement(faker.definitions.address.direction.slice(0, 4))
      );
    }
    return (
      faker.random.arrayElement(faker.definitions.address.direction_abbr.slice(0, 4))
    );
  }

  this.cardinalDirection.schema = {
    "description": "Generates a cardinal direction. Use optional useAbbr boolean to return abbreviation",
    "sampleResults": ["North", "South", "E", "W"]
  };

  /**
   * ordinal direction
   *
   * @method faker.address.ordinalDirection
   * @param {Boolean} useAbbr return direction abbreviation. defaults to false
   */
  this.ordinalDirection = function (useAbbr) {
    if (typeof useAbbr === 'undefined' || useAbbr === false) {
      return (
        faker.random.arrayElement(faker.definitions.address.direction.slice(4, 8))
      );
    }
    return (
      faker.random.arrayElement(faker.definitions.address.direction_abbr.slice(4, 8))
    );
  }

  this.ordinalDirection.schema = {
    "description": "Generates an ordinal direction. Use optional useAbbr boolean to return abbreviation",
    "sampleResults": ["Northwest", "Southeast", "SW", "NE"]
  };

  this.nearbyGPSCoordinate = function(coordinate, radius, isMetric) {
    function randomFloat(min, max) {
      return Math.random() * (max-min) + min;
    }
    function degreesToRadians(degrees) {
      return degrees * (Math.PI/180.0);
    }
    function radiansToDegrees(radians) {
      return radians * (180.0/Math.PI);
    }
    function kilometersToMiles(miles) {
      return miles * 0.621371;
    }
    function coordinateWithOffset(coordinate, bearing, distance, isMetric) {
      var R = 6378.137; // Radius of the Earth (http://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html)
      var d = isMetric ? distance : kilometersToMiles(distance); // Distance in km

      var lat1 = degreesToRadians(coordinate[0]); //Current lat point converted to radians
      var lon1 = degreesToRadians(coordinate[1]); //Current long point converted to radians

      var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d/R) +
                Math.cos(lat1) * Math.sin(d/R) * Math.cos(bearing));

      var lon2 = lon1 + Math.atan2(
        Math.sin(bearing) * Math.sin(d/R) * Math.cos(lat1),
        Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2));

      // Keep longitude in range [-180, 180]
      if (lon2 > degreesToRadians(180)) {
        lon2 = lon2 - degreesToRadians(360);
      } else if (lon2 < degreesToRadians(-180)) {
        lon2 = lon2 + degreesToRadians(360);
      }

      return [radiansToDegrees(lat2), radiansToDegrees(lon2)];
    }

    // If there is no coordinate, the best we can do is return a random GPS coordinate.
    if (coordinate === undefined) {
      return [faker.address.latitude(), faker.address.longitude()]
    }
    radius = radius || 10.0;
    isMetric = isMetric || false;

    // TODO: implement either a gaussian/uniform distribution of points in cicular region.
    // Possibly include param to function that allows user to choose between distributions.

    // This approach will likely result in a higher density of points near the center.
    var randomCoord = coordinateWithOffset(coordinate, degreesToRadians(Math.random() * 360.0), radius, isMetric);
    return [randomCoord[0].toFixed(4), randomCoord[1].toFixed(4)];
  }

  /**
     * Return a random time zone
     * @method faker.address.timeZone
     */
  this.timeZone = function() {
    return faker.random.arrayElement(faker.definitions.address.time_zone);
  }

  return this;
}

module.exports = Address;

},{}],3:[function(require,module,exports){
/**
 *
 * @namespace faker.animal
 */
var Animal = function (faker) {
  var self = this;

  /**
   * dog
   *
   * @method faker.animal.dog
   */
  self.dog = function() {
    return faker.random.arrayElement(faker.definitions.animal.dog);
  };
  /**
   * cat
   *
   * @method faker.animal.cat
   */
  self.cat = function() {
    return faker.random.arrayElement(faker.definitions.animal.cat);
  };
  /**
   * snake  
   *
   * @method faker.animal.snake
   */
  self.snake = function() {
    return faker.random.arrayElement(faker.definitions.animal.snake);
  };
  /**
   * bear  
   *
   * @method faker.animal.bear
   */
  self.bear = function() {
    return faker.random.arrayElement(faker.definitions.animal.bear);
  };
  /**
   * lion  
   *
   * @method faker.animal.lion
   */
  self.lion = function() {
    return faker.random.arrayElement(faker.definitions.animal.lion);
  };
  /**
   * cetacean  
   *
   * @method faker.animal.cetacean
   */
  self.cetacean = function() {
    return faker.random.arrayElement(faker.definitions.animal.cetacean);
  };
  /**
   * horse 
   *
   * @method faker.animal.horse
   */
  self.horse = function() {
    return faker.random.arrayElement(faker.definitions.animal.horse);
  };
  /**
   * bird
   *
   * @method faker.animal.bird
   */
  self.bird = function() {
    return faker.random.arrayElement(faker.definitions.animal.bird);
  };
  /**
   * cow 
   *
   * @method faker.animal.cow
   */
  self.cow = function() {
    return faker.random.arrayElement(faker.definitions.animal.cow);
  };
  /**
   * fish
   *
   * @method faker.animal.fish
   */
  self.fish = function() {
    return faker.random.arrayElement(faker.definitions.animal.fish);
  };
  /**
   * crocodilia
   *
   * @method faker.animal.crocodilia
   */
  self.crocodilia = function() {
    return faker.random.arrayElement(faker.definitions.animal.crocodilia);
  };
  /**
   * insect  
   *
   * @method faker.animal.insect
   */
  self.insect = function() {
    return faker.random.arrayElement(faker.definitions.animal.insect);
  };
  /**
   * rabbit 
   *
   * @method faker.animal.rabbit
   */
  self.rabbit = function() {
    return faker.random.arrayElement(faker.definitions.animal.rabbit);
  };
  /**
   * type 
   *
   * @method faker.animal.type
   */
  self.type = function() {
    return faker.random.arrayElement(faker.definitions.animal.type);
  };

  return self;
};

module['exports'] = Animal;

},{}],4:[function(require,module,exports){
/**
 *
 * @namespace faker.commerce
 */
var Commerce = function (faker) {
  var self = this;

  /**
   * color
   *
   * @method faker.commerce.color
   */
  self.color = function() {
    return faker.random.arrayElement(faker.definitions.commerce.color);
  };

  /**
   * department
   *
   * @method faker.commerce.department
   */
  self.department = function() {
    return faker.random.arrayElement(faker.definitions.commerce.department);
  };

  /**
   * productName
   *
   * @method faker.commerce.productName
   */
  self.productName = function() {
    return faker.commerce.productAdjective() + " " +
              faker.commerce.productMaterial() + " " +
              faker.commerce.product();
  };

  /**
   * price
   *
   * @method faker.commerce.price
   * @param {number} min
   * @param {number} max
   * @param {number} dec
   * @param {string} symbol
   *
   * @return {string}
   */
  self.price = function(min, max, dec, symbol) {
    min = min || 1;
    max = max || 1000;
    dec = dec === undefined ? 2 : dec;
    symbol = symbol || '';

    if (min < 0 || max < 0) {
      return symbol + 0.00;
    }

    var randValue = faker.datatype.number({ max: max, min: min });

    return symbol + (Math.round(randValue * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
  };

  /*
  self.categories = function(num) {
      var categories = [];

      do {
          var category = faker.random.arrayElement(faker.definitions.commerce.department);
          if(categories.indexOf(category) === -1) {
              categories.push(category);
          }
      } while(categories.length < num);

      return categories;
  };

  */
  /*
  self.mergeCategories = function(categories) {
      var separator = faker.definitions.separator || " &";
      // TODO: find undefined here
      categories = categories || faker.definitions.commerce.categories;
      var commaSeparated = categories.slice(0, -1).join(', ');

      return [commaSeparated, categories[categories.length - 1]].join(separator + " ");
  };
  */

  /**
   * productAdjective
   *
   * @method faker.commerce.productAdjective
   */
  self.productAdjective = function() {
    return faker.random.arrayElement(faker.definitions.commerce.product_name.adjective);
  };

  /**
   * productMaterial
   *
   * @method faker.commerce.productMaterial
   */
  self.productMaterial = function() {
    return faker.random.arrayElement(faker.definitions.commerce.product_name.material);
  };

  /**
   * product
   *
   * @method faker.commerce.product
   */
  self.product = function() {
    return faker.random.arrayElement(faker.definitions.commerce.product_name.product);
  };

  /**
   * productDescription
   *
   * @method faker.commerce.productDescription
   */
  self.productDescription = function() {
    return faker.random.arrayElement(faker.definitions.commerce.product_description);
  };

  return self;
};

module['exports'] = Commerce;

},{}],5:[function(require,module,exports){
/**
 *
 * @namespace faker.company
 */
var Company = function (faker) {
  
  var self = this;
  var f = faker.fake;
  
  /**
   * suffixes
   *
   * @method faker.company.suffixes
   */
  this.suffixes = function () {
    // Don't want the source array exposed to modification, so return a copy
    return faker.definitions.company.suffix.slice(0);
  }

  /**
   * companyName
   *
   * @method faker.company.companyName
   * @param {string} format
   */
  this.companyName = function (format) {

    var formats = [
      '{{name.lastName}} {{company.companySuffix}}',
      '{{name.lastName}} - {{name.lastName}}',
      '{{name.lastName}}, {{name.lastName}} and {{name.lastName}}'
    ];

    if (typeof format !== "number") {
      format = faker.datatype.number(formats.length - 1);
    }

    return f(formats[format]);
  }

  /**
   * companySuffix
   *
   * @method faker.company.companySuffix
   */
  this.companySuffix = function () {
    return faker.random.arrayElement(faker.company.suffixes());
  }

  /**
   * catchPhrase
   *
   * @method faker.company.catchPhrase
   */
  this.catchPhrase = function () {
    return f('{{company.catchPhraseAdjective}} {{company.catchPhraseDescriptor}} {{company.catchPhraseNoun}}')
  }

  /**
   * bs
   *
   * @method faker.company.bs
   */
  this.bs = function () {
    return f('{{company.bsBuzz}} {{company.bsAdjective}} {{company.bsNoun}}');
  }

  /**
   * catchPhraseAdjective
   *
   * @method faker.company.catchPhraseAdjective
   */
  this.catchPhraseAdjective = function () {
    return faker.random.arrayElement(faker.definitions.company.adjective);
  }

  /**
   * catchPhraseDescriptor
   *
   * @method faker.company.catchPhraseDescriptor
   */
  this.catchPhraseDescriptor = function () {
    return faker.random.arrayElement(faker.definitions.company.descriptor);
  }

  /**
   * catchPhraseNoun
   *
   * @method faker.company.catchPhraseNoun
   */
  this.catchPhraseNoun = function () {
    return faker.random.arrayElement(faker.definitions.company.noun);
  }

  /**
   * bsAdjective
   *
   * @method faker.company.bsAdjective
   */
  this.bsAdjective = function () {
    return faker.random.arrayElement(faker.definitions.company.bs_adjective);
  }

  /**
   * bsBuzz
   *
   * @method faker.company.bsBuzz
   */
  this.bsBuzz = function () {
    return faker.random.arrayElement(faker.definitions.company.bs_verb);
  }

  /**
   * bsNoun
   *
   * @method faker.company.bsNoun
   */
  this.bsNoun = function () {
    return faker.random.arrayElement(faker.definitions.company.bs_noun);
  }
  
}

module['exports'] = Company;
},{}],6:[function(require,module,exports){
/**
 *
 * @namespace faker.database
 */
var Database = function (faker) {
  var self = this;
  /**
   * column
   *
   * @method faker.database.column
   */
  self.column = function () {
    return faker.random.arrayElement(faker.definitions.database.column);
  };

  self.column.schema = {
    "description": "Generates a column name.",
    "sampleResults": ["id", "title", "createdAt"]
  };

  /**
   * type
   *
   * @method faker.database.type
   */
  self.type = function () {
    return faker.random.arrayElement(faker.definitions.database.type);
  };

  self.type.schema = {
    "description": "Generates a column type.",
    "sampleResults": ["byte", "int", "varchar", "timestamp"]
  };

  /**
   * collation
   *
   * @method faker.database.collation
   */
  self.collation = function () {
    return faker.random.arrayElement(faker.definitions.database.collation);
  };

  self.collation.schema = {
    "description": "Generates a collation.",
    "sampleResults": ["utf8_unicode_ci", "utf8_bin"]
  };

  /**
   * engine
   *
   * @method faker.database.engine
   */
  self.engine = function () {
    return faker.random.arrayElement(faker.definitions.database.engine);
  };

  self.engine.schema = {
    "description": "Generates a storage engine.",
    "sampleResults": ["MyISAM", "InnoDB"]
  };
};

module["exports"] = Database;

},{}],7:[function(require,module,exports){
/**
 *
 * @namespace faker.datatype
 */
function Datatype (faker, seed) {
  // Use a user provided seed if it is an array or number
  if (Array.isArray(seed) && seed.length) {
    faker.mersenne.seed_array(seed);
  }
  else if(!isNaN(seed)) {
    faker.mersenne.seed(seed);
  }

  /**
     * returns a single random number based on a max number or range
     *
     * @method faker.datatype.number
     * @param {mixed} options {min, max, precision}
     */
  this.number = function (options) {

    if (typeof options === "number") {
      options = {
        max: options
      };
    }

    options = options || {};

    if (typeof options.min === "undefined") {
      options.min = 0;
    }

    if (typeof options.max === "undefined") {
      options.max = 99999;
    }
    if (typeof options.precision === "undefined") {
      options.precision = 1;
    }

    // Make the range inclusive of the max value
    var max = options.max;
    if (max >= 0) {
      max += options.precision;
    }

    var randomNumber = Math.floor(
      faker.mersenne.rand(max / options.precision, options.min / options.precision));
    // Workaround problem in Float point arithmetics for e.g. 6681493 / 0.01
    randomNumber = randomNumber / (1 / options.precision);

    return randomNumber;

  };

  /**
     * returns a single random floating-point number based on a max number or range
     *
     * @method faker.datatype.float
     * @param {mixed} options
     */
  this.float = function (options) {
    if (typeof options === "number") {
      options = {
        precision: options
      };
    }
    options = options || {};
    var opts = {};
    for (var p in options) {
      opts[p] = options[p];
    }
    if (typeof opts.precision === 'undefined') {
      opts.precision = 0.01;
    }
    return faker.datatype.number(opts);
  };

  /**
     * method returns a Date object using a random number of milliseconds since 1. Jan 1970 UTC
     * Caveat: seeding is not working
     *
     * @method faker.datatype.datetime
     * @param {mixed} options, pass min OR max as number of milliseconds since 1. Jan 1970 UTC
     */
  this.datetime = function (options) {
    if (typeof options === "number") {
      options = {
        max: options
      };
    }

    var minMax = 8640000000000000;

    options = options || {};

    if (typeof options.min === "undefined" || options.min < minMax*-1) {
      options.min = new Date().setFullYear(1990, 1, 1);
    }

    if (typeof options.max === "undefined" || options.max > minMax) {
      options.max = new Date().setFullYear(2100,1,1);
    }

    var random = faker.datatype.number(options);
    return new Date(random);
  };

  /**
     * Returns a string, containing UTF-16 chars between 33 and 125 ('!' to '}')
     *
     *
     * @method faker.datatype.string
     * @param { number } length: length of generated string, default = 10, max length = 2^20
     */
  this.string = function (length) {
    if(length === undefined ){
      length = 10;
    }

    var maxLength = Math.pow(2, 20);
    if(length >= (maxLength)){
      length = maxLength;
    }

    var charCodeOption = {
      min: 33,
      max: 125
    };

    var returnString = '';

    for(var i = 0; i < length; i++){
      returnString += String.fromCharCode(faker.datatype.number(charCodeOption));
    }
    return returnString;
  };

  /**
     * uuid
     *
     * @method faker.datatype.uuid
     */
  this.uuid = function () {
    var RFC4122_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var replacePlaceholders = function (placeholder) {
      var random = faker.datatype.number({ min: 0, max: 15 });
      var value = placeholder == 'x' ? random : (random &0x3 | 0x8);
      return value.toString(16);
    };
    return RFC4122_TEMPLATE.replace(/[xy]/g, replacePlaceholders);
  };

  /**
     * boolean
     *
     * @method faker.datatype.boolean
     */
  this.boolean = function () {
    return !!faker.datatype.number(1);
  };


  /**
     * hexaDecimal
     *
     * @method faker.datatype.hexaDecimal
     * @param {number} count defaults to 1
     */
  this.hexaDecimal = function hexaDecimal(count) {
    if (typeof count === "undefined") {
      count = 1;
    }

    var wholeString = "";
    for(var i = 0; i < count; i++) {
      wholeString += faker.random.arrayElement(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]);
    }

    return "0x"+wholeString;
  };

  /**
     * returns json object with 7 pre-defined properties
     *
     * @method faker.datatype.json
     */
  this.json = function json() {

    var properties = ['foo', 'bar', 'bike', 'a', 'b', 'name', 'prop'];

    var returnObject = {};
    properties.forEach(function(prop){
      returnObject[prop] = faker.datatype.boolean() ?
        faker.datatype.string() : faker.datatype.number();
    });

    return JSON.stringify(returnObject);
  };

  /**
     * returns an array with values generated by faker.datatype.number and faker.datatype.string
     *
     * @method faker.datatype.array
     * @param { number } length of the returned array
     */

  this.array = function array(length) {


    if(length === undefined){
      length = 10;
    }
    var returnArray = new Array(length);
    for(var i = 0; i < length; i++){
      returnArray[i] = faker.datatype.boolean() ?
        faker.datatype.string() : faker.datatype.number();
    }
    return returnArray;

  };

  return this;
}

module['exports'] = Datatype;

},{}],8:[function(require,module,exports){
/**
 *
 * @namespace faker.date
 */
var _Date = function (faker) {
  var self = this;
  /**
   * past
   *
   * @method faker.date.past
   * @param {number} years
   * @param {date} refDate
   */
  self.past = function (years, refDate) {
    var date = new Date();
    if (typeof refDate !== "undefined") {
      date = new Date(Date.parse(refDate));
    }

    var range = {
      min: 1000,
      max: (years || 1) * 365 * 24 * 3600 * 1000
    };

    var past = date.getTime();
    past -= faker.datatype.number(range); // some time from now to N years ago, in milliseconds
    date.setTime(past);

    return date;
  };

  /**
   * future
   *
   * @method faker.date.future
   * @param {number} years
   * @param {date} refDate
   */
  self.future = function (years, refDate) {
    var date = new Date();
    if (typeof refDate !== "undefined") {
      date = new Date(Date.parse(refDate));
    }

    var range = {
      min: 1000,
      max: (years || 1) * 365 * 24 * 3600 * 1000
    };

    var future = date.getTime();
    future += faker.datatype.number(range); // some time from now to N years later, in milliseconds
    date.setTime(future);

    return date;
  };

  /**
   * between
   *
   * @method faker.date.between
   * @param {date} from
   * @param {date} to
   */
  self.between = function (from, to) {
    var fromMilli = Date.parse(from);
    var dateOffset = faker.datatype.number(Date.parse(to) - fromMilli);

    var newDate = new Date(fromMilli + dateOffset);

    return newDate;
  };

  /**
   * betweens
   *
   * @method faker.date.between
   * @param {date} from
   * @param {date} to
   */
  self.betweens = function (from, to, num) {
    if (typeof num == 'undefined') { num = 3; }
    var newDates = [];
    var fromMilli = Date.parse(from);
    var dateOffset = (Date.parse(to) - fromMilli) / ( num + 1 );
    var lastDate = from
    for (var i = 0; i < num; i++) {
      fromMilli = Date.parse(lastDate);
      lastDate = new Date(fromMilli + dateOffset)
      newDates.push(lastDate)
    }
    return newDates;
  };


  /**
   * recent
   *
   * @method faker.date.recent
   * @param {number} days
   * @param {date} refDate
   */
  self.recent = function (days, refDate) {
    var date = new Date();
    if (typeof refDate !== "undefined") {
      date = new Date(Date.parse(refDate));
    }

    var range = {
      min: 1000,
      max: (days || 1) * 24 * 3600 * 1000
    };

    var future = date.getTime();
    future -= faker.datatype.number(range); // some time from now to N days ago, in milliseconds
    date.setTime(future);

    return date;
  };

  /**
   * soon
   *
   * @method faker.date.soon
   * @param {number} days
   * @param {date} refDate
   */
  self.soon = function (days, refDate) {
    var date = new Date();
    if (typeof refDate !== "undefined") {
      date = new Date(Date.parse(refDate));
    }

    var range = {
      min: 1000,
      max: (days || 1) * 24 * 3600 * 1000
    };

    var future = date.getTime();
    future += faker.datatype.number(range); // some time from now to N days later, in milliseconds
    date.setTime(future);

    return date;
  };

  /**
   * month
   *
   * @method faker.date.month
   * @param {object} options
   */
  self.month = function (options) {
    options = options || {};

    var type = 'wide';
    if (options.abbr) {
      type = 'abbr';
    }
    if (options.context && typeof faker.definitions.date.month[type + '_context'] !== 'undefined') {
      type += '_context';
    }

    var source = faker.definitions.date.month[type];

    return faker.random.arrayElement(source);
  };

  /**
   * weekday
   *
   * @param {object} options
   * @method faker.date.weekday
   */
  self.weekday = function (options) {
    options = options || {};

    var type = 'wide';
    if (options.abbr) {
      type = 'abbr';
    }
    if (options.context && typeof faker.definitions.date.weekday[type + '_context'] !== 'undefined') {
      type += '_context';
    }

    var source = faker.definitions.date.weekday[type];

    return faker.random.arrayElement(source);
  };

  return self;

};

module['exports'] = _Date;

},{}],9:[function(require,module,exports){
/*
  fake.js - generator method for combining faker methods based on string input

*/

function Fake (faker) {
  
  /**
   * Generator method for combining faker methods based on string input
   *
   * __Example:__
   *
   * ```
   * console.log(faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}'));
   * //outputs: "Marks, Dean Sr."
   * ```
   *
   * This will interpolate the format string with the value of methods
   * [name.lastName]{@link faker.name.lastName}, [name.firstName]{@link faker.name.firstName},
   * and [name.suffix]{@link faker.name.suffix}
   *
   * @method faker.fake
   * @param {string} str
   */
  this.fake = function fake (str) {
    // setup default response as empty string
    var res = '';

    // if incoming str parameter is not provided, return error message
    if (typeof str !== 'string' || str.length === 0) {
      throw new Error('string parameter is required!');
    }

    // find first matching {{ and }}
    var start = str.search('{{');
    var end = str.search('}}');

    // if no {{ and }} is found, we are done
    if (start === -1 || end === -1) {
      return str;
    }

    // console.log('attempting to parse', str);

    // extract method name from between the {{ }} that we found
    // for example: {{name.firstName}}
    var token = str.substr(start + 2,  end - start - 2);
    var method = token.replace('}}', '').replace('{{', '');

    // console.log('method', method)

    // extract method parameters
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(method);
    var parameters = '';
    if (matches) {
      method = method.replace(regExp, '');
      parameters = matches[1];
    }

    // split the method into module and function
    var parts = method.split('.');

    if (typeof faker[parts[0]] === "undefined") {
      throw new Error('Invalid module: ' + parts[0]);
    }

    if (typeof faker[parts[0]][parts[1]] === "undefined") {
      throw new Error('Invalid method: ' + parts[0] + "." + parts[1]);
    }

    // assign the function from the module.function namespace
    var fn = faker[parts[0]][parts[1]];

    // If parameters are populated here, they are always going to be of string type
    // since we might actually be dealing with an object or array,
    // we always attempt to the parse the incoming parameters into JSON
    var params;
    // Note: we experience a small performance hit here due to JSON.parse try / catch
    // If anyone actually needs to optimize this specific code path, please open a support issue on github
    try {
      params = JSON.parse(parameters)
    } catch (err) {
      // since JSON.parse threw an error, assume parameters was actually a string
      params = parameters;
    }

    var result;
    if (typeof params === "string" && params.length === 0) {
      result = fn.call(this);
    } else {
      result = fn.call(this, params);
    }

    // replace the found tag with the returned fake value
    res = str.replace('{{' + token + '}}', result);

    // return the response recursively until we are done finding all tags
    return fake(res);    
  }
  
  return this;
  
  
}

module['exports'] = Fake;
},{}],10:[function(require,module,exports){
/**
 * @namespace faker.finance
 */
var Finance = function (faker) {
  var ibanLib = require("./iban");
  var Helpers = faker.helpers,
      self = this;

  /**
   * account
   *
   * @method faker.finance.account
   * @param {number} length
   */
  self.account = function (length) {

      length = length || 8;

      var template = '';

      for (var i = 0; i < length; i++) {
          template = template + '#';
      }
      length = null;
      return Helpers.replaceSymbolWithNumber(template);
  };

  /**
   * accountName
   *
   * @method faker.finance.accountName
   */
  self.accountName = function () {

      return [Helpers.randomize(faker.definitions.finance.account_type), 'Account'].join(' ');
  };

  /**
   * routingNumber
   *
   * @method faker.finance.routingNumber
   */
  self.routingNumber = function () {

      var routingNumber = Helpers.replaceSymbolWithNumber('########');

      // Modules 10 straight summation.
      var sum = 0;

      for (var i = 0; i < routingNumber.length; i += 3) {
        sum += Number(routingNumber[i]) * 3;
        sum += Number(routingNumber[i + 1]) * 7;
        sum += Number(routingNumber[i + 2]) || 0;
      }

      return routingNumber + (Math.ceil(sum / 10) * 10 - sum);
  }

  /**
   * mask
   *
   * @method faker.finance.mask
   * @param {number} length
   * @param {boolean} parens
   * @param {boolean} ellipsis
   */
  self.mask = function (length, parens, ellipsis) {

      //set defaults
      length = (length == 0 || !length || typeof length == 'undefined') ? 4 : length;
      parens = (parens === null) ? true : parens;
      ellipsis = (ellipsis === null) ? true : ellipsis;

      //create a template for length
      var template = '';

      for (var i = 0; i < length; i++) {
          template = template + '#';
      }

      //prefix with ellipsis
      template = (ellipsis) ? ['...', template].join('') : template;

      template = (parens) ? ['(', template, ')'].join('') : template;

      //generate random numbers
      template = Helpers.replaceSymbolWithNumber(template);

      return template;
  };

  //min and max take in minimum and maximum amounts, dec is the decimal place you want rounded to, symbol is $, €, £, etc
  //NOTE: this returns a string representation of the value, if you want a number use parseFloat and no symbol

  /**
   * amount
   *
   * @method faker.finance.amount
   * @param {number} min
   * @param {number} max
   * @param {number} dec
   * @param {string} symbol
   *
   * @return {string}
   */
  self.amount = function (min, max, dec, symbol, autoFormat) {

      min = min || 0;
      max = max || 1000;
      dec = dec === undefined ? 2 : dec;
      symbol = symbol || '';
      const randValue = faker.datatype.number({ max: max, min: min, precision: Math.pow(10, -dec) });

      var formattedString;
      if(autoFormat) {
        formattedString = randValue.toLocaleString(undefined, {minimumFractionDigits: dec});
      }
      else {
        formattedString = randValue.toFixed(dec);
      }

      return symbol + formattedString;
  };

  /**
   * transactionType
   *
   * @method faker.finance.transactionType
   */
  self.transactionType = function () {
      return Helpers.randomize(faker.definitions.finance.transaction_type);
  };

  /**
   * currencyCode
   *
   * @method faker.finance.currencyCode
   */
  self.currencyCode = function () {
      return faker.random.objectElement(faker.definitions.finance.currency)['code'];
  };

  /**
   * currencyName
   *
   * @method faker.finance.currencyName
   */
  self.currencyName = function () {
      return faker.random.objectElement(faker.definitions.finance.currency, 'key');
  };

  /**
   * currencySymbol
   *
   * @method faker.finance.currencySymbol
   */
  self.currencySymbol = function () {
      var symbol;

      while (!symbol) {
          symbol = faker.random.objectElement(faker.definitions.finance.currency)['symbol'];
      }
      return symbol;
  };

  /**
   * bitcoinAddress
   *
   * @method  faker.finance.bitcoinAddress
   */
  self.bitcoinAddress = function () {
    var addressLength = faker.datatype.number({ min: 25, max: 34 });

    var address = faker.random.arrayElement(['1', '3']);

    for (var i = 0; i < addressLength - 1; i++)
      address += faker.random.arrayElement('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'.split(''));

    return address;
  }

/**
 * litecoinAddress
 *
 * @method  faker.finance.litecoinAddress
 */
self.litecoinAddress = function () {
  var addressLength = faker.datatype.number({ min: 26, max: 33 });

  var address = faker.random.arrayElement(['L', 'M', '3']);

  for (var i = 0; i < addressLength - 1; i++)
    address += faker.random.arrayElement('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'.split(''));

  return address;
}

  /**
   * Credit card number
   * @method faker.finance.creditCardNumber
   * @param {string} provider | scheme
  */
  self.creditCardNumber = function(provider){
    provider = provider || "";
    var format, formats;
    var localeFormat = faker.definitions.finance.credit_card;
    if (provider in localeFormat) {
      formats = localeFormat[provider]; // there chould be multiple formats
      if (typeof formats === "string") {
        format = formats;
      } else {
        format = faker.random.arrayElement(formats);
      }
    } else if (provider.match(/#/)) { // The user chose an optional scheme
      format = provider;
    } else { // Choose a random provider
      if (typeof localeFormat === 'string') {
        format = localeFormat;
      } else if( typeof localeFormat === "object") {
        // Credit cards are in a object structure
        formats = faker.random.objectElement(localeFormat, "value"); // There chould be multiple formats
        if (typeof formats === "string") {
          format = formats;
        } else {
          format = faker.random.arrayElement(formats);
        }
      }
    }
    format = format.replace(/\//g,"")
    return Helpers.replaceCreditCardSymbols(format);
  };
  /**
   * Credit card CVV
   * @method faker.finance.creditCardCVV
  */
  self.creditCardCVV = function() {
    var cvv = "";
    for (var i = 0; i < 3; i++) {
      cvv += faker.datatype.number({max:9}).toString();
    }
    return cvv;
  };

  /**
   * ethereumAddress
   *
   * @method  faker.finance.ethereumAddress
   */
  self.ethereumAddress = function () {
    var address = faker.datatype.hexaDecimal(40).toLowerCase();
    return address;
  };

  /**
   * iban
   *
   * @param {boolean} [formatted=false] - Return a formatted version of the generated IBAN.
   * @param {string} [countryCode] - The country code from which you want to generate an IBAN, if none is provided a random country will be used.
   * @throws Will throw an error if the passed country code is not supported.
   *
   * @method  faker.finance.iban
   */
  self.iban = function (formatted, countryCode) {
      var ibanFormat;
      if (countryCode) {
          var findFormat = function(currentFormat) { return currentFormat.country === countryCode; };
          ibanFormat = ibanLib.formats.find(findFormat);
      } else {
          ibanFormat = faker.random.arrayElement(ibanLib.formats);
      }

      if (!ibanFormat) {
          throw new Error('Country code ' + countryCode + ' not supported.');
      }

      var s = "";
      var count = 0;
      for (var b = 0; b < ibanFormat.bban.length; b++) {
          var bban = ibanFormat.bban[b];
          var c = bban.count;
          count += bban.count;
          while (c > 0) {
              if (bban.type == "a") {
                  s += faker.random.arrayElement(ibanLib.alpha);
              } else if (bban.type == "c") {
                  if (faker.datatype.number(100) < 80) {
                      s += faker.datatype.number(9);
                  } else {
                      s += faker.random.arrayElement(ibanLib.alpha);
                  }
              } else {
                  if (c >= 3 && faker.datatype.number(100) < 30) {
                      if (faker.datatype.boolean()) {
                          s += faker.random.arrayElement(ibanLib.pattern100);
                          c -= 2;
                      } else {
                          s += faker.random.arrayElement(ibanLib.pattern10);
                          c--;
                      }
                  } else {
                      s += faker.datatype.number(9);
                  }
              }
              c--;
          }
          s = s.substring(0, count);
      }
      var checksum = 98 - ibanLib.mod97(ibanLib.toDigitString(s + ibanFormat.country + "00"));
      if (checksum < 10) {
          checksum = "0" + checksum;
      }
      var iban = ibanFormat.country + checksum + s;
      return formatted ? iban.match(/.{1,4}/g).join(" ") : iban;
  };

  /**
   * bic
   *
   * @method  faker.finance.bic
   */
  self.bic = function () {
      var vowels = ["A", "E", "I", "O", "U"];
      var prob = faker.datatype.number(100);
      return Helpers.replaceSymbols("???") +
          faker.random.arrayElement(vowels) +
          faker.random.arrayElement(ibanLib.iso3166) +
          Helpers.replaceSymbols("?") + "1" +
          (prob < 10 ?
              Helpers.replaceSymbols("?" + faker.random.arrayElement(vowels) + "?") :
          prob < 40 ?
              Helpers.replaceSymbols("###") : "");
  };

  /**
   * description
   *
   * @method  faker.finance.transactionDescription
   */
  self.transactionDescription = function() {
    var transaction = Helpers.createTransaction();
    var account = transaction.account;
    var amount = transaction.amount;
    var transactionType = transaction.type;
    var company = transaction.business;
    var card = faker.finance.mask();
    var currency = faker.finance.currencyCode();
    return transactionType + " transaction at " + company + " using card ending with ***" + card + " for " + currency + " " + amount + " in account ***" + account
  };

};

module['exports'] = Finance;

},{"./iban":14}],11:[function(require,module,exports){
/**
 * @namespace faker.git
 */

var Git = function(faker) {
  var self = this;
  var f = faker.fake;

  var hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

  /**
   * branch
   *
   * @method faker.git.branch
   */
  self.branch = function() {
    var noun = faker.hacker.noun().replace(' ', '-');
    var verb = faker.hacker.verb().replace(' ', '-');
    return noun + '-' + verb;
  }

  /**
   * commitEntry
   *
   * @method faker.git.commitEntry
   * @param {object} options
   */
  self.commitEntry = function(options) {
    options = options || {};

    var entry = 'commit {{git.commitSha}}\r\n';

    if (options.merge || (faker.datatype.number({ min: 0, max: 4 }) === 0)) {
      entry += 'Merge: {{git.shortSha}} {{git.shortSha}}\r\n';
    }

    entry += 'Author: {{name.firstName}} {{name.lastName}} <{{internet.email}}>\r\n';
    entry += 'Date: ' + faker.date.recent().toString() + '\r\n';
    entry += '\r\n\xa0\xa0\xa0\xa0{{git.commitMessage}}\r\n';

    return f(entry);
  };

  /**
   * commitMessage
   *
   * @method faker.git.commitMessage
   */
  self.commitMessage = function() {
    var format = '{{hacker.verb}} {{hacker.adjective}} {{hacker.noun}}';
    return f(format);
  };

  /**
   * commitSha
   *
   * @method faker.git.commitSha
   */
  self.commitSha = function() {
    var commit = "";

    for (var i = 0; i < 40; i++) {
      commit += faker.random.arrayElement(hexChars);
    }

    return commit;
  };

  /**
   * shortSha
   *
   * @method faker.git.shortSha
   */
  self.shortSha = function() {
    var shortSha = "";

    for (var i = 0; i < 7; i++) {
      shortSha += faker.random.arrayElement(hexChars);
    }

    return shortSha;
  };

  return self;
}

module['exports'] = Git;

},{}],12:[function(require,module,exports){
/**
 *
 * @namespace faker.hacker
 */
var Hacker = function (faker) {
  var self = this;
  
  /**
   * abbreviation
   *
   * @method faker.hacker.abbreviation
   */
  self.abbreviation = function () {
    return faker.random.arrayElement(faker.definitions.hacker.abbreviation);
  };

  /**
   * adjective
   *
   * @method faker.hacker.adjective
   */
  self.adjective = function () {
    return faker.random.arrayElement(faker.definitions.hacker.adjective);
  };

  /**
   * noun
   *
   * @method faker.hacker.noun
   */
  self.noun = function () {
    return faker.random.arrayElement(faker.definitions.hacker.noun);
  };

  /**
   * verb
   *
   * @method faker.hacker.verb
   */
  self.verb = function () {
    return faker.random.arrayElement(faker.definitions.hacker.verb);
  };

  /**
   * ingverb
   *
   * @method faker.hacker.ingverb
   */
  self.ingverb = function () {
    return faker.random.arrayElement(faker.definitions.hacker.ingverb);
  };

  /**
   * phrase
   *
   * @method faker.hacker.phrase
   */
  self.phrase = function () {

    var data = {
      abbreviation: self.abbreviation,
      adjective: self.adjective,
      ingverb: self.ingverb,
      noun: self.noun,
      verb: self.verb
    };

    var phrase = faker.random.arrayElement(faker.definitions.hacker.phrase);
    return faker.helpers.mustache(phrase, data);
  };
  
  return self;
};

module['exports'] = Hacker;
},{}],13:[function(require,module,exports){
/**
 *
 * @namespace faker.helpers
 */
var Helpers = function (faker) {

  var self = this;

  /**
   * backward-compatibility
   *
   * @method faker.helpers.randomize
   * @param {array} array
   */
  self.randomize = function (array) {
      array = array || ["a", "b", "c"];
      return faker.random.arrayElement(array);
  };

  /**
   * slugifies string
   *
   * @method faker.helpers.slugify
   * @param {string} string
   */
  self.slugify = function (string) {
      string = string || "";
      return string.replace(/ /g, '-').replace(/[^\一-龠\ぁ-ゔ\ァ-ヴー\w\.\-]+/g, '');
  };

  /**
   * parses string for a symbol and replace it with a random number from 1-10
   *
   * @method faker.helpers.replaceSymbolWithNumber
   * @param {string} string
   * @param {string} symbol defaults to `"#"`
   */
  self.replaceSymbolWithNumber = function (string, symbol) {
      string = string || "";
      // default symbol is '#'
      if (symbol === undefined) {
          symbol = '#';
      }

      var str = '';
      for (var i = 0; i < string.length; i++) {
          if (string.charAt(i) == symbol) {
              str += faker.datatype.number(9);
          } else if (string.charAt(i) == "!"){
              str += faker.datatype.number({min: 2, max: 9});
          } else {
              str += string.charAt(i);
          }
      }
      return str;
  };

  /**
   * parses string for symbols (numbers or letters) and replaces them appropriately (# will be replaced with number,
   * ? with letter and * will be replaced with number or letter)
   *
   * @method faker.helpers.replaceSymbols
   * @param {string} string
   */
  self.replaceSymbols = function (string) {
      string = string || "";
      var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
      var str = '';

      for (var i = 0; i < string.length; i++) {
          if (string.charAt(i) == "#") {
              str += faker.datatype.number(9);
          } else if (string.charAt(i) == "?") {
              str += faker.random.arrayElement(alpha);
          } else if (string.charAt(i) == "*") {
            str += faker.datatype.boolean() ? faker.random.arrayElement(alpha) : faker.datatype.number(9);
          } else {
              str += string.charAt(i);
          }
      }
      return str;
  };

  /**
   * replace symbols in a credit card schems including Luhn checksum
   *
   * @method faker.helpers.replaceCreditCardSymbols
   * @param {string} string
   * @param {string} symbol
   */

   self.replaceCreditCardSymbols = function(string, symbol) {

     // default values required for calling method without arguments
     string = string || "6453-####-####-####-###L";
     symbol = symbol || "#";

     // Function calculating the Luhn checksum of a number string
     var getCheckBit = function(number) {
       number.reverse();
       number = number.map(function(num, index){
         if (index%2 === 0) {
           num *= 2;
           if(num>9) {
             num -= 9;
           }
         }
         return num;
       });
       var sum = number.reduce(function(prev,curr){return prev + curr;});
       return sum % 10;
     };

     string = faker.helpers.regexpStyleStringParse(string); // replace [4-9] with a random number in range etc...
     string = faker.helpers.replaceSymbolWithNumber(string, symbol); // replace ### with random numbers

     var numberList = string.replace(/\D/g,"").split("").map(function(num){return parseInt(num);});
     var checkNum = getCheckBit(numberList);
     return string.replace("L",checkNum);
   };

   /** string repeat helper, alternative to String.prototype.repeat.... See PR #382
   *
   * @method faker.helpers.repeatString
   * @param {string} string
   * @param {number} num
   */
   self.repeatString = function(string, num) {
     if(typeof num ==="undefined") {
       num = 0;
     }
     var text = "";
     for(var i = 0; i < num; i++){
       text += string.toString();
     }
     return text;
   };

   /**
    * parse string patterns in a similar way to RegExp
    *
    * e.g. "#{3}test[1-5]" -> "###test4"
    *
    * @method faker.helpers.regexpStyleStringParse
    * @param {string} string
    */
   self.regexpStyleStringParse = function(string){
     string = string || "";
     // Deal with range repeat `{min,max}`
     var RANGE_REP_REG = /(.)\{(\d+)\,(\d+)\}/;
     var REP_REG = /(.)\{(\d+)\}/;
     var RANGE_REG = /\[(\d+)\-(\d+)\]/;
     var min, max, tmp, repetitions;
     var token = string.match(RANGE_REP_REG);
     while(token !== null){
       min = parseInt(token[2]);
       max =  parseInt(token[3]);
       // switch min and max
       if(min>max) {
         tmp = max;
         max = min;
         min = tmp;
       }
       repetitions = faker.datatype.number({min:min,max:max});
       string = string.slice(0,token.index) + faker.helpers.repeatString(token[1], repetitions) + string.slice(token.index+token[0].length);
       token = string.match(RANGE_REP_REG);
     }
     // Deal with repeat `{num}`
     token = string.match(REP_REG);
     while(token !== null){
       repetitions = parseInt(token[2]);
       string = string.slice(0,token.index)+ faker.helpers.repeatString(token[1], repetitions) + string.slice(token.index+token[0].length);
       token = string.match(REP_REG);
     }
     // Deal with range `[min-max]` (only works with numbers for now)
     //TODO: implement for letters e.g. [0-9a-zA-Z] etc.

     token = string.match(RANGE_REG);
     while(token !== null){
       min = parseInt(token[1]); // This time we are not capturing the char before `[]`
       max =  parseInt(token[2]);
       // switch min and max
       if(min>max) {
         tmp = max;
         max = min;
         min = tmp;
       }
        string = string.slice(0,token.index) +
          faker.datatype.number({min:min, max:max}).toString() +
          string.slice(token.index+token[0].length);
        token = string.match(RANGE_REG);
     }
     return string;
   };

  /**
   * takes an array and randomizes it in place then returns it
   * 
   * uses the modern version of the Fisher–Yates algorithm
   *
   * @method faker.helpers.shuffle
   * @param {array} o
   */
  self.shuffle = function (o) {
      if (typeof o === 'undefined' || o.length === 0) {
        return o || [];
      }
      o = o || ["a", "b", "c"];
      for (var x, j, i = o.length - 1; i > 0; --i) {
        j = faker.datatype.number(i);
        x = o[i];
        o[i] = o[j];
        o[j] = x;
      }
      return o;
  };

  /**
   * mustache
   *
   * @method faker.helpers.mustache
   * @param {string} str
   * @param {object} data
   */
  self.mustache = function (str, data) {
    if (typeof str === 'undefined') {
      return '';
    }
    for(var p in data) {
      var re = new RegExp('{{' + p + '}}', 'g')
      str = str.replace(re, data[p]);
    }
    return str;
  };

  /**
   * createCard
   *
   * @method faker.helpers.createCard
   */
  self.createCard = function () {
      return {
          "name": faker.name.findName(),
          "username": faker.internet.userName(),
          "email": faker.internet.email(),
          "address": {
              "streetA": faker.address.streetName(),
              "streetB": faker.address.streetAddress(),
              "streetC": faker.address.streetAddress(true),
              "streetD": faker.address.secondaryAddress(),
              "city": faker.address.city(),
              "state": faker.address.state(),
              "country": faker.address.country(),
              "zipcode": faker.address.zipCode(),
              "geo": {
                  "lat": faker.address.latitude(),
                  "lng": faker.address.longitude()
              }
          },
          "phone": faker.phone.phoneNumber(),
          "website": faker.internet.domainName(),
          "company": {
              "name": faker.company.companyName(),
              "catchPhrase": faker.company.catchPhrase(),
              "bs": faker.company.bs()
          },
          "posts": [
              {
                  "words": faker.lorem.words(),
                  "sentence": faker.lorem.sentence(),
                  "sentences": faker.lorem.sentences(),
                  "paragraph": faker.lorem.paragraph()
              },
              {
                  "words": faker.lorem.words(),
                  "sentence": faker.lorem.sentence(),
                  "sentences": faker.lorem.sentences(),
                  "paragraph": faker.lorem.paragraph()
              },
              {
                  "words": faker.lorem.words(),
                  "sentence": faker.lorem.sentence(),
                  "sentences": faker.lorem.sentences(),
                  "paragraph": faker.lorem.paragraph()
              }
          ],
          "accountHistory": [faker.helpers.createTransaction(), faker.helpers.createTransaction(), faker.helpers.createTransaction()]
      };
  };

  /**
   * contextualCard
   *
   * @method faker.helpers.contextualCard
   */
  self.contextualCard = function () {
    var name = faker.name.firstName(),
        userName = faker.internet.userName(name);
    return {
        "name": name,
        "username": userName,
        "avatar": faker.internet.avatar(),
        "email": faker.internet.email(userName),
        "dob": faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)")),
        "phone": faker.phone.phoneNumber(),
        "address": {
            "street": faker.address.streetName(true),
            "suite": faker.address.secondaryAddress(),
            "city": faker.address.city(),
            "zipcode": faker.address.zipCode(),
            "geo": {
                "lat": faker.address.latitude(),
                "lng": faker.address.longitude()
            }
        },
        "website": faker.internet.domainName(),
        "company": {
            "name": faker.company.companyName(),
            "catchPhrase": faker.company.catchPhrase(),
            "bs": faker.company.bs()
        }
    };
  };


  /**
   * userCard
   *
   * @method faker.helpers.userCard
   */
  self.userCard = function () {
      return {
          "name": faker.name.findName(),
          "username": faker.internet.userName(),
          "email": faker.internet.email(),
          "address": {
              "street": faker.address.streetName(true),
              "suite": faker.address.secondaryAddress(),
              "city": faker.address.city(),
              "zipcode": faker.address.zipCode(),
              "geo": {
                  "lat": faker.address.latitude(),
                  "lng": faker.address.longitude()
              }
          },
          "phone": faker.phone.phoneNumber(),
          "website": faker.internet.domainName(),
          "company": {
              "name": faker.company.companyName(),
              "catchPhrase": faker.company.catchPhrase(),
              "bs": faker.company.bs()
          }
      };
  };

  /**
   * createTransaction
   *
   * @method faker.helpers.createTransaction
   */
  self.createTransaction = function(){
    return {
      "amount" : faker.finance.amount(),
      "date" : new Date(2012, 1, 2),  //TODO: add a ranged date method
      "business": faker.company.companyName(),
      "name": [faker.finance.accountName(), faker.finance.mask()].join(' '),
      "type" : self.randomize(faker.definitions.finance.transaction_type),
      "account" : faker.finance.account()
    };
  };

  return self;

};


/*
String.prototype.capitalize = function () { //v1.0
    return this.replace(/\w+/g, function (a) {
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};
*/

module['exports'] = Helpers;

},{}],14:[function(require,module,exports){
module["exports"] = {
  alpha: [
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
  ],
  pattern10: [
    "01", "02", "03", "04", "05", "06", "07", "08", "09"
  ],
  pattern100: [
    "001", "002", "003", "004", "005", "006", "007", "008", "009"
  ],
  toDigitString: function (str) {
    return str.replace(/[A-Z]/gi, function(match) {
      return match.toUpperCase().charCodeAt(0) - 55;
    });
  },
  mod97: function (digitStr) {
    var m = 0;
    for (var i = 0; i < digitStr.length; i++) {
      m = ((m * 10) + (digitStr[i] |0)) % 97;
    }
    return m;
  },
  formats: [
    {
      country: "AL",
      total: 28,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "c",
          count: 16
        }
      ],
      format: "ALkk bbbs sssx cccc cccc cccc cccc"
    },
    {
      country: "AD",
      total: 24,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "c",
          count: 12
        }
      ],
      format: "ADkk bbbb ssss cccc cccc cccc"
    },
    {
      country: "AT",
      total: 20,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "n",
          count: 11
        }
      ],
      format: "ATkk bbbb bccc cccc cccc"
    },
    {
      // Azerbaijan
      // https://transferwise.com/fr/iban/azerbaijan
      // Length 28
      // BBAN 2c,16n
      // GEkk bbbb cccc cccc cccc cccc cccc
      // b = National bank code (alpha)
      // c = Account number
      // example IBAN AZ21 NABZ 0000 0000 1370 1000 1944
      country: "AZ",
      total: 28,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 20
        }
      ],
      format: "AZkk bbbb cccc cccc cccc cccc cccc"
    },
    {
      country: "BH",
      total: 22,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 14
        }
      ],
      format: "BHkk bbbb cccc cccc cccc cc"
    },
    {
      country: "BE",
      total: 16,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 9
        }
      ],
      format: "BEkk bbbc cccc ccxx"
    },
    {
      country: "BA",
      total: 20,
      bban: [
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "BAkk bbbs sscc cccc ccxx"
    },
    {
      country: "BR",
      total: 29,
      bban: [
        {
          type: "n",
          count: 13
        },
        {
          type: "n",
          count: 10
        },
        {
          type: "a",
          count: 1
        },
        {
          type: "c",
          count: 1
        }
      ],
      format: "BRkk bbbb bbbb ssss sccc cccc ccct n"
    },
    {
      country: "BG",
      total: 22,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 6
        },
        {
          type: "c",
          count: 8
        }
      ],
      format: "BGkk bbbb ssss ddcc cccc cc"
    },
    {
      country: "CR",
      total: 21,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 14
        }
      ],
      format: "CRkk bbbc cccc cccc cccc c"
    },
    {
      country: "HR",
      total: 21,
      bban: [
        {
          type: "n",
          count: 7
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "HRkk bbbb bbbc cccc cccc c"
    },
    {
      country: "CY",
      total: 28,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "c",
          count: 16
        }
      ],
      format: "CYkk bbbs ssss cccc cccc cccc cccc"
    },
    {
      country: "CZ",
      total: 24,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "CZkk bbbb ssss sscc cccc cccc"
    },
    {
      country: "DK",
      total: 18,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "DKkk bbbb cccc cccc cc"
    },
    {
      country: "DO",
      total: 28,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 20
        }
      ],
      format: "DOkk bbbb cccc cccc cccc cccc cccc"
    },
    {
      country: "TL",
      total: 23,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "TLkk bbbc cccc cccc cccc cxx"
    },
    {
      country: "EE",
      total: 20,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 12
        }
      ],
      format: "EEkk bbss cccc cccc cccx"
    },
    {
      country: "FO",
      total: 18,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "FOkk bbbb cccc cccc cx"
    },
    {
      country: "FI",
      total: 18,
      bban: [
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 8
        }
      ],
      format: "FIkk bbbb bbcc cccc cx"
    },
    {
      country: "FR",
      total: 27,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "c",
          count: 11
        },
        {
          type: "n",
          count: 2
        }
      ],
      format: "FRkk bbbb bggg ggcc cccc cccc cxx"
    },
    {
      country: "GE",
      total: 22,
      bban: [
        {
          type: "a",
          count: 2
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "GEkk bbcc cccc cccc cccc cc"
    },
    {
      country: "DE",
      total: 22,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "DEkk bbbb bbbb cccc cccc cc"
    },
    {
      country: "GI",
      total: 23,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 15
        }
      ],
      format: "GIkk bbbb cccc cccc cccc ccc"
    },
    {
      country: "GR",
      total: 27,
      bban: [
        {
          type: "n",
          count: 7
        },
        {
          type: "c",
          count: 16
        }
      ],
      format: "GRkk bbbs sssc cccc cccc cccc ccc"
    },
    {
      country: "GL",
      total: 18,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "GLkk bbbb cccc cccc cc"
    },
    {
      country: "GT",
      total: 28,
      bban: [
        {
          type: "c",
          count: 4
        },
        {
          type: "c",
          count: 4
        },
        {
          type: "c",
          count: 16
        }
      ],
      format: "GTkk bbbb mmtt cccc cccc cccc cccc"
    },
    {
      country: "HU",
      total: 28,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "HUkk bbbs sssk cccc cccc cccc cccx"
    },
    {
      country: "IS",
      total: 26,
      bban: [
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "ISkk bbbb sscc cccc iiii iiii ii"
    },
    {
      country: "IE",
      total: 22,
      bban: [
        {
          type: "c",
          count: 4
        },
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 8
        }
      ],
      format: "IEkk aaaa bbbb bbcc cccc cc"
    },
    {
      country: "IL",
      total: 23,
      bban: [
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 13
        }
      ],
      format: "ILkk bbbn nncc cccc cccc ccc"
    },
    {
      country: "IT",
      total: 27,
      bban: [
        {
          type: "a",
          count: 1
        },
        {
          type: "n",
          count: 10
        },
        {
          type: "c",
          count: 12
        }
      ],
      format: "ITkk xaaa aabb bbbc cccc cccc ccc"
    },
    {
      country: "JO",
      total: 30,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 18
        }
      ],
      format: "JOkk bbbb nnnn cccc cccc cccc cccc cc"
    },
    {
      country: "KZ",
      total: 20,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "c",
          count: 13
        }
      ],
      format: "KZkk bbbc cccc cccc cccc"
    },
    {
      country: "XK",
      total: 20,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 12
        }
      ],
      format: "XKkk bbbb cccc cccc cccc"
    },
    {
      country: "KW",
      total: 30,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 22
        }
      ],
      format: "KWkk bbbb cccc cccc cccc cccc cccc cc"
    },
    {
      country: "LV",
      total: 21,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 13
        }
      ],
      format: "LVkk bbbb cccc cccc cccc c"
    },
    {
      country: "LB",
      total: 28,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "c",
          count: 20
        }
      ],
      format: "LBkk bbbb cccc cccc cccc cccc cccc"
    },
    {
      country: "LI",
      total: 21,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "c",
          count: 12
        }
      ],
      format: "LIkk bbbb bccc cccc cccc c"
    },
    {
      country: "LT",
      total: 20,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "n",
          count: 11
        }
      ],
      format: "LTkk bbbb bccc cccc cccc"
    },
    {
      country: "LU",
      total: 20,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "c",
          count: 13
        }
      ],
      format: "LUkk bbbc cccc cccc cccc"
    },
    {
      country: "MK",
      total: 19,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "c",
          count: 10
        },
        {
          type: "n",
          count: 2
        }
      ],
      format: "MKkk bbbc cccc cccc cxx"
    },
    {
      country: "MT",
      total: 31,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 5
        },
        {
          type: "c",
          count: 18
        }
      ],
      format: "MTkk bbbb ssss sccc cccc cccc cccc ccc"
    },
    {
      country: "MR",
      total: 27,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "n",
          count: 13
        }
      ],
      format: "MRkk bbbb bsss sscc cccc cccc cxx"
    },
    {
      country: "MU",
      total: 30,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 15
        },
        {
          type: "a",
          count: 3
        }
      ],
      format: "MUkk bbbb bbss cccc cccc cccc 000d dd"
    },
    {
      country: "MC",
      total: 27,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "c",
          count: 11
        },
        {
          type: "n",
          count: 2
        }
      ],
      format: "MCkk bbbb bsss sscc cccc cccc cxx"
    },
    {
      country: "MD",
      total: 24,
      bban: [
        {
          type: "c",
          count: 2
        },
        {
          type: "c",
          count: 18
        }
      ],
      format: "MDkk bbcc cccc cccc cccc cccc"
    },
    {
      country: "ME",
      total: 22,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 15
        }
      ],
      format: "MEkk bbbc cccc cccc cccc xx"
    },
    {
      country: "NL",
      total: 18,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "NLkk bbbb cccc cccc cc"
    },
    {
      country: "NO",
      total: 15,
      bban: [
        {
          type: "n",
          count: 4
        },
        {
          type: "n",
          count: 7
        }
      ],
      format: "NOkk bbbb cccc ccx"
    },
    {
      country: "PK",
      total: 24,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "PKkk bbbb cccc cccc cccc cccc"
    },
    {
      country: "PS",
      total: 29,
      bban: [
        {
          type: "c",
          count: 4
        },
        {
          type: "n",
          count: 9
        },
        {
          type: "n",
          count: 12
        }
      ],
      format: "PSkk bbbb xxxx xxxx xccc cccc cccc c"
    },
    {
      country: "PL",
      total: 28,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "PLkk bbbs sssx cccc cccc cccc cccc"
    },
    {
      country: "PT",
      total: 25,
      bban: [
        {
          type: "n",
          count: 8
        },
        {
          type: "n",
          count: 13
        }
      ],
      format: "PTkk bbbb ssss cccc cccc cccx x"
    },
    {
      country: "QA",
      total: 29,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 21
        }
      ],
      format: "QAkk bbbb cccc cccc cccc cccc cccc c"
    },
    {
      country: "RO",
      total: 24,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "c",
          count: 16
        }
      ],
      format: "ROkk bbbb cccc cccc cccc cccc"
    },
    {
      country: "SM",
      total: 27,
      bban: [
        {
          type: "a",
          count: 1
        },
        {
          type: "n",
          count: 10
        },
        {
          type: "c",
          count: 12
        }
      ],
      format: "SMkk xaaa aabb bbbc cccc cccc ccc"
    },
    {
      country: "SA",
      total: 24,
      bban: [
        {
          type: "n",
          count: 2
        },
        {
          type: "c",
          count: 18
        }
      ],
      format: "SAkk bbcc cccc cccc cccc cccc"
    },
    {
      country: "RS",
      total: 22,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 15
        }
      ],
      format: "RSkk bbbc cccc cccc cccc xx"
    },
    {
      country: "SK",
      total: 24,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "SKkk bbbb ssss sscc cccc cccc"
    },
    {
      country: "SI",
      total: 19,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "SIkk bbss sccc cccc cxx"
    },
    {
      country: "ES",
      total: 24,
      bban: [
        {
          type: "n",
          count: 10
        },
        {
          type: "n",
          count: 10
        }
      ],
      format: "ESkk bbbb gggg xxcc cccc cccc"
    },
    {
      country: "SE",
      total: 24,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 17
        }
      ],
      format: "SEkk bbbc cccc cccc cccc cccc"
    },
    {
      country: "CH",
      total: 21,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "c",
          count: 12
        }
      ],
      format: "CHkk bbbb bccc cccc cccc c"
    },
    {
      country: "TN",
      total: 24,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "n",
          count: 15
        }
      ],
      format: "TNkk bbss sccc cccc cccc cccc"
    },
    {
      country: "TR",
      total: 26,
      bban: [
        {
          type: "n",
          count: 5
        },
        {
          type: "n",
          count: 1
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "TRkk bbbb bxcc cccc cccc cccc cc"
    },
    {
      country: "AE",
      total: 23,
      bban: [
        {
          type: "n",
          count: 3
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "AEkk bbbc cccc cccc cccc ccc"
    },
    {
      country: "GB",
      total: 22,
      bban: [
        {
          type: "a",
          count: 4
        },
        {
          type: "n",
          count: 6
        },
        {
          type: "n",
          count: 8
        }
      ],
      format: "GBkk bbbb ssss sscc cccc cc"
    },
    {
      country: "VG",
      total: 24,
      bban: [
        {
          type: "c",
          count: 4
        },
        {
          type: "n",
          count: 16
        }
      ],
      format: "VGkk bbbb cccc cccc cccc cccc"
    }
  ],
  iso3166: [
    "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS",
    "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI",
    "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BY",
    "BZ", "CA", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
    "CO", "CP", "CR", "CS", "CS", "CU", "CV", "CW", "CX", "CY", "CZ", "DD", "DE",
    "DG", "DJ", "DK", "DM", "DO", "DZ", "EA", "EC", "EE", "EG", "EH", "ER", "ES",
    "ET", "EU", "FI", "FJ", "FK", "FM", "FO", "FR", "FX", "GA", "GB", "GD", "GE",
    "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU",
    "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "IC", "ID", "IE", "IL", "IM",
    "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH",
    "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK",
    "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
    "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
    "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR",
    "NT", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN",
    "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB",
    "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR",
    "SS", "ST", "SU", "SV", "SX", "SY", "SZ", "TA", "TC", "TD", "TF", "TG", "TH",
    "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG",
    "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS",
    "YE", "YT", "YU", "ZA", "ZM", "ZR", "ZW"
  ]
}

},{}],15:[function(require,module,exports){
/**
 *
 * @namespace faker.image
 * @property {object} lorempixel - faker.image.lorempixel
 * @property {object} unsplash - faker.image.unsplash
 * @property {object} unsplash - faker.image.lorempicsum
 * @default Default provider is unsplash image provider
 */
var Image = function (faker) {

  var self = this;
  var Lorempixel = require('./image_providers/lorempixel');
  var Unsplash = require('./image_providers/unsplash');
  var LoremPicsum = require('./image_providers/lorempicsum');

  /**
   * image
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.image
   */
  self.image = function (width, height, randomize) {
    var categories = ["abstract", "animals", "business", "cats", "city", "food", "nightlife", "fashion", "people", "nature", "sports", "technics", "transport"];
    return self[faker.random.arrayElement(categories)](width, height, randomize);
  };
  /**
   * avatar
   *
   * @method faker.image.avatar
   */
  self.avatar = function () {
    return faker.internet.avatar();
  };
  /**
   * imageUrl
   *
   * @param {number} width
   * @param {number} height
   * @param {string} category
   * @param {boolean} randomize
   * @method faker.image.imageUrl
   */
  self.imageUrl = function (width, height, category, randomize, https) {
    var width = width || 640;
    var height = height || 480;
    var protocol = 'http://';
    if (typeof https !== 'undefined' && https === true) {
      protocol = 'https://';
    }
    var url = protocol + 'placeimg.com/' + width + '/' + height;
    if (typeof category !== 'undefined') {
      url += '/' + category;
    }

    if (randomize) {
      url += '?' + faker.datatype.number()
    }

    return url;
  };
  /**
   * abstract
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.abstract
   */
  self.abstract = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'abstract', randomize);
  };
  /**
   * animals
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.animals
   */
  self.animals = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'animals', randomize);
  };
  /**
   * business
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.business
   */
  self.business = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'business', randomize);
  };
  /**
   * cats
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.cats
   */
  self.cats = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'cats', randomize);
  };
  /**
   * city
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.city
   */
  self.city = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'city', randomize);
  };
  /**
   * food
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.food
   */
  self.food = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'food', randomize);
  };
  /**
   * nightlife
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.nightlife
   */
  self.nightlife = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'nightlife', randomize);
  };
  /**
   * fashion
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.fashion
   */
  self.fashion = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'fashion', randomize);
  };
  /**
   * people
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.people
   */
  self.people = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'people', randomize);
  };
  /**
   * nature
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.nature
   */
  self.nature = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'nature', randomize);
  };
  /**
   * sports
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.sports
   */
  self.sports = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'sports', randomize);
  };
  /**
   * technics
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.technics
   */
  self.technics = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'technics', randomize);
  };
  /**
   * transport
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.transport
   */
  self.transport = function (width, height, randomize) {
    return faker.image.imageUrl(width, height, 'transport', randomize);
  };
  /**
   * dataUri
   *
   * @param {number} width
   * @param {number} height
   * @param {string} color
   * @method faker.image.dataUri
   */
  self.dataUri = function (width, height, color) {
    color = color || 'grey';
    var svgString = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="' + width + '" height="' + height + '"><rect width="100%" height="100%" fill="' + color + '"/><text x="' + width / 2 + '" y="' + height / 2 + '" font-size="20" alignment-baseline="middle" text-anchor="middle" fill="white">' + width + 'x' + height + '</text></svg>';
    var rawPrefix = 'data:image/svg+xml;charset=UTF-8,';
    return rawPrefix + encodeURIComponent(svgString);
  };

  self.lorempixel = new Lorempixel(faker);
  self.unsplash = new Unsplash(faker);
  self.lorempicsum = new LoremPicsum(faker);

  // Object.assign(self, self.unsplash);
  // How to set default as unsplash? should be image.default?
}


module["exports"] = Image;

},{"./image_providers/lorempicsum":16,"./image_providers/lorempixel":17,"./image_providers/unsplash":18}],16:[function(require,module,exports){
/**
 *
 * @namespace lorempicsum
 * @memberof faker.image
 */
var LoremPicsum = function (faker) {

    var self = this;

    /**
     * image
     *
     * @param {number} width
     * @param {number} height
     * @param {boolean} grayscale
     * @param {number} blur 1-10
     * @method faker.image.lorempicsum.image
     * @description search image from unsplash
     */
    self.image = function (width, height, grayscale, blur) {
      return self.imageUrl(width, height, grayscale, blur);
    };
    /**
     * imageGrayscaled
     *
     * @param {number} width
     * @param {number} height
     * @param {boolean} grayscale
     * @method faker.image.lorempicsum.imageGrayscaled
     * @description search grayscale image from unsplash
     */
    self.imageGrayscale = function (width, height, grayscale) {
      return self.imageUrl(width, height, grayscale);
    };
    /**
     * imageBlurred
     *
     * @param {number} width
     * @param {number} height
     * @param {number} blur 1-10
     * @method faker.image.lorempicsum.imageBlurred
     * @description search blurred image from unsplash
     */
    self.imageBlurred = function (width, height, blur) {
      return self.imageUrl(width, height, undefined, blur);
    };
    /**
     * imageRandomSeeded
     *
     * @param {number} width
     * @param {number} height
     * @param {boolean} grayscale
     * @param {number} blur 1-10
     * @param {string} seed
     * @method faker.image.lorempicsum.imageRandomSeeded
     * @description search same random image from unsplash, based on a seed
     */
    self.imageRandomSeeded = function (width, height, grayscale, blur, seed) {
      return self.imageUrl(width, height, grayscale, blur, seed);
    };
    /**
     * avatar
     *
     * @method faker.image.lorempicsum.avatar
     */
    self.avatar = function () {
      return faker.internet.avatar();
    };
    /**
     * imageUrl
     *
     * @param {number} width
     * @param {number} height
     * @param {boolean} grayscale
     * @param {number} blur 1-10
     * @param {string} seed
     * @method faker.image.lorempicsum.imageUrl
     */
    self.imageUrl = function (width, height, grayscale, blur, seed) {
        var width = width || 640;
        var height = height || 480;
  
        var url = 'https://picsum.photos';
          
        if (seed) {
          url += '/seed/' + seed;
        }

        url += '/' + width + '/' + height;
        
        if (grayscale && blur) {
          return url + '?grayscale' + '&blur=' + blur;
        }

        if (grayscale) {
          return url + '?grayscale';
        }

        if (blur) {
          return url + '?blur=' + blur;
        }
    
        return url;
    };
  }
  
  module["exports"] = LoremPicsum;
  
},{}],17:[function(require,module,exports){
/**
 *
 * @namespace lorempixel
 * @memberof faker.image
 */
var Lorempixel = function (faker) {

  var self = this;

  /**
   * image
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.image
   */
  self.image = function (width, height, randomize) {
    var categories = ["abstract", "animals", "business", "cats", "city", "food", "nightlife", "fashion", "people", "nature", "sports", "technics", "transport"];
    return self[faker.random.arrayElement(categories)](width, height, randomize);
  };
  /**
   * avatar
   *
   * @method faker.image.lorempixel.avatar
   */
  self.avatar = function () {
    return faker.internet.avatar();
  };
  /**
   * imageUrl
   *
   * @param {number} width
   * @param {number} height
   * @param {string} category
   * @param {boolean} randomize
   * @method faker.image.lorempixel.imageUrl
   */
  self.imageUrl = function (width, height, category, randomize) {
      var width = width || 640;
      var height = height || 480;

      var url ='https://lorempixel.com/' + width + '/' + height;
      if (typeof category !== 'undefined') {
        url += '/' + category;
      }

      if (randomize) {
        url += '?' + faker.datatype.number()
      }

      return url;
  };
  /**
   * abstract
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.abstract
   */
  self.abstract = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'abstract', randomize);
  };
  /**
   * animals
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.animals
   */
  self.animals = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'animals', randomize);
  };
  /**
   * business
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.business
   */
  self.business = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'business', randomize);
  };
  /**
   * cats
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.cats
   */
  self.cats = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'cats', randomize);
  };
  /**
   * city
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.city
   */
  self.city = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'city', randomize);
  };
  /**
   * food
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.food
   */
  self.food = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'food', randomize);
  };
  /**
   * nightlife
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.nightlife
   */
  self.nightlife = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'nightlife', randomize);
  };
  /**
   * fashion
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.fashion
   */
  self.fashion = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'fashion', randomize);
  };
  /**
   * people
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.people
   */
  self.people = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'people', randomize);
  };
  /**
   * nature
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.nature
   */
  self.nature = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'nature', randomize);
  };
  /**
   * sports
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.sports
   */
  self.sports = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'sports', randomize);
  };
  /**
   * technics
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.technics
   */
  self.technics = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'technics', randomize);
  };
  /**
   * transport
   *
   * @param {number} width
   * @param {number} height
   * @param {boolean} randomize
   * @method faker.image.lorempixel.transport
   */
  self.transport = function (width, height, randomize) {
    return faker.image.lorempixel.imageUrl(width, height, 'transport', randomize);
  }
}

module["exports"] = Lorempixel;

},{}],18:[function(require,module,exports){
/**
 *
 * @namespace unsplash
 * @memberof faker.image
 */
var Unsplash = function (faker) {

  var self = this;
  var categories = ["food", "nature", "people", "technology", "objects", "buildings"];

  /**
   * image
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.image
   * @description search image from unsplash
   */
  self.image = function (width, height, keyword) {
    return self.imageUrl(width, height, undefined, keyword);
  };
  /**
   * avatar
   *
   * @method faker.image.unsplash.avatar
   */
  self.avatar = function () {
    return faker.internet.avatar();
  };
  /**
   * imageUrl
   *
   * @param {number} width
   * @param {number} height
   * @param {string} category
   * @param {string} keyword
   * @method faker.image.unsplash.imageUrl
   */
  self.imageUrl = function (width, height, category, keyword) {
      var width = width || 640;
      var height = height || 480;

      var url ='https://source.unsplash.com';

      if (typeof category !== 'undefined') {
          url += '/category/' + category;
      }

      url += '/' + width + 'x' + height;

      if (typeof keyword !== 'undefined') {
          var keywordFormat = new RegExp('^([A-Za-z0-9].+,[A-Za-z0-9]+)$|^([A-Za-z0-9]+)$');
          if (keywordFormat.test(keyword)) {
            url += '?' + keyword;
          }
      }

      return url;
  };
  /**
   * food
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.food
   */
  self.food = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'food', keyword);
  };
  /**
   * people
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.people
   */
  self.people = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'people', keyword);
  };
  /**
   * nature
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.nature
   */
  self.nature = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'nature', keyword);
  };
  /**
   * technology
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.technology
   */
  self.technology = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'technology', keyword);
  };
  /**
   * objects
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.objects
   */
  self.objects = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'objects', keyword);
  };
  /**
   * buildings
   *
   * @param {number} width
   * @param {number} height
   * @param {string} keyword
   * @method faker.image.unsplash.buildings
   */
  self.buildings = function (width, height, keyword) {
    return faker.image.unsplash.imageUrl(width, height, 'buildings', keyword);
  };
}

module["exports"] = Unsplash;

},{}],19:[function(require,module,exports){
/*

   this index.js file is used for including the faker library as a CommonJS module, instead of a bundle

   you can include the faker library into your existing node.js application by requiring the entire /faker directory

    var faker = require(./faker);
    var randomName = faker.name.findName();

   you can also simply include the "faker.js" file which is the auto-generated bundled version of the faker library

    var faker = require(./customAppPath/faker);
    var randomName = faker.name.findName();


  if you plan on modifying the faker library you should be performing your changes in the /lib/ directory

*/

/**
 *
 * @namespace faker
 */
function Faker (opts) {

  var self = this;

  opts = opts || {};

  // assign options
  var locales = self.locales || opts.locales || {};
  var locale = self.locale || opts.locale || "en";
  var localeFallback = self.localeFallback || opts.localeFallback || "en";

  self.locales = locales;
  self.locale = locale;
  self.localeFallback = localeFallback;

  self.definitions = {};

  var _definitions = {
    "name": ["first_name", "last_name", "prefix", "suffix", "binary_gender", "gender", "title", "male_prefix", "female_prefix", "male_first_name", "female_first_name", "male_middle_name", "female_middle_name", "male_last_name", "female_last_name"],
    "address": ["city_name", "city_prefix", "city_suffix", "street_suffix", "county", "country", "country_code", "country_code_alpha_3", "state", "state_abbr", "street_prefix", "postcode", "postcode_by_state", "direction", "direction_abbr", "time_zone"],
    "animal": ["dog", "cat", "snake", "bear", "lion", "cetacean", "insect", "crocodilia", "cow", "bird", "fish", "rabbit", "horse", "type"],
    "company": ["adjective", "noun", "descriptor", "bs_adjective", "bs_noun", "bs_verb", "suffix"],
    "lorem": ["words"],
    "hacker": ["abbreviation", "adjective", "noun", "verb", "ingverb", "phrase"],
    "phone_number": ["formats"],
    "finance": ["account_type", "transaction_type", "currency", "iban", "credit_card"],
    "internet": ["avatar_uri", "domain_suffix", "free_email", "example_email", "password"],
    "commerce": ["color", "department", "product_name", "price", "categories", "product_description"],
    "database": ["collation", "column", "engine", "type"],
    "system": ["mimeTypes", "directoryPaths"],
    "date": ["month", "weekday"],
    "vehicle": ["vehicle", "manufacturer", "model", "type", "fuel", "vin", "color"],
    "music": ["genre"],
    "word": ["adjective", "adverb", "conjunction", "interjection", "noun", "preposition", "verb"],
    "title": "",
    "separator": ""
  };

  // Create a Getter for all definitions.foo.bar properties
  Object.keys(_definitions).forEach(function(d){
    if (typeof self.definitions[d] === "undefined") {
      self.definitions[d] = {};
    }

    if (typeof _definitions[d] === "string") {
      self.definitions[d] = _definitions[d];
      return;
    }

    _definitions[d].forEach(function(p){
      Object.defineProperty(self.definitions[d], p, {
        get: function () {
          if (typeof self.locales[self.locale][d] === "undefined" || typeof self.locales[self.locale][d][p] === "undefined") {
            // certain localization sets contain less data then others.
            // in the case of a missing definition, use the default localeFallback to substitute the missing set data
            // throw new Error('unknown property ' + d + p)
            return self.locales[localeFallback][d][p];
          } else {
            // return localized data
            return self.locales[self.locale][d][p];
          }
        }
      });
    });
  });

  var Fake = require('./fake');
  self.fake = new Fake(self).fake;

  var Unique = require('./unique');
  self.unique = new Unique(self).unique;

  var Mersenne = require('./mersenne');
  self.mersenne = new Mersenne();

  var Random = require('./random');
  self.random = new Random(self);

  var Helpers = require('./helpers');
  self.helpers = new Helpers(self);

  var Name = require('./name');
  self.name = new Name(self);

  var Address = require('./address');
  self.address = new Address(self);

  var Animal = require('./animal');
  self.animal = new Animal(self);

  var Company = require('./company');
  self.company = new Company(self);

  var Finance = require('./finance');
  self.finance = new Finance(self);

  var Image = require('./image');
  self.image = new Image(self);

  var Lorem = require('./lorem');
  self.lorem = new Lorem(self);

  var Hacker = require('./hacker');
  self.hacker = new Hacker(self);

  var Internet = require('./internet');
  self.internet = new Internet(self);

  var Database = require('./database');
  self.database = new Database(self);

  var Phone = require('./phone_number');
  self.phone = new Phone(self);

  var _Date = require('./date');
  self.date = new _Date(self);

  var _Time = require('./time');
  self.time = new _Time(self);

  var Commerce = require('./commerce');
  self.commerce = new Commerce(self);

  var System = require('./system');
  self.system = new System(self);

  var Git = require('./git');
  self.git = new Git(self);

  var Vehicle = require('./vehicle');
  self.vehicle = new Vehicle(self);

  var Music = require('./music');
  self.music = new Music(self);

  var Datatype = require('./datatype');
  self.datatype = new Datatype(self);

  var Word = require('./word');
  self.word = new Word(self);
};

Faker.prototype.setLocale = function (locale) {
  this.locale = locale;
}

Faker.prototype.seed = function(value) {
  var Random = require('./random');
  var Datatype = require('./datatype');
  this.seedValue = value;
  this.random = new Random(this, this.seedValue);
  this.datatype = new Datatype(this, this.seedValue);
}
module['exports'] = Faker;
},{"./address":2,"./animal":3,"./commerce":4,"./company":5,"./database":6,"./datatype":7,"./date":8,"./fake":9,"./finance":10,"./git":11,"./hacker":12,"./helpers":13,"./image":15,"./internet":20,"./lorem":21,"./mersenne":22,"./music":23,"./name":24,"./phone_number":25,"./random":26,"./system":27,"./time":28,"./unique":29,"./vehicle":30,"./word":31}],20:[function(require,module,exports){
var random_ua = require('../vendor/user-agent');

/**
 *
 * @namespace faker.internet
 */
var Internet = function (faker) {
  var self = this;
  /**
   * avatar
   *
   * @method faker.internet.avatar
   */
  self.avatar = function () {
    return 'https://cdn.fakercloud.com/avatars/' + faker.random.arrayElement(faker.definitions.internet.avatar_uri);
  };

  self.avatar.schema = {
    "description": "Generates a URL for an avatar.",
    "sampleResults": ["https://cdn.fakercloud.com/avatars/sydlawrence_128.jpg"]
  };

  /**
   * email
   *
   * @method faker.internet.email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} provider
   */
  self.email = function (firstName, lastName, provider) {
    provider = provider || faker.random.arrayElement(faker.definitions.internet.free_email);
    return  faker.helpers.slugify(faker.internet.userName(firstName, lastName)) + "@" + provider;
  };

  self.email.schema = {
    "description": "Generates a valid email address based on optional input criteria",
    "sampleResults": ["foo.bar@gmail.com"],
    "properties": {
      "firstName": {
        "type": "string",
        "required": false,
        "description": "The first name of the user"
      },
      "lastName": {
        "type": "string",
        "required": false,
        "description": "The last name of the user"
      },
      "provider": {
        "type": "string",
        "required": false,
        "description": "The domain of the user"
      }
    }
  };
  /**
   * exampleEmail
   *
   * @method faker.internet.exampleEmail
   * @param {string} firstName
   * @param {string} lastName
   */
  self.exampleEmail = function (firstName, lastName) {
    var provider = faker.random.arrayElement(faker.definitions.internet.example_email);
    return self.email(firstName, lastName, provider);
  };

  /**
   * userName
   *
   * @method faker.internet.userName
   * @param {string} firstName
   * @param {string} lastName
   */
  self.userName = function (firstName, lastName) {
    var result;
    firstName = firstName || faker.name.firstName();
    lastName = lastName || faker.name.lastName();
    switch (faker.datatype.number(2)) {
      case 0:
        result = firstName + faker.datatype.number(99);
        break;
      case 1:
        result = firstName + faker.random.arrayElement([".", "_"]) + lastName;
        break;
      case 2:
        result = firstName + faker.random.arrayElement([".", "_"]) + lastName + faker.datatype.number(99);
        break;
    }
    result = result.toString().replace(/'/g, "");
    result = result.replace(/ /g, "");
    return result;
  };

  self.userName.schema = {
    "description": "Generates a username based on one of several patterns. The pattern is chosen randomly.",
    "sampleResults": [
      "Kirstin39",
      "Kirstin.Smith",
      "Kirstin.Smith39",
      "KirstinSmith",
      "KirstinSmith39",
    ],
    "properties": {
      "firstName": {
        "type": "string",
        "required": false,
        "description": "The first name of the user"
      },
      "lastName": {
        "type": "string",
        "required": false,
        "description": "The last name of the user"
      }
    }
  };

  /**
   * protocol
   *
   * @method faker.internet.protocol
   */
  self.protocol = function () {
    var protocols = ['http','https'];
    return faker.random.arrayElement(protocols);
  };

  self.protocol.schema = {
    "description": "Randomly generates http or https",
    "sampleResults": ["https", "http"]
  };

  /**
   * method
   *
   * @method faker.internet.httpMethod
   */
  self.httpMethod = function () {
    var httpMethods = ['GET','POST', 'PUT', 'DELETE', 'PATCH'];
    return faker.random.arrayElement(httpMethods);
  };

  self.httpMethod.schema = {
    "description": "Randomly generates HTTP Methods (GET, POST, PUT, DELETE, PATCH)",
    "sampleResults": ["GET","POST", "PUT", "DELETE", "PATCH"]
  };

  /**
   * url
   *
   * @method faker.internet.url
   */
  self.url = function () {
    return faker.internet.protocol() + '://' + faker.internet.domainName();
  };

  self.url.schema = {
    "description": "Generates a random URL. The URL could be secure or insecure.",
    "sampleResults": [
      "http://rashawn.name",
      "https://rashawn.name"
    ]
  };

  /**
   * domainName
   *
   * @method faker.internet.domainName
   */
  self.domainName = function () {
    return faker.internet.domainWord() + "." + faker.internet.domainSuffix();
  };

  self.domainName.schema = {
    "description": "Generates a random domain name.",
    "sampleResults": ["marvin.org"]
  };

  /**
   * domainSuffix
   *
   * @method faker.internet.domainSuffix
   */
  self.domainSuffix = function () {
    return faker.random.arrayElement(faker.definitions.internet.domain_suffix);
  };

  self.domainSuffix.schema = {
    "description": "Generates a random domain suffix.",
    "sampleResults": ["net"]
  };

  /**
   * domainWord
   *
   * @method faker.internet.domainWord
   */
  self.domainWord = function () {
    return (faker.word.adjective() + '-' + faker.word.noun()).replace(/([\\~#&*{}/:<>?|\"'])/ig, '').toLowerCase();
  };

  self.domainWord.schema = {
    "description": "Generates a random domain word.",
    "sampleResults": ["alyce"]
  };

  /**
   * ip
   *
   * @method faker.internet.ip
   */
  self.ip = function () {
    var randNum = function () {
      return (faker.datatype.number(255)).toFixed(0);
    };

    var result = [];
    for (var i = 0; i < 4; i++) {
      result[i] = randNum();
    }

    return result.join(".");
  };

  self.ip.schema = {
    "description": "Generates a random IP.",
    "sampleResults": ["97.238.241.11"]
  };

  /**
   * ipv6
   *
   * @method faker.internet.ipv6
   */
  self.ipv6 = function () {
    var randHash = function () {
      var result = "";
      for (var i = 0; i < 4; i++) {
        result += (faker.random.arrayElement(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]));
      }
      return result
    };

    var result = [];
    for (var i = 0; i < 8; i++) {
      result[i] = randHash();
    }
    return result.join(":");
  };

  self.ipv6.schema = {
    "description": "Generates a random IPv6 address.",
    "sampleResults": ["2001:0db8:6276:b1a7:5213:22f1:25df:c8a0"]
  };

  /**
   * port
   * 
   * @method faker.internet.port
   */
  self.port = function() {
    return faker.datatype.number({ min: 0, max: 65535 });
  };

  self.port.schema = {
    "description": "Generates a random port number.",
    "sampleResults": ["4422"]
  };

  /**
   * userAgent
   *
   * @method faker.internet.userAgent
   */
  self.userAgent = function () {
    return random_ua.generate(faker);
  };

  self.userAgent.schema = {
    "description": "Generates a random user agent.",
    "sampleResults": ["Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_7_5 rv:6.0; SL) AppleWebKit/532.0.1 (KHTML, like Gecko) Version/7.1.6 Safari/532.0.1"]
  };

  /**
   * color
   *
   * @method faker.internet.color
   * @param {number} baseRed255
   * @param {number} baseGreen255
   * @param {number} baseBlue255
   */
  self.color = function (baseRed255, baseGreen255, baseBlue255) {
    baseRed255 = baseRed255 || 0;
    baseGreen255 = baseGreen255 || 0;
    baseBlue255 = baseBlue255 || 0;
    // based on awesome response : http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
    var red = Math.floor((faker.datatype.number(256) + baseRed255) / 2);
    var green = Math.floor((faker.datatype.number(256) + baseGreen255) / 2);
    var blue = Math.floor((faker.datatype.number(256) + baseBlue255) / 2);
    var redStr = red.toString(16);
    var greenStr = green.toString(16);
    var blueStr = blue.toString(16);
    return '#' +
        (redStr.length === 1 ? '0' : '') + redStr +
        (greenStr.length === 1 ? '0' : '') + greenStr +
        (blueStr.length === 1 ? '0': '') + blueStr;

  };

  self.color.schema = {
    "description": "Generates a random hexadecimal color.",
    "sampleResults": ["#06267f"],
    "properties": {
      "baseRed255": {
        "type": "number",
        "required": false,
        "description": "The red value. Valid values are 0 - 255."
      },
      "baseGreen255": {
        "type": "number",
        "required": false,
        "description": "The green value. Valid values are 0 - 255."
      },
      "baseBlue255": {
        "type": "number",
        "required": false,
        "description": "The blue value. Valid values are 0 - 255."
      }
    }
  };

  /**
   * mac
   *
   * @method faker.internet.mac
   * @param {string} sep
   */
  self.mac = function(sep){
    var i, 
      mac = "",
      validSep = ':';

    // if the client passed in a different separator than `:`, 
    // we will use it if it is in the list of acceptable separators (dash or no separator)
    if (['-', ''].indexOf(sep) !== -1) {
      validSep = sep;
    } 

    for (i=0; i < 12; i++) {
      mac+= faker.datatype.number(15).toString(16);
      if (i%2==1 && i != 11) {
        mac+=validSep;
      }
    }
    return mac;
  };

  self.mac.schema = {
    "description": "Generates a random mac address.",
    "sampleResults": ["78:06:cc:ae:b3:81"]
  };

  /**
   * password
   *
   * @method faker.internet.password
   * @param {number} len
   * @param {boolean} memorable
   * @param {string} pattern
   * @param {string} prefix
   */
  self.password = function (len, memorable, pattern, prefix) {
    len = len || 15;
    if (typeof memorable === "undefined") {
      memorable = false;
    }
    /*
      * password-generator ( function )
      * Copyright(c) 2011-2013 Bermi Ferrer <bermi@bermilabs.com>
      * MIT Licensed
      */
    var consonant, letter, vowel;
    letter = /[a-zA-Z]$/;
    vowel = /[aeiouAEIOU]$/;
    consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
    var _password = function (length, memorable, pattern, prefix) {
      var char, n;
      if (length == null) {
        length = 10;
      }
      if (memorable == null) {
        memorable = true;
      }
      if (pattern == null) {
        pattern = /\w/;
      }
      if (prefix == null) {
        prefix = '';
      }
      if (prefix.length >= length) {
        return prefix;
      }
      if (memorable) {
        if (prefix.match(consonant)) {
          pattern = vowel;
        } else {
          pattern = consonant;
        }
      }
      n = faker.datatype.number(94) + 33;
      char = String.fromCharCode(n);
      if (memorable) {
        char = char.toLowerCase();
      }
      if (!char.match(pattern)) {
        return _password(length, memorable, pattern, prefix);
      }
      return _password(length, memorable, pattern, "" + prefix + char);
    };
    return _password(len, memorable, pattern, prefix);
  }

  self.password.schema = {
    "description": "Generates a random password.",
    "sampleResults": [
      "AM7zl6Mg",
      "susejofe"
    ],
    "properties": {
      "length": {
        "type": "number",
        "required": false,
        "description": "The number of characters in the password."
      },
      "memorable": {
        "type": "boolean",
        "required": false,
        "description": "Whether a password should be easy to remember."
      },
      "pattern": {
        "type": "regex",
        "required": false,
        "description": "A regex to match each character of the password against. This parameter will be negated if the memorable setting is turned on."
      },
      "prefix": {
        "type": "string",
        "required": false,
        "description": "A value to prepend to the generated password. The prefix counts towards the length of the password."
      }
    }
  };

};


module["exports"] = Internet;

},{"../vendor/user-agent":34}],21:[function(require,module,exports){

/**
 *
 * @namespace faker.lorem
 */
var Lorem = function (faker) {
  var self = this;
  var Helpers = faker.helpers;

  /**
   * generates a word of a specified length
   *
   * @method faker.lorem.word
   * @param {number} length length of the word that should be returned. Defaults to a random length
   */
  self.word = function (length) {
    var hasRightLength = function(word) { return word.length === length; };
    var properLengthWords;
    if(typeof length === 'undefined') {
      properLengthWords = faker.definitions.lorem.words;
    } else {
      properLengthWords = faker.definitions.lorem.words.filter(hasRightLength);
    }
    return faker.random.arrayElement(properLengthWords);
  };

  /**
   * generates a space separated list of words
   *
   * @method faker.lorem.words
   * @param {number} num number of words, defaults to 3
   */
  self.words = function (num) {
    if (typeof num == 'undefined') { num = 3; }
    var words = [];
    for (var i = 0; i < num; i++) {
      words.push(faker.lorem.word());
    }
    return words.join(' ');
  };

  /**
   * sentence
   *
   * @method faker.lorem.sentence
   * @param {number} wordCount defaults to a random number between 3 and 10
   * @param {number} range
   */
  self.sentence = function (wordCount, range) {
    if (typeof wordCount == 'undefined') { wordCount = faker.datatype.number({ min: 3, max: 10 }); }
    // if (typeof range == 'undefined') { range = 7; }

    // strange issue with the node_min_test failing for captialize, please fix and add faker.lorem.back
    //return  faker.lorem.words(wordCount + Helpers.randomNumber(range)).join(' ').capitalize();

    var sentence = faker.lorem.words(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  /**
   * slug
   *
   * @method faker.lorem.slug
   * @param {number} wordCount number of words, defaults to 3
   */
  self.slug = function (wordCount) {
    var words = faker.lorem.words(wordCount);
    return Helpers.slugify(words);
  };

  /**
   * sentences
   *
   * @method faker.lorem.sentences
   * @param {number} sentenceCount defautls to a random number between 2 and 6
   * @param {string} separator defaults to `' '`
   */
  self.sentences = function (sentenceCount, separator) {
    if (typeof sentenceCount === 'undefined') { sentenceCount = faker.datatype.number({ min: 2, max: 6 });}
    if (typeof separator == 'undefined') { separator = " "; }
    var sentences = [];
    for (sentenceCount; sentenceCount > 0; sentenceCount--) {
      sentences.push(faker.lorem.sentence());
    }
    return sentences.join(separator);
  };

  /**
   * paragraph
   *
   * @method faker.lorem.paragraph
   * @param {number} sentenceCount defaults to 3
   */
  self.paragraph = function (sentenceCount) {
    if (typeof sentenceCount == 'undefined') { sentenceCount = 3; }
    return faker.lorem.sentences(sentenceCount + faker.datatype.number(3));
  };

  /**
   * paragraphs
   *
   * @method faker.lorem.paragraphs
   * @param {number} paragraphCount defaults to 3
   * @param {string} separator defaults to `'\n \r'`
   */
  self.paragraphs = function (paragraphCount, separator) {
    if (typeof separator === "undefined") {
      separator = "\n \r";
    }
    if (typeof paragraphCount == 'undefined') { paragraphCount = 3; }
    var paragraphs = [];
    for (paragraphCount; paragraphCount > 0; paragraphCount--) {
      paragraphs.push(faker.lorem.paragraph());
    }
    return paragraphs.join(separator);
  }

  /**
   * returns random text based on a random lorem method
   *
   * @method faker.lorem.text
   * @param {number} times
   */
  self.text = function loremText (times) {
    var loremMethods = ['lorem.word', 'lorem.words', 'lorem.sentence', 'lorem.sentences', 'lorem.paragraph', 'lorem.paragraphs', 'lorem.lines'];
    var randomLoremMethod = faker.random.arrayElement(loremMethods);
    return faker.fake('{{' + randomLoremMethod + '}}');
  };

  /**
   * returns lines of lorem separated by `'\n'`
   *
   * @method faker.lorem.lines
   * @param {number} lineCount defaults to a random number between 1 and 5
   */
  self.lines = function lines (lineCount) {
    if (typeof lineCount === 'undefined') { lineCount = faker.datatype.number({ min: 1, max: 5 });}
    return faker.lorem.sentences(lineCount, '\n')
  };

  return self;
};


module["exports"] = Lorem;

},{}],22:[function(require,module,exports){
var Gen = require('../vendor/mersenne').MersenneTwister19937;

function Mersenne() {
  var gen = new Gen();
  gen.init_genrand((new Date).getTime() % 1000000000);

  this.rand = function(max, min) {
    if (max === undefined)
    {
      min = 0;
      max = 32768;
    }
    return Math.floor(gen.genrand_real2() * (max - min) + min);
  }
  this.seed = function(S) {
    if (typeof(S) != 'number')
    {
      throw new Error("seed(S) must take numeric argument; is " + typeof(S));
    }
    gen.init_genrand(S);
  }
  this.seed_array = function(A) {
    if (typeof(A) != 'object')
    {
      throw new Error("seed_array(A) must take array of numbers; is " + typeof(A));
    }
    gen.init_by_array(A, A.length);
  }
}

module.exports = Mersenne;

},{"../vendor/mersenne":32}],23:[function(require,module,exports){
/**
 *
 * @namespace faker.music
 */
var Music = function (faker) {
  var self = this;
  /**
     * genre
     *
     * @method faker.music.genre
     */
  self.genre = function () {
    return faker.random.arrayElement(faker.definitions.music.genre);
  };

  self.genre.schema = {
    "description": "Generates a genre.",
    "sampleResults": ["Rock", "Metal", "Pop"]
  };
};

module["exports"] = Music;

},{}],24:[function(require,module,exports){
/**
 *
 * @namespace faker.name
 */
function Name (faker) {

  /**
   * firstName
   *
   * @method firstName
   * @param {mixed} gender
   * @memberof faker.name
   */
  this.firstName = function (gender) {
    if (typeof faker.definitions.name.male_first_name !== "undefined" && typeof faker.definitions.name.female_first_name !== "undefined") {
      // some locale datasets ( like ru ) have first_name split by gender. since the name.first_name field does not exist in these datasets,
      // we must randomly pick a name from either gender array so faker.name.firstName will return the correct locale data ( and not fallback )

      if(typeof gender === 'string') {
        if(gender.toLowerCase() === 'male') {
          gender = 0;
        }
        else if(gender.toLowerCase() === 'female') {
          gender = 1;
        }
      }

      if (typeof gender !== 'number') {
        if(typeof faker.definitions.name.first_name === "undefined") {
          gender = faker.datatype.number(1);
        }
        else {
          //Fall back to non-gendered names if they exist and gender wasn't specified
          return faker.random.arrayElement(faker.definitions.name.first_name);
        }
      }
      if (gender === 0) {
        return faker.random.arrayElement(faker.definitions.name.male_first_name)
      } else {
        return faker.random.arrayElement(faker.definitions.name.female_first_name);
      }
    }
    return faker.random.arrayElement(faker.definitions.name.first_name);
  };

  /**
   * lastName
   *
   * @method lastName
   * @param {mixed} gender
   * @memberof faker.name
   */
  this.lastName = function (gender) {
    if (typeof faker.definitions.name.male_last_name !== "undefined" && typeof faker.definitions.name.female_last_name !== "undefined") {
      // some locale datasets ( like ru ) have last_name split by gender. i have no idea how last names can have genders, but also i do not speak russian
      // see above comment of firstName method
      if (typeof gender !== 'number') {
        gender = faker.datatype.number(1);
      }
      if (gender === 0) {
        return faker.random.arrayElement(faker.locales[faker.locale].name.male_last_name);
      } else {
        return faker.random.arrayElement(faker.locales[faker.locale].name.female_last_name);
      }
    }
    return faker.random.arrayElement(faker.definitions.name.last_name);
  };

  /**
   * middleName
   *
   * @method middleName
   * @param {mixed} gender
   * @memberof faker.name
   */
  this.middleName = function (gender) {
    if (typeof faker.definitions.name.male_middle_name !== "undefined" && typeof faker.definitions.name.female_middle_name !== "undefined") {
      if (typeof gender !== 'number') {
        gender = faker.datatype.number(1);
      }
      if (gender === 0) {
        return faker.random.arrayElement(faker.locales[faker.locale].name.male_middle_name);
      } else {
        return faker.random.arrayElement(faker.locales[faker.locale].name.female_middle_name);
      }
    }
    return faker.random.arrayElement(faker.definitions.name.middle_name);
  };

  /**
   * findName
   *
   * @method findName
   * @param {string} firstName
   * @param {string} lastName
   * @param {mixed} gender
   * @memberof faker.name
   */
  this.findName = function (firstName, lastName, gender) {
    var r = faker.datatype.number(8);
    var prefix, suffix;
    // in particular locales first and last names split by gender,
    // thus we keep consistency by passing 0 as male and 1 as female
    if (typeof gender !== 'number') {
      gender = faker.datatype.number(1);
    }
    firstName = firstName || faker.name.firstName(gender);
    lastName = lastName || faker.name.lastName(gender);
    switch (r) {
      case 0:
        prefix = faker.name.prefix(gender);
        if (prefix) {
          return prefix + " " + firstName + " " + lastName;
        }
      case 1:
        suffix = faker.name.suffix(gender);
        if (suffix) {
          return firstName + " " + lastName + " " + suffix;
        }
    }

    return firstName + " " + lastName;
  };

  /**
   * jobTitle
   *
   * @method jobTitle
   * @memberof faker.name
   */
  this.jobTitle = function () {
    return  faker.name.jobDescriptor() + " " +
      faker.name.jobArea() + " " +
      faker.name.jobType();
  };

  /**
   * gender
   *
   * @method gender
   * @memberof faker.name
   */
  this.gender = function (binary) {
    if (binary) {
      return faker.random.arrayElement(faker.definitions.name.binary_gender);
    } else {
      return faker.random.arrayElement(faker.definitions.name.gender);
    }
  }
  
  /**
   * prefix
   *
   * @method prefix
   * @param {mixed} gender
   * @memberof faker.name
   */
  this.prefix = function (gender) {
    if (typeof faker.definitions.name.male_prefix !== "undefined" && typeof faker.definitions.name.female_prefix !== "undefined") {
      if (typeof gender !== 'number') {
        gender = faker.datatype.number(1);
      }
      if (gender === 0) {
        return faker.random.arrayElement(faker.locales[faker.locale].name.male_prefix);
      } else {
        return faker.random.arrayElement(faker.locales[faker.locale].name.female_prefix);
      }
    }
    return faker.random.arrayElement(faker.definitions.name.prefix);
  };

  /**
   * suffix
   *
   * @method suffix
   * @memberof faker.name
   */
  this.suffix = function () {
    return faker.random.arrayElement(faker.definitions.name.suffix);
  };

  /**
   * title
   *
   * @method title
   * @memberof faker.name
   */
  this.title = function() {
    var descriptor  = faker.random.arrayElement(faker.definitions.name.title.descriptor),
      level       = faker.random.arrayElement(faker.definitions.name.title.level),
      job         = faker.random.arrayElement(faker.definitions.name.title.job);

    return descriptor + " " + level + " " + job;
  };

  /**
   * jobDescriptor
   *
   * @method jobDescriptor
   * @memberof faker.name
   */
  this.jobDescriptor = function () {
    return faker.random.arrayElement(faker.definitions.name.title.descriptor);
  };

  /**
   * jobArea
   *
   * @method jobArea
   * @memberof faker.name
   */
  this.jobArea = function () {
    return faker.random.arrayElement(faker.definitions.name.title.level);
  };

  /**
   * jobType
   *
   * @method jobType
   * @memberof faker.name
   */
  this.jobType = function () {
    return faker.random.arrayElement(faker.definitions.name.title.job);
  };

}

module['exports'] = Name;

},{}],25:[function(require,module,exports){
/**
 *
 * @namespace faker.phone
 */
var Phone = function (faker) {
  var self = this;

  /**
   * phoneNumber
   *
   * @method faker.phone.phoneNumber
   * @param {string} format
   * @memberOf faker.phone
   */
  self.phoneNumber = function (format) {
    format = format || faker.phone.phoneFormats();
    return faker.helpers.replaceSymbolWithNumber(format);
  };

  // FIXME: this is strange passing in an array index.
  /**
   * phoneNumberFormat
   *
   * @method faker.phone.phoneFormatsArrayIndex
   * @param phoneFormatsArrayIndex
   * @memberOf faker.phone
   */
  self.phoneNumberFormat = function (phoneFormatsArrayIndex) {
    phoneFormatsArrayIndex = phoneFormatsArrayIndex || 0;
    return faker.helpers.replaceSymbolWithNumber(faker.definitions.phone_number.formats[phoneFormatsArrayIndex]);
  };

  /**
   * phoneFormats
   *
   * @method faker.phone.phoneFormats
   */
  self.phoneFormats = function () {
    return faker.random.arrayElement(faker.definitions.phone_number.formats);
  };
  
  return self;

};

module['exports'] = Phone;

},{}],26:[function(require,module,exports){
/**
 * Method to reduce array of characters
 * @param arr existing array of characters
 * @param values array of characters which should be removed
 * @return {*} new array without banned characters
 */
var arrayRemove = function (arr, values) {
  values.forEach(function(value){
    arr = arr.filter(function(ele){
      return ele !== value;
    });
  });
  return arr;
};

/**
 *
 * @namespace faker.random
 */
function Random (faker, seed) {
  // Use a user provided seed if it is an array or number
  if (Array.isArray(seed) && seed.length) {
    faker.mersenne.seed_array(seed);
  }
  else if(!isNaN(seed)) {
    faker.mersenne.seed(seed);
  }

  /**
   * @Deprecated
   * returns a single random number based on a max number or range
   *
   * @method faker.random.number
   * @param {mixed} options {min, max, precision}
   */
  this.number = function (options) {
    console.log("Deprecation Warning: faker.random.number is now located in faker.datatype.number");
    return faker.datatype.number(options);
  };

  /**
   * @Deprecated
   * returns a single random floating-point number based on a max number or range
   *
   * @method faker.random.float
   * @param {mixed} options
   */
  this.float = function (options) {
    console.log("Deprecation Warning: faker.random.float is now located in faker.datatype.float");
    return faker.datatype.float(options);
  };

  /**
   * takes an array and returns a random element of the array
   *
   * @method faker.random.arrayElement
   * @param {array} array
   */
  this.arrayElement = function (array) {
    array = array || ["a", "b", "c"];
    var r = faker.datatype.number({ max: array.length - 1 });
    return array[r];
  };

  /**
   * takes an array and returns a subset with random elements of the array
   *
   * @method faker.random.arrayElements
   * @param {array} array
   * @param {number} count number of elements to pick
   */
  this.arrayElements = function (array, count) {
    array = array || ["a", "b", "c"];

    if (typeof count !== 'number') {
      count = faker.datatype.number({ min: 1, max: array.length });
    } else if (count > array.length) {
      count = array.length;
    } else if (count < 0) {
      count = 0;
    }

    var arrayCopy = array.slice(0);
    var i = array.length;
    var min = i - count;
    var temp;
    var index;

    while (i-- > min) {
      index = Math.floor((i + 1) * faker.datatype.float({ min: 0, max: 0.99 }));
      temp = arrayCopy[index];
      arrayCopy[index] = arrayCopy[i];
      arrayCopy[i] = temp;
    }

    return arrayCopy.slice(min);
  };

  /**
   * takes an object and returns a random key or value
   *
   * @method faker.random.objectElement
   * @param {object} object
   * @param {mixed} field
   */
  this.objectElement = function (object, field) {
    object = object || { "foo": "bar", "too": "car" };
    var array = Object.keys(object);
    var key = faker.random.arrayElement(array);

    return field === "key" ? key : object[key];
  };

  /**
   * @Deprecated
   * uuid
   *
   * @method faker.random.uuid
   */
  this.uuid = function () {
    console.log("Deprecation Warning: faker.random.uuid is now located in faker.datatype.uuid");
    return faker.datatype.uuid();
  };

  /**
   * boolean
   *
   * @method faker.random.boolean
   */
  this.boolean = function () {
    console.log("Deprecation Warning: faker.random.boolean is now located in faker.datatype.boolean");
    return faker.datatype.boolean();
  };

  // TODO: have ability to return specific type of word? As in: noun, adjective, verb, etc
  /**
   * word
   *
   * @method faker.random.word
   * @param {string} type
   */
  this.word = function randomWord (type) {

    var wordMethods = [
      'commerce.department',
      'commerce.productName',
      'commerce.productAdjective',
      'commerce.productMaterial',
      'commerce.product',
      'commerce.color',

      'company.catchPhraseAdjective',
      'company.catchPhraseDescriptor',
      'company.catchPhraseNoun',
      'company.bsAdjective',
      'company.bsBuzz',
      'company.bsNoun',
      'address.streetSuffix',
      'address.county',
      'address.country',
      'address.state',

      'finance.accountName',
      'finance.transactionType',
      'finance.currencyName',

      'hacker.noun',
      'hacker.verb',
      'hacker.adjective',
      'hacker.ingverb',
      'hacker.abbreviation',

      'name.jobDescriptor',
      'name.jobArea',
      'name.jobType'];

    // randomly pick from the many faker methods that can generate words
    var randomWordMethod = faker.random.arrayElement(wordMethods);
    var result = faker.fake('{{' + randomWordMethod + '}}');
    return faker.random.arrayElement(result.split(' '));
  };

  /**
   * randomWords
   *
   * @method faker.random.words
   * @param {number} count defaults to a random value between 1 and 3
   */
  this.words = function randomWords (count) {
    var words = [];
    if (typeof count === "undefined") {
      count = faker.datatype.number({min:1, max: 3});
    }
    for (var i = 0; i<count; i++) {
      words.push(faker.random.word());
    }
    return words.join(' ');
  };

  /**
   * locale
   *
   * @method faker.random.image
   */
  this.image = function randomImage () {
    return faker.image.image();
  };

  /**
   * locale
   *
   * @method faker.random.locale
   */
  this.locale = function randomLocale () {
    return faker.random.arrayElement(Object.keys(faker.locales));
  };

  /**
   * alpha. returns lower/upper alpha characters based count and upcase options
   *
   * @method faker.random.alpha
   * @param {mixed} options // defaults to { count: 1, upcase: false, bannedChars: [] }
   */
  this.alpha = function alpha(options) {
    if (typeof options === "undefined") {
      options = {
        count: 1
      };
    } else if (typeof options === "number") {
      options = {
        count: options,
      };
    } else if (typeof options.count === "undefined") {
      options.count = 1;
    }

    if (typeof options.upcase === "undefined") {
      options.upcase = false;
    }
    if (typeof options.bannedChars ==="undefined"){
      options.bannedChars = [];
    }

    var wholeString = "";
    var charsArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    if(options.bannedChars){
      charsArray = arrayRemove(charsArray,options.bannedChars);
    }
    for(var i = 0; i < options.count; i++) {
      wholeString += faker.random.arrayElement(charsArray);
    }

    return options.upcase ? wholeString.toUpperCase() : wholeString;
  }

  /**
   * alphaNumeric
   *
   * @method faker.random.alphaNumeric
   * @param {number} count defaults to 1
   * {mixed} options // defaults to { bannedChars: [] }
   * options.bannedChars - array of characters which should be banned in new string
   */
  this.alphaNumeric = function alphaNumeric(count, options) {
    if (typeof count === "undefined") {
      count = 1;
    }
    if (typeof options ==="undefined"){
      options = {};
    }
    if (typeof options.bannedChars ==="undefined"){
      options.bannedChars = [];
    }

    var wholeString = "";
    var charsArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    if(options) {
      if (options.bannedChars) {
        charsArray = arrayRemove(charsArray, options.bannedChars);
      }
    }
    for(var i = 0; i < count; i++) {
      wholeString += faker.random.arrayElement(charsArray);
    }

    return wholeString;
  };

  /**
   * @Deprecated
   * hexaDecimal
   *
   * @method faker.random.hexaDecimal
   * @param {number} count defaults to 1
   */
  this.hexaDecimal = function hexaDecimal(count) {
    console.log("Deprecation Warning: faker.random.hexaDecimal is now located in faker.datatype.hexaDecimal");
    return faker.datatype.hexaDecimal(count);
  };

  return this;

}

module['exports'] = Random;

},{}],27:[function(require,module,exports){
// generates fake data for many computer systems properties

var commonFileTypes = [
  "video",
  "audio",
  "image",
  "text",
  "application"
];

var commonMimeTypes = [
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "image/png",
  "image/jpeg",
  "image/gif",
  "video/mp4",
  "video/mpeg",
  "text/html"
];

function setToArray(set) {
  // shortcut if Array.from is available
  if (Array.from) { return Array.from(set); }

  var array = [];
  set.forEach(function (item) {
    array.push(item);
  });
  return array;
}

/**
 *
 * @namespace faker.system
 */
function System(faker) {

  /**
   * generates a file name
   *
   * @method faker.system.fileName
   */
  this.fileName = function () {
    var str = faker.random.words(); 
    str = str
          .toLowerCase()
          .replace(/\W/g, "_") + "." + faker.system.fileExt();;
    return str;
  };

  /**
   * commonFileName
   *
   * @method faker.system.commonFileName
   * @param {string} ext
   */
  this.commonFileName = function (ext) {
    var str = faker.random.words();
    str = str
          .toLowerCase()
          .replace(/\W/g, "_");
    str += "." + (ext || faker.system.commonFileExt());
    return str;
  };

  /**
   * mimeType
   *
   * @method faker.system.mimeType
   */
  this.mimeType = function () {
    var typeSet = new Set();
    var extensionSet = new Set();
    var mimeTypes = faker.definitions.system.mimeTypes;

    Object.keys(mimeTypes).forEach(function (m) {
      var type = m.split("/")[0];

      typeSet.add(type);

      if (mimeTypes[m].extensions instanceof Array) {
        mimeTypes[m].extensions.forEach(function (ext) {
          extensionSet.add(ext);
        });
      }
    });

    var types = setToArray(typeSet);
    var extensions = setToArray(extensionSet);
    var mimeTypeKeys = Object.keys(faker.definitions.system.mimeTypes);

    return faker.random.arrayElement(mimeTypeKeys);
  };

  /**
   * returns a commonly used file type
   *
   * @method faker.system.commonFileType
   */
  this.commonFileType = function () {
    return faker.random.arrayElement(commonFileTypes);
  };

  /**
   * returns a commonly used file extension
   *
   * @method faker.system.commonFileExt
   */
  this.commonFileExt = function () {
    return faker.system.fileExt(faker.random.arrayElement(commonMimeTypes));
  };


  /**
   * returns any file type available as mime-type
   *
   * @method faker.system.fileType
   */
  this.fileType = function () {
    var typeSet = new Set();
    var extensionSet = new Set();
    var mimeTypes = faker.definitions.system.mimeTypes;

    Object.keys(mimeTypes).forEach(function (m) {
      var type = m.split("/")[0];

      typeSet.add(type);

      if (mimeTypes[m].extensions instanceof Array) {
        mimeTypes[m].extensions.forEach(function (ext) {
          extensionSet.add(ext);
        });
      }
    });

    var types = setToArray(typeSet);
    var extensions = setToArray(extensionSet);
    var mimeTypeKeys = Object.keys(faker.definitions.system.mimeTypes);
    return faker.random.arrayElement(types);

  };

  /**
   * fileExt
   *
   * @method faker.system.fileExt
   * @param {string} mimeType
   */
  this.fileExt = function (mimeType) {
    var typeSet = new Set();
    var extensionSet = new Set();
    var mimeTypes = faker.definitions.system.mimeTypes;

    Object.keys(mimeTypes).forEach(function (m) {
      var type = m.split("/")[0];

      typeSet.add(type);

      if (mimeTypes[m].extensions instanceof Array) {
        mimeTypes[m].extensions.forEach(function (ext) {
          extensionSet.add(ext);
        });
      }
    });

    var types = setToArray(typeSet);
    var extensions = setToArray(extensionSet);
    var mimeTypeKeys = Object.keys(faker.definitions.system.mimeTypes);

    if (mimeType) {
      var mimes = faker.definitions.system.mimeTypes;
      return faker.random.arrayElement(mimes[mimeType].extensions);
    }

    return faker.random.arrayElement(extensions);
  };

  /**
   * returns directory path
   *
   * @method faker.system.directoryPath
   */
  this.directoryPath = function () {
    var paths = faker.definitions.system.directoryPaths
    return faker.random.arrayElement(paths);
  };

  /**
   * returns file path
   *
   * @method faker.system.filePath
   */
  this.filePath = function () {
    return faker.fake("{{system.directoryPath}}/{{system.fileName}}.{{system.fileExt}}");
  };

  /**
   * semver
   *
   * @method faker.system.semver
   */
  this.semver = function () {
    return [faker.datatype.number(9),
      faker.datatype.number(9),
      faker.datatype.number(9)].join('.');
  }

}

module['exports'] = System;

},{}],28:[function(require,module,exports){
/**
 *
 * @namespace faker.time
 */
var _Time = function(faker) {
  var self = this;

  /**
   * recent
   *
   * @method faker.time.recent
   * @param {string} outputType - 'abbr' || 'wide' || 'unix' (default choice)
   */
  self.recent = function(outputType) {
    if (typeof outputType === "undefined") {
      outputType = 'unix';
    }

    var date = new Date();
    switch (outputType) {
      case "abbr":
        date = date.toLocaleTimeString();
        break;
      case "wide":
        date = date.toTimeString();
        break;
      case "unix":
        date = date.getTime();
        break;
    }
    return date;
  };

  return self;
};

module["exports"] = _Time;

},{}],29:[function(require,module,exports){
var uniqueExec = require('../vendor/unique');
/**
 *
 * @namespace faker.unique
 */
function Unique (faker) {

  // initialize unique module class variables

  // maximum time unique.exec will attempt to run before aborting
  var maxTime = 10;

  // maximum retries unique.exec will recurse before abortings ( max loop depth )
  var maxRetries = 10;

  // time the script started
  // var startTime = 0;

  /**
   * unique
   *
   * @method unique
   */
  this.unique = function unique (method, args, opts) {
    opts = opts || {};
    opts.startTime = new Date().getTime();
    if (typeof opts.maxTime !== 'number') {
      opts.maxTime = maxTime;
    }
    if (typeof opts.maxRetries !== 'number') {
      opts.maxRetries = maxRetries;
    }
    opts.currentIterations = 0;
    return uniqueExec.exec(method, args, opts);
  }
}

module['exports'] = Unique;
},{"../vendor/unique":33}],30:[function(require,module,exports){
/**
 *
 * @namespace faker.vehicle
 */
var Vehicle = function (faker) {
  var self = this;
  var fake = faker.fake;

  /**
   * vehicle
   *
   * @method faker.vehicle.vehicle
   */
  self.vehicle = function () {
    return fake('{{vehicle.manufacturer}} {{vehicle.model}}');
  };

  self.vehicle.schema = {
    "description": "Generates a random vehicle.",
    "sampleResults": ["BMW Explorer", "Ford Camry", "Lamborghini Ranchero"]
  };

  /**
   * manufacturer
   *
   * @method faker.vehicle.manufacturer
   */
  self.manufacturer = function () {
    return faker.random.arrayElement(faker.definitions.vehicle.manufacturer);
  };

  self.manufacturer.schema = {
    "description": "Generates a manufacturer name.",
    "sampleResults": ["Ford", "Jeep", "Tesla"]
  };


  /**
   * model
   *
   * @method faker.vehicle.model
   */
  self.model = function () {
    return faker.random.arrayElement(faker.definitions.vehicle.model);
  };

  self.model.schema = {
    "description": "Generates a vehicle model.",
    "sampleResults": ["Explorer", "Camry", "Ranchero"]
  };

  /**
   * type
   *
   * @method faker.vehicle.type
   */
  self.type = function () {
    return faker.random.arrayElement(faker.definitions.vehicle.type);
  };

  self.type.schema = {
    "description": "Generates a vehicle type.",
    "sampleResults": ["Coupe", "Convertable", "Sedan", "SUV"]
  };

  /**
   * fuel
   *
   * @method faker.vehicle.fuel
   */
  self.fuel = function () {
    return faker.random.arrayElement(faker.definitions.vehicle.fuel);
  };

  self.fuel.schema = {
    "description": "Generates a fuel type.",
    "sampleResults": ["Electric", "Gasoline", "Diesel"]
  };

  /**
   * vin
   *
   * @method faker.vehicle.vin
   */
  self.vin = function () {
    var bannedChars=['o','i','q'];
    return (
      faker.random.alphaNumeric(10, {bannedChars:bannedChars}) +
      faker.random.alpha({ count: 1, upcase: true ,bannedChars:bannedChars}) +
      faker.random.alphaNumeric(1, {bannedChars:bannedChars}) +
      faker.datatype.number({ min: 10000, max: 100000}) // return five digit #
    ).toUpperCase();
  };

  self.vin.schema = {
    "description": "Generates a valid VIN number.",
    "sampleResults": ["YV1MH682762184654", "3C7WRMBJ2EG208836"]
  };

  /**
   * color
   *
   * @method faker.vehicle.color
   */
  self.color = function () {
    return fake('{{commerce.color}}');
  };

  self.color.schema = {
    "description": "Generates a color",
    "sampleResults": ["red", "white", "black"]
  };

  /**
     * vrm
     *
     * @method faker.vehicle.vrm
     */
  self.vrm = function () {
    return (
      faker.random.alpha({ count: 2, upcase: true }) +
            faker.datatype.number({ min: 0, max: 9 }) +
            faker.datatype.number({ min: 0, max: 9 }) +
            faker.random.alpha({ count: 3, upcase: true })
    ).toUpperCase();
  };

  self.vrm.schema = {
    "description": "Generates a vehicle vrm",
    "sampleResults": ["MF56UPA", "GL19AAQ", "SF20TTA"]
  };

  /**
  * bicycle
  *
  * @method faker.vehicle.bicycle
  */
  self.bicycle = function () {
    return faker.random.arrayElement(faker.definitions.vehicle.bicycle_type);
  };

  self.bicycle.schema = {
    "description": "Generates a type of bicycle",
    "sampleResults": ["Adventure Road Bicycle", "City Bicycle", "Recumbent Bicycle"]
  };
};

module["exports"] = Vehicle;

},{}],31:[function(require,module,exports){
/**
 * @namespace faker.word
 */
var Word = function (faker) {
  var self = this;
  /**
   * Returns an adjective of random or optionally specified length.
   * If specified length is unresolvable, returns random adjective.
   *
   * @method faker.word.adjective
   * @param {number} [length] - optional length of word to return
   * @returns {string}          a random adjective
   */
  self.adjective = function (length) {
    var wordList = faker.definitions.word.adjective;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.adjective.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.adjective)
    );
  };
  /**
   * Returns an adverb of random or optionally specified length.
   * If specified length is unresolvable, returns random adverb.
   *
   * @method faker.word.adverb
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random adverb
   */
  self.adverb = function (length) {
    var wordList = faker.definitions.word.adverb;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.adverb.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.adverb)
    );
  };
  /**
   * Returns a conjunction of random or optionally specified length.
   * If specified length is unresolvable, returns random conjunction.
   *
   * @method faker.word.conjunction
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random conjunction
   */
  self.conjunction = function (length) {
    var wordList = faker.definitions.word.conjunction;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.conjunction.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.conjunction)
    );
  };
  /**
   * Returns an interjection of random or optionally specified length.
   * If specified length is unresolvable, returns random interjection.
   *
   * @method faker.word.interjection
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random interjection
   */
  self.interjection = function (length) {
    var wordList = faker.definitions.word.interjection;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.interjection.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.interjection)
    );
  };
  /**
   * Returns a noun of random or optionally specified length.
   * If specified length is unresolvable, returns random noun.
   *
   * @method faker.word.noun
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random noun
   */
  self.noun = function (length) {
    var wordList = faker.definitions.word.noun;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.noun.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.noun)
    );
  };
  /**
   * Returns a preposition of random or optionally specified length.
   * If specified length is unresolvable, returns random preposition.
   *
   * @method faker.word.preposition
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random preposition
   */
  self.preposition = function (length) {
    var wordList = faker.definitions.word.preposition;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.preposition.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.preposition)
    );
  };
  /**
   * Returns a verb of random or optionally specified length.
   * If specified length is unresolvable, returns random verb.
   *
   * @method faker.word.verb
   * @param {number} [length] - optional length of word to return
   * @returns {string}          random verb
   */
  self.verb = function (length) {
    var wordList = faker.definitions.word.verb;
    if (length !== undefined) {
      length = parseInt(length);
      wordList = faker.definitions.word.verb.filter(function (word) {
        return word.length == length;
      });
    }
    // If result of filtered word list is undefined, return an element
    // from the unfiltered list.
    return (
      faker.random.arrayElement(wordList) ||
      faker.random.arrayElement(faker.definitions.word.verb)
    );
  };

  return self;
};

module["exports"] = Word;

},{}],32:[function(require,module,exports){
// this program is a JavaScript version of Mersenne Twister, with concealment and encapsulation in class,
// an almost straight conversion from the original program, mt19937ar.c,
// translated by y. okada on July 17, 2006.
// and modified a little at july 20, 2006, but there are not any substantial differences.
// in this program, procedure descriptions and comments of original source code were not removed.
// lines commented with //c// were originally descriptions of c procedure. and a few following lines are appropriate JavaScript descriptions.
// lines commented with /* and */ are original comments.
// lines commented with // are additional comments in this JavaScript version.
// before using this version, create at least one instance of MersenneTwister19937 class, and initialize the each state, given below in c comments, of all the instances.
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

function MersenneTwister19937()
{
  /* constants should be scoped inside the class */
  var N, M, MATRIX_A, UPPER_MASK, LOWER_MASK;
  /* Period parameters */
  //c//#define N 624
  //c//#define M 397
  //c//#define MATRIX_A 0x9908b0dfUL   /* constant vector a */
  //c//#define UPPER_MASK 0x80000000UL /* most significant w-r bits */
  //c//#define LOWER_MASK 0x7fffffffUL /* least significant r bits */
  N = 624;
  M = 397;
  MATRIX_A = 0x9908b0df;   /* constant vector a */
  UPPER_MASK = 0x80000000; /* most significant w-r bits */
  LOWER_MASK = 0x7fffffff; /* least significant r bits */
  //c//static unsigned long mt[N]; /* the array for the state vector  */
  //c//static int mti=N+1; /* mti==N+1 means mt[N] is not initialized */
  var mt = new Array(N);   /* the array for the state vector  */
  var mti = N+1;           /* mti==N+1 means mt[N] is not initialized */

  function unsigned32 (n1) // returns a 32-bits unsiged integer from an operand to which applied a bit operator.
  {
    return n1 < 0 ? (n1 ^ UPPER_MASK) + UPPER_MASK : n1;
  }

  function subtraction32 (n1, n2) // emulates lowerflow of a c 32-bits unsiged integer variable, instead of the operator -. these both arguments must be non-negative integers expressible using unsigned 32 bits.
  {
    return n1 < n2 ? unsigned32((0x100000000 - (n2 - n1)) & 0xffffffff) : n1 - n2;
  }

  function addition32 (n1, n2) // emulates overflow of a c 32-bits unsiged integer variable, instead of the operator +. these both arguments must be non-negative integers expressible using unsigned 32 bits.
  {
    return unsigned32((n1 + n2) & 0xffffffff)
  }

  function multiplication32 (n1, n2) // emulates overflow of a c 32-bits unsiged integer variable, instead of the operator *. these both arguments must be non-negative integers expressible using unsigned 32 bits.
  {
    var sum = 0;
    for (var i = 0; i < 32; ++i){
      if ((n1 >>> i) & 0x1){
        sum = addition32(sum, unsigned32(n2 << i));
      }
    }
    return sum;
  }

  /* initializes mt[N] with a seed */
  //c//void init_genrand(unsigned long s)
  this.init_genrand = function (s)
  {
    //c//mt[0]= s & 0xffffffff;
    mt[0]= unsigned32(s & 0xffffffff);
    for (mti=1; mti<N; mti++) {
      mt[mti] =
			//c//(1812433253 * (mt[mti-1] ^ (mt[mti-1] >> 30)) + mti);
			addition32(multiplication32(1812433253, unsigned32(mt[mti-1] ^ (mt[mti-1] >>> 30))), mti);
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      //c//mt[mti] &= 0xffffffff;
      mt[mti] = unsigned32(mt[mti] & 0xffffffff);
      /* for >32 bit machines */
    }
  }

  /* initialize by an array with array-length */
  /* init_key is the array for initializing keys */
  /* key_length is its length */
  /* slight change for C++, 2004/2/26 */
  //c//void init_by_array(unsigned long init_key[], int key_length)
  this.init_by_array = function (init_key, key_length)
  {
    //c//int i, j, k;
    var i, j, k;
    //c//init_genrand(19650218);
    this.init_genrand(19650218);
    i=1; j=0;
    k = (N>key_length ? N : key_length);
    for (; k; k--) {
      //c//mt[i] = (mt[i] ^ ((mt[i-1] ^ (mt[i-1] >> 30)) * 1664525))
      //c//	+ init_key[j] + j; /* non linear */
      mt[i] = addition32(addition32(unsigned32(mt[i] ^ multiplication32(unsigned32(mt[i-1] ^ (mt[i-1] >>> 30)), 1664525)), init_key[j]), j);
      mt[i] =
			//c//mt[i] &= 0xffffffff; /* for WORDSIZE > 32 machines */
			unsigned32(mt[i] & 0xffffffff);
      i++; j++;
      if (i>=N) { mt[0] = mt[N-1]; i=1; }
      if (j>=key_length) {j=0;}
    }
    for (k=N-1; k; k--) {
      //c//mt[i] = (mt[i] ^ ((mt[i-1] ^ (mt[i-1] >> 30)) * 1566083941))
      //c//- i; /* non linear */
      mt[i] = subtraction32(unsigned32((dbg=mt[i]) ^ multiplication32(unsigned32(mt[i-1] ^ (mt[i-1] >>> 30)), 1566083941)), i);
      //c//mt[i] &= 0xffffffff; /* for WORDSIZE > 32 machines */
      mt[i] = unsigned32(mt[i] & 0xffffffff);
      i++;
      if (i>=N) { mt[0] = mt[N-1]; i=1; }
    }
    mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
  }

  /* moved outside of genrand_int32() by jwatte 2010-11-17; generate less garbage */
  var mag01 = [0x0, MATRIX_A];

  /* generates a random number on [0,0xffffffff]-interval */
  //c//unsigned long genrand_int32(void)
  this.genrand_int32 = function ()
  {
    //c//unsigned long y;
    //c//static unsigned long mag01[2]={0x0UL, MATRIX_A};
    var y;
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (mti >= N) { /* generate N words at one time */
      //c//int kk;
      var kk;

      if (mti == N+1)   /* if init_genrand() has not been called, */
      //c//init_genrand(5489); /* a default initial seed is used */
      {this.init_genrand(5489);} /* a default initial seed is used */

      for (kk=0;kk<N-M;kk++) {
        //c//y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
        //c//mt[kk] = mt[kk+M] ^ (y >> 1) ^ mag01[y & 0x1];
        y = unsigned32((mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK));
        mt[kk] = unsigned32(mt[kk+M] ^ (y >>> 1) ^ mag01[y & 0x1]);
      }
      for (;kk<N-1;kk++) {
        //c//y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
        //c//mt[kk] = mt[kk+(M-N)] ^ (y >> 1) ^ mag01[y & 0x1];
        y = unsigned32((mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK));
        mt[kk] = unsigned32(mt[kk+(M-N)] ^ (y >>> 1) ^ mag01[y & 0x1]);
      }
      //c//y = (mt[N-1]&UPPER_MASK)|(mt[0]&LOWER_MASK);
      //c//mt[N-1] = mt[M-1] ^ (y >> 1) ^ mag01[y & 0x1];
      y = unsigned32((mt[N-1]&UPPER_MASK)|(mt[0]&LOWER_MASK));
      mt[N-1] = unsigned32(mt[M-1] ^ (y >>> 1) ^ mag01[y & 0x1]);
      mti = 0;
    }

    y = mt[mti++];

    /* Tempering */
    //c//y ^= (y >> 11);
    //c//y ^= (y << 7) & 0x9d2c5680;
    //c//y ^= (y << 15) & 0xefc60000;
    //c//y ^= (y >> 18);
    y = unsigned32(y ^ (y >>> 11));
    y = unsigned32(y ^ ((y << 7) & 0x9d2c5680));
    y = unsigned32(y ^ ((y << 15) & 0xefc60000));
    y = unsigned32(y ^ (y >>> 18));

    return y;
  }

  /* generates a random number on [0,0x7fffffff]-interval */
  //c//long genrand_int31(void)
  this.genrand_int31 = function ()
  {
    //c//return (genrand_int32()>>1);
    return (this.genrand_int32()>>>1);
  }

  /* generates a random number on [0,1]-real-interval */
  //c//double genrand_real1(void)
  this.genrand_real1 = function ()
  {
    //c//return genrand_int32()*(1.0/4294967295.0);
    return this.genrand_int32()*(1.0/4294967295.0);
    /* divided by 2^32-1 */
  }

  /* generates a random number on [0,1)-real-interval */
  //c//double genrand_real2(void)
  this.genrand_real2 = function ()
  {
    //c//return genrand_int32()*(1.0/4294967296.0);
    return this.genrand_int32()*(1.0/4294967296.0);
    /* divided by 2^32 */
  }

  /* generates a random number on (0,1)-real-interval */
  //c//double genrand_real3(void)
  this.genrand_real3 = function ()
  {
    //c//return ((genrand_int32()) + 0.5)*(1.0/4294967296.0);
    return ((this.genrand_int32()) + 0.5)*(1.0/4294967296.0);
    /* divided by 2^32 */
  }

  /* generates a random number on [0,1) with 53-bit resolution*/
  //c//double genrand_res53(void)
  this.genrand_res53 = function ()
  {
    //c//unsigned long a=genrand_int32()>>5, b=genrand_int32()>>6;
    var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
    return(a*67108864.0+b)*(1.0/9007199254740992.0);
  }
  /* These real versions are due to Isaku Wada, 2002/01/09 added */
}

//  Exports: Public API

//  Export the twister class
exports.MersenneTwister19937 = MersenneTwister19937;

},{}],33:[function(require,module,exports){
// the `unique` module
var unique = {};

// global results store
// currently uniqueness is global to entire faker instance
// this means that faker should currently *never* return duplicate values across all API methods when using `Faker.unique`
// it's possible in the future that some users may want to scope found per function call instead of faker instance
var found = {};

// global exclude list of results
// defaults to nothing excluded
var exclude = [];

// current iteration or retries of unique.exec ( current loop depth )
var currentIterations = 0;

// uniqueness compare function
// default behavior is to check value as key against object hash
var defaultCompare = function(obj, key) {
  if (typeof obj[key] === 'undefined') {
    return -1;
  }
  return 0;
};

// common error handler for messages
unique.errorMessage = function (now, code, opts) {
  console.error('error', code);
  console.log('found', Object.keys(found).length, 'unique entries before throwing error. \nretried:', currentIterations, '\ntotal time:', now - opts.startTime, 'ms');
  throw new Error(code + ' for uniqueness check \n\nMay not be able to generate any more unique values with current settings. \nTry adjusting maxTime or maxRetries parameters for faker.unique()')
};

unique.exec = function (method, args, opts) {
  //console.log(currentIterations)

  var now = new Date().getTime();

  opts = opts || {};
  opts.maxTime = opts.maxTime || 3;
  opts.maxRetries = opts.maxRetries || 50;
  opts.exclude = opts.exclude || exclude;
  opts.compare = opts.compare || defaultCompare;

  if (typeof opts.currentIterations !== 'number') {
    opts.currentIterations = 0;
  }

  if (typeof opts.startTime === 'undefined') {
    opts.startTime = new Date().getTime();
  }

  var startTime = opts.startTime;

  // support single exclude argument as string
  if (typeof opts.exclude === 'string') {
    opts.exclude = [opts.exclude];
  }

  if (opts.currentIterations > 0) {
    // console.log('iterating', currentIterations)
  }

  // console.log(now - startTime)
  if (now - startTime >= opts.maxTime) {
    return unique.errorMessage(now, 'Exceeded maxTime:' + opts.maxTime, opts);
  }

  if (opts.currentIterations >= opts.maxRetries) {
    return unique.errorMessage(now, 'Exceeded maxRetries:' + opts.maxRetries, opts);
  }

  // execute the provided method to find a potential satifised value
  var result = method.apply(this, args);

  // if the result has not been previously found, add it to the found array and return the value as it's unique
  if (opts.compare(found, result) === -1 && opts.exclude.indexOf(result) === -1) {
    found[result] = result;
    opts.currentIterations = 0;
    return result;
  } else {
    // console.log('conflict', result);
    opts.currentIterations++;
    return unique.exec(method, args, opts);
  }
};

module.exports = unique;

},{}],34:[function(require,module,exports){
/*

Copyright (c) 2012-2014 Jeffrey Mealo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

------------------------------------------------------------------------------------------------------------------------

Based loosely on Luka Pusic's PHP Script: http://360percents.com/posts/php-random-user-agent-generator/

The license for that script is as follows:

"THE BEER-WARE LICENSE" (Revision 42):

<pusic93@gmail.com> wrote this file. As long as you retain this notice you can do whatever you want with this stuff.
If we meet some day, and you think this stuff is worth it, you can buy me a beer in return. Luka Pusic

*/

exports.generate = function generate(faker) {

  function rnd(a, b) {
    //calling rnd() with no arguments is identical to rnd(0, 100)
    a = a || 0;
    b = b || 100;

    if (typeof b === 'number' && typeof a === 'number') {

      // 9/2018 - Added faker random to ensure mersenne and seed
      return faker.datatype.number({ min: a, max: b});

    }

    if (Object.prototype.toString.call(a) === "[object Array]") {
      //returns a random element from array (a), even weighting
      return faker.random.arrayElement(a);
    }

    if (a && typeof a === 'object') {
      //returns a random key from the passed object; keys are weighted by the decimal probability in their value
      return (function (obj) {
        var rand = rnd(0, 100) / 100, min = 0, max = 0, key, return_val;

        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            max = obj[key] + min;
            return_val = key;
            if (rand >= min && rand <= max) {
              break;
            }
            min = min + obj[key];
          }
        }

        return return_val;
      }(a));
    }

    throw new TypeError('Invalid arguments passed to rnd. (' + (b ? a + ', ' + b : a) + ')');
  }

  function randomLang() {
    return rnd(['AB', 'AF', 'AN', 'AR', 'AS', 'AZ', 'BE', 'BG', 'BN', 'BO', 'BR', 'BS', 'CA', 'CE', 'CO', 'CS',
      'CU', 'CY', 'DA', 'DE', 'EL', 'EN', 'EO', 'ES', 'ET', 'EU', 'FA', 'FI', 'FJ', 'FO', 'FR', 'FY',
      'GA', 'GD', 'GL', 'GV', 'HE', 'HI', 'HR', 'HT', 'HU', 'HY', 'ID', 'IS', 'IT', 'JA', 'JV', 'KA',
      'KG', 'KO', 'KU', 'KW', 'KY', 'LA', 'LB', 'LI', 'LN', 'LT', 'LV', 'MG', 'MK', 'MN', 'MO', 'MS',
      'MT', 'MY', 'NB', 'NE', 'NL', 'NN', 'NO', 'OC', 'PL', 'PT', 'RM', 'RO', 'RU', 'SC', 'SE', 'SK',
      'SL', 'SO', 'SQ', 'SR', 'SV', 'SW', 'TK', 'TR', 'TY', 'UK', 'UR', 'UZ', 'VI', 'VO', 'YI', 'ZH']);
  }

  function randomBrowserAndOS() {
    var browser = rnd({
        chrome:    .45132810566,
        iexplorer: .27477061836,
        firefox:   .19384170608,
        safari:    .06186781118,
        opera:     .01574236955
      }),
      os = {
        chrome:  {win: .89,  mac: .09 , lin: .02},
        firefox: {win: .83,  mac: .16,  lin: .01},
        opera:   {win: .91,  mac: .03 , lin: .06},
        safari:  {win: .04 , mac: .96  },
        iexplorer: ['win']
      };

    return [browser, rnd(os[browser])];
  }

  function randomProc(arch) {
    var procs = {
      lin:['i686', 'x86_64'],
      mac: {'Intel' : .48, 'PPC': .01, 'U; Intel':.48, 'U; PPC' :.01},
      win:['', 'WOW64', 'Win64; x64']
    };
    return rnd(procs[arch]);
  }

  function randomRevision(dots) {
    var return_val = '';
    //generate a random revision
    //dots = 2 returns .x.y where x & y are between 0 and 9
    for (var x = 0; x < dots; x++) {
      return_val += '.' + rnd(0, 9);
    }
    return return_val;
  }

  var version_string = {
    net: function () {
      return [rnd(1, 4), rnd(0, 9), rnd(10000, 99999), rnd(0, 9)].join('.');
    },
    nt: function () {
      return rnd(5, 6) + '.' + rnd(0, 3);
    },
    ie: function () {
      return rnd(7, 11);
    },
    trident: function () {
      return rnd(3, 7) + '.' + rnd(0, 1);
    },
    osx: function (delim) {
      return [10, rnd(5, 10), rnd(0, 9)].join(delim || '.');
    },
    chrome: function () {
      return [rnd(13, 39), 0, rnd(800, 899), 0].join('.');
    },
    presto: function () {
      return '2.9.' + rnd(160, 190);
    },
    presto2: function () {
      return rnd(10, 12) + '.00';
    },
    safari: function () {
      return rnd(531, 538) + '.' + rnd(0, 2) + '.' + rnd(0,2);
    }
  };

  var browser = {
    firefox: function firefox(arch) {
      //https://developer.mozilla.org/en-US/docs/Gecko_user_agent_string_reference
      var firefox_ver = rnd(5, 15) + randomRevision(2),
        gecko_ver = 'Gecko/20100101 Firefox/' + firefox_ver,
        proc = randomProc(arch),
        os_ver = (arch === 'win') ? '(Windows NT ' + version_string.nt() + ((proc) ? '; ' + proc : '')
          : (arch === 'mac') ? '(Macintosh; ' + proc + ' Mac OS X ' + version_string.osx()
            : '(X11; Linux ' + proc;

      return 'Mozilla/5.0 ' + os_ver + '; rv:' + firefox_ver.slice(0, -2) + ') ' + gecko_ver;
    },

    iexplorer: function iexplorer() {
      var ver = version_string.ie();

      if (ver >= 11) {
        //http://msdn.microsoft.com/en-us/library/ie/hh869301(v=vs.85).aspx
        return 'Mozilla/5.0 (Windows NT 6.' + rnd(1,3) + '; Trident/7.0; ' + rnd(['Touch; ', '']) + 'rv:11.0) like Gecko';
      }

      //http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx
      return 'Mozilla/5.0 (compatible; MSIE ' + ver + '.0; Windows NT ' + version_string.nt() + '; Trident/' +
                version_string.trident() + ((rnd(0, 1) === 1) ? '; .NET CLR ' + version_string.net() : '') + ')';
    },

    opera: function opera(arch) {
      //http://www.opera.com/docs/history/
      var presto_ver = ' Presto/' + version_string.presto() + ' Version/' + version_string.presto2() + ')',
        os_ver = (arch === 'win') ? '(Windows NT ' + version_string.nt() + '; U; ' + randomLang() + presto_ver
          : (arch === 'lin') ? '(X11; Linux ' + randomProc(arch) + '; U; ' + randomLang() + presto_ver
            : '(Macintosh; Intel Mac OS X ' + version_string.osx() + ' U; ' + randomLang() + ' Presto/' +
                version_string.presto() + ' Version/' + version_string.presto2() + ')';

      return 'Opera/' + rnd(9, 14) + '.' + rnd(0, 99) + ' ' + os_ver;
    },

    safari: function safari(arch) {
      var safari = version_string.safari(),
        ver = rnd(4, 7) + '.' + rnd(0,1) + '.' + rnd(0,10),
        os_ver = (arch === 'mac') ? '(Macintosh; ' + randomProc('mac') + ' Mac OS X '+ version_string.osx('_') + ' rv:' + rnd(2, 6) + '.0; '+ randomLang() + ') '
          : '(Windows; U; Windows NT ' + version_string.nt() + ')';

      return 'Mozilla/5.0 ' + os_ver + 'AppleWebKit/' + safari + ' (KHTML, like Gecko) Version/' + ver + ' Safari/' + safari;
    },

    chrome: function chrome(arch) {
      var safari = version_string.safari(),
        os_ver = (arch === 'mac') ? '(Macintosh; ' + randomProc('mac') + ' Mac OS X ' + version_string.osx('_') + ') '
          : (arch === 'win') ? '(Windows; U; Windows NT ' + version_string.nt() + ')'
            : '(X11; Linux ' + randomProc(arch);

      return 'Mozilla/5.0 ' + os_ver + ' AppleWebKit/' + safari + ' (KHTML, like Gecko) Chrome/' + version_string.chrome() + ' Safari/' + safari;
    }
  };

  var random = randomBrowserAndOS();
  return browser[random[0]](random[1]);
};

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9hZGRyZXNzLmpzIiwibGliL2FuaW1hbC5qcyIsImxpYi9jb21tZXJjZS5qcyIsImxpYi9jb21wYW55LmpzIiwibGliL2RhdGFiYXNlLmpzIiwibGliL2RhdGF0eXBlLmpzIiwibGliL2RhdGUuanMiLCJsaWIvZmFrZS5qcyIsImxpYi9maW5hbmNlLmpzIiwibGliL2dpdC5qcyIsImxpYi9oYWNrZXIuanMiLCJsaWIvaGVscGVycy5qcyIsImxpYi9pYmFuLmpzIiwibGliL2ltYWdlLmpzIiwibGliL2ltYWdlX3Byb3ZpZGVycy9sb3JlbXBpY3N1bS5qcyIsImxpYi9pbWFnZV9wcm92aWRlcnMvbG9yZW1waXhlbC5qcyIsImxpYi9pbWFnZV9wcm92aWRlcnMvdW5zcGxhc2guanMiLCJsaWIvaW5kZXguanMiLCJsaWIvaW50ZXJuZXQuanMiLCJsaWIvbG9yZW0uanMiLCJsaWIvbWVyc2VubmUuanMiLCJsaWIvbXVzaWMuanMiLCJsaWIvbmFtZS5qcyIsImxpYi9waG9uZV9udW1iZXIuanMiLCJsaWIvcmFuZG9tLmpzIiwibGliL3N5c3RlbS5qcyIsImxpYi90aW1lLmpzIiwibGliL3VuaXF1ZS5qcyIsImxpYi92ZWhpY2xlLmpzIiwibGliL3dvcmQuanMiLCJ2ZW5kb3IvbWVyc2VubmUuanMiLCJ2ZW5kb3IvdW5pcXVlLmpzIiwidmVuZG9yL3VzZXItYWdlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3huQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHNpbmNlIHdlIGFyZSByZXF1aXJpbmcgdGhlIHRvcCBsZXZlbCBvZiBmYWtlciwgbG9hZCBhbGwgbG9jYWxlcyBieSBkZWZhdWx0XG52YXIgRmFrZXIgPSByZXF1aXJlKCcuL2xpYicpO1xudmFyIGZha2VyID0gbmV3IEZha2VyKHsgbG9jYWxlOiAnZXNfTVgnIH0pO1xubW9kdWxlWydleHBvcnRzJ10gPSBmYWtlcjsiLCIvKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLmFkZHJlc3NcbiAqL1xuZnVuY3Rpb24gQWRkcmVzcyAoZmFrZXIpIHtcbiAgdmFyIGYgPSBmYWtlci5mYWtlLFxuICAgIEhlbHBlcnMgPSBmYWtlci5oZWxwZXJzO1xuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgcmFuZG9tIHppcGNvZGUgZnJvbSBmb3JtYXQuIElmIGZvcm1hdCBpcyBub3Qgc3BlY2lmaWVkLCB0aGVcbiAgICogbG9jYWxlJ3MgemlwIGZvcm1hdCBpcyB1c2VkLlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuemlwQ29kZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZm9ybWF0XG4gICAqL1xuICB0aGlzLnppcENvZGUgPSBmdW5jdGlvbihmb3JtYXQpIHtcbiAgICAvLyBpZiB6aXAgZm9ybWF0IGlzIG5vdCBzcGVjaWZpZWQsIHVzZSB0aGUgemlwIGZvcm1hdCBkZWZpbmVkIGZvciB0aGUgbG9jYWxlXG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgbG9jYWxlRm9ybWF0ID0gZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5wb3N0Y29kZTtcbiAgICAgIGlmICh0eXBlb2YgbG9jYWxlRm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgICAgICBmb3JtYXQgPSBsb2NhbGVGb3JtYXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtYXQgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGxvY2FsZUZvcm1hdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBIZWxwZXJzLnJlcGxhY2VTeW1ib2xzKGZvcm1hdCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHJhbmRvbSB6aXBjb2RlIGZyb20gc3RhdGUgYWJicmV2aWF0aW9uLiBJZiBzdGF0ZSBhYmJyZXZpYXRpb24gaXNcbiAgICogbm90IHNwZWNpZmllZCwgYSByYW5kb20gemlwIGNvZGUgaXMgZ2VuZXJhdGVkIGFjY29yZGluZyB0byB0aGUgbG9jYWxlJ3MgemlwIGZvcm1hdC5cbiAgICogT25seSB3b3JrcyBmb3IgbG9jYWxlcyB3aXRoIHBvc3Rjb2RlX2J5X3N0YXRlIGRlZmluaXRpb24uIElmIGEgbG9jYWxlIGRvZXMgbm90XG4gICAqIGhhdmUgYSBwb3N0Y29kZV9ieV9zdGF0ZSBkZWZpbml0aW9uLCBhIHJhbmRvbSB6aXAgY29kZSBpcyBnZW5lcmF0ZWQgYWNjb3JkaW5nXG4gICAqIHRvIHRoZSBsb2NhbGUncyB6aXAgZm9ybWF0LlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuemlwQ29kZUJ5U3RhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlXG4gICAqL1xuICB0aGlzLnppcENvZGVCeVN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHppcFJhbmdlID0gZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5wb3N0Y29kZV9ieV9zdGF0ZVtzdGF0ZV07XG4gICAgaWYgKHppcFJhbmdlKSB7XG4gICAgICByZXR1cm4gZmFrZXIuZGF0YXR5cGUubnVtYmVyKHppcFJhbmdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZha2VyLmFkZHJlc3MuemlwQ29kZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHJhbmRvbSBsb2NhbGl6ZWQgY2l0eSBuYW1lLiBUaGUgZm9ybWF0IHN0cmluZyBjYW4gY29udGFpbiBhbnlcbiAgICogbWV0aG9kIHByb3ZpZGVkIGJ5IGZha2VyIHdyYXBwZWQgaW4gYHt7fX1gLCBlLmcuIGB7e25hbWUuZmlyc3ROYW1lfX1gIGluXG4gICAqIG9yZGVyIHRvIGJ1aWxkIHRoZSBjaXR5IG5hbWUuXG4gICAqXG4gICAqIElmIG5vIGZvcm1hdCBzdHJpbmcgaXMgcHJvdmlkZWQgb25lIG9mIHRoZSBmb2xsb3dpbmcgaXMgcmFuZG9tbHkgdXNlZDpcbiAgICpcbiAgICogKiBge3thZGRyZXNzLmNpdHlQcmVmaXh9fSB7e25hbWUuZmlyc3ROYW1lfX17e2FkZHJlc3MuY2l0eVN1ZmZpeH19YFxuICAgKiAqIGB7e2FkZHJlc3MuY2l0eVByZWZpeH19IHt7bmFtZS5maXJzdE5hbWV9fWBcbiAgICogKiBge3tuYW1lLmZpcnN0TmFtZX19e3thZGRyZXNzLmNpdHlTdWZmaXh9fWBcbiAgICogKiBge3tuYW1lLmxhc3ROYW1lfX17e2FkZHJlc3MuY2l0eVN1ZmZpeH19YFxuICAgKiAqIGB7e2FkZHJlc3MuY2l0eU5hbWV9fWAgd2hlbiBjaXR5IG5hbWUgaXMgYXZhaWxhYmxlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy5jaXR5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmb3JtYXRcbiAgICovXG4gIHRoaXMuY2l0eSA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICB2YXIgZm9ybWF0cyA9IFtcbiAgICAgICd7e2FkZHJlc3MuY2l0eVByZWZpeH19IHt7bmFtZS5maXJzdE5hbWV9fXt7YWRkcmVzcy5jaXR5U3VmZml4fX0nLFxuICAgICAgJ3t7YWRkcmVzcy5jaXR5UHJlZml4fX0ge3tuYW1lLmZpcnN0TmFtZX19JyxcbiAgICAgICd7e25hbWUuZmlyc3ROYW1lfX17e2FkZHJlc3MuY2l0eVN1ZmZpeH19JyxcbiAgICAgICd7e25hbWUubGFzdE5hbWV9fXt7YWRkcmVzcy5jaXR5U3VmZml4fX0nXG4gICAgXTtcblxuICAgIGlmICghZm9ybWF0ICYmIGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuY2l0eV9uYW1lKSB7XG4gICAgICBmb3JtYXRzLnB1c2goJ3t7YWRkcmVzcy5jaXR5TmFtZX19Jyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGZvcm1hdCA9IGZha2VyLmRhdGF0eXBlLm51bWJlcihmb3JtYXRzLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBmKGZvcm1hdHNbZm9ybWF0XSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByYW5kb20gbG9jYWxpemVkIGNpdHkgcHJlZml4XG4gICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy5jaXR5UHJlZml4XG4gICAqL1xuICB0aGlzLmNpdHlQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5jaXR5X3ByZWZpeCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcmFuZG9tIGxvY2FsaXplZCBjaXR5IHN1ZmZpeFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuY2l0eVN1ZmZpeFxuICAgKi9cbiAgdGhpcy5jaXR5U3VmZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuY2l0eV9zdWZmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSByYW5kb20gY2l0eSBuYW1lXG4gICAqIFxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuY2l0eU5hbWVcbiAgICovXG4gIHRoaXMuY2l0eU5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hZGRyZXNzLmNpdHlfbmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHJhbmRvbSBsb2NhbGl6ZWQgc3RyZWV0IG5hbWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLnN0cmVldE5hbWVcbiAgICovXG4gIHRoaXMuc3RyZWV0TmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHZhciBzdWZmaXggPSBmYWtlci5hZGRyZXNzLnN0cmVldFN1ZmZpeCgpO1xuICAgIGlmIChzdWZmaXggIT09IFwiXCIpIHtcbiAgICAgIHN1ZmZpeCA9IFwiIFwiICsgc3VmZml4XG4gICAgfVxuXG4gICAgc3dpdGNoIChmYWtlci5kYXRhdHlwZS5udW1iZXIoMSkpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmVzdWx0ID0gZmFrZXIubmFtZS5sYXN0TmFtZSgpICsgc3VmZml4O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmVzdWx0ID0gZmFrZXIubmFtZS5maXJzdE5hbWUoKSArIHN1ZmZpeDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvL1xuICAvLyBUT0RPOiBjaGFuZ2UgYWxsIHRoZXNlIG1ldGhvZHMgdGhhdCBhY2NlcHQgYSBib29sZWFuIHRvIGluc3RlYWQgYWNjZXB0IGFuIG9wdGlvbnMgaGFzaC5cbiAgLy9cbiAgLyoqXG4gICAqIFJldHVybnMgYSByYW5kb20gbG9jYWxpemVkIHN0cmVldCBhZGRyZXNzXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy5zdHJlZXRBZGRyZXNzXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlRnVsbEFkZHJlc3NcbiAgICovXG4gIHRoaXMuc3RyZWV0QWRkcmVzcyA9IGZ1bmN0aW9uICh1c2VGdWxsQWRkcmVzcykge1xuICAgIGlmICh1c2VGdWxsQWRkcmVzcyA9PT0gdW5kZWZpbmVkKSB7IHVzZUZ1bGxBZGRyZXNzID0gZmFsc2U7IH1cbiAgICB2YXIgYWRkcmVzcyA9IFwiXCI7XG4gICAgc3dpdGNoIChmYWtlci5kYXRhdHlwZS5udW1iZXIoMikpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgYWRkcmVzcyA9IEhlbHBlcnMucmVwbGFjZVN5bWJvbFdpdGhOdW1iZXIoXCIjIyMjI1wiKSArIFwiIFwiICsgZmFrZXIuYWRkcmVzcy5zdHJlZXROYW1lKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBhZGRyZXNzID0gSGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcihcIiMjIyNcIikgKyAgXCIgXCIgKyBmYWtlci5hZGRyZXNzLnN0cmVldE5hbWUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGFkZHJlc3MgPSBIZWxwZXJzLnJlcGxhY2VTeW1ib2xXaXRoTnVtYmVyKFwiIyMjXCIpICsgXCIgXCIgKyBmYWtlci5hZGRyZXNzLnN0cmVldE5hbWUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB1c2VGdWxsQWRkcmVzcyA/IChhZGRyZXNzICsgXCIgXCIgKyBmYWtlci5hZGRyZXNzLnNlY29uZGFyeUFkZHJlc3MoKSkgOiBhZGRyZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIHN0cmVldFN1ZmZpeFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3Muc3RyZWV0U3VmZml4XG4gICAqL1xuICB0aGlzLnN0cmVldFN1ZmZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hZGRyZXNzLnN0cmVldF9zdWZmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHN0cmVldFByZWZpeFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3Muc3RyZWV0UHJlZml4XG4gICAqL1xuICB0aGlzLnN0cmVldFByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hZGRyZXNzLnN0cmVldF9wcmVmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlY29uZGFyeUFkZHJlc3NcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLnNlY29uZGFyeUFkZHJlc3NcbiAgICovXG4gIHRoaXMuc2Vjb25kYXJ5QWRkcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcihmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KFxuICAgICAgW1xuICAgICAgICAnQXB0LiAjIyMnLFxuICAgICAgICAnU3VpdGUgIyMjJ1xuICAgICAgXVxuICAgICkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvdW50eVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuY291bnR5XG4gICAqL1xuICB0aGlzLmNvdW50eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hZGRyZXNzLmNvdW50eSk7XG4gIH1cblxuICAvKipcbiAgICogY291bnRyeVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuY291bnRyeVxuICAgKi9cbiAgdGhpcy5jb3VudHJ5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuY291bnRyeSk7XG4gIH1cblxuICAvKipcbiAgICogY291bnRyeUNvZGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLmNvdW50cnlDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbHBoYUNvZGUgZGVmYXVsdCBhbHBoYS0yXG4gICAqL1xuICB0aGlzLmNvdW50cnlDb2RlID0gZnVuY3Rpb24gKGFscGhhQ29kZSkge1xuICAgIFxuICAgIGlmICh0eXBlb2YgYWxwaGFDb2RlID09PSAndW5kZWZpbmVkJyB8fCBhbHBoYUNvZGUgPT09ICdhbHBoYS0yJykge1xuICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5jb3VudHJ5X2NvZGUpO1xuICAgIH1cblxuICAgIGlmIChhbHBoYUNvZGUgPT09ICdhbHBoYS0zJykge1xuICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5jb3VudHJ5X2NvZGVfYWxwaGFfMyk7XG4gICAgfVxuICAgICAgXG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5jb3VudHJ5X2NvZGUpO1xuXG4gIH1cblxuICAvKipcbiAgICogc3RhdGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLnN0YXRlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQWJiclxuICAgKi9cbiAgdGhpcy5zdGF0ZSA9IGZ1bmN0aW9uICh1c2VBYmJyKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5zdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogc3RhdGVBYmJyXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy5zdGF0ZUFiYnJcbiAgICovXG4gIHRoaXMuc3RhdGVBYmJyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3Muc3RhdGVfYWJicik7XG4gIH1cblxuICAvKipcbiAgICogbGF0aXR1ZGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLmxhdGl0dWRlXG4gICAqIEBwYXJhbSB7RG91YmxlfSBtYXggZGVmYXVsdCBpcyA5MFxuICAgKiBAcGFyYW0ge0RvdWJsZX0gbWluIGRlZmF1bHQgaXMgLTkwXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVjaXNpb24gZGVmYXVsdCBpcyA0XG4gICAqL1xuICB0aGlzLmxhdGl0dWRlID0gZnVuY3Rpb24gKG1heCwgbWluLCBwcmVjaXNpb24pIHtcbiAgICBtYXggICAgICAgPSBtYXggfHwgOTBcbiAgICBtaW4gICAgICAgPSBtaW4gfHwgLTkwXG4gICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uIHx8IDRcblxuICAgIHJldHVybiBmYWtlci5kYXRhdHlwZS5udW1iZXIoe1xuICAgICAgbWF4OiBtYXgsXG4gICAgICBtaW46IG1pbixcbiAgICAgIHByZWNpc2lvbjogcGFyc2VGbG9hdCgoMC4wKS50b1ByZWNpc2lvbihwcmVjaXNpb24pICsgJzEnKVxuICAgIH0pLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb25naXR1ZGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLmxvbmdpdHVkZVxuICAgKiBAcGFyYW0ge0RvdWJsZX0gbWF4IGRlZmF1bHQgaXMgMTgwXG4gICAqIEBwYXJhbSB7RG91YmxlfSBtaW4gZGVmYXVsdCBpcyAtMTgwXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVjaXNpb24gZGVmYXVsdCBpcyA0XG4gICAqL1xuICB0aGlzLmxvbmdpdHVkZSA9IGZ1bmN0aW9uIChtYXgsIG1pbiwgcHJlY2lzaW9uKSB7XG4gICAgbWF4ICAgICAgID0gbWF4IHx8IDE4MFxuICAgIG1pbiAgICAgICA9IG1pbiB8fCAtMTgwXG4gICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uIHx8IDRcblxuICAgIHJldHVybiBmYWtlci5kYXRhdHlwZS5udW1iZXIoe1xuICAgICAgbWF4OiBtYXgsXG4gICAgICBtaW46IG1pbixcbiAgICAgIHByZWNpc2lvbjogcGFyc2VGbG9hdCgoMC4wKS50b1ByZWNpc2lvbihwcmVjaXNpb24pICsgJzEnKVxuICAgIH0pLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgZGlyZWN0aW9uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy5kaXJlY3Rpb25cbiAgICogQHBhcmFtIHtCb29sZWFufSB1c2VBYmJyIHJldHVybiBkaXJlY3Rpb24gYWJicmV2aWF0aW9uLiBkZWZhdWx0cyB0byBmYWxzZVxuICAgKi9cbiAgdGhpcy5kaXJlY3Rpb24gPSBmdW5jdGlvbiAodXNlQWJicikge1xuICAgIGlmICh0eXBlb2YgdXNlQWJiciA9PT0gJ3VuZGVmaW5lZCcgfHwgdXNlQWJiciA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuZGlyZWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5kaXJlY3Rpb25fYWJicik7XG4gIH1cblxuICB0aGlzLmRpcmVjdGlvbi5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIGRpcmVjdGlvbi4gVXNlIG9wdGlvbmFsIHVzZUFiYnIgYm9vbCB0byByZXR1cm4gYWJicmV2aWF0aW9uXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIk5vcnRod2VzdFwiLCBcIlNvdXRoXCIsIFwiU1dcIiwgXCJFXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIGNhcmRpbmFsIGRpcmVjdGlvblxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFkZHJlc3MuY2FyZGluYWxEaXJlY3Rpb25cbiAgICogQHBhcmFtIHtCb29sZWFufSB1c2VBYmJyIHJldHVybiBkaXJlY3Rpb24gYWJicmV2aWF0aW9uLiBkZWZhdWx0cyB0byBmYWxzZVxuICAgKi9cbiAgdGhpcy5jYXJkaW5hbERpcmVjdGlvbiA9IGZ1bmN0aW9uICh1c2VBYmJyKSB7XG4gICAgaWYgKHR5cGVvZiB1c2VBYmJyID09PSAndW5kZWZpbmVkJyB8fCB1c2VBYmJyID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hZGRyZXNzLmRpcmVjdGlvbi5zbGljZSgwLCA0KSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuZGlyZWN0aW9uX2FiYnIuc2xpY2UoMCwgNCkpXG4gICAgKTtcbiAgfVxuXG4gIHRoaXMuY2FyZGluYWxEaXJlY3Rpb24uc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSBjYXJkaW5hbCBkaXJlY3Rpb24uIFVzZSBvcHRpb25hbCB1c2VBYmJyIGJvb2xlYW4gdG8gcmV0dXJuIGFiYnJldmlhdGlvblwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJOb3J0aFwiLCBcIlNvdXRoXCIsIFwiRVwiLCBcIldcIl1cbiAgfTtcblxuICAvKipcbiAgICogb3JkaW5hbCBkaXJlY3Rpb25cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hZGRyZXNzLm9yZGluYWxEaXJlY3Rpb25cbiAgICogQHBhcmFtIHtCb29sZWFufSB1c2VBYmJyIHJldHVybiBkaXJlY3Rpb24gYWJicmV2aWF0aW9uLiBkZWZhdWx0cyB0byBmYWxzZVxuICAgKi9cbiAgdGhpcy5vcmRpbmFsRGlyZWN0aW9uID0gZnVuY3Rpb24gKHVzZUFiYnIpIHtcbiAgICBpZiAodHlwZW9mIHVzZUFiYnIgPT09ICd1bmRlZmluZWQnIHx8IHVzZUFiYnIgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFkZHJlc3MuZGlyZWN0aW9uLnNsaWNlKDQsIDgpKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy5kaXJlY3Rpb25fYWJici5zbGljZSg0LCA4KSlcbiAgICApO1xuICB9XG5cbiAgdGhpcy5vcmRpbmFsRGlyZWN0aW9uLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGFuIG9yZGluYWwgZGlyZWN0aW9uLiBVc2Ugb3B0aW9uYWwgdXNlQWJiciBib29sZWFuIHRvIHJldHVybiBhYmJyZXZpYXRpb25cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiTm9ydGh3ZXN0XCIsIFwiU291dGhlYXN0XCIsIFwiU1dcIiwgXCJORVwiXVxuICB9O1xuXG4gIHRoaXMubmVhcmJ5R1BTQ29vcmRpbmF0ZSA9IGZ1bmN0aW9uKGNvb3JkaW5hdGUsIHJhZGl1cywgaXNNZXRyaWMpIHtcbiAgICBmdW5jdGlvbiByYW5kb21GbG9hdChtaW4sIG1heCkge1xuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4LW1pbikgKyBtaW47XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xuICAgICAgcmV0dXJuIGRlZ3JlZXMgKiAoTWF0aC5QSS8xODAuMCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFucykge1xuICAgICAgcmV0dXJuIHJhZGlhbnMgKiAoMTgwLjAvTWF0aC5QSSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGtpbG9tZXRlcnNUb01pbGVzKG1pbGVzKSB7XG4gICAgICByZXR1cm4gbWlsZXMgKiAwLjYyMTM3MTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29vcmRpbmF0ZVdpdGhPZmZzZXQoY29vcmRpbmF0ZSwgYmVhcmluZywgZGlzdGFuY2UsIGlzTWV0cmljKSB7XG4gICAgICB2YXIgUiA9IDYzNzguMTM3OyAvLyBSYWRpdXMgb2YgdGhlIEVhcnRoIChodHRwOi8vbnNzZGMuZ3NmYy5uYXNhLmdvdi9wbGFuZXRhcnkvZmFjdHNoZWV0L2VhcnRoZmFjdC5odG1sKVxuICAgICAgdmFyIGQgPSBpc01ldHJpYyA/IGRpc3RhbmNlIDoga2lsb21ldGVyc1RvTWlsZXMoZGlzdGFuY2UpOyAvLyBEaXN0YW5jZSBpbiBrbVxuXG4gICAgICB2YXIgbGF0MSA9IGRlZ3JlZXNUb1JhZGlhbnMoY29vcmRpbmF0ZVswXSk7IC8vQ3VycmVudCBsYXQgcG9pbnQgY29udmVydGVkIHRvIHJhZGlhbnNcbiAgICAgIHZhciBsb24xID0gZGVncmVlc1RvUmFkaWFucyhjb29yZGluYXRlWzFdKTsgLy9DdXJyZW50IGxvbmcgcG9pbnQgY29udmVydGVkIHRvIHJhZGlhbnNcblxuICAgICAgdmFyIGxhdDIgPSBNYXRoLmFzaW4oTWF0aC5zaW4obGF0MSkgKiBNYXRoLmNvcyhkL1IpICtcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyhsYXQxKSAqIE1hdGguc2luKGQvUikgKiBNYXRoLmNvcyhiZWFyaW5nKSk7XG5cbiAgICAgIHZhciBsb24yID0gbG9uMSArIE1hdGguYXRhbjIoXG4gICAgICAgIE1hdGguc2luKGJlYXJpbmcpICogTWF0aC5zaW4oZC9SKSAqIE1hdGguY29zKGxhdDEpLFxuICAgICAgICBNYXRoLmNvcyhkL1IpIC0gTWF0aC5zaW4obGF0MSkgKiBNYXRoLnNpbihsYXQyKSk7XG5cbiAgICAgIC8vIEtlZXAgbG9uZ2l0dWRlIGluIHJhbmdlIFstMTgwLCAxODBdXG4gICAgICBpZiAobG9uMiA+IGRlZ3JlZXNUb1JhZGlhbnMoMTgwKSkge1xuICAgICAgICBsb24yID0gbG9uMiAtIGRlZ3JlZXNUb1JhZGlhbnMoMzYwKTtcbiAgICAgIH0gZWxzZSBpZiAobG9uMiA8IGRlZ3JlZXNUb1JhZGlhbnMoLTE4MCkpIHtcbiAgICAgICAgbG9uMiA9IGxvbjIgKyBkZWdyZWVzVG9SYWRpYW5zKDM2MCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbcmFkaWFuc1RvRGVncmVlcyhsYXQyKSwgcmFkaWFuc1RvRGVncmVlcyhsb24yKV07XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gY29vcmRpbmF0ZSwgdGhlIGJlc3Qgd2UgY2FuIGRvIGlzIHJldHVybiBhIHJhbmRvbSBHUFMgY29vcmRpbmF0ZS5cbiAgICBpZiAoY29vcmRpbmF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gW2Zha2VyLmFkZHJlc3MubGF0aXR1ZGUoKSwgZmFrZXIuYWRkcmVzcy5sb25naXR1ZGUoKV1cbiAgICB9XG4gICAgcmFkaXVzID0gcmFkaXVzIHx8IDEwLjA7XG4gICAgaXNNZXRyaWMgPSBpc01ldHJpYyB8fCBmYWxzZTtcblxuICAgIC8vIFRPRE86IGltcGxlbWVudCBlaXRoZXIgYSBnYXVzc2lhbi91bmlmb3JtIGRpc3RyaWJ1dGlvbiBvZiBwb2ludHMgaW4gY2ljdWxhciByZWdpb24uXG4gICAgLy8gUG9zc2libHkgaW5jbHVkZSBwYXJhbSB0byBmdW5jdGlvbiB0aGF0IGFsbG93cyB1c2VyIHRvIGNob29zZSBiZXR3ZWVuIGRpc3RyaWJ1dGlvbnMuXG5cbiAgICAvLyBUaGlzIGFwcHJvYWNoIHdpbGwgbGlrZWx5IHJlc3VsdCBpbiBhIGhpZ2hlciBkZW5zaXR5IG9mIHBvaW50cyBuZWFyIHRoZSBjZW50ZXIuXG4gICAgdmFyIHJhbmRvbUNvb3JkID0gY29vcmRpbmF0ZVdpdGhPZmZzZXQoY29vcmRpbmF0ZSwgZGVncmVlc1RvUmFkaWFucyhNYXRoLnJhbmRvbSgpICogMzYwLjApLCByYWRpdXMsIGlzTWV0cmljKTtcbiAgICByZXR1cm4gW3JhbmRvbUNvb3JkWzBdLnRvRml4ZWQoNCksIHJhbmRvbUNvb3JkWzFdLnRvRml4ZWQoNCldO1xuICB9XG5cbiAgLyoqXG4gICAgICogUmV0dXJuIGEgcmFuZG9tIHRpbWUgem9uZVxuICAgICAqIEBtZXRob2QgZmFrZXIuYWRkcmVzcy50aW1lWm9uZVxuICAgICAqL1xuICB0aGlzLnRpbWVab25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYWRkcmVzcy50aW1lX3pvbmUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWRkcmVzcztcbiIsIi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXIuYW5pbWFsXG4gKi9cbnZhciBBbmltYWwgPSBmdW5jdGlvbiAoZmFrZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8qKlxuICAgKiBkb2dcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hbmltYWwuZG9nXG4gICAqL1xuICBzZWxmLmRvZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5kb2cpO1xuICB9O1xuICAvKipcbiAgICogY2F0XG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmNhdFxuICAgKi9cbiAgc2VsZi5jYXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hbmltYWwuY2F0KTtcbiAgfTtcbiAgLyoqXG4gICAqIHNuYWtlICBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hbmltYWwuc25ha2VcbiAgICovXG4gIHNlbGYuc25ha2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hbmltYWwuc25ha2UpO1xuICB9O1xuICAvKipcbiAgICogYmVhciAgXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmJlYXJcbiAgICovXG4gIHNlbGYuYmVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5iZWFyKTtcbiAgfTtcbiAgLyoqXG4gICAqIGxpb24gIFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFuaW1hbC5saW9uXG4gICAqL1xuICBzZWxmLmxpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hbmltYWwubGlvbik7XG4gIH07XG4gIC8qKlxuICAgKiBjZXRhY2VhbiAgXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmNldGFjZWFuXG4gICAqL1xuICBzZWxmLmNldGFjZWFuID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYW5pbWFsLmNldGFjZWFuKTtcbiAgfTtcbiAgLyoqXG4gICAqIGhvcnNlIFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFuaW1hbC5ob3JzZVxuICAgKi9cbiAgc2VsZi5ob3JzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5ob3JzZSk7XG4gIH07XG4gIC8qKlxuICAgKiBiaXJkXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmJpcmRcbiAgICovXG4gIHNlbGYuYmlyZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5iaXJkKTtcbiAgfTtcbiAgLyoqXG4gICAqIGNvdyBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hbmltYWwuY293XG4gICAqL1xuICBzZWxmLmNvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5jb3cpO1xuICB9O1xuICAvKipcbiAgICogZmlzaFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmFuaW1hbC5maXNoXG4gICAqL1xuICBzZWxmLmZpc2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hbmltYWwuZmlzaCk7XG4gIH07XG4gIC8qKlxuICAgKiBjcm9jb2RpbGlhXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmNyb2NvZGlsaWFcbiAgICovXG4gIHNlbGYuY3JvY29kaWxpYSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5jcm9jb2RpbGlhKTtcbiAgfTtcbiAgLyoqXG4gICAqIGluc2VjdCAgXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuYW5pbWFsLmluc2VjdFxuICAgKi9cbiAgc2VsZi5pbnNlY3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5hbmltYWwuaW5zZWN0KTtcbiAgfTtcbiAgLyoqXG4gICAqIHJhYmJpdCBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hbmltYWwucmFiYml0XG4gICAqL1xuICBzZWxmLnJhYmJpdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmFuaW1hbC5yYWJiaXQpO1xuICB9O1xuICAvKipcbiAgICogdHlwZSBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5hbmltYWwudHlwZVxuICAgKi9cbiAgc2VsZi50eXBlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuYW5pbWFsLnR5cGUpO1xuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufTtcblxubW9kdWxlWydleHBvcnRzJ10gPSBBbmltYWw7XG4iLCIvKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLmNvbW1lcmNlXG4gKi9cbnZhciBDb21tZXJjZSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLyoqXG4gICAqIGNvbG9yXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuY29tbWVyY2UuY29sb3JcbiAgICovXG4gIHNlbGYuY29sb3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5jb21tZXJjZS5jb2xvcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIGRlcGFydG1lbnRcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21tZXJjZS5kZXBhcnRtZW50XG4gICAqL1xuICBzZWxmLmRlcGFydG1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5jb21tZXJjZS5kZXBhcnRtZW50KTtcbiAgfTtcblxuICAvKipcbiAgICogcHJvZHVjdE5hbWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21tZXJjZS5wcm9kdWN0TmFtZVxuICAgKi9cbiAgc2VsZi5wcm9kdWN0TmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5jb21tZXJjZS5wcm9kdWN0QWRqZWN0aXZlKCkgKyBcIiBcIiArXG4gICAgICAgICAgICAgIGZha2VyLmNvbW1lcmNlLnByb2R1Y3RNYXRlcmlhbCgpICsgXCIgXCIgK1xuICAgICAgICAgICAgICBmYWtlci5jb21tZXJjZS5wcm9kdWN0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHByaWNlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuY29tbWVyY2UucHJpY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN5bWJvbFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZWxmLnByaWNlID0gZnVuY3Rpb24obWluLCBtYXgsIGRlYywgc3ltYm9sKSB7XG4gICAgbWluID0gbWluIHx8IDE7XG4gICAgbWF4ID0gbWF4IHx8IDEwMDA7XG4gICAgZGVjID0gZGVjID09PSB1bmRlZmluZWQgPyAyIDogZGVjO1xuICAgIHN5bWJvbCA9IHN5bWJvbCB8fCAnJztcblxuICAgIGlmIChtaW4gPCAwIHx8IG1heCA8IDApIHtcbiAgICAgIHJldHVybiBzeW1ib2wgKyAwLjAwO1xuICAgIH1cblxuICAgIHZhciByYW5kVmFsdWUgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtYXg6IG1heCwgbWluOiBtaW4gfSk7XG5cbiAgICByZXR1cm4gc3ltYm9sICsgKE1hdGgucm91bmQocmFuZFZhbHVlICogTWF0aC5wb3coMTAsIGRlYykpIC8gTWF0aC5wb3coMTAsIGRlYykpLnRvRml4ZWQoZGVjKTtcbiAgfTtcblxuICAvKlxuICBzZWxmLmNhdGVnb3JpZXMgPSBmdW5jdGlvbihudW0pIHtcbiAgICAgIHZhciBjYXRlZ29yaWVzID0gW107XG5cbiAgICAgIGRvIHtcbiAgICAgICAgICB2YXIgY2F0ZWdvcnkgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmNvbW1lcmNlLmRlcGFydG1lbnQpO1xuICAgICAgICAgIGlmKGNhdGVnb3JpZXMuaW5kZXhPZihjYXRlZ29yeSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICAgICAgfVxuICAgICAgfSB3aGlsZShjYXRlZ29yaWVzLmxlbmd0aCA8IG51bSk7XG5cbiAgICAgIHJldHVybiBjYXRlZ29yaWVzO1xuICB9O1xuXG4gICovXG4gIC8qXG4gIHNlbGYubWVyZ2VDYXRlZ29yaWVzID0gZnVuY3Rpb24oY2F0ZWdvcmllcykge1xuICAgICAgdmFyIHNlcGFyYXRvciA9IGZha2VyLmRlZmluaXRpb25zLnNlcGFyYXRvciB8fCBcIiAmXCI7XG4gICAgICAvLyBUT0RPOiBmaW5kIHVuZGVmaW5lZCBoZXJlXG4gICAgICBjYXRlZ29yaWVzID0gY2F0ZWdvcmllcyB8fCBmYWtlci5kZWZpbml0aW9ucy5jb21tZXJjZS5jYXRlZ29yaWVzO1xuICAgICAgdmFyIGNvbW1hU2VwYXJhdGVkID0gY2F0ZWdvcmllcy5zbGljZSgwLCAtMSkuam9pbignLCAnKTtcblxuICAgICAgcmV0dXJuIFtjb21tYVNlcGFyYXRlZCwgY2F0ZWdvcmllc1tjYXRlZ29yaWVzLmxlbmd0aCAtIDFdXS5qb2luKHNlcGFyYXRvciArIFwiIFwiKTtcbiAgfTtcbiAgKi9cblxuICAvKipcbiAgICogcHJvZHVjdEFkamVjdGl2ZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbW1lcmNlLnByb2R1Y3RBZGplY3RpdmVcbiAgICovXG4gIHNlbGYucHJvZHVjdEFkamVjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmNvbW1lcmNlLnByb2R1Y3RfbmFtZS5hZGplY3RpdmUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBwcm9kdWN0TWF0ZXJpYWxcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21tZXJjZS5wcm9kdWN0TWF0ZXJpYWxcbiAgICovXG4gIHNlbGYucHJvZHVjdE1hdGVyaWFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuY29tbWVyY2UucHJvZHVjdF9uYW1lLm1hdGVyaWFsKTtcbiAgfTtcblxuICAvKipcbiAgICogcHJvZHVjdFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbW1lcmNlLnByb2R1Y3RcbiAgICovXG4gIHNlbGYucHJvZHVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmNvbW1lcmNlLnByb2R1Y3RfbmFtZS5wcm9kdWN0KTtcbiAgfTtcblxuICAvKipcbiAgICogcHJvZHVjdERlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuY29tbWVyY2UucHJvZHVjdERlc2NyaXB0aW9uXG4gICAqL1xuICBzZWxmLnByb2R1Y3REZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmNvbW1lcmNlLnByb2R1Y3RfZGVzY3JpcHRpb24pO1xuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufTtcblxubW9kdWxlWydleHBvcnRzJ10gPSBDb21tZXJjZTtcbiIsIi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXIuY29tcGFueVxuICovXG52YXIgQ29tcGFueSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICBcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZiA9IGZha2VyLmZha2U7XG4gIFxuICAvKipcbiAgICogc3VmZml4ZXNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LnN1ZmZpeGVzXG4gICAqL1xuICB0aGlzLnN1ZmZpeGVzID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIERvbid0IHdhbnQgdGhlIHNvdXJjZSBhcnJheSBleHBvc2VkIHRvIG1vZGlmaWNhdGlvbiwgc28gcmV0dXJuIGEgY29weVxuICAgIHJldHVybiBmYWtlci5kZWZpbml0aW9ucy5jb21wYW55LnN1ZmZpeC5zbGljZSgwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb21wYW55TmFtZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbXBhbnkuY29tcGFueU5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFxuICAgKi9cbiAgdGhpcy5jb21wYW55TmFtZSA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcblxuICAgIHZhciBmb3JtYXRzID0gW1xuICAgICAgJ3t7bmFtZS5sYXN0TmFtZX19IHt7Y29tcGFueS5jb21wYW55U3VmZml4fX0nLFxuICAgICAgJ3t7bmFtZS5sYXN0TmFtZX19IC0ge3tuYW1lLmxhc3ROYW1lfX0nLFxuICAgICAgJ3t7bmFtZS5sYXN0TmFtZX19LCB7e25hbWUubGFzdE5hbWV9fSBhbmQge3tuYW1lLmxhc3ROYW1lfX0nXG4gICAgXTtcblxuICAgIGlmICh0eXBlb2YgZm9ybWF0ICE9PSBcIm51bWJlclwiKSB7XG4gICAgICBmb3JtYXQgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoZm9ybWF0cy5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZihmb3JtYXRzW2Zvcm1hdF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbXBhbnlTdWZmaXhcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LmNvbXBhbnlTdWZmaXhcbiAgICovXG4gIHRoaXMuY29tcGFueVN1ZmZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5jb21wYW55LnN1ZmZpeGVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhdGNoUGhyYXNlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuY29tcGFueS5jYXRjaFBocmFzZVxuICAgKi9cbiAgdGhpcy5jYXRjaFBocmFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZigne3tjb21wYW55LmNhdGNoUGhyYXNlQWRqZWN0aXZlfX0ge3tjb21wYW55LmNhdGNoUGhyYXNlRGVzY3JpcHRvcn19IHt7Y29tcGFueS5jYXRjaFBocmFzZU5vdW59fScpXG4gIH1cblxuICAvKipcbiAgICogYnNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LmJzXG4gICAqL1xuICB0aGlzLmJzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmKCd7e2NvbXBhbnkuYnNCdXp6fX0ge3tjb21wYW55LmJzQWRqZWN0aXZlfX0ge3tjb21wYW55LmJzTm91bn19Jyk7XG4gIH1cblxuICAvKipcbiAgICogY2F0Y2hQaHJhc2VBZGplY3RpdmVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LmNhdGNoUGhyYXNlQWRqZWN0aXZlXG4gICAqL1xuICB0aGlzLmNhdGNoUGhyYXNlQWRqZWN0aXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmNvbXBhbnkuYWRqZWN0aXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjYXRjaFBocmFzZURlc2NyaXB0b3JcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LmNhdGNoUGhyYXNlRGVzY3JpcHRvclxuICAgKi9cbiAgdGhpcy5jYXRjaFBocmFzZURlc2NyaXB0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuY29tcGFueS5kZXNjcmlwdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjYXRjaFBocmFzZU5vdW5cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5jb21wYW55LmNhdGNoUGhyYXNlTm91blxuICAgKi9cbiAgdGhpcy5jYXRjaFBocmFzZU5vdW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuY29tcGFueS5ub3VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBic0FkamVjdGl2ZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbXBhbnkuYnNBZGplY3RpdmVcbiAgICovXG4gIHRoaXMuYnNBZGplY3RpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuY29tcGFueS5ic19hZGplY3RpdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIGJzQnV6elxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbXBhbnkuYnNCdXp6XG4gICAqL1xuICB0aGlzLmJzQnV6eiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5jb21wYW55LmJzX3ZlcmIpO1xuICB9XG5cbiAgLyoqXG4gICAqIGJzTm91blxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmNvbXBhbnkuYnNOb3VuXG4gICAqL1xuICB0aGlzLmJzTm91biA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5jb21wYW55LmJzX25vdW4pO1xuICB9XG4gIFxufVxuXG5tb2R1bGVbJ2V4cG9ydHMnXSA9IENvbXBhbnk7IiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5kYXRhYmFzZVxuICovXG52YXIgRGF0YWJhc2UgPSBmdW5jdGlvbiAoZmFrZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvKipcbiAgICogY29sdW1uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0YWJhc2UuY29sdW1uXG4gICAqL1xuICBzZWxmLmNvbHVtbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5kYXRhYmFzZS5jb2x1bW4pO1xuICB9O1xuXG4gIHNlbGYuY29sdW1uLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgY29sdW1uIG5hbWUuXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcImlkXCIsIFwidGl0bGVcIiwgXCJjcmVhdGVkQXRcIl1cbiAgfTtcblxuICAvKipcbiAgICogdHlwZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmRhdGFiYXNlLnR5cGVcbiAgICovXG4gIHNlbGYudHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5kYXRhYmFzZS50eXBlKTtcbiAgfTtcblxuICBzZWxmLnR5cGUuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSBjb2x1bW4gdHlwZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiYnl0ZVwiLCBcImludFwiLCBcInZhcmNoYXJcIiwgXCJ0aW1lc3RhbXBcIl1cbiAgfTtcblxuICAvKipcbiAgICogY29sbGF0aW9uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0YWJhc2UuY29sbGF0aW9uXG4gICAqL1xuICBzZWxmLmNvbGxhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5kYXRhYmFzZS5jb2xsYXRpb24pO1xuICB9O1xuXG4gIHNlbGYuY29sbGF0aW9uLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgY29sbGF0aW9uLlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJ1dGY4X3VuaWNvZGVfY2lcIiwgXCJ1dGY4X2JpblwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiBlbmdpbmVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5kYXRhYmFzZS5lbmdpbmVcbiAgICovXG4gIHNlbGYuZW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmRhdGFiYXNlLmVuZ2luZSk7XG4gIH07XG5cbiAgc2VsZi5lbmdpbmUuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSBzdG9yYWdlIGVuZ2luZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiTXlJU0FNXCIsIFwiSW5ub0RCXCJdXG4gIH07XG59O1xuXG5tb2R1bGVbXCJleHBvcnRzXCJdID0gRGF0YWJhc2U7XG4iLCIvKipcclxuICpcclxuICogQG5hbWVzcGFjZSBmYWtlci5kYXRhdHlwZVxyXG4gKi9cclxuZnVuY3Rpb24gRGF0YXR5cGUgKGZha2VyLCBzZWVkKSB7XHJcbiAgLy8gVXNlIGEgdXNlciBwcm92aWRlZCBzZWVkIGlmIGl0IGlzIGFuIGFycmF5IG9yIG51bWJlclxyXG4gIGlmIChBcnJheS5pc0FycmF5KHNlZWQpICYmIHNlZWQubGVuZ3RoKSB7XHJcbiAgICBmYWtlci5tZXJzZW5uZS5zZWVkX2FycmF5KHNlZWQpO1xyXG4gIH1cclxuICBlbHNlIGlmKCFpc05hTihzZWVkKSkge1xyXG4gICAgZmFrZXIubWVyc2VubmUuc2VlZChzZWVkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHNpbmdsZSByYW5kb20gbnVtYmVyIGJhc2VkIG9uIGEgbWF4IG51bWJlciBvciByYW5nZVxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUubnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge21peGVkfSBvcHRpb25zIHttaW4sIG1heCwgcHJlY2lzaW9ufVxyXG4gICAgICovXHJcbiAgdGhpcy5udW1iZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgIG1heDogb3B0aW9uc1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5taW4gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgb3B0aW9ucy5taW4gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYXggPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgb3B0aW9ucy5tYXggPSA5OTk5OTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5wcmVjaXNpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgb3B0aW9ucy5wcmVjaXNpb24gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1ha2UgdGhlIHJhbmdlIGluY2x1c2l2ZSBvZiB0aGUgbWF4IHZhbHVlXHJcbiAgICB2YXIgbWF4ID0gb3B0aW9ucy5tYXg7XHJcbiAgICBpZiAobWF4ID49IDApIHtcclxuICAgICAgbWF4ICs9IG9wdGlvbnMucHJlY2lzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICBmYWtlci5tZXJzZW5uZS5yYW5kKG1heCAvIG9wdGlvbnMucHJlY2lzaW9uLCBvcHRpb25zLm1pbiAvIG9wdGlvbnMucHJlY2lzaW9uKSk7XHJcbiAgICAvLyBXb3JrYXJvdW5kIHByb2JsZW0gaW4gRmxvYXQgcG9pbnQgYXJpdGhtZXRpY3MgZm9yIGUuZy4gNjY4MTQ5MyAvIDAuMDFcclxuICAgIHJhbmRvbU51bWJlciA9IHJhbmRvbU51bWJlciAvICgxIC8gb3B0aW9ucy5wcmVjaXNpb24pO1xyXG5cclxuICAgIHJldHVybiByYW5kb21OdW1iZXI7XHJcblxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAgICogcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZmxvYXRpbmctcG9pbnQgbnVtYmVyIGJhc2VkIG9uIGEgbWF4IG51bWJlciBvciByYW5nZVxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUuZmxvYXRcclxuICAgICAqIEBwYXJhbSB7bWl4ZWR9IG9wdGlvbnNcclxuICAgICAqL1xyXG4gIHRoaXMuZmxvYXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgcHJlY2lzaW9uOiBvcHRpb25zXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciBvcHRzID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIG9wdGlvbnMpIHtcclxuICAgICAgb3B0c1twXSA9IG9wdGlvbnNbcF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG9wdHMucHJlY2lzaW9uID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBvcHRzLnByZWNpc2lvbiA9IDAuMDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFrZXIuZGF0YXR5cGUubnVtYmVyKG9wdHMpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAgICogbWV0aG9kIHJldHVybnMgYSBEYXRlIG9iamVjdCB1c2luZyBhIHJhbmRvbSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHNpbmNlIDEuIEphbiAxOTcwIFVUQ1xyXG4gICAgICogQ2F2ZWF0OiBzZWVkaW5nIGlzIG5vdCB3b3JraW5nXHJcbiAgICAgKlxyXG4gICAgICogQG1ldGhvZCBmYWtlci5kYXRhdHlwZS5kYXRldGltZVxyXG4gICAgICogQHBhcmFtIHttaXhlZH0gb3B0aW9ucywgcGFzcyBtaW4gT1IgbWF4IGFzIG51bWJlciBvZiBtaWxsaXNlY29uZHMgc2luY2UgMS4gSmFuIDE5NzAgVVRDXHJcbiAgICAgKi9cclxuICB0aGlzLmRhdGV0aW1lID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgIG1heDogb3B0aW9uc1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtaW5NYXggPSA4NjQwMDAwMDAwMDAwMDAwO1xyXG5cclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5taW4gPT09IFwidW5kZWZpbmVkXCIgfHwgb3B0aW9ucy5taW4gPCBtaW5NYXgqLTEpIHtcclxuICAgICAgb3B0aW9ucy5taW4gPSBuZXcgRGF0ZSgpLnNldEZ1bGxZZWFyKDE5OTAsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYXggPT09IFwidW5kZWZpbmVkXCIgfHwgb3B0aW9ucy5tYXggPiBtaW5NYXgpIHtcclxuICAgICAgb3B0aW9ucy5tYXggPSBuZXcgRGF0ZSgpLnNldEZ1bGxZZWFyKDIxMDAsMSwxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmFuZG9tID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHJhbmRvbSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nLCBjb250YWluaW5nIFVURi0xNiBjaGFycyBiZXR3ZWVuIDMzIGFuZCAxMjUgKCchJyB0byAnfScpXHJcbiAgICAgKlxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUuc3RyaW5nXHJcbiAgICAgKiBAcGFyYW0geyBudW1iZXIgfSBsZW5ndGg6IGxlbmd0aCBvZiBnZW5lcmF0ZWQgc3RyaW5nLCBkZWZhdWx0ID0gMTAsIG1heCBsZW5ndGggPSAyXjIwXHJcbiAgICAgKi9cclxuICB0aGlzLnN0cmluZyA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcclxuICAgIGlmKGxlbmd0aCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGxlbmd0aCA9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtYXhMZW5ndGggPSBNYXRoLnBvdygyLCAyMCk7XHJcbiAgICBpZihsZW5ndGggPj0gKG1heExlbmd0aCkpe1xyXG4gICAgICBsZW5ndGggPSBtYXhMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNoYXJDb2RlT3B0aW9uID0ge1xyXG4gICAgICBtaW46IDMzLFxyXG4gICAgICBtYXg6IDEyNVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmV0dXJuU3RyaW5nID0gJyc7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKXtcclxuICAgICAgcmV0dXJuU3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZmFrZXIuZGF0YXR5cGUubnVtYmVyKGNoYXJDb2RlT3B0aW9uKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAgICogdXVpZFxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUudXVpZFxyXG4gICAgICovXHJcbiAgdGhpcy51dWlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIFJGQzQxMjJfVEVNUExBVEUgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcclxuICAgIHZhciByZXBsYWNlUGxhY2Vob2xkZXJzID0gZnVuY3Rpb24gKHBsYWNlaG9sZGVyKSB7XHJcbiAgICAgIHZhciByYW5kb20gPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtaW46IDAsIG1heDogMTUgfSk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBsYWNlaG9sZGVyID09ICd4JyA/IHJhbmRvbSA6IChyYW5kb20gJjB4MyB8IDB4OCk7XHJcbiAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygxNik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJGQzQxMjJfVEVNUExBVEUucmVwbGFjZSgvW3h5XS9nLCByZXBsYWNlUGxhY2Vob2xkZXJzKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgICAqIGJvb2xlYW5cclxuICAgICAqXHJcbiAgICAgKiBAbWV0aG9kIGZha2VyLmRhdGF0eXBlLmJvb2xlYW5cclxuICAgICAqL1xyXG4gIHRoaXMuYm9vbGVhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIWZha2VyLmRhdGF0eXBlLm51bWJlcigxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICAgKiBoZXhhRGVjaW1hbFxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUuaGV4YURlY2ltYWxcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBkZWZhdWx0cyB0byAxXHJcbiAgICAgKi9cclxuICB0aGlzLmhleGFEZWNpbWFsID0gZnVuY3Rpb24gaGV4YURlY2ltYWwoY291bnQpIHtcclxuICAgIGlmICh0eXBlb2YgY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgY291bnQgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB3aG9sZVN0cmluZyA9IFwiXCI7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICB3aG9sZVN0cmluZyArPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCJhXCIsIFwiYlwiLCBcImNcIiwgXCJkXCIsIFwiZVwiLCBcImZcIiwgXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBcIjB4XCIrd2hvbGVTdHJpbmc7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGpzb24gb2JqZWN0IHdpdGggNyBwcmUtZGVmaW5lZCBwcm9wZXJ0aWVzXHJcbiAgICAgKlxyXG4gICAgICogQG1ldGhvZCBmYWtlci5kYXRhdHlwZS5qc29uXHJcbiAgICAgKi9cclxuICB0aGlzLmpzb24gPSBmdW5jdGlvbiBqc29uKCkge1xyXG5cclxuICAgIHZhciBwcm9wZXJ0aWVzID0gWydmb28nLCAnYmFyJywgJ2Jpa2UnLCAnYScsICdiJywgJ25hbWUnLCAncHJvcCddO1xyXG5cclxuICAgIHZhciByZXR1cm5PYmplY3QgPSB7fTtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKXtcclxuICAgICAgcmV0dXJuT2JqZWN0W3Byb3BdID0gZmFrZXIuZGF0YXR5cGUuYm9vbGVhbigpID9cclxuICAgICAgICBmYWtlci5kYXRhdHlwZS5zdHJpbmcoKSA6IGZha2VyLmRhdGF0eXBlLm51bWJlcigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJldHVybk9iamVjdCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICAgKiByZXR1cm5zIGFuIGFycmF5IHdpdGggdmFsdWVzIGdlbmVyYXRlZCBieSBmYWtlci5kYXRhdHlwZS5udW1iZXIgYW5kIGZha2VyLmRhdGF0eXBlLnN0cmluZ1xyXG4gICAgICpcclxuICAgICAqIEBtZXRob2QgZmFrZXIuZGF0YXR5cGUuYXJyYXlcclxuICAgICAqIEBwYXJhbSB7IG51bWJlciB9IGxlbmd0aCBvZiB0aGUgcmV0dXJuZWQgYXJyYXlcclxuICAgICAqL1xyXG5cclxuICB0aGlzLmFycmF5ID0gZnVuY3Rpb24gYXJyYXkobGVuZ3RoKSB7XHJcblxyXG5cclxuICAgIGlmKGxlbmd0aCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgbGVuZ3RoID0gMTA7XHJcbiAgICB9XHJcbiAgICB2YXIgcmV0dXJuQXJyYXkgPSBuZXcgQXJyYXkobGVuZ3RoKTtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKyl7XHJcbiAgICAgIHJldHVybkFycmF5W2ldID0gZmFrZXIuZGF0YXR5cGUuYm9vbGVhbigpID9cclxuICAgICAgICBmYWtlci5kYXRhdHlwZS5zdHJpbmcoKSA6IGZha2VyLmRhdGF0eXBlLm51bWJlcigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybkFycmF5O1xyXG5cclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlWydleHBvcnRzJ10gPSBEYXRhdHlwZTtcclxuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5kYXRlXG4gKi9cbnZhciBfRGF0ZSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8qKlxuICAgKiBwYXN0XG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0ZS5wYXN0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyc1xuICAgKiBAcGFyYW0ge2RhdGV9IHJlZkRhdGVcbiAgICovXG4gIHNlbGYucGFzdCA9IGZ1bmN0aW9uICh5ZWFycywgcmVmRGF0ZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBpZiAodHlwZW9mIHJlZkRhdGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKHJlZkRhdGUpKTtcbiAgICB9XG5cbiAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICBtaW46IDEwMDAsXG4gICAgICBtYXg6ICh5ZWFycyB8fCAxKSAqIDM2NSAqIDI0ICogMzYwMCAqIDEwMDBcbiAgICB9O1xuXG4gICAgdmFyIHBhc3QgPSBkYXRlLmdldFRpbWUoKTtcbiAgICBwYXN0IC09IGZha2VyLmRhdGF0eXBlLm51bWJlcihyYW5nZSk7IC8vIHNvbWUgdGltZSBmcm9tIG5vdyB0byBOIHllYXJzIGFnbywgaW4gbWlsbGlzZWNvbmRzXG4gICAgZGF0ZS5zZXRUaW1lKHBhc3QpO1xuXG4gICAgcmV0dXJuIGRhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIGZ1dHVyZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmRhdGUuZnV0dXJlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyc1xuICAgKiBAcGFyYW0ge2RhdGV9IHJlZkRhdGVcbiAgICovXG4gIHNlbGYuZnV0dXJlID0gZnVuY3Rpb24gKHllYXJzLCByZWZEYXRlKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGlmICh0eXBlb2YgcmVmRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUucGFyc2UocmVmRGF0ZSkpO1xuICAgIH1cblxuICAgIHZhciByYW5nZSA9IHtcbiAgICAgIG1pbjogMTAwMCxcbiAgICAgIG1heDogKHllYXJzIHx8IDEpICogMzY1ICogMjQgKiAzNjAwICogMTAwMFxuICAgIH07XG5cbiAgICB2YXIgZnV0dXJlID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgZnV0dXJlICs9IGZha2VyLmRhdGF0eXBlLm51bWJlcihyYW5nZSk7IC8vIHNvbWUgdGltZSBmcm9tIG5vdyB0byBOIHllYXJzIGxhdGVyLCBpbiBtaWxsaXNlY29uZHNcbiAgICBkYXRlLnNldFRpbWUoZnV0dXJlKTtcblxuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBiZXR3ZWVuXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0ZS5iZXR3ZWVuXG4gICAqIEBwYXJhbSB7ZGF0ZX0gZnJvbVxuICAgKiBAcGFyYW0ge2RhdGV9IHRvXG4gICAqL1xuICBzZWxmLmJldHdlZW4gPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICB2YXIgZnJvbU1pbGxpID0gRGF0ZS5wYXJzZShmcm9tKTtcbiAgICB2YXIgZGF0ZU9mZnNldCA9IGZha2VyLmRhdGF0eXBlLm51bWJlcihEYXRlLnBhcnNlKHRvKSAtIGZyb21NaWxsaSk7XG5cbiAgICB2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKGZyb21NaWxsaSArIGRhdGVPZmZzZXQpO1xuXG4gICAgcmV0dXJuIG5ld0RhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIGJldHdlZW5zXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0ZS5iZXR3ZWVuXG4gICAqIEBwYXJhbSB7ZGF0ZX0gZnJvbVxuICAgKiBAcGFyYW0ge2RhdGV9IHRvXG4gICAqL1xuICBzZWxmLmJldHdlZW5zID0gZnVuY3Rpb24gKGZyb20sIHRvLCBudW0pIHtcbiAgICBpZiAodHlwZW9mIG51bSA9PSAndW5kZWZpbmVkJykgeyBudW0gPSAzOyB9XG4gICAgdmFyIG5ld0RhdGVzID0gW107XG4gICAgdmFyIGZyb21NaWxsaSA9IERhdGUucGFyc2UoZnJvbSk7XG4gICAgdmFyIGRhdGVPZmZzZXQgPSAoRGF0ZS5wYXJzZSh0bykgLSBmcm9tTWlsbGkpIC8gKCBudW0gKyAxICk7XG4gICAgdmFyIGxhc3REYXRlID0gZnJvbVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgIGZyb21NaWxsaSA9IERhdGUucGFyc2UobGFzdERhdGUpO1xuICAgICAgbGFzdERhdGUgPSBuZXcgRGF0ZShmcm9tTWlsbGkgKyBkYXRlT2Zmc2V0KVxuICAgICAgbmV3RGF0ZXMucHVzaChsYXN0RGF0ZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ld0RhdGVzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHJlY2VudFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmRhdGUucmVjZW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkYXlzXG4gICAqIEBwYXJhbSB7ZGF0ZX0gcmVmRGF0ZVxuICAgKi9cbiAgc2VsZi5yZWNlbnQgPSBmdW5jdGlvbiAoZGF5cywgcmVmRGF0ZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBpZiAodHlwZW9mIHJlZkRhdGUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKHJlZkRhdGUpKTtcbiAgICB9XG5cbiAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICBtaW46IDEwMDAsXG4gICAgICBtYXg6IChkYXlzIHx8IDEpICogMjQgKiAzNjAwICogMTAwMFxuICAgIH07XG5cbiAgICB2YXIgZnV0dXJlID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgZnV0dXJlIC09IGZha2VyLmRhdGF0eXBlLm51bWJlcihyYW5nZSk7IC8vIHNvbWUgdGltZSBmcm9tIG5vdyB0byBOIGRheXMgYWdvLCBpbiBtaWxsaXNlY29uZHNcbiAgICBkYXRlLnNldFRpbWUoZnV0dXJlKTtcblxuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzb29uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0ZS5zb29uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkYXlzXG4gICAqIEBwYXJhbSB7ZGF0ZX0gcmVmRGF0ZVxuICAgKi9cbiAgc2VsZi5zb29uID0gZnVuY3Rpb24gKGRheXMsIHJlZkRhdGUpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKHR5cGVvZiByZWZEYXRlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShyZWZEYXRlKSk7XG4gICAgfVxuXG4gICAgdmFyIHJhbmdlID0ge1xuICAgICAgbWluOiAxMDAwLFxuICAgICAgbWF4OiAoZGF5cyB8fCAxKSAqIDI0ICogMzYwMCAqIDEwMDBcbiAgICB9O1xuXG4gICAgdmFyIGZ1dHVyZSA9IGRhdGUuZ2V0VGltZSgpO1xuICAgIGZ1dHVyZSArPSBmYWtlci5kYXRhdHlwZS5udW1iZXIocmFuZ2UpOyAvLyBzb21lIHRpbWUgZnJvbSBub3cgdG8gTiBkYXlzIGxhdGVyLCBpbiBtaWxsaXNlY29uZHNcbiAgICBkYXRlLnNldFRpbWUoZnV0dXJlKTtcblxuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBtb250aFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmRhdGUubW9udGhcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHNlbGYubW9udGggPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHR5cGUgPSAnd2lkZSc7XG4gICAgaWYgKG9wdGlvbnMuYWJicikge1xuICAgICAgdHlwZSA9ICdhYmJyJztcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMuZGF0ZS5tb250aFt0eXBlICsgJ19jb250ZXh0J10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0eXBlICs9ICdfY29udGV4dCc7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZSA9IGZha2VyLmRlZmluaXRpb25zLmRhdGUubW9udGhbdHlwZV07XG5cbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChzb3VyY2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiB3ZWVrZGF5XG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAqIEBtZXRob2QgZmFrZXIuZGF0ZS53ZWVrZGF5XG4gICAqL1xuICBzZWxmLndlZWtkYXkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHR5cGUgPSAnd2lkZSc7XG4gICAgaWYgKG9wdGlvbnMuYWJicikge1xuICAgICAgdHlwZSA9ICdhYmJyJztcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiB0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMuZGF0ZS53ZWVrZGF5W3R5cGUgKyAnX2NvbnRleHQnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHR5cGUgKz0gJ19jb250ZXh0JztcbiAgICB9XG5cbiAgICB2YXIgc291cmNlID0gZmFrZXIuZGVmaW5pdGlvbnMuZGF0ZS53ZWVrZGF5W3R5cGVdO1xuXG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoc291cmNlKTtcbiAgfTtcblxuICByZXR1cm4gc2VsZjtcblxufTtcblxubW9kdWxlWydleHBvcnRzJ10gPSBfRGF0ZTtcbiIsIi8qXG4gIGZha2UuanMgLSBnZW5lcmF0b3IgbWV0aG9kIGZvciBjb21iaW5pbmcgZmFrZXIgbWV0aG9kcyBiYXNlZCBvbiBzdHJpbmcgaW5wdXRcblxuKi9cblxuZnVuY3Rpb24gRmFrZSAoZmFrZXIpIHtcbiAgXG4gIC8qKlxuICAgKiBHZW5lcmF0b3IgbWV0aG9kIGZvciBjb21iaW5pbmcgZmFrZXIgbWV0aG9kcyBiYXNlZCBvbiBzdHJpbmcgaW5wdXRcbiAgICpcbiAgICogX19FeGFtcGxlOl9fXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zb2xlLmxvZyhmYWtlci5mYWtlKCd7e25hbWUubGFzdE5hbWV9fSwge3tuYW1lLmZpcnN0TmFtZX19IHt7bmFtZS5zdWZmaXh9fScpKTtcbiAgICogLy9vdXRwdXRzOiBcIk1hcmtzLCBEZWFuIFNyLlwiXG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIHdpbGwgaW50ZXJwb2xhdGUgdGhlIGZvcm1hdCBzdHJpbmcgd2l0aCB0aGUgdmFsdWUgb2YgbWV0aG9kc1xuICAgKiBbbmFtZS5sYXN0TmFtZV17QGxpbmsgZmFrZXIubmFtZS5sYXN0TmFtZX0sIFtuYW1lLmZpcnN0TmFtZV17QGxpbmsgZmFrZXIubmFtZS5maXJzdE5hbWV9LFxuICAgKiBhbmQgW25hbWUuc3VmZml4XXtAbGluayBmYWtlci5uYW1lLnN1ZmZpeH1cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5mYWtlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICovXG4gIHRoaXMuZmFrZSA9IGZ1bmN0aW9uIGZha2UgKHN0cikge1xuICAgIC8vIHNldHVwIGRlZmF1bHQgcmVzcG9uc2UgYXMgZW1wdHkgc3RyaW5nXG4gICAgdmFyIHJlcyA9ICcnO1xuXG4gICAgLy8gaWYgaW5jb21pbmcgc3RyIHBhcmFtZXRlciBpcyBub3QgcHJvdmlkZWQsIHJldHVybiBlcnJvciBtZXNzYWdlXG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnIHx8IHN0ci5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc3RyaW5nIHBhcmFtZXRlciBpcyByZXF1aXJlZCEnKTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIGZpcnN0IG1hdGNoaW5nIHt7IGFuZCB9fVxuICAgIHZhciBzdGFydCA9IHN0ci5zZWFyY2goJ3t7Jyk7XG4gICAgdmFyIGVuZCA9IHN0ci5zZWFyY2goJ319Jyk7XG5cbiAgICAvLyBpZiBubyB7eyBhbmQgfX0gaXMgZm91bmQsIHdlIGFyZSBkb25lXG4gICAgaWYgKHN0YXJ0ID09PSAtMSB8fCBlbmQgPT09IC0xKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdhdHRlbXB0aW5nIHRvIHBhcnNlJywgc3RyKTtcblxuICAgIC8vIGV4dHJhY3QgbWV0aG9kIG5hbWUgZnJvbSBiZXR3ZWVuIHRoZSB7eyB9fSB0aGF0IHdlIGZvdW5kXG4gICAgLy8gZm9yIGV4YW1wbGU6IHt7bmFtZS5maXJzdE5hbWV9fVxuICAgIHZhciB0b2tlbiA9IHN0ci5zdWJzdHIoc3RhcnQgKyAyLCAgZW5kIC0gc3RhcnQgLSAyKTtcbiAgICB2YXIgbWV0aG9kID0gdG9rZW4ucmVwbGFjZSgnfX0nLCAnJykucmVwbGFjZSgne3snLCAnJyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnbWV0aG9kJywgbWV0aG9kKVxuXG4gICAgLy8gZXh0cmFjdCBtZXRob2QgcGFyYW1ldGVyc1xuICAgIHZhciByZWdFeHAgPSAvXFwoKFteKV0rKVxcKS87XG4gICAgdmFyIG1hdGNoZXMgPSByZWdFeHAuZXhlYyhtZXRob2QpO1xuICAgIHZhciBwYXJhbWV0ZXJzID0gJyc7XG4gICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgIG1ldGhvZCA9IG1ldGhvZC5yZXBsYWNlKHJlZ0V4cCwgJycpO1xuICAgICAgcGFyYW1ldGVycyA9IG1hdGNoZXNbMV07XG4gICAgfVxuXG4gICAgLy8gc3BsaXQgdGhlIG1ldGhvZCBpbnRvIG1vZHVsZSBhbmQgZnVuY3Rpb25cbiAgICB2YXIgcGFydHMgPSBtZXRob2Quc3BsaXQoJy4nKTtcblxuICAgIGlmICh0eXBlb2YgZmFrZXJbcGFydHNbMF1dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbW9kdWxlOiAnICsgcGFydHNbMF0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZmFrZXJbcGFydHNbMF1dW3BhcnRzWzFdXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1ldGhvZDogJyArIHBhcnRzWzBdICsgXCIuXCIgKyBwYXJ0c1sxXSk7XG4gICAgfVxuXG4gICAgLy8gYXNzaWduIHRoZSBmdW5jdGlvbiBmcm9tIHRoZSBtb2R1bGUuZnVuY3Rpb24gbmFtZXNwYWNlXG4gICAgdmFyIGZuID0gZmFrZXJbcGFydHNbMF1dW3BhcnRzWzFdXTtcblxuICAgIC8vIElmIHBhcmFtZXRlcnMgYXJlIHBvcHVsYXRlZCBoZXJlLCB0aGV5IGFyZSBhbHdheXMgZ29pbmcgdG8gYmUgb2Ygc3RyaW5nIHR5cGVcbiAgICAvLyBzaW5jZSB3ZSBtaWdodCBhY3R1YWxseSBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFycmF5LFxuICAgIC8vIHdlIGFsd2F5cyBhdHRlbXB0IHRvIHRoZSBwYXJzZSB0aGUgaW5jb21pbmcgcGFyYW1ldGVycyBpbnRvIEpTT05cbiAgICB2YXIgcGFyYW1zO1xuICAgIC8vIE5vdGU6IHdlIGV4cGVyaWVuY2UgYSBzbWFsbCBwZXJmb3JtYW5jZSBoaXQgaGVyZSBkdWUgdG8gSlNPTi5wYXJzZSB0cnkgLyBjYXRjaFxuICAgIC8vIElmIGFueW9uZSBhY3R1YWxseSBuZWVkcyB0byBvcHRpbWl6ZSB0aGlzIHNwZWNpZmljIGNvZGUgcGF0aCwgcGxlYXNlIG9wZW4gYSBzdXBwb3J0IGlzc3VlIG9uIGdpdGh1YlxuICAgIHRyeSB7XG4gICAgICBwYXJhbXMgPSBKU09OLnBhcnNlKHBhcmFtZXRlcnMpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBzaW5jZSBKU09OLnBhcnNlIHRocmV3IGFuIGVycm9yLCBhc3N1bWUgcGFyYW1ldGVycyB3YXMgYWN0dWFsbHkgYSBzdHJpbmdcbiAgICAgIHBhcmFtcyA9IHBhcmFtZXRlcnM7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIiAmJiBwYXJhbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXN1bHQgPSBmbi5jYWxsKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBmbi5jYWxsKHRoaXMsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZSB0aGUgZm91bmQgdGFnIHdpdGggdGhlIHJldHVybmVkIGZha2UgdmFsdWVcbiAgICByZXMgPSBzdHIucmVwbGFjZSgne3snICsgdG9rZW4gKyAnfX0nLCByZXN1bHQpO1xuXG4gICAgLy8gcmV0dXJuIHRoZSByZXNwb25zZSByZWN1cnNpdmVseSB1bnRpbCB3ZSBhcmUgZG9uZSBmaW5kaW5nIGFsbCB0YWdzXG4gICAgcmV0dXJuIGZha2UocmVzKTsgICAgXG4gIH1cbiAgXG4gIHJldHVybiB0aGlzO1xuICBcbiAgXG59XG5cbm1vZHVsZVsnZXhwb3J0cyddID0gRmFrZTsiLCIvKipcbiAqIEBuYW1lc3BhY2UgZmFrZXIuZmluYW5jZVxuICovXG52YXIgRmluYW5jZSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgaWJhbkxpYiA9IHJlcXVpcmUoXCIuL2liYW5cIik7XG4gIHZhciBIZWxwZXJzID0gZmFrZXIuaGVscGVycyxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gIC8qKlxuICAgKiBhY2NvdW50XG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5hY2NvdW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGhcbiAgICovXG4gIHNlbGYuYWNjb3VudCA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcblxuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHx8IDg7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSArICcjJztcbiAgICAgIH1cbiAgICAgIGxlbmd0aCA9IG51bGw7XG4gICAgICByZXR1cm4gSGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcih0ZW1wbGF0ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGFjY291bnROYW1lXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5hY2NvdW50TmFtZVxuICAgKi9cbiAgc2VsZi5hY2NvdW50TmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgcmV0dXJuIFtIZWxwZXJzLnJhbmRvbWl6ZShmYWtlci5kZWZpbml0aW9ucy5maW5hbmNlLmFjY291bnRfdHlwZSksICdBY2NvdW50J10uam9pbignICcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiByb3V0aW5nTnVtYmVyXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5yb3V0aW5nTnVtYmVyXG4gICAqL1xuICBzZWxmLnJvdXRpbmdOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHZhciByb3V0aW5nTnVtYmVyID0gSGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcignIyMjIyMjIyMnKTtcblxuICAgICAgLy8gTW9kdWxlcyAxMCBzdHJhaWdodCBzdW1tYXRpb24uXG4gICAgICB2YXIgc3VtID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3V0aW5nTnVtYmVyLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHN1bSArPSBOdW1iZXIocm91dGluZ051bWJlcltpXSkgKiAzO1xuICAgICAgICBzdW0gKz0gTnVtYmVyKHJvdXRpbmdOdW1iZXJbaSArIDFdKSAqIDc7XG4gICAgICAgIHN1bSArPSBOdW1iZXIocm91dGluZ051bWJlcltpICsgMl0pIHx8IDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3V0aW5nTnVtYmVyICsgKE1hdGguY2VpbChzdW0gLyAxMCkgKiAxMCAtIHN1bSk7XG4gIH1cblxuICAvKipcbiAgICogbWFza1xuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmZpbmFuY2UubWFza1xuICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyZW5zXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZWxsaXBzaXNcbiAgICovXG4gIHNlbGYubWFzayA9IGZ1bmN0aW9uIChsZW5ndGgsIHBhcmVucywgZWxsaXBzaXMpIHtcblxuICAgICAgLy9zZXQgZGVmYXVsdHNcbiAgICAgIGxlbmd0aCA9IChsZW5ndGggPT0gMCB8fCAhbGVuZ3RoIHx8IHR5cGVvZiBsZW5ndGggPT0gJ3VuZGVmaW5lZCcpID8gNCA6IGxlbmd0aDtcbiAgICAgIHBhcmVucyA9IChwYXJlbnMgPT09IG51bGwpID8gdHJ1ZSA6IHBhcmVucztcbiAgICAgIGVsbGlwc2lzID0gKGVsbGlwc2lzID09PSBudWxsKSA/IHRydWUgOiBlbGxpcHNpcztcblxuICAgICAgLy9jcmVhdGUgYSB0ZW1wbGF0ZSBmb3IgbGVuZ3RoXG4gICAgICB2YXIgdGVtcGxhdGUgPSAnJztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgKyAnIyc7XG4gICAgICB9XG5cbiAgICAgIC8vcHJlZml4IHdpdGggZWxsaXBzaXNcbiAgICAgIHRlbXBsYXRlID0gKGVsbGlwc2lzKSA/IFsnLi4uJywgdGVtcGxhdGVdLmpvaW4oJycpIDogdGVtcGxhdGU7XG5cbiAgICAgIHRlbXBsYXRlID0gKHBhcmVucykgPyBbJygnLCB0ZW1wbGF0ZSwgJyknXS5qb2luKCcnKSA6IHRlbXBsYXRlO1xuXG4gICAgICAvL2dlbmVyYXRlIHJhbmRvbSBudW1iZXJzXG4gICAgICB0ZW1wbGF0ZSA9IEhlbHBlcnMucmVwbGFjZVN5bWJvbFdpdGhOdW1iZXIodGVtcGxhdGUpO1xuXG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy9taW4gYW5kIG1heCB0YWtlIGluIG1pbmltdW0gYW5kIG1heGltdW0gYW1vdW50cywgZGVjIGlzIHRoZSBkZWNpbWFsIHBsYWNlIHlvdSB3YW50IHJvdW5kZWQgdG8sIHN5bWJvbCBpcyAkLCDigqwsIMKjLCBldGNcbiAgLy9OT1RFOiB0aGlzIHJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZhbHVlLCBpZiB5b3Ugd2FudCBhIG51bWJlciB1c2UgcGFyc2VGbG9hdCBhbmQgbm8gc3ltYm9sXG5cbiAgLyoqXG4gICAqIGFtb3VudFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmZpbmFuY2UuYW1vdW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzeW1ib2xcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2VsZi5hbW91bnQgPSBmdW5jdGlvbiAobWluLCBtYXgsIGRlYywgc3ltYm9sLCBhdXRvRm9ybWF0KSB7XG5cbiAgICAgIG1pbiA9IG1pbiB8fCAwO1xuICAgICAgbWF4ID0gbWF4IHx8IDEwMDA7XG4gICAgICBkZWMgPSBkZWMgPT09IHVuZGVmaW5lZCA/IDIgOiBkZWM7XG4gICAgICBzeW1ib2wgPSBzeW1ib2wgfHwgJyc7XG4gICAgICBjb25zdCByYW5kVmFsdWUgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtYXg6IG1heCwgbWluOiBtaW4sIHByZWNpc2lvbjogTWF0aC5wb3coMTAsIC1kZWMpIH0pO1xuXG4gICAgICB2YXIgZm9ybWF0dGVkU3RyaW5nO1xuICAgICAgaWYoYXV0b0Zvcm1hdCkge1xuICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSByYW5kVmFsdWUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7bWluaW11bUZyYWN0aW9uRGlnaXRzOiBkZWN9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSByYW5kVmFsdWUudG9GaXhlZChkZWMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3ltYm9sICsgZm9ybWF0dGVkU3RyaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiB0cmFuc2FjdGlvblR5cGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5maW5hbmNlLnRyYW5zYWN0aW9uVHlwZVxuICAgKi9cbiAgc2VsZi50cmFuc2FjdGlvblR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gSGVscGVycy5yYW5kb21pemUoZmFrZXIuZGVmaW5pdGlvbnMuZmluYW5jZS50cmFuc2FjdGlvbl90eXBlKTtcbiAgfTtcblxuICAvKipcbiAgICogY3VycmVuY3lDb2RlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5jdXJyZW5jeUNvZGVcbiAgICovXG4gIHNlbGYuY3VycmVuY3lDb2RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5vYmplY3RFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmZpbmFuY2UuY3VycmVuY3kpWydjb2RlJ107XG4gIH07XG5cbiAgLyoqXG4gICAqIGN1cnJlbmN5TmFtZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmZpbmFuY2UuY3VycmVuY3lOYW1lXG4gICAqL1xuICBzZWxmLmN1cnJlbmN5TmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWtlci5yYW5kb20ub2JqZWN0RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5maW5hbmNlLmN1cnJlbmN5LCAna2V5Jyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGN1cnJlbmN5U3ltYm9sXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5jdXJyZW5jeVN5bWJvbFxuICAgKi9cbiAgc2VsZi5jdXJyZW5jeVN5bWJvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzeW1ib2w7XG5cbiAgICAgIHdoaWxlICghc3ltYm9sKSB7XG4gICAgICAgICAgc3ltYm9sID0gZmFrZXIucmFuZG9tLm9iamVjdEVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuZmluYW5jZS5jdXJyZW5jeSlbJ3N5bWJvbCddO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN5bWJvbDtcbiAgfTtcblxuICAvKipcbiAgICogYml0Y29pbkFkZHJlc3NcbiAgICpcbiAgICogQG1ldGhvZCAgZmFrZXIuZmluYW5jZS5iaXRjb2luQWRkcmVzc1xuICAgKi9cbiAgc2VsZi5iaXRjb2luQWRkcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWRkcmVzc0xlbmd0aCA9IGZha2VyLmRhdGF0eXBlLm51bWJlcih7IG1pbjogMjUsIG1heDogMzQgfSk7XG5cbiAgICB2YXIgYWRkcmVzcyA9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoWycxJywgJzMnXSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZHJlc3NMZW5ndGggLSAxOyBpKyspXG4gICAgICBhZGRyZXNzICs9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoJzEyMzQ1Njc4OWFiY2RlZmdoaWprbW5vcHFyc3R1dnd4eXpBQkNERUZHSEpLTE1OUFFSU1RVVldYWVonLnNwbGl0KCcnKSk7XG5cbiAgICByZXR1cm4gYWRkcmVzcztcbiAgfVxuXG4vKipcbiAqIGxpdGVjb2luQWRkcmVzc1xuICpcbiAqIEBtZXRob2QgIGZha2VyLmZpbmFuY2UubGl0ZWNvaW5BZGRyZXNzXG4gKi9cbnNlbGYubGl0ZWNvaW5BZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYWRkcmVzc0xlbmd0aCA9IGZha2VyLmRhdGF0eXBlLm51bWJlcih7IG1pbjogMjYsIG1heDogMzMgfSk7XG5cbiAgdmFyIGFkZHJlc3MgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KFsnTCcsICdNJywgJzMnXSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRyZXNzTGVuZ3RoIC0gMTsgaSsrKVxuICAgIGFkZHJlc3MgKz0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudCgnMTIzNDU2Nzg5YWJjZGVmZ2hpamttbm9wcXJzdHV2d3h5ekFCQ0RFRkdISktMTU5QUVJTVFVWV1hZWicuc3BsaXQoJycpKTtcblxuICByZXR1cm4gYWRkcmVzcztcbn1cblxuICAvKipcbiAgICogQ3JlZGl0IGNhcmQgbnVtYmVyXG4gICAqIEBtZXRob2QgZmFrZXIuZmluYW5jZS5jcmVkaXRDYXJkTnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm92aWRlciB8IHNjaGVtZVxuICAqL1xuICBzZWxmLmNyZWRpdENhcmROdW1iZXIgPSBmdW5jdGlvbihwcm92aWRlcil7XG4gICAgcHJvdmlkZXIgPSBwcm92aWRlciB8fCBcIlwiO1xuICAgIHZhciBmb3JtYXQsIGZvcm1hdHM7XG4gICAgdmFyIGxvY2FsZUZvcm1hdCA9IGZha2VyLmRlZmluaXRpb25zLmZpbmFuY2UuY3JlZGl0X2NhcmQ7XG4gICAgaWYgKHByb3ZpZGVyIGluIGxvY2FsZUZvcm1hdCkge1xuICAgICAgZm9ybWF0cyA9IGxvY2FsZUZvcm1hdFtwcm92aWRlcl07IC8vIHRoZXJlIGNob3VsZCBiZSBtdWx0aXBsZSBmb3JtYXRzXG4gICAgICBpZiAodHlwZW9mIGZvcm1hdHMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1hdCA9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZm9ybWF0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcm92aWRlci5tYXRjaCgvIy8pKSB7IC8vIFRoZSB1c2VyIGNob3NlIGFuIG9wdGlvbmFsIHNjaGVtZVxuICAgICAgZm9ybWF0ID0gcHJvdmlkZXI7XG4gICAgfSBlbHNlIHsgLy8gQ2hvb3NlIGEgcmFuZG9tIHByb3ZpZGVyXG4gICAgICBpZiAodHlwZW9mIGxvY2FsZUZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZm9ybWF0ID0gbG9jYWxlRm9ybWF0O1xuICAgICAgfSBlbHNlIGlmKCB0eXBlb2YgbG9jYWxlRm9ybWF0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIC8vIENyZWRpdCBjYXJkcyBhcmUgaW4gYSBvYmplY3Qgc3RydWN0dXJlXG4gICAgICAgIGZvcm1hdHMgPSBmYWtlci5yYW5kb20ub2JqZWN0RWxlbWVudChsb2NhbGVGb3JtYXQsIFwidmFsdWVcIik7IC8vIFRoZXJlIGNob3VsZCBiZSBtdWx0aXBsZSBmb3JtYXRzXG4gICAgICAgIGlmICh0eXBlb2YgZm9ybWF0cyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybWF0ID0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmb3JtYXRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgvXFwvL2csXCJcIilcbiAgICByZXR1cm4gSGVscGVycy5yZXBsYWNlQ3JlZGl0Q2FyZFN5bWJvbHMoZm9ybWF0KTtcbiAgfTtcbiAgLyoqXG4gICAqIENyZWRpdCBjYXJkIENWVlxuICAgKiBAbWV0aG9kIGZha2VyLmZpbmFuY2UuY3JlZGl0Q2FyZENWVlxuICAqL1xuICBzZWxmLmNyZWRpdENhcmRDVlYgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3Z2ID0gXCJcIjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgY3Z2ICs9IGZha2VyLmRhdGF0eXBlLm51bWJlcih7bWF4Ojl9KS50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gY3Z2O1xuICB9O1xuXG4gIC8qKlxuICAgKiBldGhlcmV1bUFkZHJlc3NcbiAgICpcbiAgICogQG1ldGhvZCAgZmFrZXIuZmluYW5jZS5ldGhlcmV1bUFkZHJlc3NcbiAgICovXG4gIHNlbGYuZXRoZXJldW1BZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhZGRyZXNzID0gZmFrZXIuZGF0YXR5cGUuaGV4YURlY2ltYWwoNDApLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGFkZHJlc3M7XG4gIH07XG5cbiAgLyoqXG4gICAqIGliYW5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBbZm9ybWF0dGVkPWZhbHNlXSAtIFJldHVybiBhIGZvcm1hdHRlZCB2ZXJzaW9uIG9mIHRoZSBnZW5lcmF0ZWQgSUJBTi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtjb3VudHJ5Q29kZV0gLSBUaGUgY291bnRyeSBjb2RlIGZyb20gd2hpY2ggeW91IHdhbnQgdG8gZ2VuZXJhdGUgYW4gSUJBTiwgaWYgbm9uZSBpcyBwcm92aWRlZCBhIHJhbmRvbSBjb3VudHJ5IHdpbGwgYmUgdXNlZC5cbiAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBwYXNzZWQgY291bnRyeSBjb2RlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAqXG4gICAqIEBtZXRob2QgIGZha2VyLmZpbmFuY2UuaWJhblxuICAgKi9cbiAgc2VsZi5pYmFuID0gZnVuY3Rpb24gKGZvcm1hdHRlZCwgY291bnRyeUNvZGUpIHtcbiAgICAgIHZhciBpYmFuRm9ybWF0O1xuICAgICAgaWYgKGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgdmFyIGZpbmRGb3JtYXQgPSBmdW5jdGlvbihjdXJyZW50Rm9ybWF0KSB7IHJldHVybiBjdXJyZW50Rm9ybWF0LmNvdW50cnkgPT09IGNvdW50cnlDb2RlOyB9O1xuICAgICAgICAgIGliYW5Gb3JtYXQgPSBpYmFuTGliLmZvcm1hdHMuZmluZChmaW5kRm9ybWF0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWJhbkZvcm1hdCA9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoaWJhbkxpYi5mb3JtYXRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpYmFuRm9ybWF0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VudHJ5IGNvZGUgJyArIGNvdW50cnlDb2RlICsgJyBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcyA9IFwiXCI7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBpYmFuRm9ybWF0LmJiYW4ubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICB2YXIgYmJhbiA9IGliYW5Gb3JtYXQuYmJhbltiXTtcbiAgICAgICAgICB2YXIgYyA9IGJiYW4uY291bnQ7XG4gICAgICAgICAgY291bnQgKz0gYmJhbi5jb3VudDtcbiAgICAgICAgICB3aGlsZSAoYyA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGJiYW4udHlwZSA9PSBcImFcIikge1xuICAgICAgICAgICAgICAgICAgcyArPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGliYW5MaWIuYWxwaGEpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJiYW4udHlwZSA9PSBcImNcIikge1xuICAgICAgICAgICAgICAgICAgaWYgKGZha2VyLmRhdGF0eXBlLm51bWJlcigxMDApIDwgODApIHtcbiAgICAgICAgICAgICAgICAgICAgICBzICs9IGZha2VyLmRhdGF0eXBlLm51bWJlcig5KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcyArPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGliYW5MaWIuYWxwaGEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKGMgPj0gMyAmJiBmYWtlci5kYXRhdHlwZS5udW1iZXIoMTAwKSA8IDMwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGZha2VyLmRhdGF0eXBlLmJvb2xlYW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzICs9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoaWJhbkxpYi5wYXR0ZXJuMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYyAtPSAyO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChpYmFuTGliLnBhdHRlcm4xMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGMtLTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHMgKz0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGMtLTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcyA9IHMuc3Vic3RyaW5nKDAsIGNvdW50KTtcbiAgICAgIH1cbiAgICAgIHZhciBjaGVja3N1bSA9IDk4IC0gaWJhbkxpYi5tb2Q5NyhpYmFuTGliLnRvRGlnaXRTdHJpbmcocyArIGliYW5Gb3JtYXQuY291bnRyeSArIFwiMDBcIikpO1xuICAgICAgaWYgKGNoZWNrc3VtIDwgMTApIHtcbiAgICAgICAgICBjaGVja3N1bSA9IFwiMFwiICsgY2hlY2tzdW07XG4gICAgICB9XG4gICAgICB2YXIgaWJhbiA9IGliYW5Gb3JtYXQuY291bnRyeSArIGNoZWNrc3VtICsgcztcbiAgICAgIHJldHVybiBmb3JtYXR0ZWQgPyBpYmFuLm1hdGNoKC8uezEsNH0vZykuam9pbihcIiBcIikgOiBpYmFuO1xuICB9O1xuXG4gIC8qKlxuICAgKiBiaWNcbiAgICpcbiAgICogQG1ldGhvZCAgZmFrZXIuZmluYW5jZS5iaWNcbiAgICovXG4gIHNlbGYuYmljID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZvd2VscyA9IFtcIkFcIiwgXCJFXCIsIFwiSVwiLCBcIk9cIiwgXCJVXCJdO1xuICAgICAgdmFyIHByb2IgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoMTAwKTtcbiAgICAgIHJldHVybiBIZWxwZXJzLnJlcGxhY2VTeW1ib2xzKFwiPz8/XCIpICtcbiAgICAgICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHZvd2VscykgK1xuICAgICAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoaWJhbkxpYi5pc28zMTY2KSArXG4gICAgICAgICAgSGVscGVycy5yZXBsYWNlU3ltYm9scyhcIj9cIikgKyBcIjFcIiArXG4gICAgICAgICAgKHByb2IgPCAxMCA/XG4gICAgICAgICAgICAgIEhlbHBlcnMucmVwbGFjZVN5bWJvbHMoXCI/XCIgKyBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHZvd2VscykgKyBcIj9cIikgOlxuICAgICAgICAgIHByb2IgPCA0MCA/XG4gICAgICAgICAgICAgIEhlbHBlcnMucmVwbGFjZVN5bWJvbHMoXCIjIyNcIikgOiBcIlwiKTtcbiAgfTtcblxuICAvKipcbiAgICogZGVzY3JpcHRpb25cbiAgICpcbiAgICogQG1ldGhvZCAgZmFrZXIuZmluYW5jZS50cmFuc2FjdGlvbkRlc2NyaXB0aW9uXG4gICAqL1xuICBzZWxmLnRyYW5zYWN0aW9uRGVzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhbnNhY3Rpb24gPSBIZWxwZXJzLmNyZWF0ZVRyYW5zYWN0aW9uKCk7XG4gICAgdmFyIGFjY291bnQgPSB0cmFuc2FjdGlvbi5hY2NvdW50O1xuICAgIHZhciBhbW91bnQgPSB0cmFuc2FjdGlvbi5hbW91bnQ7XG4gICAgdmFyIHRyYW5zYWN0aW9uVHlwZSA9IHRyYW5zYWN0aW9uLnR5cGU7XG4gICAgdmFyIGNvbXBhbnkgPSB0cmFuc2FjdGlvbi5idXNpbmVzcztcbiAgICB2YXIgY2FyZCA9IGZha2VyLmZpbmFuY2UubWFzaygpO1xuICAgIHZhciBjdXJyZW5jeSA9IGZha2VyLmZpbmFuY2UuY3VycmVuY3lDb2RlKCk7XG4gICAgcmV0dXJuIHRyYW5zYWN0aW9uVHlwZSArIFwiIHRyYW5zYWN0aW9uIGF0IFwiICsgY29tcGFueSArIFwiIHVzaW5nIGNhcmQgZW5kaW5nIHdpdGggKioqXCIgKyBjYXJkICsgXCIgZm9yIFwiICsgY3VycmVuY3kgKyBcIiBcIiArIGFtb3VudCArIFwiIGluIGFjY291bnQgKioqXCIgKyBhY2NvdW50XG4gIH07XG5cbn07XG5cbm1vZHVsZVsnZXhwb3J0cyddID0gRmluYW5jZTtcbiIsIi8qKlxuICogQG5hbWVzcGFjZSBmYWtlci5naXRcbiAqL1xuXG52YXIgR2l0ID0gZnVuY3Rpb24oZmFrZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZiA9IGZha2VyLmZha2U7XG5cbiAgdmFyIGhleENoYXJzID0gW1wiMFwiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCIsIFwiOVwiLCBcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIiwgXCJlXCIsIFwiZlwiXTtcblxuICAvKipcbiAgICogYnJhbmNoXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZ2l0LmJyYW5jaFxuICAgKi9cbiAgc2VsZi5icmFuY2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm91biA9IGZha2VyLmhhY2tlci5ub3VuKCkucmVwbGFjZSgnICcsICctJyk7XG4gICAgdmFyIHZlcmIgPSBmYWtlci5oYWNrZXIudmVyYigpLnJlcGxhY2UoJyAnLCAnLScpO1xuICAgIHJldHVybiBub3VuICsgJy0nICsgdmVyYjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb21taXRFbnRyeVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmdpdC5jb21taXRFbnRyeVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc2VsZi5jb21taXRFbnRyeSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBlbnRyeSA9ICdjb21taXQge3tnaXQuY29tbWl0U2hhfX1cXHJcXG4nO1xuXG4gICAgaWYgKG9wdGlvbnMubWVyZ2UgfHwgKGZha2VyLmRhdGF0eXBlLm51bWJlcih7IG1pbjogMCwgbWF4OiA0IH0pID09PSAwKSkge1xuICAgICAgZW50cnkgKz0gJ01lcmdlOiB7e2dpdC5zaG9ydFNoYX19IHt7Z2l0LnNob3J0U2hhfX1cXHJcXG4nO1xuICAgIH1cblxuICAgIGVudHJ5ICs9ICdBdXRob3I6IHt7bmFtZS5maXJzdE5hbWV9fSB7e25hbWUubGFzdE5hbWV9fSA8e3tpbnRlcm5ldC5lbWFpbH19Plxcclxcbic7XG4gICAgZW50cnkgKz0gJ0RhdGU6ICcgKyBmYWtlci5kYXRlLnJlY2VudCgpLnRvU3RyaW5nKCkgKyAnXFxyXFxuJztcbiAgICBlbnRyeSArPSAnXFxyXFxuXFx4YTBcXHhhMFxceGEwXFx4YTB7e2dpdC5jb21taXRNZXNzYWdlfX1cXHJcXG4nO1xuXG4gICAgcmV0dXJuIGYoZW50cnkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBjb21taXRNZXNzYWdlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZ2l0LmNvbW1pdE1lc3NhZ2VcbiAgICovXG4gIHNlbGYuY29tbWl0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmb3JtYXQgPSAne3toYWNrZXIudmVyYn19IHt7aGFja2VyLmFkamVjdGl2ZX19IHt7aGFja2VyLm5vdW59fSc7XG4gICAgcmV0dXJuIGYoZm9ybWF0KTtcbiAgfTtcblxuICAvKipcbiAgICogY29tbWl0U2hhXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZ2l0LmNvbW1pdFNoYVxuICAgKi9cbiAgc2VsZi5jb21taXRTaGEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29tbWl0ID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDA7IGkrKykge1xuICAgICAgY29tbWl0ICs9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoaGV4Q2hhcnMpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21taXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNob3J0U2hhXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuZ2l0LnNob3J0U2hhXG4gICAqL1xuICBzZWxmLnNob3J0U2hhID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNob3J0U2hhID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICBzaG9ydFNoYSArPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGhleENoYXJzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2hvcnRTaGE7XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbm1vZHVsZVsnZXhwb3J0cyddID0gR2l0O1xuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5oYWNrZXJcbiAqL1xudmFyIEhhY2tlciA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICAvKipcbiAgICogYWJicmV2aWF0aW9uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGFja2VyLmFiYnJldmlhdGlvblxuICAgKi9cbiAgc2VsZi5hYmJyZXZpYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuaGFja2VyLmFiYnJldmlhdGlvbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIGFkamVjdGl2ZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmhhY2tlci5hZGplY3RpdmVcbiAgICovXG4gIHNlbGYuYWRqZWN0aXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmhhY2tlci5hZGplY3RpdmUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBub3VuXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGFja2VyLm5vdW5cbiAgICovXG4gIHNlbGYubm91biA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5oYWNrZXIubm91bik7XG4gIH07XG5cbiAgLyoqXG4gICAqIHZlcmJcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oYWNrZXIudmVyYlxuICAgKi9cbiAgc2VsZi52ZXJiID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmhhY2tlci52ZXJiKTtcbiAgfTtcblxuICAvKipcbiAgICogaW5ndmVyYlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmhhY2tlci5pbmd2ZXJiXG4gICAqL1xuICBzZWxmLmluZ3ZlcmIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuaGFja2VyLmluZ3ZlcmIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBwaHJhc2VcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oYWNrZXIucGhyYXNlXG4gICAqL1xuICBzZWxmLnBocmFzZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgYWJicmV2aWF0aW9uOiBzZWxmLmFiYnJldmlhdGlvbixcbiAgICAgIGFkamVjdGl2ZTogc2VsZi5hZGplY3RpdmUsXG4gICAgICBpbmd2ZXJiOiBzZWxmLmluZ3ZlcmIsXG4gICAgICBub3VuOiBzZWxmLm5vdW4sXG4gICAgICB2ZXJiOiBzZWxmLnZlcmJcbiAgICB9O1xuXG4gICAgdmFyIHBocmFzZSA9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuaGFja2VyLnBocmFzZSk7XG4gICAgcmV0dXJuIGZha2VyLmhlbHBlcnMubXVzdGFjaGUocGhyYXNlLCBkYXRhKTtcbiAgfTtcbiAgXG4gIHJldHVybiBzZWxmO1xufTtcblxubW9kdWxlWydleHBvcnRzJ10gPSBIYWNrZXI7IiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5oZWxwZXJzXG4gKi9cbnZhciBIZWxwZXJzID0gZnVuY3Rpb24gKGZha2VyKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8qKlxuICAgKiBiYWNrd2FyZC1jb21wYXRpYmlsaXR5XG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGVscGVycy5yYW5kb21pemVcbiAgICogQHBhcmFtIHthcnJheX0gYXJyYXlcbiAgICovXG4gIHNlbGYucmFuZG9taXplID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICBhcnJheSA9IGFycmF5IHx8IFtcImFcIiwgXCJiXCIsIFwiY1wiXTtcbiAgICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGFycmF5KTtcbiAgfTtcblxuICAvKipcbiAgICogc2x1Z2lmaWVzIHN0cmluZ1xuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmhlbHBlcnMuc2x1Z2lmeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAqL1xuICBzZWxmLnNsdWdpZnkgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgXCJcIjtcbiAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoL1teXFzkuIAt6b6gXFzjgYEt44KUXFzjgqEt44O044O8XFx3XFwuXFwtXSsvZywgJycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBwYXJzZXMgc3RyaW5nIGZvciBhIHN5bWJvbCBhbmQgcmVwbGFjZSBpdCB3aXRoIGEgcmFuZG9tIG51bWJlciBmcm9tIDEtMTBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oZWxwZXJzLnJlcGxhY2VTeW1ib2xXaXRoTnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN5bWJvbCBkZWZhdWx0cyB0byBgXCIjXCJgXG4gICAqL1xuICBzZWxmLnJlcGxhY2VTeW1ib2xXaXRoTnVtYmVyID0gZnVuY3Rpb24gKHN0cmluZywgc3ltYm9sKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgXCJcIjtcbiAgICAgIC8vIGRlZmF1bHQgc3ltYm9sIGlzICcjJ1xuICAgICAgaWYgKHN5bWJvbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3ltYm9sID0gJyMnO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RyID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChzdHJpbmcuY2hhckF0KGkpID09IHN5bWJvbCkge1xuICAgICAgICAgICAgICBzdHIgKz0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaW5nLmNoYXJBdChpKSA9PSBcIiFcIil7XG4gICAgICAgICAgICAgIHN0ciArPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoe21pbjogMiwgbWF4OiA5fSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyICs9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICAvKipcbiAgICogcGFyc2VzIHN0cmluZyBmb3Igc3ltYm9scyAobnVtYmVycyBvciBsZXR0ZXJzKSBhbmQgcmVwbGFjZXMgdGhlbSBhcHByb3ByaWF0ZWx5ICgjIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBudW1iZXIsXG4gICAqID8gd2l0aCBsZXR0ZXIgYW5kICogd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bWJlciBvciBsZXR0ZXIpXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGVscGVycy5yZXBsYWNlU3ltYm9sc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAqL1xuICBzZWxmLnJlcGxhY2VTeW1ib2xzID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nIHx8IFwiXCI7XG4gICAgICB2YXIgYWxwaGEgPSBbJ0EnLCdCJywnQycsJ0QnLCdFJywnRicsJ0cnLCdIJywnSScsJ0onLCdLJywnTCcsJ00nLCdOJywnTycsJ1AnLCdRJywnUicsJ1MnLCdUJywnVScsJ1YnLCdXJywnWCcsJ1knLCdaJ11cbiAgICAgIHZhciBzdHIgPSAnJztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoc3RyaW5nLmNoYXJBdChpKSA9PSBcIiNcIikge1xuICAgICAgICAgICAgICBzdHIgKz0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaW5nLmNoYXJBdChpKSA9PSBcIj9cIikge1xuICAgICAgICAgICAgICBzdHIgKz0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChhbHBoYSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdHJpbmcuY2hhckF0KGkpID09IFwiKlwiKSB7XG4gICAgICAgICAgICBzdHIgKz0gZmFrZXIuZGF0YXR5cGUuYm9vbGVhbigpID8gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChhbHBoYSkgOiBmYWtlci5kYXRhdHlwZS5udW1iZXIoOSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyICs9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICAvKipcbiAgICogcmVwbGFjZSBzeW1ib2xzIGluIGEgY3JlZGl0IGNhcmQgc2NoZW1zIGluY2x1ZGluZyBMdWhuIGNoZWNrc3VtXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGVscGVycy5yZXBsYWNlQ3JlZGl0Q2FyZFN5bWJvbHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3ltYm9sXG4gICAqL1xuXG4gICBzZWxmLnJlcGxhY2VDcmVkaXRDYXJkU3ltYm9scyA9IGZ1bmN0aW9uKHN0cmluZywgc3ltYm9sKSB7XG5cbiAgICAgLy8gZGVmYXVsdCB2YWx1ZXMgcmVxdWlyZWQgZm9yIGNhbGxpbmcgbWV0aG9kIHdpdGhvdXQgYXJndW1lbnRzXG4gICAgIHN0cmluZyA9IHN0cmluZyB8fCBcIjY0NTMtIyMjIy0jIyMjLSMjIyMtIyMjTFwiO1xuICAgICBzeW1ib2wgPSBzeW1ib2wgfHwgXCIjXCI7XG5cbiAgICAgLy8gRnVuY3Rpb24gY2FsY3VsYXRpbmcgdGhlIEx1aG4gY2hlY2tzdW0gb2YgYSBudW1iZXIgc3RyaW5nXG4gICAgIHZhciBnZXRDaGVja0JpdCA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgIG51bWJlci5yZXZlcnNlKCk7XG4gICAgICAgbnVtYmVyID0gbnVtYmVyLm1hcChmdW5jdGlvbihudW0sIGluZGV4KXtcbiAgICAgICAgIGlmIChpbmRleCUyID09PSAwKSB7XG4gICAgICAgICAgIG51bSAqPSAyO1xuICAgICAgICAgICBpZihudW0+OSkge1xuICAgICAgICAgICAgIG51bSAtPSA5O1xuICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgIH0pO1xuICAgICAgIHZhciBzdW0gPSBudW1iZXIucmVkdWNlKGZ1bmN0aW9uKHByZXYsY3Vycil7cmV0dXJuIHByZXYgKyBjdXJyO30pO1xuICAgICAgIHJldHVybiBzdW0gJSAxMDtcbiAgICAgfTtcblxuICAgICBzdHJpbmcgPSBmYWtlci5oZWxwZXJzLnJlZ2V4cFN0eWxlU3RyaW5nUGFyc2Uoc3RyaW5nKTsgLy8gcmVwbGFjZSBbNC05XSB3aXRoIGEgcmFuZG9tIG51bWJlciBpbiByYW5nZSBldGMuLi5cbiAgICAgc3RyaW5nID0gZmFrZXIuaGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcihzdHJpbmcsIHN5bWJvbCk7IC8vIHJlcGxhY2UgIyMjIHdpdGggcmFuZG9tIG51bWJlcnNcblxuICAgICB2YXIgbnVtYmVyTGlzdCA9IHN0cmluZy5yZXBsYWNlKC9cXEQvZyxcIlwiKS5zcGxpdChcIlwiKS5tYXAoZnVuY3Rpb24obnVtKXtyZXR1cm4gcGFyc2VJbnQobnVtKTt9KTtcbiAgICAgdmFyIGNoZWNrTnVtID0gZ2V0Q2hlY2tCaXQobnVtYmVyTGlzdCk7XG4gICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShcIkxcIixjaGVja051bSk7XG4gICB9O1xuXG4gICAvKiogc3RyaW5nIHJlcGVhdCBoZWxwZXIsIGFsdGVybmF0aXZlIHRvIFN0cmluZy5wcm90b3R5cGUucmVwZWF0Li4uLiBTZWUgUFIgIzM4MlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmhlbHBlcnMucmVwZWF0U3RyaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgKi9cbiAgIHNlbGYucmVwZWF0U3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nLCBudW0pIHtcbiAgICAgaWYodHlwZW9mIG51bSA9PT1cInVuZGVmaW5lZFwiKSB7XG4gICAgICAgbnVtID0gMDtcbiAgICAgfVxuICAgICB2YXIgdGV4dCA9IFwiXCI7XG4gICAgIGZvcih2YXIgaSA9IDA7IGkgPCBudW07IGkrKyl7XG4gICAgICAgdGV4dCArPSBzdHJpbmcudG9TdHJpbmcoKTtcbiAgICAgfVxuICAgICByZXR1cm4gdGV4dDtcbiAgIH07XG5cbiAgIC8qKlxuICAgICogcGFyc2Ugc3RyaW5nIHBhdHRlcm5zIGluIGEgc2ltaWxhciB3YXkgdG8gUmVnRXhwXG4gICAgKlxuICAgICogZS5nLiBcIiN7M310ZXN0WzEtNV1cIiAtPiBcIiMjI3Rlc3Q0XCJcbiAgICAqXG4gICAgKiBAbWV0aG9kIGZha2VyLmhlbHBlcnMucmVnZXhwU3R5bGVTdHJpbmdQYXJzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAgICovXG4gICBzZWxmLnJlZ2V4cFN0eWxlU3RyaW5nUGFyc2UgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgXCJcIjtcbiAgICAgLy8gRGVhbCB3aXRoIHJhbmdlIHJlcGVhdCBge21pbixtYXh9YFxuICAgICB2YXIgUkFOR0VfUkVQX1JFRyA9IC8oLilcXHsoXFxkKylcXCwoXFxkKylcXH0vO1xuICAgICB2YXIgUkVQX1JFRyA9IC8oLilcXHsoXFxkKylcXH0vO1xuICAgICB2YXIgUkFOR0VfUkVHID0gL1xcWyhcXGQrKVxcLShcXGQrKVxcXS87XG4gICAgIHZhciBtaW4sIG1heCwgdG1wLCByZXBldGl0aW9ucztcbiAgICAgdmFyIHRva2VuID0gc3RyaW5nLm1hdGNoKFJBTkdFX1JFUF9SRUcpO1xuICAgICB3aGlsZSh0b2tlbiAhPT0gbnVsbCl7XG4gICAgICAgbWluID0gcGFyc2VJbnQodG9rZW5bMl0pO1xuICAgICAgIG1heCA9ICBwYXJzZUludCh0b2tlblszXSk7XG4gICAgICAgLy8gc3dpdGNoIG1pbiBhbmQgbWF4XG4gICAgICAgaWYobWluPm1heCkge1xuICAgICAgICAgdG1wID0gbWF4O1xuICAgICAgICAgbWF4ID0gbWluO1xuICAgICAgICAgbWluID0gdG1wO1xuICAgICAgIH1cbiAgICAgICByZXBldGl0aW9ucyA9IGZha2VyLmRhdGF0eXBlLm51bWJlcih7bWluOm1pbixtYXg6bWF4fSk7XG4gICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDAsdG9rZW4uaW5kZXgpICsgZmFrZXIuaGVscGVycy5yZXBlYXRTdHJpbmcodG9rZW5bMV0sIHJlcGV0aXRpb25zKSArIHN0cmluZy5zbGljZSh0b2tlbi5pbmRleCt0b2tlblswXS5sZW5ndGgpO1xuICAgICAgIHRva2VuID0gc3RyaW5nLm1hdGNoKFJBTkdFX1JFUF9SRUcpO1xuICAgICB9XG4gICAgIC8vIERlYWwgd2l0aCByZXBlYXQgYHtudW19YFxuICAgICB0b2tlbiA9IHN0cmluZy5tYXRjaChSRVBfUkVHKTtcbiAgICAgd2hpbGUodG9rZW4gIT09IG51bGwpe1xuICAgICAgIHJlcGV0aXRpb25zID0gcGFyc2VJbnQodG9rZW5bMl0pO1xuICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZSgwLHRva2VuLmluZGV4KSsgZmFrZXIuaGVscGVycy5yZXBlYXRTdHJpbmcodG9rZW5bMV0sIHJlcGV0aXRpb25zKSArIHN0cmluZy5zbGljZSh0b2tlbi5pbmRleCt0b2tlblswXS5sZW5ndGgpO1xuICAgICAgIHRva2VuID0gc3RyaW5nLm1hdGNoKFJFUF9SRUcpO1xuICAgICB9XG4gICAgIC8vIERlYWwgd2l0aCByYW5nZSBgW21pbi1tYXhdYCAob25seSB3b3JrcyB3aXRoIG51bWJlcnMgZm9yIG5vdylcbiAgICAgLy9UT0RPOiBpbXBsZW1lbnQgZm9yIGxldHRlcnMgZS5nLiBbMC05YS16QS1aXSBldGMuXG5cbiAgICAgdG9rZW4gPSBzdHJpbmcubWF0Y2goUkFOR0VfUkVHKTtcbiAgICAgd2hpbGUodG9rZW4gIT09IG51bGwpe1xuICAgICAgIG1pbiA9IHBhcnNlSW50KHRva2VuWzFdKTsgLy8gVGhpcyB0aW1lIHdlIGFyZSBub3QgY2FwdHVyaW5nIHRoZSBjaGFyIGJlZm9yZSBgW11gXG4gICAgICAgbWF4ID0gIHBhcnNlSW50KHRva2VuWzJdKTtcbiAgICAgICAvLyBzd2l0Y2ggbWluIGFuZCBtYXhcbiAgICAgICBpZihtaW4+bWF4KSB7XG4gICAgICAgICB0bXAgPSBtYXg7XG4gICAgICAgICBtYXggPSBtaW47XG4gICAgICAgICBtaW4gPSB0bXA7XG4gICAgICAgfVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoMCx0b2tlbi5pbmRleCkgK1xuICAgICAgICAgIGZha2VyLmRhdGF0eXBlLm51bWJlcih7bWluOm1pbiwgbWF4Om1heH0pLnRvU3RyaW5nKCkgK1xuICAgICAgICAgIHN0cmluZy5zbGljZSh0b2tlbi5pbmRleCt0b2tlblswXS5sZW5ndGgpO1xuICAgICAgICB0b2tlbiA9IHN0cmluZy5tYXRjaChSQU5HRV9SRUcpO1xuICAgICB9XG4gICAgIHJldHVybiBzdHJpbmc7XG4gICB9O1xuXG4gIC8qKlxuICAgKiB0YWtlcyBhbiBhcnJheSBhbmQgcmFuZG9taXplcyBpdCBpbiBwbGFjZSB0aGVuIHJldHVybnMgaXRcbiAgICogXG4gICAqIHVzZXMgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZSBGaXNoZXLigJNZYXRlcyBhbGdvcml0aG1cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oZWxwZXJzLnNodWZmbGVcbiAgICogQHBhcmFtIHthcnJheX0gb1xuICAgKi9cbiAgc2VsZi5zaHVmZmxlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmICh0eXBlb2YgbyA9PT0gJ3VuZGVmaW5lZCcgfHwgby5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG8gfHwgW107XG4gICAgICB9XG4gICAgICBvID0gbyB8fCBbXCJhXCIsIFwiYlwiLCBcImNcIl07XG4gICAgICBmb3IgKHZhciB4LCBqLCBpID0gby5sZW5ndGggLSAxOyBpID4gMDsgLS1pKSB7XG4gICAgICAgIGogPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoaSk7XG4gICAgICAgIHggPSBvW2ldO1xuICAgICAgICBvW2ldID0gb1tqXTtcbiAgICAgICAgb1tqXSA9IHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gbztcbiAgfTtcblxuICAvKipcbiAgICogbXVzdGFjaGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oZWxwZXJzLm11c3RhY2hlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAgICovXG4gIHNlbGYubXVzdGFjaGUgPSBmdW5jdGlvbiAoc3RyLCBkYXRhKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGZvcih2YXIgcCBpbiBkYXRhKSB7XG4gICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCd7eycgKyBwICsgJ319JywgJ2cnKVxuICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmUsIGRhdGFbcF0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIC8qKlxuICAgKiBjcmVhdGVDYXJkXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGVscGVycy5jcmVhdGVDYXJkXG4gICAqL1xuICBzZWxmLmNyZWF0ZUNhcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgIFwibmFtZVwiOiBmYWtlci5uYW1lLmZpbmROYW1lKCksXG4gICAgICAgICAgXCJ1c2VybmFtZVwiOiBmYWtlci5pbnRlcm5ldC51c2VyTmFtZSgpLFxuICAgICAgICAgIFwiZW1haWxcIjogZmFrZXIuaW50ZXJuZXQuZW1haWwoKSxcbiAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInN0cmVldEFcIjogZmFrZXIuYWRkcmVzcy5zdHJlZXROYW1lKCksXG4gICAgICAgICAgICAgIFwic3RyZWV0QlwiOiBmYWtlci5hZGRyZXNzLnN0cmVldEFkZHJlc3MoKSxcbiAgICAgICAgICAgICAgXCJzdHJlZXRDXCI6IGZha2VyLmFkZHJlc3Muc3RyZWV0QWRkcmVzcyh0cnVlKSxcbiAgICAgICAgICAgICAgXCJzdHJlZXREXCI6IGZha2VyLmFkZHJlc3Muc2Vjb25kYXJ5QWRkcmVzcygpLFxuICAgICAgICAgICAgICBcImNpdHlcIjogZmFrZXIuYWRkcmVzcy5jaXR5KCksXG4gICAgICAgICAgICAgIFwic3RhdGVcIjogZmFrZXIuYWRkcmVzcy5zdGF0ZSgpLFxuICAgICAgICAgICAgICBcImNvdW50cnlcIjogZmFrZXIuYWRkcmVzcy5jb3VudHJ5KCksXG4gICAgICAgICAgICAgIFwiemlwY29kZVwiOiBmYWtlci5hZGRyZXNzLnppcENvZGUoKSxcbiAgICAgICAgICAgICAgXCJnZW9cIjoge1xuICAgICAgICAgICAgICAgICAgXCJsYXRcIjogZmFrZXIuYWRkcmVzcy5sYXRpdHVkZSgpLFxuICAgICAgICAgICAgICAgICAgXCJsbmdcIjogZmFrZXIuYWRkcmVzcy5sb25naXR1ZGUoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBob25lXCI6IGZha2VyLnBob25lLnBob25lTnVtYmVyKCksXG4gICAgICAgICAgXCJ3ZWJzaXRlXCI6IGZha2VyLmludGVybmV0LmRvbWFpbk5hbWUoKSxcbiAgICAgICAgICBcImNvbXBhbnlcIjoge1xuICAgICAgICAgICAgICBcIm5hbWVcIjogZmFrZXIuY29tcGFueS5jb21wYW55TmFtZSgpLFxuICAgICAgICAgICAgICBcImNhdGNoUGhyYXNlXCI6IGZha2VyLmNvbXBhbnkuY2F0Y2hQaHJhc2UoKSxcbiAgICAgICAgICAgICAgXCJic1wiOiBmYWtlci5jb21wYW55LmJzKClcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicG9zdHNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIndvcmRzXCI6IGZha2VyLmxvcmVtLndvcmRzKCksXG4gICAgICAgICAgICAgICAgICBcInNlbnRlbmNlXCI6IGZha2VyLmxvcmVtLnNlbnRlbmNlKCksXG4gICAgICAgICAgICAgICAgICBcInNlbnRlbmNlc1wiOiBmYWtlci5sb3JlbS5zZW50ZW5jZXMoKSxcbiAgICAgICAgICAgICAgICAgIFwicGFyYWdyYXBoXCI6IGZha2VyLmxvcmVtLnBhcmFncmFwaCgpXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwid29yZHNcIjogZmFrZXIubG9yZW0ud29yZHMoKSxcbiAgICAgICAgICAgICAgICAgIFwic2VudGVuY2VcIjogZmFrZXIubG9yZW0uc2VudGVuY2UoKSxcbiAgICAgICAgICAgICAgICAgIFwic2VudGVuY2VzXCI6IGZha2VyLmxvcmVtLnNlbnRlbmNlcygpLFxuICAgICAgICAgICAgICAgICAgXCJwYXJhZ3JhcGhcIjogZmFrZXIubG9yZW0ucGFyYWdyYXBoKClcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJ3b3Jkc1wiOiBmYWtlci5sb3JlbS53b3JkcygpLFxuICAgICAgICAgICAgICAgICAgXCJzZW50ZW5jZVwiOiBmYWtlci5sb3JlbS5zZW50ZW5jZSgpLFxuICAgICAgICAgICAgICAgICAgXCJzZW50ZW5jZXNcIjogZmFrZXIubG9yZW0uc2VudGVuY2VzKCksXG4gICAgICAgICAgICAgICAgICBcInBhcmFncmFwaFwiOiBmYWtlci5sb3JlbS5wYXJhZ3JhcGgoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBcImFjY291bnRIaXN0b3J5XCI6IFtmYWtlci5oZWxwZXJzLmNyZWF0ZVRyYW5zYWN0aW9uKCksIGZha2VyLmhlbHBlcnMuY3JlYXRlVHJhbnNhY3Rpb24oKSwgZmFrZXIuaGVscGVycy5jcmVhdGVUcmFuc2FjdGlvbigpXVxuICAgICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogY29udGV4dHVhbENhcmRcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oZWxwZXJzLmNvbnRleHR1YWxDYXJkXG4gICAqL1xuICBzZWxmLmNvbnRleHR1YWxDYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYW1lID0gZmFrZXIubmFtZS5maXJzdE5hbWUoKSxcbiAgICAgICAgdXNlck5hbWUgPSBmYWtlci5pbnRlcm5ldC51c2VyTmFtZShuYW1lKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBcIm5hbWVcIjogbmFtZSxcbiAgICAgICAgXCJ1c2VybmFtZVwiOiB1c2VyTmFtZSxcbiAgICAgICAgXCJhdmF0YXJcIjogZmFrZXIuaW50ZXJuZXQuYXZhdGFyKCksXG4gICAgICAgIFwiZW1haWxcIjogZmFrZXIuaW50ZXJuZXQuZW1haWwodXNlck5hbWUpLFxuICAgICAgICBcImRvYlwiOiBmYWtlci5kYXRlLnBhc3QoNTAsIG5ldyBEYXRlKFwiU2F0IFNlcCAyMCAxOTkyIDIxOjM1OjAyIEdNVCswMjAwIChDRVNUKVwiKSksXG4gICAgICAgIFwicGhvbmVcIjogZmFrZXIucGhvbmUucGhvbmVOdW1iZXIoKSxcbiAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgIFwic3RyZWV0XCI6IGZha2VyLmFkZHJlc3Muc3RyZWV0TmFtZSh0cnVlKSxcbiAgICAgICAgICAgIFwic3VpdGVcIjogZmFrZXIuYWRkcmVzcy5zZWNvbmRhcnlBZGRyZXNzKCksXG4gICAgICAgICAgICBcImNpdHlcIjogZmFrZXIuYWRkcmVzcy5jaXR5KCksXG4gICAgICAgICAgICBcInppcGNvZGVcIjogZmFrZXIuYWRkcmVzcy56aXBDb2RlKCksXG4gICAgICAgICAgICBcImdlb1wiOiB7XG4gICAgICAgICAgICAgICAgXCJsYXRcIjogZmFrZXIuYWRkcmVzcy5sYXRpdHVkZSgpLFxuICAgICAgICAgICAgICAgIFwibG5nXCI6IGZha2VyLmFkZHJlc3MubG9uZ2l0dWRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJzaXRlXCI6IGZha2VyLmludGVybmV0LmRvbWFpbk5hbWUoKSxcbiAgICAgICAgXCJjb21wYW55XCI6IHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBmYWtlci5jb21wYW55LmNvbXBhbnlOYW1lKCksXG4gICAgICAgICAgICBcImNhdGNoUGhyYXNlXCI6IGZha2VyLmNvbXBhbnkuY2F0Y2hQaHJhc2UoKSxcbiAgICAgICAgICAgIFwiYnNcIjogZmFrZXIuY29tcGFueS5icygpXG4gICAgICAgIH1cbiAgICB9O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHVzZXJDYXJkXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaGVscGVycy51c2VyQ2FyZFxuICAgKi9cbiAgc2VsZi51c2VyQ2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgXCJuYW1lXCI6IGZha2VyLm5hbWUuZmluZE5hbWUoKSxcbiAgICAgICAgICBcInVzZXJuYW1lXCI6IGZha2VyLmludGVybmV0LnVzZXJOYW1lKCksXG4gICAgICAgICAgXCJlbWFpbFwiOiBmYWtlci5pbnRlcm5ldC5lbWFpbCgpLFxuICAgICAgICAgIFwiYWRkcmVzc1wiOiB7XG4gICAgICAgICAgICAgIFwic3RyZWV0XCI6IGZha2VyLmFkZHJlc3Muc3RyZWV0TmFtZSh0cnVlKSxcbiAgICAgICAgICAgICAgXCJzdWl0ZVwiOiBmYWtlci5hZGRyZXNzLnNlY29uZGFyeUFkZHJlc3MoKSxcbiAgICAgICAgICAgICAgXCJjaXR5XCI6IGZha2VyLmFkZHJlc3MuY2l0eSgpLFxuICAgICAgICAgICAgICBcInppcGNvZGVcIjogZmFrZXIuYWRkcmVzcy56aXBDb2RlKCksXG4gICAgICAgICAgICAgIFwiZ2VvXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwibGF0XCI6IGZha2VyLmFkZHJlc3MubGF0aXR1ZGUoKSxcbiAgICAgICAgICAgICAgICAgIFwibG5nXCI6IGZha2VyLmFkZHJlc3MubG9uZ2l0dWRlKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwaG9uZVwiOiBmYWtlci5waG9uZS5waG9uZU51bWJlcigpLFxuICAgICAgICAgIFwid2Vic2l0ZVwiOiBmYWtlci5pbnRlcm5ldC5kb21haW5OYW1lKCksXG4gICAgICAgICAgXCJjb21wYW55XCI6IHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IGZha2VyLmNvbXBhbnkuY29tcGFueU5hbWUoKSxcbiAgICAgICAgICAgICAgXCJjYXRjaFBocmFzZVwiOiBmYWtlci5jb21wYW55LmNhdGNoUGhyYXNlKCksXG4gICAgICAgICAgICAgIFwiYnNcIjogZmFrZXIuY29tcGFueS5icygpXG4gICAgICAgICAgfVxuICAgICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogY3JlYXRlVHJhbnNhY3Rpb25cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5oZWxwZXJzLmNyZWF0ZVRyYW5zYWN0aW9uXG4gICAqL1xuICBzZWxmLmNyZWF0ZVRyYW5zYWN0aW9uID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJhbW91bnRcIiA6IGZha2VyLmZpbmFuY2UuYW1vdW50KCksXG4gICAgICBcImRhdGVcIiA6IG5ldyBEYXRlKDIwMTIsIDEsIDIpLCAgLy9UT0RPOiBhZGQgYSByYW5nZWQgZGF0ZSBtZXRob2RcbiAgICAgIFwiYnVzaW5lc3NcIjogZmFrZXIuY29tcGFueS5jb21wYW55TmFtZSgpLFxuICAgICAgXCJuYW1lXCI6IFtmYWtlci5maW5hbmNlLmFjY291bnROYW1lKCksIGZha2VyLmZpbmFuY2UubWFzaygpXS5qb2luKCcgJyksXG4gICAgICBcInR5cGVcIiA6IHNlbGYucmFuZG9taXplKGZha2VyLmRlZmluaXRpb25zLmZpbmFuY2UudHJhbnNhY3Rpb25fdHlwZSksXG4gICAgICBcImFjY291bnRcIiA6IGZha2VyLmZpbmFuY2UuYWNjb3VudCgpXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gc2VsZjtcblxufTtcblxuXG4vKlxuU3RyaW5nLnByb3RvdHlwZS5jYXBpdGFsaXplID0gZnVuY3Rpb24gKCkgeyAvL3YxLjBcbiAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9cXHcrL2csIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBhLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbn07XG4qL1xuXG5tb2R1bGVbJ2V4cG9ydHMnXSA9IEhlbHBlcnM7XG4iLCJtb2R1bGVbXCJleHBvcnRzXCJdID0ge1xuICBhbHBoYTogW1xuICAgICdBJywnQicsJ0MnLCdEJywnRScsJ0YnLCdHJywnSCcsJ0knLCdKJywnSycsJ0wnLCdNJywnTicsJ08nLCdQJywnUScsJ1InLCdTJywnVCcsJ1UnLCdWJywnVycsJ1gnLCdZJywnWidcbiAgXSxcbiAgcGF0dGVybjEwOiBbXG4gICAgXCIwMVwiLCBcIjAyXCIsIFwiMDNcIiwgXCIwNFwiLCBcIjA1XCIsIFwiMDZcIiwgXCIwN1wiLCBcIjA4XCIsIFwiMDlcIlxuICBdLFxuICBwYXR0ZXJuMTAwOiBbXG4gICAgXCIwMDFcIiwgXCIwMDJcIiwgXCIwMDNcIiwgXCIwMDRcIiwgXCIwMDVcIiwgXCIwMDZcIiwgXCIwMDdcIiwgXCIwMDhcIiwgXCIwMDlcIlxuICBdLFxuICB0b0RpZ2l0U3RyaW5nOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9naSwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXRjaC50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCkgLSA1NTtcbiAgICB9KTtcbiAgfSxcbiAgbW9kOTc6IGZ1bmN0aW9uIChkaWdpdFN0cikge1xuICAgIHZhciBtID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZ2l0U3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBtID0gKChtICogMTApICsgKGRpZ2l0U3RyW2ldIHwwKSkgJSA5NztcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH0sXG4gIGZvcm1hdHM6IFtcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkFMXCIsXG4gICAgICB0b3RhbDogMjgsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogOFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDE2XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQUxrayBiYmJzIHNzc3ggY2NjYyBjY2NjIGNjY2MgY2NjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkFEXCIsXG4gICAgICB0b3RhbDogMjQsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogOFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDEyXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQURrayBiYmJiIHNzc3MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJBVFwiLFxuICAgICAgdG90YWw6IDIwLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkFUa2sgYmJiYiBiY2NjIGNjY2MgY2NjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBBemVyYmFpamFuXG4gICAgICAvLyBodHRwczovL3RyYW5zZmVyd2lzZS5jb20vZnIvaWJhbi9hemVyYmFpamFuXG4gICAgICAvLyBMZW5ndGggMjhcbiAgICAgIC8vIEJCQU4gMmMsMTZuXG4gICAgICAvLyBHRWtrIGJiYmIgY2NjYyBjY2NjIGNjY2MgY2NjYyBjY2NjXG4gICAgICAvLyBiID0gTmF0aW9uYWwgYmFuayBjb2RlIChhbHBoYSlcbiAgICAgIC8vIGMgPSBBY2NvdW50IG51bWJlclxuICAgICAgLy8gZXhhbXBsZSBJQkFOIEFaMjEgTkFCWiAwMDAwIDAwMDAgMTM3MCAxMDAwIDE5NDRcbiAgICAgIGNvdW50cnk6IFwiQVpcIixcbiAgICAgIHRvdGFsOiAyOCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMjBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJBWmtrIGJiYmIgY2NjYyBjY2NjIGNjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiQkhcIixcbiAgICAgIHRvdGFsOiAyMixcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTRcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJCSGtrIGJiYmIgY2NjYyBjY2NjIGNjY2MgY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJCRVwiLFxuICAgICAgdG90YWw6IDE2LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA5XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQkVrayBiYmJjIGNjY2MgY2N4eFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkJBXCIsXG4gICAgICB0b3RhbDogMjAsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQkFrayBiYmJzIHNzY2MgY2NjYyBjY3h4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiQlJcIixcbiAgICAgIHRvdGFsOiAyOSxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogMVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJCUmtrIGJiYmIgYmJiYiBzc3NzIHNjY2MgY2NjYyBjY2N0IG5cIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJCR1wiLFxuICAgICAgdG90YWw6IDIyLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA2XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogOFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkJHa2sgYmJiYiBzc3NzIGRkY2MgY2NjYyBjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkNSXCIsXG4gICAgICB0b3RhbDogMjEsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE0XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQ1JrayBiYmJjIGNjY2MgY2NjYyBjY2NjIGNcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJIUlwiLFxuICAgICAgdG90YWw6IDIxLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkhSa2sgYmJiYiBiYmJjIGNjY2MgY2NjYyBjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiQ1lcIixcbiAgICAgIHRvdGFsOiAyOCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA4XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTZcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJDWWtrIGJiYnMgc3NzcyBjY2NjIGNjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiQ1pcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQ1prayBiYmJiIHNzc3Mgc3NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJES1wiLFxuICAgICAgdG90YWw6IDE4LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkRLa2sgYmJiYiBjY2NjIGNjY2MgY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJET1wiLFxuICAgICAgdG90YWw6IDI4LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAyMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkRPa2sgYmJiYiBjY2NjIGNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJUTFwiLFxuICAgICAgdG90YWw6IDIzLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlRMa2sgYmJiYyBjY2NjIGNjY2MgY2NjYyBjeHhcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJFRVwiLFxuICAgICAgdG90YWw6IDIwLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkVFa2sgYmJzcyBjY2NjIGNjY2MgY2NjeFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkZPXCIsXG4gICAgICB0b3RhbDogMTgsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiRk9rayBiYmJiIGNjY2MgY2NjYyBjeFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkZJXCIsXG4gICAgICB0b3RhbDogMTgsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDhcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJGSWtrIGJiYmIgYmJjYyBjY2NjIGN4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiRlJcIixcbiAgICAgIHRvdGFsOiAyNyxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDExXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkZSa2sgYmJiYiBiZ2dnIGdnY2MgY2NjYyBjY2NjIGN4eFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkdFXCIsXG4gICAgICB0b3RhbDogMjIsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogMlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE2XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiR0VrayBiYmNjIGNjY2MgY2NjYyBjY2NjIGNjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiREVcIixcbiAgICAgIHRvdGFsOiAyMixcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA4XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJERWtrIGJiYmIgYmJiYiBjY2NjIGNjY2MgY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJHSVwiLFxuICAgICAgdG90YWw6IDIzLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxNVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkdJa2sgYmJiYiBjY2NjIGNjY2MgY2NjYyBjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJHUlwiLFxuICAgICAgdG90YWw6IDI3LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkdSa2sgYmJicyBzc3NjIGNjY2MgY2NjYyBjY2NjIGNjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkdMXCIsXG4gICAgICB0b3RhbDogMTgsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiR0xrayBiYmJiIGNjY2MgY2NjYyBjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkdUXCIsXG4gICAgICB0b3RhbDogMjgsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkdUa2sgYmJiYiBtbXR0IGNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJIVVwiLFxuICAgICAgdG90YWw6IDI4LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDhcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkhVa2sgYmJicyBzc3NrIGNjY2MgY2NjYyBjY2NjIGNjY3hcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJJU1wiLFxuICAgICAgdG90YWw6IDI2LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDZcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIklTa2sgYmJiYiBzc2NjIGNjY2MgaWlpaSBpaWlpIGlpXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiSUVcIixcbiAgICAgIHRvdGFsOiAyMixcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDhcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJJRWtrIGFhYWEgYmJiYiBiYmNjIGNjY2MgY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJJTFwiLFxuICAgICAgdG90YWw6IDIzLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDZcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxM1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIklMa2sgYmJibiBubmNjIGNjY2MgY2NjYyBjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJJVFwiLFxuICAgICAgdG90YWw6IDI3LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDEyXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiSVRrayB4YWFhIGFhYmIgYmJiYyBjY2NjIGNjY2MgY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiSk9cIixcbiAgICAgIHRvdGFsOiAzMCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE4XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiSk9rayBiYmJiIG5ubm4gY2NjYyBjY2NjIGNjY2MgY2NjYyBjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIktaXCIsXG4gICAgICB0b3RhbDogMjAsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDEzXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiS1prayBiYmJjIGNjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiWEtcIixcbiAgICAgIHRvdGFsOiAyMCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJYS2trIGJiYmIgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJLV1wiLFxuICAgICAgdG90YWw6IDMwLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAyMlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIktXa2sgYmJiYiBjY2NjIGNjY2MgY2NjYyBjY2NjIGNjY2MgY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJMVlwiLFxuICAgICAgdG90YWw6IDIxLFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxM1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIkxWa2sgYmJiYiBjY2NjIGNjY2MgY2NjYyBjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTEJcIixcbiAgICAgIHRvdGFsOiAyOCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMjBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJMQmtrIGJiYmIgY2NjYyBjY2NjIGNjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTElcIixcbiAgICAgIHRvdGFsOiAyMSxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJMSWtrIGJiYmIgYmNjYyBjY2NjIGNjY2MgY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkxUXCIsXG4gICAgICB0b3RhbDogMjAsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDExXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiTFRrayBiYmJiIGJjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTFVcIixcbiAgICAgIHRvdGFsOiAyMCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAzXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTNcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJMVWtrIGJiYmMgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJNS1wiLFxuICAgICAgdG90YWw6IDE5LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJNS2trIGJiYmMgY2NjYyBjY2NjIGN4eFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIk1UXCIsXG4gICAgICB0b3RhbDogMzEsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAxOFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIk1Ua2sgYmJiYiBzc3NzIHNjY2MgY2NjYyBjY2NjIGNjY2MgY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTVJcIixcbiAgICAgIHRvdGFsOiAyNyxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEzXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiTVJrayBiYmJiIGJzc3Mgc3NjYyBjY2NjIGNjY2MgY3h4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTVVcIixcbiAgICAgIHRvdGFsOiAzMCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIk1Va2sgYmJiYiBiYnNzIGNjY2MgY2NjYyBjY2NjIDAwMGQgZGRcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJNQ1wiLFxuICAgICAgdG90YWw6IDI3LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAyXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiTUNrayBiYmJiIGJzc3Mgc3NjYyBjY2NjIGNjY2MgY3h4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTURcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMThcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJNRGtrIGJiY2MgY2NjYyBjY2NjIGNjY2MgY2NjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIk1FXCIsXG4gICAgICB0b3RhbDogMjIsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiTUVrayBiYmJjIGNjY2MgY2NjYyBjY2NjIHh4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTkxcIixcbiAgICAgIHRvdGFsOiAxOCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiYVwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJOTGtrIGJiYmIgY2NjYyBjY2NjIGNjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiTk9cIixcbiAgICAgIHRvdGFsOiAxNSxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogN1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIk5Pa2sgYmJiYiBjY2NjIGNjeFwiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIlBLXCIsXG4gICAgICB0b3RhbDogMjQsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE2XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiUEtrayBiYmJiIGNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJQU1wiLFxuICAgICAgdG90YWw6IDI5LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA5XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJQU2trIGJiYmIgeHh4eCB4eHh4IHhjY2MgY2NjYyBjY2NjIGNcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJQTFwiLFxuICAgICAgdG90YWw6IDI4LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDhcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxNlxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlBMa2sgYmJicyBzc3N4IGNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJQVFwiLFxuICAgICAgdG90YWw6IDI1LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDhcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxM1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlBUa2sgYmJiYiBzc3NzIGNjY2MgY2NjYyBjY2N4IHhcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJRQVwiLFxuICAgICAgdG90YWw6IDI5LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDRcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiAyMVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlFBa2sgYmJiYiBjY2NjIGNjY2MgY2NjYyBjY2NjIGNjY2MgY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIlJPXCIsXG4gICAgICB0b3RhbDogMjQsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDE2XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiUk9rayBiYmJiIGNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJTTVwiLFxuICAgICAgdG90YWw6IDI3LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJhXCIsXG4gICAgICAgICAgY291bnQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJjXCIsXG4gICAgICAgICAgY291bnQ6IDEyXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiU01rayB4YWFhIGFhYmIgYmJiYyBjY2NjIGNjY2MgY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiU0FcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMThcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJTQWtrIGJiY2MgY2NjYyBjY2NjIGNjY2MgY2NjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIlJTXCIsXG4gICAgICB0b3RhbDogMjIsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiUlNrayBiYmJjIGNjY2MgY2NjYyBjY2NjIHh4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiU0tcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiU0trayBiYmJiIHNzc3Mgc3NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJTSVwiLFxuICAgICAgdG90YWw6IDE5LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlNJa2sgYmJzcyBzY2NjIGNjY2MgY3h4XCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiRVNcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDEwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiRVNrayBiYmJiIGdnZ2cgeHhjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJTRVwiLFxuICAgICAgdG90YWw6IDI0LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxN1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgZm9ybWF0OiBcIlNFa2sgYmJiYyBjY2NjIGNjY2MgY2NjYyBjY2NjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiQ0hcIixcbiAgICAgIHRvdGFsOiAyMSxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImNcIixcbiAgICAgICAgICBjb3VudDogMTJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJDSGtrIGJiYmIgYmNjYyBjY2NjIGNjY2MgY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIlROXCIsXG4gICAgICB0b3RhbDogMjQsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogNVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE1XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiVE5rayBiYnNzIHNjY2MgY2NjYyBjY2NjIGNjY2NcIlxuICAgIH0sXG4gICAge1xuICAgICAgY291bnRyeTogXCJUUlwiLFxuICAgICAgdG90YWw6IDI2LFxuICAgICAgYmJhbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTZcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJUUmtrIGJiYmIgYnhjYyBjY2NjIGNjY2MgY2NjYyBjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkFFXCIsXG4gICAgICB0b3RhbDogMjMsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogM1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDE2XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiQUVrayBiYmJjIGNjY2MgY2NjYyBjY2NjIGNjY1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBjb3VudHJ5OiBcIkdCXCIsXG4gICAgICB0b3RhbDogMjIsXG4gICAgICBiYmFuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcImFcIixcbiAgICAgICAgICBjb3VudDogNFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogXCJuXCIsXG4gICAgICAgICAgY291bnQ6IDZcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiblwiLFxuICAgICAgICAgIGNvdW50OiA4XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBmb3JtYXQ6IFwiR0JrayBiYmJiIHNzc3Mgc3NjYyBjY2NjIGNjXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIGNvdW50cnk6IFwiVkdcIixcbiAgICAgIHRvdGFsOiAyNCxcbiAgICAgIGJiYW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiY1wiLFxuICAgICAgICAgIGNvdW50OiA0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiBcIm5cIixcbiAgICAgICAgICBjb3VudDogMTZcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGZvcm1hdDogXCJWR2trIGJiYmIgY2NjYyBjY2NjIGNjY2MgY2NjY1wiXG4gICAgfVxuICBdLFxuICBpc28zMTY2OiBbXG4gICAgXCJBQ1wiLCBcIkFEXCIsIFwiQUVcIiwgXCJBRlwiLCBcIkFHXCIsIFwiQUlcIiwgXCJBTFwiLCBcIkFNXCIsIFwiQU5cIiwgXCJBT1wiLCBcIkFRXCIsIFwiQVJcIiwgXCJBU1wiLFxuICAgIFwiQVRcIiwgXCJBVVwiLCBcIkFXXCIsIFwiQVhcIiwgXCJBWlwiLCBcIkJBXCIsIFwiQkJcIiwgXCJCRFwiLCBcIkJFXCIsIFwiQkZcIiwgXCJCR1wiLCBcIkJIXCIsIFwiQklcIixcbiAgICBcIkJKXCIsIFwiQkxcIiwgXCJCTVwiLCBcIkJOXCIsIFwiQk9cIiwgXCJCUVwiLCBcIkJSXCIsIFwiQlNcIiwgXCJCVFwiLCBcIkJVXCIsIFwiQlZcIiwgXCJCV1wiLCBcIkJZXCIsXG4gICAgXCJCWlwiLCBcIkNBXCIsIFwiQ0NcIiwgXCJDRFwiLCBcIkNFXCIsIFwiQ0ZcIiwgXCJDR1wiLCBcIkNIXCIsIFwiQ0lcIiwgXCJDS1wiLCBcIkNMXCIsIFwiQ01cIiwgXCJDTlwiLFxuICAgIFwiQ09cIiwgXCJDUFwiLCBcIkNSXCIsIFwiQ1NcIiwgXCJDU1wiLCBcIkNVXCIsIFwiQ1ZcIiwgXCJDV1wiLCBcIkNYXCIsIFwiQ1lcIiwgXCJDWlwiLCBcIkREXCIsIFwiREVcIixcbiAgICBcIkRHXCIsIFwiREpcIiwgXCJES1wiLCBcIkRNXCIsIFwiRE9cIiwgXCJEWlwiLCBcIkVBXCIsIFwiRUNcIiwgXCJFRVwiLCBcIkVHXCIsIFwiRUhcIiwgXCJFUlwiLCBcIkVTXCIsXG4gICAgXCJFVFwiLCBcIkVVXCIsIFwiRklcIiwgXCJGSlwiLCBcIkZLXCIsIFwiRk1cIiwgXCJGT1wiLCBcIkZSXCIsIFwiRlhcIiwgXCJHQVwiLCBcIkdCXCIsIFwiR0RcIiwgXCJHRVwiLFxuICAgIFwiR0ZcIiwgXCJHR1wiLCBcIkdIXCIsIFwiR0lcIiwgXCJHTFwiLCBcIkdNXCIsIFwiR05cIiwgXCJHUFwiLCBcIkdRXCIsIFwiR1JcIiwgXCJHU1wiLCBcIkdUXCIsIFwiR1VcIixcbiAgICBcIkdXXCIsIFwiR1lcIiwgXCJIS1wiLCBcIkhNXCIsIFwiSE5cIiwgXCJIUlwiLCBcIkhUXCIsIFwiSFVcIiwgXCJJQ1wiLCBcIklEXCIsIFwiSUVcIiwgXCJJTFwiLCBcIklNXCIsXG4gICAgXCJJTlwiLCBcIklPXCIsIFwiSVFcIiwgXCJJUlwiLCBcIklTXCIsIFwiSVRcIiwgXCJKRVwiLCBcIkpNXCIsIFwiSk9cIiwgXCJKUFwiLCBcIktFXCIsIFwiS0dcIiwgXCJLSFwiLFxuICAgIFwiS0lcIiwgXCJLTVwiLCBcIktOXCIsIFwiS1BcIiwgXCJLUlwiLCBcIktXXCIsIFwiS1lcIiwgXCJLWlwiLCBcIkxBXCIsIFwiTEJcIiwgXCJMQ1wiLCBcIkxJXCIsIFwiTEtcIixcbiAgICBcIkxSXCIsIFwiTFNcIiwgXCJMVFwiLCBcIkxVXCIsIFwiTFZcIiwgXCJMWVwiLCBcIk1BXCIsIFwiTUNcIiwgXCJNRFwiLCBcIk1FXCIsIFwiTUZcIiwgXCJNR1wiLCBcIk1IXCIsXG4gICAgXCJNS1wiLCBcIk1MXCIsIFwiTU1cIiwgXCJNTlwiLCBcIk1PXCIsIFwiTVBcIiwgXCJNUVwiLCBcIk1SXCIsIFwiTVNcIiwgXCJNVFwiLCBcIk1VXCIsIFwiTVZcIiwgXCJNV1wiLFxuICAgIFwiTVhcIiwgXCJNWVwiLCBcIk1aXCIsIFwiTkFcIiwgXCJOQ1wiLCBcIk5FXCIsIFwiTkZcIiwgXCJOR1wiLCBcIk5JXCIsIFwiTkxcIiwgXCJOT1wiLCBcIk5QXCIsIFwiTlJcIixcbiAgICBcIk5UXCIsIFwiTlVcIiwgXCJOWlwiLCBcIk9NXCIsIFwiUEFcIiwgXCJQRVwiLCBcIlBGXCIsIFwiUEdcIiwgXCJQSFwiLCBcIlBLXCIsIFwiUExcIiwgXCJQTVwiLCBcIlBOXCIsXG4gICAgXCJQUlwiLCBcIlBTXCIsIFwiUFRcIiwgXCJQV1wiLCBcIlBZXCIsIFwiUUFcIiwgXCJSRVwiLCBcIlJPXCIsIFwiUlNcIiwgXCJSVVwiLCBcIlJXXCIsIFwiU0FcIiwgXCJTQlwiLFxuICAgIFwiU0NcIiwgXCJTRFwiLCBcIlNFXCIsIFwiU0dcIiwgXCJTSFwiLCBcIlNJXCIsIFwiU0pcIiwgXCJTS1wiLCBcIlNMXCIsIFwiU01cIiwgXCJTTlwiLCBcIlNPXCIsIFwiU1JcIixcbiAgICBcIlNTXCIsIFwiU1RcIiwgXCJTVVwiLCBcIlNWXCIsIFwiU1hcIiwgXCJTWVwiLCBcIlNaXCIsIFwiVEFcIiwgXCJUQ1wiLCBcIlREXCIsIFwiVEZcIiwgXCJUR1wiLCBcIlRIXCIsXG4gICAgXCJUSlwiLCBcIlRLXCIsIFwiVExcIiwgXCJUTVwiLCBcIlROXCIsIFwiVE9cIiwgXCJUUlwiLCBcIlRUXCIsIFwiVFZcIiwgXCJUV1wiLCBcIlRaXCIsIFwiVUFcIiwgXCJVR1wiLFxuICAgIFwiVU1cIiwgXCJVU1wiLCBcIlVZXCIsIFwiVVpcIiwgXCJWQVwiLCBcIlZDXCIsIFwiVkVcIiwgXCJWR1wiLCBcIlZJXCIsIFwiVk5cIiwgXCJWVVwiLCBcIldGXCIsIFwiV1NcIixcbiAgICBcIllFXCIsIFwiWVRcIiwgXCJZVVwiLCBcIlpBXCIsIFwiWk1cIiwgXCJaUlwiLCBcIlpXXCJcbiAgXVxufVxuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5pbWFnZVxuICogQHByb3BlcnR5IHtvYmplY3R9IGxvcmVtcGl4ZWwgLSBmYWtlci5pbWFnZS5sb3JlbXBpeGVsXG4gKiBAcHJvcGVydHkge29iamVjdH0gdW5zcGxhc2ggLSBmYWtlci5pbWFnZS51bnNwbGFzaFxuICogQHByb3BlcnR5IHtvYmplY3R9IHVuc3BsYXNoIC0gZmFrZXIuaW1hZ2UubG9yZW1waWNzdW1cbiAqIEBkZWZhdWx0IERlZmF1bHQgcHJvdmlkZXIgaXMgdW5zcGxhc2ggaW1hZ2UgcHJvdmlkZXJcbiAqL1xudmFyIEltYWdlID0gZnVuY3Rpb24gKGZha2VyKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgTG9yZW1waXhlbCA9IHJlcXVpcmUoJy4vaW1hZ2VfcHJvdmlkZXJzL2xvcmVtcGl4ZWwnKTtcbiAgdmFyIFVuc3BsYXNoID0gcmVxdWlyZSgnLi9pbWFnZV9wcm92aWRlcnMvdW5zcGxhc2gnKTtcbiAgdmFyIExvcmVtUGljc3VtID0gcmVxdWlyZSgnLi9pbWFnZV9wcm92aWRlcnMvbG9yZW1waWNzdW0nKTtcblxuICAvKipcbiAgICogaW1hZ2VcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5pbWFnZVxuICAgKi9cbiAgc2VsZi5pbWFnZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICB2YXIgY2F0ZWdvcmllcyA9IFtcImFic3RyYWN0XCIsIFwiYW5pbWFsc1wiLCBcImJ1c2luZXNzXCIsIFwiY2F0c1wiLCBcImNpdHlcIiwgXCJmb29kXCIsIFwibmlnaHRsaWZlXCIsIFwiZmFzaGlvblwiLCBcInBlb3BsZVwiLCBcIm5hdHVyZVwiLCBcInNwb3J0c1wiLCBcInRlY2huaWNzXCIsIFwidHJhbnNwb3J0XCJdO1xuICAgIHJldHVybiBzZWxmW2Zha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoY2F0ZWdvcmllcyldKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSk7XG4gIH07XG4gIC8qKlxuICAgKiBhdmF0YXJcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5hdmF0YXJcbiAgICovXG4gIHNlbGYuYXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5pbnRlcm5ldC5hdmF0YXIoKTtcbiAgfTtcbiAgLyoqXG4gICAqIGltYWdlVXJsXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmltYWdlVXJsXG4gICAqL1xuICBzZWxmLmltYWdlVXJsID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGNhdGVnb3J5LCByYW5kb21pemUsIGh0dHBzKSB7XG4gICAgdmFyIHdpZHRoID0gd2lkdGggfHwgNjQwO1xuICAgIHZhciBoZWlnaHQgPSBoZWlnaHQgfHwgNDgwO1xuICAgIHZhciBwcm90b2NvbCA9ICdodHRwOi8vJztcbiAgICBpZiAodHlwZW9mIGh0dHBzICE9PSAndW5kZWZpbmVkJyAmJiBodHRwcyA9PT0gdHJ1ZSkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cHM6Ly8nO1xuICAgIH1cbiAgICB2YXIgdXJsID0gcHJvdG9jb2wgKyAncGxhY2VpbWcuY29tLycgKyB3aWR0aCArICcvJyArIGhlaWdodDtcbiAgICBpZiAodHlwZW9mIGNhdGVnb3J5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdXJsICs9ICcvJyArIGNhdGVnb3J5O1xuICAgIH1cblxuICAgIGlmIChyYW5kb21pemUpIHtcbiAgICAgIHVybCArPSAnPycgKyBmYWtlci5kYXRhdHlwZS5udW1iZXIoKVxuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH07XG4gIC8qKlxuICAgKiBhYnN0cmFjdFxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmFic3RyYWN0XG4gICAqL1xuICBzZWxmLmFic3RyYWN0ID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnYWJzdHJhY3QnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogYW5pbWFsc1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmFuaW1hbHNcbiAgICovXG4gIHNlbGYuYW5pbWFscyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ2FuaW1hbHMnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogYnVzaW5lc3NcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5idXNpbmVzc1xuICAgKi9cbiAgc2VsZi5idXNpbmVzcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ2J1c2luZXNzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIGNhdHNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5jYXRzXG4gICAqL1xuICBzZWxmLmNhdHMgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdjYXRzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIGNpdHlcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5jaXR5XG4gICAqL1xuICBzZWxmLmNpdHkgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdjaXR5JywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIGZvb2RcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5mb29kXG4gICAqL1xuICBzZWxmLmZvb2QgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdmb29kJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIG5pZ2h0bGlmZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLm5pZ2h0bGlmZVxuICAgKi9cbiAgc2VsZi5uaWdodGxpZmUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICduaWdodGxpZmUnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogZmFzaGlvblxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmZhc2hpb25cbiAgICovXG4gIHNlbGYuZmFzaGlvbiA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ2Zhc2hpb24nLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogcGVvcGxlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UucGVvcGxlXG4gICAqL1xuICBzZWxmLnBlb3BsZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ3Blb3BsZScsIHJhbmRvbWl6ZSk7XG4gIH07XG4gIC8qKlxuICAgKiBuYXR1cmVcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5uYXR1cmVcbiAgICovXG4gIHNlbGYubmF0dXJlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnbmF0dXJlJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIHNwb3J0c1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLnNwb3J0c1xuICAgKi9cbiAgc2VsZi5zcG9ydHMgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdzcG9ydHMnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogdGVjaG5pY3NcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS50ZWNobmljc1xuICAgKi9cbiAgc2VsZi50ZWNobmljcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ3RlY2huaWNzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIHRyYW5zcG9ydFxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLnRyYW5zcG9ydFxuICAgKi9cbiAgc2VsZi50cmFuc3BvcnQgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICd0cmFuc3BvcnQnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogZGF0YVVyaVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3JcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5kYXRhVXJpXG4gICAqL1xuICBzZWxmLmRhdGFVcmkgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgY29sb3IpIHtcbiAgICBjb2xvciA9IGNvbG9yIHx8ICdncmV5JztcbiAgICB2YXIgc3ZnU3RyaW5nID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIiBiYXNlUHJvZmlsZT1cImZ1bGxcIiB3aWR0aD1cIicgKyB3aWR0aCArICdcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ1wiPjxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwiJyArIGNvbG9yICsgJ1wiLz48dGV4dCB4PVwiJyArIHdpZHRoIC8gMiArICdcIiB5PVwiJyArIGhlaWdodCAvIDIgKyAnXCIgZm9udC1zaXplPVwiMjBcIiBhbGlnbm1lbnQtYmFzZWxpbmU9XCJtaWRkbGVcIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ3aGl0ZVwiPicgKyB3aWR0aCArICd4JyArIGhlaWdodCArICc8L3RleHQ+PC9zdmc+JztcbiAgICB2YXIgcmF3UHJlZml4ID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PVVURi04LCc7XG4gICAgcmV0dXJuIHJhd1ByZWZpeCArIGVuY29kZVVSSUNvbXBvbmVudChzdmdTdHJpbmcpO1xuICB9O1xuXG4gIHNlbGYubG9yZW1waXhlbCA9IG5ldyBMb3JlbXBpeGVsKGZha2VyKTtcbiAgc2VsZi51bnNwbGFzaCA9IG5ldyBVbnNwbGFzaChmYWtlcik7XG4gIHNlbGYubG9yZW1waWNzdW0gPSBuZXcgTG9yZW1QaWNzdW0oZmFrZXIpO1xuXG4gIC8vIE9iamVjdC5hc3NpZ24oc2VsZiwgc2VsZi51bnNwbGFzaCk7XG4gIC8vIEhvdyB0byBzZXQgZGVmYXVsdCBhcyB1bnNwbGFzaD8gc2hvdWxkIGJlIGltYWdlLmRlZmF1bHQ/XG59XG5cblxubW9kdWxlW1wiZXhwb3J0c1wiXSA9IEltYWdlO1xuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBsb3JlbXBpY3N1bVxuICogQG1lbWJlcm9mIGZha2VyLmltYWdlXG4gKi9cbnZhciBMb3JlbVBpY3N1bSA9IGZ1bmN0aW9uIChmYWtlcikge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLyoqXG4gICAgICogaW1hZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdyYXlzY2FsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVyIDEtMTBcbiAgICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGljc3VtLmltYWdlXG4gICAgICogQGRlc2NyaXB0aW9uIHNlYXJjaCBpbWFnZSBmcm9tIHVuc3BsYXNoXG4gICAgICovXG4gICAgc2VsZi5pbWFnZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBncmF5c2NhbGUsIGJsdXIpIHtcbiAgICAgIHJldHVybiBzZWxmLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsIGdyYXlzY2FsZSwgYmx1cik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBpbWFnZUdyYXlzY2FsZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdyYXlzY2FsZVxuICAgICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waWNzdW0uaW1hZ2VHcmF5c2NhbGVkXG4gICAgICogQGRlc2NyaXB0aW9uIHNlYXJjaCBncmF5c2NhbGUgaW1hZ2UgZnJvbSB1bnNwbGFzaFxuICAgICAqL1xuICAgIHNlbGYuaW1hZ2VHcmF5c2NhbGUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgZ3JheXNjYWxlKSB7XG4gICAgICByZXR1cm4gc2VsZi5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCBncmF5c2NhbGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogaW1hZ2VCbHVycmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdXIgMS0xMFxuICAgICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waWNzdW0uaW1hZ2VCbHVycmVkXG4gICAgICogQGRlc2NyaXB0aW9uIHNlYXJjaCBibHVycmVkIGltYWdlIGZyb20gdW5zcGxhc2hcbiAgICAgKi9cbiAgICBzZWxmLmltYWdlQmx1cnJlZCA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBibHVyKSB7XG4gICAgICByZXR1cm4gc2VsZi5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCB1bmRlZmluZWQsIGJsdXIpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogaW1hZ2VSYW5kb21TZWVkZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdyYXlzY2FsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVyIDEtMTBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VlZFxuICAgICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waWNzdW0uaW1hZ2VSYW5kb21TZWVkZWRcbiAgICAgKiBAZGVzY3JpcHRpb24gc2VhcmNoIHNhbWUgcmFuZG9tIGltYWdlIGZyb20gdW5zcGxhc2gsIGJhc2VkIG9uIGEgc2VlZFxuICAgICAqL1xuICAgIHNlbGYuaW1hZ2VSYW5kb21TZWVkZWQgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgZ3JheXNjYWxlLCBibHVyLCBzZWVkKSB7XG4gICAgICByZXR1cm4gc2VsZi5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCBncmF5c2NhbGUsIGJsdXIsIHNlZWQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogYXZhdGFyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGljc3VtLmF2YXRhclxuICAgICAqL1xuICAgIHNlbGYuYXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZha2VyLmludGVybmV0LmF2YXRhcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogaW1hZ2VVcmxcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdyYXlzY2FsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVyIDEtMTBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VlZFxuICAgICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waWNzdW0uaW1hZ2VVcmxcbiAgICAgKi9cbiAgICBzZWxmLmltYWdlVXJsID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGdyYXlzY2FsZSwgYmx1ciwgc2VlZCkge1xuICAgICAgICB2YXIgd2lkdGggPSB3aWR0aCB8fCA2NDA7XG4gICAgICAgIHZhciBoZWlnaHQgPSBoZWlnaHQgfHwgNDgwO1xuICBcbiAgICAgICAgdmFyIHVybCA9ICdodHRwczovL3BpY3N1bS5waG90b3MnO1xuICAgICAgICAgIFxuICAgICAgICBpZiAoc2VlZCkge1xuICAgICAgICAgIHVybCArPSAnL3NlZWQvJyArIHNlZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB1cmwgKz0gJy8nICsgd2lkdGggKyAnLycgKyBoZWlnaHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoZ3JheXNjYWxlICYmIGJsdXIpIHtcbiAgICAgICAgICByZXR1cm4gdXJsICsgJz9ncmF5c2NhbGUnICsgJyZibHVyPScgKyBibHVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdyYXlzY2FsZSkge1xuICAgICAgICAgIHJldHVybiB1cmwgKyAnP2dyYXlzY2FsZSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmx1cikge1xuICAgICAgICAgIHJldHVybiB1cmwgKyAnP2JsdXI9JyArIGJsdXI7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9O1xuICB9XG4gIFxuICBtb2R1bGVbXCJleHBvcnRzXCJdID0gTG9yZW1QaWNzdW07XG4gICIsIi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgbG9yZW1waXhlbFxuICogQG1lbWJlcm9mIGZha2VyLmltYWdlXG4gKi9cbnZhciBMb3JlbXBpeGVsID0gZnVuY3Rpb24gKGZha2VyKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8qKlxuICAgKiBpbWFnZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuaW1hZ2VcbiAgICovXG4gIHNlbGYuaW1hZ2UgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgdmFyIGNhdGVnb3JpZXMgPSBbXCJhYnN0cmFjdFwiLCBcImFuaW1hbHNcIiwgXCJidXNpbmVzc1wiLCBcImNhdHNcIiwgXCJjaXR5XCIsIFwiZm9vZFwiLCBcIm5pZ2h0bGlmZVwiLCBcImZhc2hpb25cIiwgXCJwZW9wbGVcIiwgXCJuYXR1cmVcIiwgXCJzcG9ydHNcIiwgXCJ0ZWNobmljc1wiLCBcInRyYW5zcG9ydFwiXTtcbiAgICByZXR1cm4gc2VsZltmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGNhdGVnb3JpZXMpXSh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogYXZhdGFyXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5hdmF0YXJcbiAgICovXG4gIHNlbGYuYXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5pbnRlcm5ldC5hdmF0YXIoKTtcbiAgfTtcbiAgLyoqXG4gICAqIGltYWdlVXJsXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuaW1hZ2VVcmxcbiAgICovXG4gIHNlbGYuaW1hZ2VVcmwgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgY2F0ZWdvcnksIHJhbmRvbWl6ZSkge1xuICAgICAgdmFyIHdpZHRoID0gd2lkdGggfHwgNjQwO1xuICAgICAgdmFyIGhlaWdodCA9IGhlaWdodCB8fCA0ODA7XG5cbiAgICAgIHZhciB1cmwgPSdodHRwczovL2xvcmVtcGl4ZWwuY29tLycgKyB3aWR0aCArICcvJyArIGhlaWdodDtcbiAgICAgIGlmICh0eXBlb2YgY2F0ZWdvcnkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHVybCArPSAnLycgKyBjYXRlZ29yeTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJhbmRvbWl6ZSkge1xuICAgICAgICB1cmwgKz0gJz8nICsgZmFrZXIuZGF0YXR5cGUubnVtYmVyKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVybDtcbiAgfTtcbiAgLyoqXG4gICAqIGFic3RyYWN0XG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5hYnN0cmFjdFxuICAgKi9cbiAgc2VsZi5hYnN0cmFjdCA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnYWJzdHJhY3QnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogYW5pbWFsc1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuYW5pbWFsc1xuICAgKi9cbiAgc2VsZi5hbmltYWxzID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdhbmltYWxzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIGJ1c2luZXNzXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5idXNpbmVzc1xuICAgKi9cbiAgc2VsZi5idXNpbmVzcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnYnVzaW5lc3MnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogY2F0c1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuY2F0c1xuICAgKi9cbiAgc2VsZi5jYXRzID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdjYXRzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIGNpdHlcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtib29sZWFufSByYW5kb21pemVcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmNpdHlcbiAgICovXG4gIHNlbGYuY2l0eSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnY2l0eScsIHJhbmRvbWl6ZSk7XG4gIH07XG4gIC8qKlxuICAgKiBmb29kXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5mb29kXG4gICAqL1xuICBzZWxmLmZvb2QgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmFuZG9taXplKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ2Zvb2QnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogbmlnaHRsaWZlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5uaWdodGxpZmVcbiAgICovXG4gIHNlbGYubmlnaHRsaWZlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICduaWdodGxpZmUnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogZmFzaGlvblxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuZmFzaGlvblxuICAgKi9cbiAgc2VsZi5mYXNoaW9uID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdmYXNoaW9uJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIHBlb3BsZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwucGVvcGxlXG4gICAqL1xuICBzZWxmLnBlb3BsZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAncGVvcGxlJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIG5hdHVyZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwubmF0dXJlXG4gICAqL1xuICBzZWxmLm5hdHVyZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnbmF0dXJlJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIHNwb3J0c1xuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhbmRvbWl6ZVxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLmxvcmVtcGl4ZWwuc3BvcnRzXG4gICAqL1xuICBzZWxmLnNwb3J0cyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnc3BvcnRzJywgcmFuZG9taXplKTtcbiAgfTtcbiAgLyoqXG4gICAqIHRlY2huaWNzXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC50ZWNobmljc1xuICAgKi9cbiAgc2VsZi50ZWNobmljcyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCByYW5kb21pemUpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UubG9yZW1waXhlbC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAndGVjaG5pY3MnLCByYW5kb21pemUpO1xuICB9O1xuICAvKipcbiAgICogdHJhbnNwb3J0XG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmFuZG9taXplXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UubG9yZW1waXhlbC50cmFuc3BvcnRcbiAgICovXG4gIHNlbGYudHJhbnNwb3J0ID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHJhbmRvbWl6ZSkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS5sb3JlbXBpeGVsLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICd0cmFuc3BvcnQnLCByYW5kb21pemUpO1xuICB9XG59XG5cbm1vZHVsZVtcImV4cG9ydHNcIl0gPSBMb3JlbXBpeGVsO1xuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSB1bnNwbGFzaFxuICogQG1lbWJlcm9mIGZha2VyLmltYWdlXG4gKi9cbnZhciBVbnNwbGFzaCA9IGZ1bmN0aW9uIChmYWtlcikge1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNhdGVnb3JpZXMgPSBbXCJmb29kXCIsIFwibmF0dXJlXCIsIFwicGVvcGxlXCIsIFwidGVjaG5vbG9neVwiLCBcIm9iamVjdHNcIiwgXCJidWlsZGluZ3NcIl07XG5cbiAgLyoqXG4gICAqIGltYWdlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UudW5zcGxhc2guaW1hZ2VcbiAgICogQGRlc2NyaXB0aW9uIHNlYXJjaCBpbWFnZSBmcm9tIHVuc3BsYXNoXG4gICAqL1xuICBzZWxmLmltYWdlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGtleXdvcmQpIHtcbiAgICByZXR1cm4gc2VsZi5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCB1bmRlZmluZWQsIGtleXdvcmQpO1xuICB9O1xuICAvKipcbiAgICogYXZhdGFyXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UudW5zcGxhc2guYXZhdGFyXG4gICAqL1xuICBzZWxmLmF2YXRhciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIuaW50ZXJuZXQuYXZhdGFyKCk7XG4gIH07XG4gIC8qKlxuICAgKiBpbWFnZVVybFxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2F0ZWdvcnlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS51bnNwbGFzaC5pbWFnZVVybFxuICAgKi9cbiAgc2VsZi5pbWFnZVVybCA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBjYXRlZ29yeSwga2V5d29yZCkge1xuICAgICAgdmFyIHdpZHRoID0gd2lkdGggfHwgNjQwO1xuICAgICAgdmFyIGhlaWdodCA9IGhlaWdodCB8fCA0ODA7XG5cbiAgICAgIHZhciB1cmwgPSdodHRwczovL3NvdXJjZS51bnNwbGFzaC5jb20nO1xuXG4gICAgICBpZiAodHlwZW9mIGNhdGVnb3J5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHVybCArPSAnL2NhdGVnb3J5LycgKyBjYXRlZ29yeTtcbiAgICAgIH1cblxuICAgICAgdXJsICs9ICcvJyArIHdpZHRoICsgJ3gnICsgaGVpZ2h0O1xuXG4gICAgICBpZiAodHlwZW9mIGtleXdvcmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdmFyIGtleXdvcmRGb3JtYXQgPSBuZXcgUmVnRXhwKCdeKFtBLVphLXowLTldLissW0EtWmEtejAtOV0rKSR8XihbQS1aYS16MC05XSspJCcpO1xuICAgICAgICAgIGlmIChrZXl3b3JkRm9ybWF0LnRlc3Qoa2V5d29yZCkpIHtcbiAgICAgICAgICAgIHVybCArPSAnPycgKyBrZXl3b3JkO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVybDtcbiAgfTtcbiAgLyoqXG4gICAqIGZvb2RcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS51bnNwbGFzaC5mb29kXG4gICAqL1xuICBzZWxmLmZvb2QgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwga2V5d29yZCkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS51bnNwbGFzaC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnZm9vZCcsIGtleXdvcmQpO1xuICB9O1xuICAvKipcbiAgICogcGVvcGxlXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UudW5zcGxhc2gucGVvcGxlXG4gICAqL1xuICBzZWxmLnBlb3BsZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBrZXl3b3JkKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLnVuc3BsYXNoLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdwZW9wbGUnLCBrZXl3b3JkKTtcbiAgfTtcbiAgLyoqXG4gICAqIG5hdHVyZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZFxuICAgKiBAbWV0aG9kIGZha2VyLmltYWdlLnVuc3BsYXNoLm5hdHVyZVxuICAgKi9cbiAgc2VsZi5uYXR1cmUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwga2V5d29yZCkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS51bnNwbGFzaC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnbmF0dXJlJywga2V5d29yZCk7XG4gIH07XG4gIC8qKlxuICAgKiB0ZWNobm9sb2d5XG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UudW5zcGxhc2gudGVjaG5vbG9neVxuICAgKi9cbiAgc2VsZi50ZWNobm9sb2d5ID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGtleXdvcmQpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UudW5zcGxhc2guaW1hZ2VVcmwod2lkdGgsIGhlaWdodCwgJ3RlY2hub2xvZ3knLCBrZXl3b3JkKTtcbiAgfTtcbiAgLyoqXG4gICAqIG9iamVjdHNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAgICogQG1ldGhvZCBmYWtlci5pbWFnZS51bnNwbGFzaC5vYmplY3RzXG4gICAqL1xuICBzZWxmLm9iamVjdHMgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwga2V5d29yZCkge1xuICAgIHJldHVybiBmYWtlci5pbWFnZS51bnNwbGFzaC5pbWFnZVVybCh3aWR0aCwgaGVpZ2h0LCAnb2JqZWN0cycsIGtleXdvcmQpO1xuICB9O1xuICAvKipcbiAgICogYnVpbGRpbmdzXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZXRob2QgZmFrZXIuaW1hZ2UudW5zcGxhc2guYnVpbGRpbmdzXG4gICAqL1xuICBzZWxmLmJ1aWxkaW5ncyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBrZXl3b3JkKSB7XG4gICAgcmV0dXJuIGZha2VyLmltYWdlLnVuc3BsYXNoLmltYWdlVXJsKHdpZHRoLCBoZWlnaHQsICdidWlsZGluZ3MnLCBrZXl3b3JkKTtcbiAgfTtcbn1cblxubW9kdWxlW1wiZXhwb3J0c1wiXSA9IFVuc3BsYXNoO1xuIiwiLypcblxuICAgdGhpcyBpbmRleC5qcyBmaWxlIGlzIHVzZWQgZm9yIGluY2x1ZGluZyB0aGUgZmFrZXIgbGlicmFyeSBhcyBhIENvbW1vbkpTIG1vZHVsZSwgaW5zdGVhZCBvZiBhIGJ1bmRsZVxuXG4gICB5b3UgY2FuIGluY2x1ZGUgdGhlIGZha2VyIGxpYnJhcnkgaW50byB5b3VyIGV4aXN0aW5nIG5vZGUuanMgYXBwbGljYXRpb24gYnkgcmVxdWlyaW5nIHRoZSBlbnRpcmUgL2Zha2VyIGRpcmVjdG9yeVxuXG4gICAgdmFyIGZha2VyID0gcmVxdWlyZSguL2Zha2VyKTtcbiAgICB2YXIgcmFuZG9tTmFtZSA9IGZha2VyLm5hbWUuZmluZE5hbWUoKTtcblxuICAgeW91IGNhbiBhbHNvIHNpbXBseSBpbmNsdWRlIHRoZSBcImZha2VyLmpzXCIgZmlsZSB3aGljaCBpcyB0aGUgYXV0by1nZW5lcmF0ZWQgYnVuZGxlZCB2ZXJzaW9uIG9mIHRoZSBmYWtlciBsaWJyYXJ5XG5cbiAgICB2YXIgZmFrZXIgPSByZXF1aXJlKC4vY3VzdG9tQXBwUGF0aC9mYWtlcik7XG4gICAgdmFyIHJhbmRvbU5hbWUgPSBmYWtlci5uYW1lLmZpbmROYW1lKCk7XG5cblxuICBpZiB5b3UgcGxhbiBvbiBtb2RpZnlpbmcgdGhlIGZha2VyIGxpYnJhcnkgeW91IHNob3VsZCBiZSBwZXJmb3JtaW5nIHlvdXIgY2hhbmdlcyBpbiB0aGUgL2xpYi8gZGlyZWN0b3J5XG5cbiovXG5cbi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXJcbiAqL1xuZnVuY3Rpb24gRmFrZXIgKG9wdHMpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgLy8gYXNzaWduIG9wdGlvbnNcbiAgdmFyIGxvY2FsZXMgPSBzZWxmLmxvY2FsZXMgfHwgb3B0cy5sb2NhbGVzIHx8IHt9O1xuICB2YXIgbG9jYWxlID0gc2VsZi5sb2NhbGUgfHwgb3B0cy5sb2NhbGUgfHwgXCJlblwiO1xuICB2YXIgbG9jYWxlRmFsbGJhY2sgPSBzZWxmLmxvY2FsZUZhbGxiYWNrIHx8IG9wdHMubG9jYWxlRmFsbGJhY2sgfHwgXCJlblwiO1xuXG4gIHNlbGYubG9jYWxlcyA9IGxvY2FsZXM7XG4gIHNlbGYubG9jYWxlID0gbG9jYWxlO1xuICBzZWxmLmxvY2FsZUZhbGxiYWNrID0gbG9jYWxlRmFsbGJhY2s7XG5cbiAgc2VsZi5kZWZpbml0aW9ucyA9IHt9O1xuXG4gIHZhciBfZGVmaW5pdGlvbnMgPSB7XG4gICAgXCJuYW1lXCI6IFtcImZpcnN0X25hbWVcIiwgXCJsYXN0X25hbWVcIiwgXCJwcmVmaXhcIiwgXCJzdWZmaXhcIiwgXCJiaW5hcnlfZ2VuZGVyXCIsIFwiZ2VuZGVyXCIsIFwidGl0bGVcIiwgXCJtYWxlX3ByZWZpeFwiLCBcImZlbWFsZV9wcmVmaXhcIiwgXCJtYWxlX2ZpcnN0X25hbWVcIiwgXCJmZW1hbGVfZmlyc3RfbmFtZVwiLCBcIm1hbGVfbWlkZGxlX25hbWVcIiwgXCJmZW1hbGVfbWlkZGxlX25hbWVcIiwgXCJtYWxlX2xhc3RfbmFtZVwiLCBcImZlbWFsZV9sYXN0X25hbWVcIl0sXG4gICAgXCJhZGRyZXNzXCI6IFtcImNpdHlfbmFtZVwiLCBcImNpdHlfcHJlZml4XCIsIFwiY2l0eV9zdWZmaXhcIiwgXCJzdHJlZXRfc3VmZml4XCIsIFwiY291bnR5XCIsIFwiY291bnRyeVwiLCBcImNvdW50cnlfY29kZVwiLCBcImNvdW50cnlfY29kZV9hbHBoYV8zXCIsIFwic3RhdGVcIiwgXCJzdGF0ZV9hYmJyXCIsIFwic3RyZWV0X3ByZWZpeFwiLCBcInBvc3Rjb2RlXCIsIFwicG9zdGNvZGVfYnlfc3RhdGVcIiwgXCJkaXJlY3Rpb25cIiwgXCJkaXJlY3Rpb25fYWJiclwiLCBcInRpbWVfem9uZVwiXSxcbiAgICBcImFuaW1hbFwiOiBbXCJkb2dcIiwgXCJjYXRcIiwgXCJzbmFrZVwiLCBcImJlYXJcIiwgXCJsaW9uXCIsIFwiY2V0YWNlYW5cIiwgXCJpbnNlY3RcIiwgXCJjcm9jb2RpbGlhXCIsIFwiY293XCIsIFwiYmlyZFwiLCBcImZpc2hcIiwgXCJyYWJiaXRcIiwgXCJob3JzZVwiLCBcInR5cGVcIl0sXG4gICAgXCJjb21wYW55XCI6IFtcImFkamVjdGl2ZVwiLCBcIm5vdW5cIiwgXCJkZXNjcmlwdG9yXCIsIFwiYnNfYWRqZWN0aXZlXCIsIFwiYnNfbm91blwiLCBcImJzX3ZlcmJcIiwgXCJzdWZmaXhcIl0sXG4gICAgXCJsb3JlbVwiOiBbXCJ3b3Jkc1wiXSxcbiAgICBcImhhY2tlclwiOiBbXCJhYmJyZXZpYXRpb25cIiwgXCJhZGplY3RpdmVcIiwgXCJub3VuXCIsIFwidmVyYlwiLCBcImluZ3ZlcmJcIiwgXCJwaHJhc2VcIl0sXG4gICAgXCJwaG9uZV9udW1iZXJcIjogW1wiZm9ybWF0c1wiXSxcbiAgICBcImZpbmFuY2VcIjogW1wiYWNjb3VudF90eXBlXCIsIFwidHJhbnNhY3Rpb25fdHlwZVwiLCBcImN1cnJlbmN5XCIsIFwiaWJhblwiLCBcImNyZWRpdF9jYXJkXCJdLFxuICAgIFwiaW50ZXJuZXRcIjogW1wiYXZhdGFyX3VyaVwiLCBcImRvbWFpbl9zdWZmaXhcIiwgXCJmcmVlX2VtYWlsXCIsIFwiZXhhbXBsZV9lbWFpbFwiLCBcInBhc3N3b3JkXCJdLFxuICAgIFwiY29tbWVyY2VcIjogW1wiY29sb3JcIiwgXCJkZXBhcnRtZW50XCIsIFwicHJvZHVjdF9uYW1lXCIsIFwicHJpY2VcIiwgXCJjYXRlZ29yaWVzXCIsIFwicHJvZHVjdF9kZXNjcmlwdGlvblwiXSxcbiAgICBcImRhdGFiYXNlXCI6IFtcImNvbGxhdGlvblwiLCBcImNvbHVtblwiLCBcImVuZ2luZVwiLCBcInR5cGVcIl0sXG4gICAgXCJzeXN0ZW1cIjogW1wibWltZVR5cGVzXCIsIFwiZGlyZWN0b3J5UGF0aHNcIl0sXG4gICAgXCJkYXRlXCI6IFtcIm1vbnRoXCIsIFwid2Vla2RheVwiXSxcbiAgICBcInZlaGljbGVcIjogW1widmVoaWNsZVwiLCBcIm1hbnVmYWN0dXJlclwiLCBcIm1vZGVsXCIsIFwidHlwZVwiLCBcImZ1ZWxcIiwgXCJ2aW5cIiwgXCJjb2xvclwiXSxcbiAgICBcIm11c2ljXCI6IFtcImdlbnJlXCJdLFxuICAgIFwid29yZFwiOiBbXCJhZGplY3RpdmVcIiwgXCJhZHZlcmJcIiwgXCJjb25qdW5jdGlvblwiLCBcImludGVyamVjdGlvblwiLCBcIm5vdW5cIiwgXCJwcmVwb3NpdGlvblwiLCBcInZlcmJcIl0sXG4gICAgXCJ0aXRsZVwiOiBcIlwiLFxuICAgIFwic2VwYXJhdG9yXCI6IFwiXCJcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBHZXR0ZXIgZm9yIGFsbCBkZWZpbml0aW9ucy5mb28uYmFyIHByb3BlcnRpZXNcbiAgT2JqZWN0LmtleXMoX2RlZmluaXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuICAgIGlmICh0eXBlb2Ygc2VsZi5kZWZpbml0aW9uc1tkXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZi5kZWZpbml0aW9uc1tkXSA9IHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgX2RlZmluaXRpb25zW2RdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBzZWxmLmRlZmluaXRpb25zW2RdID0gX2RlZmluaXRpb25zW2RdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF9kZWZpbml0aW9uc1tkXS5mb3JFYWNoKGZ1bmN0aW9uKHApe1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYuZGVmaW5pdGlvbnNbZF0sIHAsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmxvY2FsZXNbc2VsZi5sb2NhbGVdW2RdID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBzZWxmLmxvY2FsZXNbc2VsZi5sb2NhbGVdW2RdW3BdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAvLyBjZXJ0YWluIGxvY2FsaXphdGlvbiBzZXRzIGNvbnRhaW4gbGVzcyBkYXRhIHRoZW4gb3RoZXJzLlxuICAgICAgICAgICAgLy8gaW4gdGhlIGNhc2Ugb2YgYSBtaXNzaW5nIGRlZmluaXRpb24sIHVzZSB0aGUgZGVmYXVsdCBsb2NhbGVGYWxsYmFjayB0byBzdWJzdGl0dXRlIHRoZSBtaXNzaW5nIHNldCBkYXRhXG4gICAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gcHJvcGVydHkgJyArIGQgKyBwKVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYubG9jYWxlc1tsb2NhbGVGYWxsYmFja11bZF1bcF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBsb2NhbGl6ZWQgZGF0YVxuICAgICAgICAgICAgcmV0dXJuIHNlbGYubG9jYWxlc1tzZWxmLmxvY2FsZV1bZF1bcF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdmFyIEZha2UgPSByZXF1aXJlKCcuL2Zha2UnKTtcbiAgc2VsZi5mYWtlID0gbmV3IEZha2Uoc2VsZikuZmFrZTtcblxuICB2YXIgVW5pcXVlID0gcmVxdWlyZSgnLi91bmlxdWUnKTtcbiAgc2VsZi51bmlxdWUgPSBuZXcgVW5pcXVlKHNlbGYpLnVuaXF1ZTtcblxuICB2YXIgTWVyc2VubmUgPSByZXF1aXJlKCcuL21lcnNlbm5lJyk7XG4gIHNlbGYubWVyc2VubmUgPSBuZXcgTWVyc2VubmUoKTtcblxuICB2YXIgUmFuZG9tID0gcmVxdWlyZSgnLi9yYW5kb20nKTtcbiAgc2VsZi5yYW5kb20gPSBuZXcgUmFuZG9tKHNlbGYpO1xuXG4gIHZhciBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG4gIHNlbGYuaGVscGVycyA9IG5ldyBIZWxwZXJzKHNlbGYpO1xuXG4gIHZhciBOYW1lID0gcmVxdWlyZSgnLi9uYW1lJyk7XG4gIHNlbGYubmFtZSA9IG5ldyBOYW1lKHNlbGYpO1xuXG4gIHZhciBBZGRyZXNzID0gcmVxdWlyZSgnLi9hZGRyZXNzJyk7XG4gIHNlbGYuYWRkcmVzcyA9IG5ldyBBZGRyZXNzKHNlbGYpO1xuXG4gIHZhciBBbmltYWwgPSByZXF1aXJlKCcuL2FuaW1hbCcpO1xuICBzZWxmLmFuaW1hbCA9IG5ldyBBbmltYWwoc2VsZik7XG5cbiAgdmFyIENvbXBhbnkgPSByZXF1aXJlKCcuL2NvbXBhbnknKTtcbiAgc2VsZi5jb21wYW55ID0gbmV3IENvbXBhbnkoc2VsZik7XG5cbiAgdmFyIEZpbmFuY2UgPSByZXF1aXJlKCcuL2ZpbmFuY2UnKTtcbiAgc2VsZi5maW5hbmNlID0gbmV3IEZpbmFuY2Uoc2VsZik7XG5cbiAgdmFyIEltYWdlID0gcmVxdWlyZSgnLi9pbWFnZScpO1xuICBzZWxmLmltYWdlID0gbmV3IEltYWdlKHNlbGYpO1xuXG4gIHZhciBMb3JlbSA9IHJlcXVpcmUoJy4vbG9yZW0nKTtcbiAgc2VsZi5sb3JlbSA9IG5ldyBMb3JlbShzZWxmKTtcblxuICB2YXIgSGFja2VyID0gcmVxdWlyZSgnLi9oYWNrZXInKTtcbiAgc2VsZi5oYWNrZXIgPSBuZXcgSGFja2VyKHNlbGYpO1xuXG4gIHZhciBJbnRlcm5ldCA9IHJlcXVpcmUoJy4vaW50ZXJuZXQnKTtcbiAgc2VsZi5pbnRlcm5ldCA9IG5ldyBJbnRlcm5ldChzZWxmKTtcblxuICB2YXIgRGF0YWJhc2UgPSByZXF1aXJlKCcuL2RhdGFiYXNlJyk7XG4gIHNlbGYuZGF0YWJhc2UgPSBuZXcgRGF0YWJhc2Uoc2VsZik7XG5cbiAgdmFyIFBob25lID0gcmVxdWlyZSgnLi9waG9uZV9udW1iZXInKTtcbiAgc2VsZi5waG9uZSA9IG5ldyBQaG9uZShzZWxmKTtcblxuICB2YXIgX0RhdGUgPSByZXF1aXJlKCcuL2RhdGUnKTtcbiAgc2VsZi5kYXRlID0gbmV3IF9EYXRlKHNlbGYpO1xuXG4gIHZhciBfVGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuICBzZWxmLnRpbWUgPSBuZXcgX1RpbWUoc2VsZik7XG5cbiAgdmFyIENvbW1lcmNlID0gcmVxdWlyZSgnLi9jb21tZXJjZScpO1xuICBzZWxmLmNvbW1lcmNlID0gbmV3IENvbW1lcmNlKHNlbGYpO1xuXG4gIHZhciBTeXN0ZW0gPSByZXF1aXJlKCcuL3N5c3RlbScpO1xuICBzZWxmLnN5c3RlbSA9IG5ldyBTeXN0ZW0oc2VsZik7XG5cbiAgdmFyIEdpdCA9IHJlcXVpcmUoJy4vZ2l0Jyk7XG4gIHNlbGYuZ2l0ID0gbmV3IEdpdChzZWxmKTtcblxuICB2YXIgVmVoaWNsZSA9IHJlcXVpcmUoJy4vdmVoaWNsZScpO1xuICBzZWxmLnZlaGljbGUgPSBuZXcgVmVoaWNsZShzZWxmKTtcblxuICB2YXIgTXVzaWMgPSByZXF1aXJlKCcuL211c2ljJyk7XG4gIHNlbGYubXVzaWMgPSBuZXcgTXVzaWMoc2VsZik7XG5cbiAgdmFyIERhdGF0eXBlID0gcmVxdWlyZSgnLi9kYXRhdHlwZScpO1xuICBzZWxmLmRhdGF0eXBlID0gbmV3IERhdGF0eXBlKHNlbGYpO1xuXG4gIHZhciBXb3JkID0gcmVxdWlyZSgnLi93b3JkJyk7XG4gIHNlbGYud29yZCA9IG5ldyBXb3JkKHNlbGYpO1xufTtcblxuRmFrZXIucHJvdG90eXBlLnNldExvY2FsZSA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcbiAgdGhpcy5sb2NhbGUgPSBsb2NhbGU7XG59XG5cbkZha2VyLnByb3RvdHlwZS5zZWVkID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIFJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XG4gIHZhciBEYXRhdHlwZSA9IHJlcXVpcmUoJy4vZGF0YXR5cGUnKTtcbiAgdGhpcy5zZWVkVmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5yYW5kb20gPSBuZXcgUmFuZG9tKHRoaXMsIHRoaXMuc2VlZFZhbHVlKTtcbiAgdGhpcy5kYXRhdHlwZSA9IG5ldyBEYXRhdHlwZSh0aGlzLCB0aGlzLnNlZWRWYWx1ZSk7XG59XG5tb2R1bGVbJ2V4cG9ydHMnXSA9IEZha2VyOyIsInZhciByYW5kb21fdWEgPSByZXF1aXJlKCcuLi92ZW5kb3IvdXNlci1hZ2VudCcpO1xuXG4vKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLmludGVybmV0XG4gKi9cbnZhciBJbnRlcm5ldCA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8qKlxuICAgKiBhdmF0YXJcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5hdmF0YXJcbiAgICovXG4gIHNlbGYuYXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jZG4uZmFrZXJjbG91ZC5jb20vYXZhdGFycy8nICsgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5pbnRlcm5ldC5hdmF0YXJfdXJpKTtcbiAgfTtcblxuICBzZWxmLmF2YXRhci5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIFVSTCBmb3IgYW4gYXZhdGFyLlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJodHRwczovL2Nkbi5mYWtlcmNsb3VkLmNvbS9hdmF0YXJzL3N5ZGxhd3JlbmNlXzEyOC5qcGdcIl1cbiAgfTtcblxuICAvKipcbiAgICogZW1haWxcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5lbWFpbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlyc3ROYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXN0TmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvdmlkZXJcbiAgICovXG4gIHNlbGYuZW1haWwgPSBmdW5jdGlvbiAoZmlyc3ROYW1lLCBsYXN0TmFtZSwgcHJvdmlkZXIpIHtcbiAgICBwcm92aWRlciA9IHByb3ZpZGVyIHx8IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuaW50ZXJuZXQuZnJlZV9lbWFpbCk7XG4gICAgcmV0dXJuICBmYWtlci5oZWxwZXJzLnNsdWdpZnkoZmFrZXIuaW50ZXJuZXQudXNlck5hbWUoZmlyc3ROYW1lLCBsYXN0TmFtZSkpICsgXCJAXCIgKyBwcm92aWRlcjtcbiAgfTtcblxuICBzZWxmLmVtYWlsLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgdmFsaWQgZW1haWwgYWRkcmVzcyBiYXNlZCBvbiBvcHRpb25hbCBpbnB1dCBjcml0ZXJpYVwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJmb28uYmFyQGdtYWlsLmNvbVwiXSxcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJmaXJzdE5hbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBmaXJzdCBuYW1lIG9mIHRoZSB1c2VyXCJcbiAgICAgIH0sXG4gICAgICBcImxhc3ROYW1lXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUaGUgbGFzdCBuYW1lIG9mIHRoZSB1c2VyXCJcbiAgICAgIH0sXG4gICAgICBcInByb3ZpZGVyXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUaGUgZG9tYWluIG9mIHRoZSB1c2VyXCJcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBleGFtcGxlRW1haWxcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5leGFtcGxlRW1haWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0TmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFzdE5hbWVcbiAgICovXG4gIHNlbGYuZXhhbXBsZUVtYWlsID0gZnVuY3Rpb24gKGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICB2YXIgcHJvdmlkZXIgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLmludGVybmV0LmV4YW1wbGVfZW1haWwpO1xuICAgIHJldHVybiBzZWxmLmVtYWlsKGZpcnN0TmFtZSwgbGFzdE5hbWUsIHByb3ZpZGVyKTtcbiAgfTtcblxuICAvKipcbiAgICogdXNlck5hbWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC51c2VyTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlyc3ROYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXN0TmFtZVxuICAgKi9cbiAgc2VsZi51c2VyTmFtZSA9IGZ1bmN0aW9uIChmaXJzdE5hbWUsIGxhc3ROYW1lKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBmaXJzdE5hbWUgPSBmaXJzdE5hbWUgfHwgZmFrZXIubmFtZS5maXJzdE5hbWUoKTtcbiAgICBsYXN0TmFtZSA9IGxhc3ROYW1lIHx8IGZha2VyLm5hbWUubGFzdE5hbWUoKTtcbiAgICBzd2l0Y2ggKGZha2VyLmRhdGF0eXBlLm51bWJlcigyKSkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXN1bHQgPSBmaXJzdE5hbWUgKyBmYWtlci5kYXRhdHlwZS5udW1iZXIoOTkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmVzdWx0ID0gZmlyc3ROYW1lICsgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChbXCIuXCIsIFwiX1wiXSkgKyBsYXN0TmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJlc3VsdCA9IGZpcnN0TmFtZSArIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoW1wiLlwiLCBcIl9cIl0pICsgbGFzdE5hbWUgKyBmYWtlci5kYXRhdHlwZS5udW1iZXIoOTkpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0ID0gcmVzdWx0LnRvU3RyaW5nKCkucmVwbGFjZSgvJy9nLCBcIlwiKTtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvIC9nLCBcIlwiKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHNlbGYudXNlck5hbWUuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSB1c2VybmFtZSBiYXNlZCBvbiBvbmUgb2Ygc2V2ZXJhbCBwYXR0ZXJucy4gVGhlIHBhdHRlcm4gaXMgY2hvc2VuIHJhbmRvbWx5LlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXG4gICAgICBcIktpcnN0aW4zOVwiLFxuICAgICAgXCJLaXJzdGluLlNtaXRoXCIsXG4gICAgICBcIktpcnN0aW4uU21pdGgzOVwiLFxuICAgICAgXCJLaXJzdGluU21pdGhcIixcbiAgICAgIFwiS2lyc3RpblNtaXRoMzlcIixcbiAgICBdLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIGZpcnN0IG5hbWUgb2YgdGhlIHVzZXJcIlxuICAgICAgfSxcbiAgICAgIFwibGFzdE5hbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBsYXN0IG5hbWUgb2YgdGhlIHVzZXJcIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogcHJvdG9jb2xcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5wcm90b2NvbFxuICAgKi9cbiAgc2VsZi5wcm90b2NvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvdG9jb2xzID0gWydodHRwJywnaHR0cHMnXTtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChwcm90b2NvbHMpO1xuICB9O1xuXG4gIHNlbGYucHJvdG9jb2wuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJSYW5kb21seSBnZW5lcmF0ZXMgaHR0cCBvciBodHRwc1wiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJodHRwc1wiLCBcImh0dHBcIl1cbiAgfTtcblxuICAvKipcbiAgICogbWV0aG9kXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaW50ZXJuZXQuaHR0cE1ldGhvZFxuICAgKi9cbiAgc2VsZi5odHRwTWV0aG9kID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBodHRwTWV0aG9kcyA9IFsnR0VUJywnUE9TVCcsICdQVVQnLCAnREVMRVRFJywgJ1BBVENIJ107XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoaHR0cE1ldGhvZHMpO1xuICB9O1xuXG4gIHNlbGYuaHR0cE1ldGhvZC5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIlJhbmRvbWx5IGdlbmVyYXRlcyBIVFRQIE1ldGhvZHMgKEdFVCwgUE9TVCwgUFVULCBERUxFVEUsIFBBVENIKVwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJHRVRcIixcIlBPU1RcIiwgXCJQVVRcIiwgXCJERUxFVEVcIiwgXCJQQVRDSFwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiB1cmxcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC51cmxcbiAgICovXG4gIHNlbGYudXJsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5pbnRlcm5ldC5wcm90b2NvbCgpICsgJzovLycgKyBmYWtlci5pbnRlcm5ldC5kb21haW5OYW1lKCk7XG4gIH07XG5cbiAgc2VsZi51cmwuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSByYW5kb20gVVJMLiBUaGUgVVJMIGNvdWxkIGJlIHNlY3VyZSBvciBpbnNlY3VyZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1xuICAgICAgXCJodHRwOi8vcmFzaGF3bi5uYW1lXCIsXG4gICAgICBcImh0dHBzOi8vcmFzaGF3bi5uYW1lXCJcbiAgICBdXG4gIH07XG5cbiAgLyoqXG4gICAqIGRvbWFpbk5hbWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5kb21haW5OYW1lXG4gICAqL1xuICBzZWxmLmRvbWFpbk5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLmludGVybmV0LmRvbWFpbldvcmQoKSArIFwiLlwiICsgZmFrZXIuaW50ZXJuZXQuZG9tYWluU3VmZml4KCk7XG4gIH07XG5cbiAgc2VsZi5kb21haW5OYW1lLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgcmFuZG9tIGRvbWFpbiBuYW1lLlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJtYXJ2aW4ub3JnXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIGRvbWFpblN1ZmZpeFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmludGVybmV0LmRvbWFpblN1ZmZpeFxuICAgKi9cbiAgc2VsZi5kb21haW5TdWZmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMuaW50ZXJuZXQuZG9tYWluX3N1ZmZpeCk7XG4gIH07XG5cbiAgc2VsZi5kb21haW5TdWZmaXguc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSByYW5kb20gZG9tYWluIHN1ZmZpeC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wibmV0XCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIGRvbWFpbldvcmRcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5kb21haW5Xb3JkXG4gICAqL1xuICBzZWxmLmRvbWFpbldvcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChmYWtlci53b3JkLmFkamVjdGl2ZSgpICsgJy0nICsgZmFrZXIud29yZC5ub3VuKCkpLnJlcGxhY2UoLyhbXFxcXH4jJip7fS86PD4/fFxcXCInXSkvaWcsICcnKS50b0xvd2VyQ2FzZSgpO1xuICB9O1xuXG4gIHNlbGYuZG9tYWluV29yZC5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHJhbmRvbSBkb21haW4gd29yZC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiYWx5Y2VcIl1cbiAgfTtcblxuICAvKipcbiAgICogaXBcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5pcFxuICAgKi9cbiAgc2VsZi5pcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmFuZE51bSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoZmFrZXIuZGF0YXR5cGUubnVtYmVyKDI1NSkpLnRvRml4ZWQoMCk7XG4gICAgfTtcblxuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgcmVzdWx0W2ldID0gcmFuZE51bSgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQuam9pbihcIi5cIik7XG4gIH07XG5cbiAgc2VsZi5pcC5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHJhbmRvbSBJUC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiOTcuMjM4LjI0MS4xMVwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiBpcHY2XG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaW50ZXJuZXQuaXB2NlxuICAgKi9cbiAgc2VsZi5pcHY2ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByYW5kSGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgcmVzdWx0ICs9IChmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCJhXCIsIFwiYlwiLCBcImNcIiwgXCJkXCIsIFwiZVwiLCBcImZcIl0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICByZXN1bHRbaV0gPSByYW5kSGFzaCgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0LmpvaW4oXCI6XCIpO1xuICB9O1xuXG4gIHNlbGYuaXB2Ni5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHJhbmRvbSBJUHY2IGFkZHJlc3MuXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIjIwMDE6MGRiODo2Mjc2OmIxYTc6NTIxMzoyMmYxOjI1ZGY6YzhhMFwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiBwb3J0XG4gICAqIFxuICAgKiBAbWV0aG9kIGZha2VyLmludGVybmV0LnBvcnRcbiAgICovXG4gIHNlbGYucG9ydCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtaW46IDAsIG1heDogNjU1MzUgfSk7XG4gIH07XG5cbiAgc2VsZi5wb3J0LnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgcmFuZG9tIHBvcnQgbnVtYmVyLlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCI0NDIyXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIHVzZXJBZ2VudFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmludGVybmV0LnVzZXJBZ2VudFxuICAgKi9cbiAgc2VsZi51c2VyQWdlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJhbmRvbV91YS5nZW5lcmF0ZShmYWtlcik7XG4gIH07XG5cbiAgc2VsZi51c2VyQWdlbnQuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSByYW5kb20gdXNlciBhZ2VudC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgVTsgUFBDIE1hYyBPUyBYIDEwXzdfNSBydjo2LjA7IFNMKSBBcHBsZVdlYktpdC81MzIuMC4xIChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi83LjEuNiBTYWZhcmkvNTMyLjAuMVwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiBjb2xvclxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmludGVybmV0LmNvbG9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiYXNlUmVkMjU1XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiYXNlR3JlZW4yNTVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJhc2VCbHVlMjU1XG4gICAqL1xuICBzZWxmLmNvbG9yID0gZnVuY3Rpb24gKGJhc2VSZWQyNTUsIGJhc2VHcmVlbjI1NSwgYmFzZUJsdWUyNTUpIHtcbiAgICBiYXNlUmVkMjU1ID0gYmFzZVJlZDI1NSB8fCAwO1xuICAgIGJhc2VHcmVlbjI1NSA9IGJhc2VHcmVlbjI1NSB8fCAwO1xuICAgIGJhc2VCbHVlMjU1ID0gYmFzZUJsdWUyNTUgfHwgMDtcbiAgICAvLyBiYXNlZCBvbiBhd2Vzb21lIHJlc3BvbnNlIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MzA0NC9hbGdvcml0aG0tdG8tcmFuZG9tbHktZ2VuZXJhdGUtYW4tYWVzdGhldGljYWxseS1wbGVhc2luZy1jb2xvci1wYWxldHRlXG4gICAgdmFyIHJlZCA9IE1hdGguZmxvb3IoKGZha2VyLmRhdGF0eXBlLm51bWJlcigyNTYpICsgYmFzZVJlZDI1NSkgLyAyKTtcbiAgICB2YXIgZ3JlZW4gPSBNYXRoLmZsb29yKChmYWtlci5kYXRhdHlwZS5udW1iZXIoMjU2KSArIGJhc2VHcmVlbjI1NSkgLyAyKTtcbiAgICB2YXIgYmx1ZSA9IE1hdGguZmxvb3IoKGZha2VyLmRhdGF0eXBlLm51bWJlcigyNTYpICsgYmFzZUJsdWUyNTUpIC8gMik7XG4gICAgdmFyIHJlZFN0ciA9IHJlZC50b1N0cmluZygxNik7XG4gICAgdmFyIGdyZWVuU3RyID0gZ3JlZW4udG9TdHJpbmcoMTYpO1xuICAgIHZhciBibHVlU3RyID0gYmx1ZS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuICcjJyArXG4gICAgICAgIChyZWRTdHIubGVuZ3RoID09PSAxID8gJzAnIDogJycpICsgcmVkU3RyICtcbiAgICAgICAgKGdyZWVuU3RyLmxlbmd0aCA9PT0gMSA/ICcwJyA6ICcnKSArIGdyZWVuU3RyICtcbiAgICAgICAgKGJsdWVTdHIubGVuZ3RoID09PSAxID8gJzAnOiAnJykgKyBibHVlU3RyO1xuXG4gIH07XG5cbiAgc2VsZi5jb2xvci5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHJhbmRvbSBoZXhhZGVjaW1hbCBjb2xvci5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiIzA2MjY3ZlwiXSxcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJiYXNlUmVkMjU1XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUaGUgcmVkIHZhbHVlLiBWYWxpZCB2YWx1ZXMgYXJlIDAgLSAyNTUuXCJcbiAgICAgIH0sXG4gICAgICBcImJhc2VHcmVlbjI1NVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIGdyZWVuIHZhbHVlLiBWYWxpZCB2YWx1ZXMgYXJlIDAgLSAyNTUuXCJcbiAgICAgIH0sXG4gICAgICBcImJhc2VCbHVlMjU1XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUaGUgYmx1ZSB2YWx1ZS4gVmFsaWQgdmFsdWVzIGFyZSAwIC0gMjU1LlwiXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBtYWNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5pbnRlcm5ldC5tYWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlcFxuICAgKi9cbiAgc2VsZi5tYWMgPSBmdW5jdGlvbihzZXApe1xuICAgIHZhciBpLCBcbiAgICAgIG1hYyA9IFwiXCIsXG4gICAgICB2YWxpZFNlcCA9ICc6JztcblxuICAgIC8vIGlmIHRoZSBjbGllbnQgcGFzc2VkIGluIGEgZGlmZmVyZW50IHNlcGFyYXRvciB0aGFuIGA6YCwgXG4gICAgLy8gd2Ugd2lsbCB1c2UgaXQgaWYgaXQgaXMgaW4gdGhlIGxpc3Qgb2YgYWNjZXB0YWJsZSBzZXBhcmF0b3JzIChkYXNoIG9yIG5vIHNlcGFyYXRvcilcbiAgICBpZiAoWyctJywgJyddLmluZGV4T2Yoc2VwKSAhPT0gLTEpIHtcbiAgICAgIHZhbGlkU2VwID0gc2VwO1xuICAgIH0gXG5cbiAgICBmb3IgKGk9MDsgaSA8IDEyOyBpKyspIHtcbiAgICAgIG1hYys9IGZha2VyLmRhdGF0eXBlLm51bWJlcigxNSkudG9TdHJpbmcoMTYpO1xuICAgICAgaWYgKGklMj09MSAmJiBpICE9IDExKSB7XG4gICAgICAgIG1hYys9dmFsaWRTZXA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYWM7XG4gIH07XG5cbiAgc2VsZi5tYWMuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSByYW5kb20gbWFjIGFkZHJlc3MuXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIjc4OjA2OmNjOmFlOmIzOjgxXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIHBhc3N3b3JkXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuaW50ZXJuZXQucGFzc3dvcmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlblxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1lbW9yYWJsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4XG4gICAqL1xuICBzZWxmLnBhc3N3b3JkID0gZnVuY3Rpb24gKGxlbiwgbWVtb3JhYmxlLCBwYXR0ZXJuLCBwcmVmaXgpIHtcbiAgICBsZW4gPSBsZW4gfHwgMTU7XG4gICAgaWYgKHR5cGVvZiBtZW1vcmFibGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG1lbW9yYWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICAvKlxuICAgICAgKiBwYXNzd29yZC1nZW5lcmF0b3IgKCBmdW5jdGlvbiApXG4gICAgICAqIENvcHlyaWdodChjKSAyMDExLTIwMTMgQmVybWkgRmVycmVyIDxiZXJtaUBiZXJtaWxhYnMuY29tPlxuICAgICAgKiBNSVQgTGljZW5zZWRcbiAgICAgICovXG4gICAgdmFyIGNvbnNvbmFudCwgbGV0dGVyLCB2b3dlbDtcbiAgICBsZXR0ZXIgPSAvW2EtekEtWl0kLztcbiAgICB2b3dlbCA9IC9bYWVpb3VBRUlPVV0kLztcbiAgICBjb25zb25hbnQgPSAvW2JjZGZnaGprbG1ucHFyc3R2d3h5ekJDREZHSEpLTE1OUFFSU1RWV1hZWl0kLztcbiAgICB2YXIgX3Bhc3N3b3JkID0gZnVuY3Rpb24gKGxlbmd0aCwgbWVtb3JhYmxlLCBwYXR0ZXJuLCBwcmVmaXgpIHtcbiAgICAgIHZhciBjaGFyLCBuO1xuICAgICAgaWYgKGxlbmd0aCA9PSBudWxsKSB7XG4gICAgICAgIGxlbmd0aCA9IDEwO1xuICAgICAgfVxuICAgICAgaWYgKG1lbW9yYWJsZSA9PSBudWxsKSB7XG4gICAgICAgIG1lbW9yYWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAocGF0dGVybiA9PSBudWxsKSB7XG4gICAgICAgIHBhdHRlcm4gPSAvXFx3LztcbiAgICAgIH1cbiAgICAgIGlmIChwcmVmaXggPT0gbnVsbCkge1xuICAgICAgICBwcmVmaXggPSAnJztcbiAgICAgIH1cbiAgICAgIGlmIChwcmVmaXgubGVuZ3RoID49IGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgICAgfVxuICAgICAgaWYgKG1lbW9yYWJsZSkge1xuICAgICAgICBpZiAocHJlZml4Lm1hdGNoKGNvbnNvbmFudCkpIHtcbiAgICAgICAgICBwYXR0ZXJuID0gdm93ZWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0dGVybiA9IGNvbnNvbmFudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbiA9IGZha2VyLmRhdGF0eXBlLm51bWJlcig5NCkgKyAzMztcbiAgICAgIGNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG4pO1xuICAgICAgaWYgKG1lbW9yYWJsZSkge1xuICAgICAgICBjaGFyID0gY2hhci50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCFjaGFyLm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICAgIHJldHVybiBfcGFzc3dvcmQobGVuZ3RoLCBtZW1vcmFibGUsIHBhdHRlcm4sIHByZWZpeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3Bhc3N3b3JkKGxlbmd0aCwgbWVtb3JhYmxlLCBwYXR0ZXJuLCBcIlwiICsgcHJlZml4ICsgY2hhcik7XG4gICAgfTtcbiAgICByZXR1cm4gX3Bhc3N3b3JkKGxlbiwgbWVtb3JhYmxlLCBwYXR0ZXJuLCBwcmVmaXgpO1xuICB9XG5cbiAgc2VsZi5wYXNzd29yZC5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHJhbmRvbSBwYXNzd29yZC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1xuICAgICAgXCJBTTd6bDZNZ1wiLFxuICAgICAgXCJzdXNlam9mZVwiXG4gICAgXSxcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJsZW5ndGhcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiB0aGUgcGFzc3dvcmQuXCJcbiAgICAgIH0sXG4gICAgICBcIm1lbW9yYWJsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIldoZXRoZXIgYSBwYXNzd29yZCBzaG91bGQgYmUgZWFzeSB0byByZW1lbWJlci5cIlxuICAgICAgfSxcbiAgICAgIFwicGF0dGVyblwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInJlZ2V4XCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIHJlZ2V4IHRvIG1hdGNoIGVhY2ggY2hhcmFjdGVyIG9mIHRoZSBwYXNzd29yZCBhZ2FpbnN0LiBUaGlzIHBhcmFtZXRlciB3aWxsIGJlIG5lZ2F0ZWQgaWYgdGhlIG1lbW9yYWJsZSBzZXR0aW5nIGlzIHR1cm5lZCBvbi5cIlxuICAgICAgfSxcbiAgICAgIFwicHJlZml4XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIHZhbHVlIHRvIHByZXBlbmQgdG8gdGhlIGdlbmVyYXRlZCBwYXNzd29yZC4gVGhlIHByZWZpeCBjb3VudHMgdG93YXJkcyB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzd29yZC5cIlxuICAgICAgfVxuICAgIH1cbiAgfTtcblxufTtcblxuXG5tb2R1bGVbXCJleHBvcnRzXCJdID0gSW50ZXJuZXQ7XG4iLCJcbi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXIubG9yZW1cbiAqL1xudmFyIExvcmVtID0gZnVuY3Rpb24gKGZha2VyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIEhlbHBlcnMgPSBmYWtlci5oZWxwZXJzO1xuXG4gIC8qKlxuICAgKiBnZW5lcmF0ZXMgYSB3b3JkIG9mIGEgc3BlY2lmaWVkIGxlbmd0aFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmxvcmVtLndvcmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBsZW5ndGggb2YgdGhlIHdvcmQgdGhhdCBzaG91bGQgYmUgcmV0dXJuZWQuIERlZmF1bHRzIHRvIGEgcmFuZG9tIGxlbmd0aFxuICAgKi9cbiAgc2VsZi53b3JkID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciBoYXNSaWdodExlbmd0aCA9IGZ1bmN0aW9uKHdvcmQpIHsgcmV0dXJuIHdvcmQubGVuZ3RoID09PSBsZW5ndGg7IH07XG4gICAgdmFyIHByb3Blckxlbmd0aFdvcmRzO1xuICAgIGlmKHR5cGVvZiBsZW5ndGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwcm9wZXJMZW5ndGhXb3JkcyA9IGZha2VyLmRlZmluaXRpb25zLmxvcmVtLndvcmRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wZXJMZW5ndGhXb3JkcyA9IGZha2VyLmRlZmluaXRpb25zLmxvcmVtLndvcmRzLmZpbHRlcihoYXNSaWdodExlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHByb3Blckxlbmd0aFdvcmRzKTtcbiAgfTtcblxuICAvKipcbiAgICogZ2VuZXJhdGVzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2Ygd29yZHNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5sb3JlbS53b3Jkc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbnVtIG51bWJlciBvZiB3b3JkcywgZGVmYXVsdHMgdG8gM1xuICAgKi9cbiAgc2VsZi53b3JkcyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICBpZiAodHlwZW9mIG51bSA9PSAndW5kZWZpbmVkJykgeyBudW0gPSAzOyB9XG4gICAgdmFyIHdvcmRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgd29yZHMucHVzaChmYWtlci5sb3JlbS53b3JkKCkpO1xuICAgIH1cbiAgICByZXR1cm4gd29yZHMuam9pbignICcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzZW50ZW5jZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLmxvcmVtLnNlbnRlbmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3b3JkQ291bnQgZGVmYXVsdHMgdG8gYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMyBhbmQgMTBcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJhbmdlXG4gICAqL1xuICBzZWxmLnNlbnRlbmNlID0gZnVuY3Rpb24gKHdvcmRDb3VudCwgcmFuZ2UpIHtcbiAgICBpZiAodHlwZW9mIHdvcmRDb3VudCA9PSAndW5kZWZpbmVkJykgeyB3b3JkQ291bnQgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtaW46IDMsIG1heDogMTAgfSk7IH1cbiAgICAvLyBpZiAodHlwZW9mIHJhbmdlID09ICd1bmRlZmluZWQnKSB7IHJhbmdlID0gNzsgfVxuXG4gICAgLy8gc3RyYW5nZSBpc3N1ZSB3aXRoIHRoZSBub2RlX21pbl90ZXN0IGZhaWxpbmcgZm9yIGNhcHRpYWxpemUsIHBsZWFzZSBmaXggYW5kIGFkZCBmYWtlci5sb3JlbS5iYWNrXG4gICAgLy9yZXR1cm4gIGZha2VyLmxvcmVtLndvcmRzKHdvcmRDb3VudCArIEhlbHBlcnMucmFuZG9tTnVtYmVyKHJhbmdlKSkuam9pbignICcpLmNhcGl0YWxpemUoKTtcblxuICAgIHZhciBzZW50ZW5jZSA9IGZha2VyLmxvcmVtLndvcmRzKHdvcmRDb3VudCk7XG4gICAgcmV0dXJuIHNlbnRlbmNlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc2VudGVuY2Uuc2xpY2UoMSkgKyAnLic7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNsdWdcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5sb3JlbS5zbHVnXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3b3JkQ291bnQgbnVtYmVyIG9mIHdvcmRzLCBkZWZhdWx0cyB0byAzXG4gICAqL1xuICBzZWxmLnNsdWcgPSBmdW5jdGlvbiAod29yZENvdW50KSB7XG4gICAgdmFyIHdvcmRzID0gZmFrZXIubG9yZW0ud29yZHMod29yZENvdW50KTtcbiAgICByZXR1cm4gSGVscGVycy5zbHVnaWZ5KHdvcmRzKTtcbiAgfTtcblxuICAvKipcbiAgICogc2VudGVuY2VzXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIubG9yZW0uc2VudGVuY2VzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZW50ZW5jZUNvdW50IGRlZmF1dGxzIHRvIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDIgYW5kIDZcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlcGFyYXRvciBkZWZhdWx0cyB0byBgJyAnYFxuICAgKi9cbiAgc2VsZi5zZW50ZW5jZXMgPSBmdW5jdGlvbiAoc2VudGVuY2VDb3VudCwgc2VwYXJhdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBzZW50ZW5jZUNvdW50ID09PSAndW5kZWZpbmVkJykgeyBzZW50ZW5jZUNvdW50ID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKHsgbWluOiAyLCBtYXg6IDYgfSk7fVxuICAgIGlmICh0eXBlb2Ygc2VwYXJhdG9yID09ICd1bmRlZmluZWQnKSB7IHNlcGFyYXRvciA9IFwiIFwiOyB9XG4gICAgdmFyIHNlbnRlbmNlcyA9IFtdO1xuICAgIGZvciAoc2VudGVuY2VDb3VudDsgc2VudGVuY2VDb3VudCA+IDA7IHNlbnRlbmNlQ291bnQtLSkge1xuICAgICAgc2VudGVuY2VzLnB1c2goZmFrZXIubG9yZW0uc2VudGVuY2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBzZW50ZW5jZXMuam9pbihzZXBhcmF0b3IpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBwYXJhZ3JhcGhcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5sb3JlbS5wYXJhZ3JhcGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNlbnRlbmNlQ291bnQgZGVmYXVsdHMgdG8gM1xuICAgKi9cbiAgc2VsZi5wYXJhZ3JhcGggPSBmdW5jdGlvbiAoc2VudGVuY2VDb3VudCkge1xuICAgIGlmICh0eXBlb2Ygc2VudGVuY2VDb3VudCA9PSAndW5kZWZpbmVkJykgeyBzZW50ZW5jZUNvdW50ID0gMzsgfVxuICAgIHJldHVybiBmYWtlci5sb3JlbS5zZW50ZW5jZXMoc2VudGVuY2VDb3VudCArIGZha2VyLmRhdGF0eXBlLm51bWJlcigzKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHBhcmFncmFwaHNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5sb3JlbS5wYXJhZ3JhcGhzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhZ3JhcGhDb3VudCBkZWZhdWx0cyB0byAzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXBhcmF0b3IgZGVmYXVsdHMgdG8gYCdcXG4gXFxyJ2BcbiAgICovXG4gIHNlbGYucGFyYWdyYXBocyA9IGZ1bmN0aW9uIChwYXJhZ3JhcGhDb3VudCwgc2VwYXJhdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHNlcGFyYXRvciA9IFwiXFxuIFxcclwiO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcmFncmFwaENvdW50ID09ICd1bmRlZmluZWQnKSB7IHBhcmFncmFwaENvdW50ID0gMzsgfVxuICAgIHZhciBwYXJhZ3JhcGhzID0gW107XG4gICAgZm9yIChwYXJhZ3JhcGhDb3VudDsgcGFyYWdyYXBoQ291bnQgPiAwOyBwYXJhZ3JhcGhDb3VudC0tKSB7XG4gICAgICBwYXJhZ3JhcGhzLnB1c2goZmFrZXIubG9yZW0ucGFyYWdyYXBoKCkpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYWdyYXBocy5qb2luKHNlcGFyYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyByYW5kb20gdGV4dCBiYXNlZCBvbiBhIHJhbmRvbSBsb3JlbSBtZXRob2RcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5sb3JlbS50ZXh0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lc1xuICAgKi9cbiAgc2VsZi50ZXh0ID0gZnVuY3Rpb24gbG9yZW1UZXh0ICh0aW1lcykge1xuICAgIHZhciBsb3JlbU1ldGhvZHMgPSBbJ2xvcmVtLndvcmQnLCAnbG9yZW0ud29yZHMnLCAnbG9yZW0uc2VudGVuY2UnLCAnbG9yZW0uc2VudGVuY2VzJywgJ2xvcmVtLnBhcmFncmFwaCcsICdsb3JlbS5wYXJhZ3JhcGhzJywgJ2xvcmVtLmxpbmVzJ107XG4gICAgdmFyIHJhbmRvbUxvcmVtTWV0aG9kID0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChsb3JlbU1ldGhvZHMpO1xuICAgIHJldHVybiBmYWtlci5mYWtlKCd7eycgKyByYW5kb21Mb3JlbU1ldGhvZCArICd9fScpO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIGxpbmVzIG9mIGxvcmVtIHNlcGFyYXRlZCBieSBgJ1xcbidgXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIubG9yZW0ubGluZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpbmVDb3VudCBkZWZhdWx0cyB0byBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAxIGFuZCA1XG4gICAqL1xuICBzZWxmLmxpbmVzID0gZnVuY3Rpb24gbGluZXMgKGxpbmVDb3VudCkge1xuICAgIGlmICh0eXBlb2YgbGluZUNvdW50ID09PSAndW5kZWZpbmVkJykgeyBsaW5lQ291bnQgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtaW46IDEsIG1heDogNSB9KTt9XG4gICAgcmV0dXJuIGZha2VyLmxvcmVtLnNlbnRlbmNlcyhsaW5lQ291bnQsICdcXG4nKVxuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufTtcblxuXG5tb2R1bGVbXCJleHBvcnRzXCJdID0gTG9yZW07XG4iLCJ2YXIgR2VuID0gcmVxdWlyZSgnLi4vdmVuZG9yL21lcnNlbm5lJykuTWVyc2VubmVUd2lzdGVyMTk5Mzc7XG5cbmZ1bmN0aW9uIE1lcnNlbm5lKCkge1xuICB2YXIgZ2VuID0gbmV3IEdlbigpO1xuICBnZW4uaW5pdF9nZW5yYW5kKChuZXcgRGF0ZSkuZ2V0VGltZSgpICUgMTAwMDAwMDAwMCk7XG5cbiAgdGhpcy5yYW5kID0gZnVuY3Rpb24obWF4LCBtaW4pIHtcbiAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgbWluID0gMDtcbiAgICAgIG1heCA9IDMyNzY4O1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihnZW4uZ2VucmFuZF9yZWFsMigpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICB9XG4gIHRoaXMuc2VlZCA9IGZ1bmN0aW9uKFMpIHtcbiAgICBpZiAodHlwZW9mKFMpICE9ICdudW1iZXInKVxuICAgIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNlZWQoUykgbXVzdCB0YWtlIG51bWVyaWMgYXJndW1lbnQ7IGlzIFwiICsgdHlwZW9mKFMpKTtcbiAgICB9XG4gICAgZ2VuLmluaXRfZ2VucmFuZChTKTtcbiAgfVxuICB0aGlzLnNlZWRfYXJyYXkgPSBmdW5jdGlvbihBKSB7XG4gICAgaWYgKHR5cGVvZihBKSAhPSAnb2JqZWN0JylcbiAgICB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZWVkX2FycmF5KEEpIG11c3QgdGFrZSBhcnJheSBvZiBudW1iZXJzOyBpcyBcIiArIHR5cGVvZihBKSk7XG4gICAgfVxuICAgIGdlbi5pbml0X2J5X2FycmF5KEEsIEEubGVuZ3RoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lcnNlbm5lO1xuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5tdXNpY1xuICovXG52YXIgTXVzaWMgPSBmdW5jdGlvbiAoZmFrZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvKipcbiAgICAgKiBnZW5yZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBmYWtlci5tdXNpYy5nZW5yZVxuICAgICAqL1xuICBzZWxmLmdlbnJlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLm11c2ljLmdlbnJlKTtcbiAgfTtcblxuICBzZWxmLmdlbnJlLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgZ2VucmUuXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIlJvY2tcIiwgXCJNZXRhbFwiLCBcIlBvcFwiXVxuICB9O1xufTtcblxubW9kdWxlW1wiZXhwb3J0c1wiXSA9IE11c2ljO1xuIiwiLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5uYW1lXG4gKi9cbmZ1bmN0aW9uIE5hbWUgKGZha2VyKSB7XG5cbiAgLyoqXG4gICAqIGZpcnN0TmFtZVxuICAgKlxuICAgKiBAbWV0aG9kIGZpcnN0TmFtZVxuICAgKiBAcGFyYW0ge21peGVkfSBnZW5kZXJcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMuZmlyc3ROYW1lID0gZnVuY3Rpb24gKGdlbmRlcikge1xuICAgIGlmICh0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5tYWxlX2ZpcnN0X25hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGZha2VyLmRlZmluaXRpb25zLm5hbWUuZmVtYWxlX2ZpcnN0X25hbWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIC8vIHNvbWUgbG9jYWxlIGRhdGFzZXRzICggbGlrZSBydSApIGhhdmUgZmlyc3RfbmFtZSBzcGxpdCBieSBnZW5kZXIuIHNpbmNlIHRoZSBuYW1lLmZpcnN0X25hbWUgZmllbGQgZG9lcyBub3QgZXhpc3QgaW4gdGhlc2UgZGF0YXNldHMsXG4gICAgICAvLyB3ZSBtdXN0IHJhbmRvbWx5IHBpY2sgYSBuYW1lIGZyb20gZWl0aGVyIGdlbmRlciBhcnJheSBzbyBmYWtlci5uYW1lLmZpcnN0TmFtZSB3aWxsIHJldHVybiB0aGUgY29ycmVjdCBsb2NhbGUgZGF0YSAoIGFuZCBub3QgZmFsbGJhY2sgKVxuXG4gICAgICBpZih0eXBlb2YgZ2VuZGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZihnZW5kZXIudG9Mb3dlckNhc2UoKSA9PT0gJ21hbGUnKSB7XG4gICAgICAgICAgZ2VuZGVyID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGdlbmRlci50b0xvd2VyQ2FzZSgpID09PSAnZmVtYWxlJykge1xuICAgICAgICAgIGdlbmRlciA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBnZW5kZXIgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmKHR5cGVvZiBmYWtlci5kZWZpbml0aW9ucy5uYW1lLmZpcnN0X25hbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBnZW5kZXIgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy9GYWxsIGJhY2sgdG8gbm9uLWdlbmRlcmVkIG5hbWVzIGlmIHRoZXkgZXhpc3QgYW5kIGdlbmRlciB3YXNuJ3Qgc3BlY2lmaWVkXG4gICAgICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5maXJzdF9uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGdlbmRlciA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5uYW1lLm1hbGVfZmlyc3RfbmFtZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLm5hbWUuZmVtYWxlX2ZpcnN0X25hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5uYW1lLmZpcnN0X25hbWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBsYXN0TmFtZVxuICAgKlxuICAgKiBAbWV0aG9kIGxhc3ROYW1lXG4gICAqIEBwYXJhbSB7bWl4ZWR9IGdlbmRlclxuICAgKiBAbWVtYmVyb2YgZmFrZXIubmFtZVxuICAgKi9cbiAgdGhpcy5sYXN0TmFtZSA9IGZ1bmN0aW9uIChnZW5kZXIpIHtcbiAgICBpZiAodHlwZW9mIGZha2VyLmRlZmluaXRpb25zLm5hbWUubWFsZV9sYXN0X25hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGZha2VyLmRlZmluaXRpb25zLm5hbWUuZmVtYWxlX2xhc3RfbmFtZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gc29tZSBsb2NhbGUgZGF0YXNldHMgKCBsaWtlIHJ1ICkgaGF2ZSBsYXN0X25hbWUgc3BsaXQgYnkgZ2VuZGVyLiBpIGhhdmUgbm8gaWRlYSBob3cgbGFzdCBuYW1lcyBjYW4gaGF2ZSBnZW5kZXJzLCBidXQgYWxzbyBpIGRvIG5vdCBzcGVhayBydXNzaWFuXG4gICAgICAvLyBzZWUgYWJvdmUgY29tbWVudCBvZiBmaXJzdE5hbWUgbWV0aG9kXG4gICAgICBpZiAodHlwZW9mIGdlbmRlciAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgZ2VuZGVyID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDEpO1xuICAgICAgfVxuICAgICAgaWYgKGdlbmRlciA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5sb2NhbGVzW2Zha2VyLmxvY2FsZV0ubmFtZS5tYWxlX2xhc3RfbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5sb2NhbGVzW2Zha2VyLmxvY2FsZV0ubmFtZS5mZW1hbGVfbGFzdF9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5sYXN0X25hbWUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBtaWRkbGVOYW1lXG4gICAqXG4gICAqIEBtZXRob2QgbWlkZGxlTmFtZVxuICAgKiBAcGFyYW0ge21peGVkfSBnZW5kZXJcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMubWlkZGxlTmFtZSA9IGZ1bmN0aW9uIChnZW5kZXIpIHtcbiAgICBpZiAodHlwZW9mIGZha2VyLmRlZmluaXRpb25zLm5hbWUubWFsZV9taWRkbGVfbmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5mZW1hbGVfbWlkZGxlX25hbWUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICh0eXBlb2YgZ2VuZGVyICE9PSAnbnVtYmVyJykge1xuICAgICAgICBnZW5kZXIgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoMSk7XG4gICAgICB9XG4gICAgICBpZiAoZ2VuZGVyID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmxvY2FsZXNbZmFrZXIubG9jYWxlXS5uYW1lLm1hbGVfbWlkZGxlX25hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIubG9jYWxlc1tmYWtlci5sb2NhbGVdLm5hbWUuZmVtYWxlX21pZGRsZV9uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5taWRkbGVfbmFtZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGZpbmROYW1lXG4gICAqXG4gICAqIEBtZXRob2QgZmluZE5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0TmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFzdE5hbWVcbiAgICogQHBhcmFtIHttaXhlZH0gZ2VuZGVyXG4gICAqIEBtZW1iZXJvZiBmYWtlci5uYW1lXG4gICAqL1xuICB0aGlzLmZpbmROYW1lID0gZnVuY3Rpb24gKGZpcnN0TmFtZSwgbGFzdE5hbWUsIGdlbmRlcikge1xuICAgIHZhciByID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDgpO1xuICAgIHZhciBwcmVmaXgsIHN1ZmZpeDtcbiAgICAvLyBpbiBwYXJ0aWN1bGFyIGxvY2FsZXMgZmlyc3QgYW5kIGxhc3QgbmFtZXMgc3BsaXQgYnkgZ2VuZGVyLFxuICAgIC8vIHRodXMgd2Uga2VlcCBjb25zaXN0ZW5jeSBieSBwYXNzaW5nIDAgYXMgbWFsZSBhbmQgMSBhcyBmZW1hbGVcbiAgICBpZiAodHlwZW9mIGdlbmRlciAhPT0gJ251bWJlcicpIHtcbiAgICAgIGdlbmRlciA9IGZha2VyLmRhdGF0eXBlLm51bWJlcigxKTtcbiAgICB9XG4gICAgZmlyc3ROYW1lID0gZmlyc3ROYW1lIHx8IGZha2VyLm5hbWUuZmlyc3ROYW1lKGdlbmRlcik7XG4gICAgbGFzdE5hbWUgPSBsYXN0TmFtZSB8fCBmYWtlci5uYW1lLmxhc3ROYW1lKGdlbmRlcik7XG4gICAgc3dpdGNoIChyKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHByZWZpeCA9IGZha2VyLm5hbWUucHJlZml4KGdlbmRlcik7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgXCIgXCIgKyBmaXJzdE5hbWUgKyBcIiBcIiArIGxhc3ROYW1lO1xuICAgICAgICB9XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHN1ZmZpeCA9IGZha2VyLm5hbWUuc3VmZml4KGdlbmRlcik7XG4gICAgICAgIGlmIChzdWZmaXgpIHtcbiAgICAgICAgICByZXR1cm4gZmlyc3ROYW1lICsgXCIgXCIgKyBsYXN0TmFtZSArIFwiIFwiICsgc3VmZml4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0TmFtZSArIFwiIFwiICsgbGFzdE5hbWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIGpvYlRpdGxlXG4gICAqXG4gICAqIEBtZXRob2Qgam9iVGl0bGVcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMuam9iVGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICBmYWtlci5uYW1lLmpvYkRlc2NyaXB0b3IoKSArIFwiIFwiICtcbiAgICAgIGZha2VyLm5hbWUuam9iQXJlYSgpICsgXCIgXCIgK1xuICAgICAgZmFrZXIubmFtZS5qb2JUeXBlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGdlbmRlclxuICAgKlxuICAgKiBAbWV0aG9kIGdlbmRlclxuICAgKiBAbWVtYmVyb2YgZmFrZXIubmFtZVxuICAgKi9cbiAgdGhpcy5nZW5kZXIgPSBmdW5jdGlvbiAoYmluYXJ5KSB7XG4gICAgaWYgKGJpbmFyeSkge1xuICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5iaW5hcnlfZ2VuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5nZW5kZXIpO1xuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICAqIHByZWZpeFxuICAgKlxuICAgKiBAbWV0aG9kIHByZWZpeFxuICAgKiBAcGFyYW0ge21peGVkfSBnZW5kZXJcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMucHJlZml4ID0gZnVuY3Rpb24gKGdlbmRlcikge1xuICAgIGlmICh0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5tYWxlX3ByZWZpeCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5mZW1hbGVfcHJlZml4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGdlbmRlciAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgZ2VuZGVyID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKDEpO1xuICAgICAgfVxuICAgICAgaWYgKGdlbmRlciA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5sb2NhbGVzW2Zha2VyLmxvY2FsZV0ubmFtZS5tYWxlX3ByZWZpeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5sb2NhbGVzW2Zha2VyLmxvY2FsZV0ubmFtZS5mZW1hbGVfcHJlZml4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS5wcmVmaXgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzdWZmaXhcbiAgICpcbiAgICogQG1ldGhvZCBzdWZmaXhcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMuc3VmZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLm5hbWUuc3VmZml4KTtcbiAgfTtcblxuICAvKipcbiAgICogdGl0bGVcbiAgICpcbiAgICogQG1ldGhvZCB0aXRsZVxuICAgKiBAbWVtYmVyb2YgZmFrZXIubmFtZVxuICAgKi9cbiAgdGhpcy50aXRsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZXNjcmlwdG9yICA9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMubmFtZS50aXRsZS5kZXNjcmlwdG9yKSxcbiAgICAgIGxldmVsICAgICAgID0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5uYW1lLnRpdGxlLmxldmVsKSxcbiAgICAgIGpvYiAgICAgICAgID0gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5uYW1lLnRpdGxlLmpvYik7XG5cbiAgICByZXR1cm4gZGVzY3JpcHRvciArIFwiIFwiICsgbGV2ZWwgKyBcIiBcIiArIGpvYjtcbiAgfTtcblxuICAvKipcbiAgICogam9iRGVzY3JpcHRvclxuICAgKlxuICAgKiBAbWV0aG9kIGpvYkRlc2NyaXB0b3JcbiAgICogQG1lbWJlcm9mIGZha2VyLm5hbWVcbiAgICovXG4gIHRoaXMuam9iRGVzY3JpcHRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy5uYW1lLnRpdGxlLmRlc2NyaXB0b3IpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBqb2JBcmVhXG4gICAqXG4gICAqIEBtZXRob2Qgam9iQXJlYVxuICAgKiBAbWVtYmVyb2YgZmFrZXIubmFtZVxuICAgKi9cbiAgdGhpcy5qb2JBcmVhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLm5hbWUudGl0bGUubGV2ZWwpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBqb2JUeXBlXG4gICAqXG4gICAqIEBtZXRob2Qgam9iVHlwZVxuICAgKiBAbWVtYmVyb2YgZmFrZXIubmFtZVxuICAgKi9cbiAgdGhpcy5qb2JUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLm5hbWUudGl0bGUuam9iKTtcbiAgfTtcblxufVxuXG5tb2R1bGVbJ2V4cG9ydHMnXSA9IE5hbWU7XG4iLCIvKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLnBob25lXG4gKi9cbnZhciBQaG9uZSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLyoqXG4gICAqIHBob25lTnVtYmVyXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIucGhvbmUucGhvbmVOdW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFxuICAgKiBAbWVtYmVyT2YgZmFrZXIucGhvbmVcbiAgICovXG4gIHNlbGYucGhvbmVOdW1iZXIgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgZm9ybWF0ID0gZm9ybWF0IHx8IGZha2VyLnBob25lLnBob25lRm9ybWF0cygpO1xuICAgIHJldHVybiBmYWtlci5oZWxwZXJzLnJlcGxhY2VTeW1ib2xXaXRoTnVtYmVyKGZvcm1hdCk7XG4gIH07XG5cbiAgLy8gRklYTUU6IHRoaXMgaXMgc3RyYW5nZSBwYXNzaW5nIGluIGFuIGFycmF5IGluZGV4LlxuICAvKipcbiAgICogcGhvbmVOdW1iZXJGb3JtYXRcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5waG9uZS5waG9uZUZvcm1hdHNBcnJheUluZGV4XG4gICAqIEBwYXJhbSBwaG9uZUZvcm1hdHNBcnJheUluZGV4XG4gICAqIEBtZW1iZXJPZiBmYWtlci5waG9uZVxuICAgKi9cbiAgc2VsZi5waG9uZU51bWJlckZvcm1hdCA9IGZ1bmN0aW9uIChwaG9uZUZvcm1hdHNBcnJheUluZGV4KSB7XG4gICAgcGhvbmVGb3JtYXRzQXJyYXlJbmRleCA9IHBob25lRm9ybWF0c0FycmF5SW5kZXggfHwgMDtcbiAgICByZXR1cm4gZmFrZXIuaGVscGVycy5yZXBsYWNlU3ltYm9sV2l0aE51bWJlcihmYWtlci5kZWZpbml0aW9ucy5waG9uZV9udW1iZXIuZm9ybWF0c1twaG9uZUZvcm1hdHNBcnJheUluZGV4XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHBob25lRm9ybWF0c1xuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnBob25lLnBob25lRm9ybWF0c1xuICAgKi9cbiAgc2VsZi5waG9uZUZvcm1hdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMucGhvbmVfbnVtYmVyLmZvcm1hdHMpO1xuICB9O1xuICBcbiAgcmV0dXJuIHNlbGY7XG5cbn07XG5cbm1vZHVsZVsnZXhwb3J0cyddID0gUGhvbmU7XG4iLCIvKipcbiAqIE1ldGhvZCB0byByZWR1Y2UgYXJyYXkgb2YgY2hhcmFjdGVyc1xuICogQHBhcmFtIGFyciBleGlzdGluZyBhcnJheSBvZiBjaGFyYWN0ZXJzXG4gKiBAcGFyYW0gdmFsdWVzIGFycmF5IG9mIGNoYXJhY3RlcnMgd2hpY2ggc2hvdWxkIGJlIHJlbW92ZWRcbiAqIEByZXR1cm4geyp9IG5ldyBhcnJheSB3aXRob3V0IGJhbm5lZCBjaGFyYWN0ZXJzXG4gKi9cbnZhciBhcnJheVJlbW92ZSA9IGZ1bmN0aW9uIChhcnIsIHZhbHVlcykge1xuICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSl7XG4gICAgYXJyID0gYXJyLmZpbHRlcihmdW5jdGlvbihlbGUpe1xuICAgICAgcmV0dXJuIGVsZSAhPT0gdmFsdWU7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufTtcblxuLyoqXG4gKlxuICogQG5hbWVzcGFjZSBmYWtlci5yYW5kb21cbiAqL1xuZnVuY3Rpb24gUmFuZG9tIChmYWtlciwgc2VlZCkge1xuICAvLyBVc2UgYSB1c2VyIHByb3ZpZGVkIHNlZWQgaWYgaXQgaXMgYW4gYXJyYXkgb3IgbnVtYmVyXG4gIGlmIChBcnJheS5pc0FycmF5KHNlZWQpICYmIHNlZWQubGVuZ3RoKSB7XG4gICAgZmFrZXIubWVyc2VubmUuc2VlZF9hcnJheShzZWVkKTtcbiAgfVxuICBlbHNlIGlmKCFpc05hTihzZWVkKSkge1xuICAgIGZha2VyLm1lcnNlbm5lLnNlZWQoc2VlZCk7XG4gIH1cblxuICAvKipcbiAgICogQERlcHJlY2F0ZWRcbiAgICogcmV0dXJucyBhIHNpbmdsZSByYW5kb20gbnVtYmVyIGJhc2VkIG9uIGEgbWF4IG51bWJlciBvciByYW5nZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5udW1iZXJcbiAgICogQHBhcmFtIHttaXhlZH0gb3B0aW9ucyB7bWluLCBtYXgsIHByZWNpc2lvbn1cbiAgICovXG4gIHRoaXMubnVtYmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBjb25zb2xlLmxvZyhcIkRlcHJlY2F0aW9uIFdhcm5pbmc6IGZha2VyLnJhbmRvbS5udW1iZXIgaXMgbm93IGxvY2F0ZWQgaW4gZmFrZXIuZGF0YXR5cGUubnVtYmVyXCIpO1xuICAgIHJldHVybiBmYWtlci5kYXRhdHlwZS5udW1iZXIob3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBEZXByZWNhdGVkXG4gICAqIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGZsb2F0aW5nLXBvaW50IG51bWJlciBiYXNlZCBvbiBhIG1heCBudW1iZXIgb3IgcmFuZ2VcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5yYW5kb20uZmxvYXRcbiAgICogQHBhcmFtIHttaXhlZH0gb3B0aW9uc1xuICAgKi9cbiAgdGhpcy5mbG9hdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2coXCJEZXByZWNhdGlvbiBXYXJuaW5nOiBmYWtlci5yYW5kb20uZmxvYXQgaXMgbm93IGxvY2F0ZWQgaW4gZmFrZXIuZGF0YXR5cGUuZmxvYXRcIik7XG4gICAgcmV0dXJuIGZha2VyLmRhdGF0eXBlLmZsb2F0KG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiB0YWtlcyBhbiBhcnJheSBhbmQgcmV0dXJucyBhIHJhbmRvbSBlbGVtZW50IG9mIHRoZSBhcnJheVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnRcbiAgICogQHBhcmFtIHthcnJheX0gYXJyYXlcbiAgICovXG4gIHRoaXMuYXJyYXlFbGVtZW50ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgYXJyYXkgPSBhcnJheSB8fCBbXCJhXCIsIFwiYlwiLCBcImNcIl07XG4gICAgdmFyIHIgPSBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtYXg6IGFycmF5Lmxlbmd0aCAtIDEgfSk7XG4gICAgcmV0dXJuIGFycmF5W3JdO1xuICB9O1xuXG4gIC8qKlxuICAgKiB0YWtlcyBhbiBhcnJheSBhbmQgcmV0dXJucyBhIHN1YnNldCB3aXRoIHJhbmRvbSBlbGVtZW50cyBvZiB0aGUgYXJyYXlcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50c1xuICAgKiBAcGFyYW0ge2FycmF5fSBhcnJheVxuICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHBpY2tcbiAgICovXG4gIHRoaXMuYXJyYXlFbGVtZW50cyA9IGZ1bmN0aW9uIChhcnJheSwgY291bnQpIHtcbiAgICBhcnJheSA9IGFycmF5IHx8IFtcImFcIiwgXCJiXCIsIFwiY1wiXTtcblxuICAgIGlmICh0eXBlb2YgY291bnQgIT09ICdudW1iZXInKSB7XG4gICAgICBjb3VudCA9IGZha2VyLmRhdGF0eXBlLm51bWJlcih7IG1pbjogMSwgbWF4OiBhcnJheS5sZW5ndGggfSk7XG4gICAgfSBlbHNlIGlmIChjb3VudCA+IGFycmF5Lmxlbmd0aCkge1xuICAgICAgY291bnQgPSBhcnJheS5sZW5ndGg7XG4gICAgfSBlbHNlIGlmIChjb3VudCA8IDApIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG5cbiAgICB2YXIgYXJyYXlDb3B5ID0gYXJyYXkuc2xpY2UoMCk7XG4gICAgdmFyIGkgPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIG1pbiA9IGkgLSBjb3VudDtcbiAgICB2YXIgdGVtcDtcbiAgICB2YXIgaW5kZXg7XG5cbiAgICB3aGlsZSAoaS0tID4gbWluKSB7XG4gICAgICBpbmRleCA9IE1hdGguZmxvb3IoKGkgKyAxKSAqIGZha2VyLmRhdGF0eXBlLmZsb2F0KHsgbWluOiAwLCBtYXg6IDAuOTkgfSkpO1xuICAgICAgdGVtcCA9IGFycmF5Q29weVtpbmRleF07XG4gICAgICBhcnJheUNvcHlbaW5kZXhdID0gYXJyYXlDb3B5W2ldO1xuICAgICAgYXJyYXlDb3B5W2ldID0gdGVtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlDb3B5LnNsaWNlKG1pbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIHRha2VzIGFuIG9iamVjdCBhbmQgcmV0dXJucyBhIHJhbmRvbSBrZXkgb3IgdmFsdWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5yYW5kb20ub2JqZWN0RWxlbWVudFxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gICAqIEBwYXJhbSB7bWl4ZWR9IGZpZWxkXG4gICAqL1xuICB0aGlzLm9iamVjdEVsZW1lbnQgPSBmdW5jdGlvbiAob2JqZWN0LCBmaWVsZCkge1xuICAgIG9iamVjdCA9IG9iamVjdCB8fCB7IFwiZm9vXCI6IFwiYmFyXCIsIFwidG9vXCI6IFwiY2FyXCIgfTtcbiAgICB2YXIgYXJyYXkgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIHZhciBrZXkgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGFycmF5KTtcblxuICAgIHJldHVybiBmaWVsZCA9PT0gXCJrZXlcIiA/IGtleSA6IG9iamVjdFtrZXldO1xuICB9O1xuXG4gIC8qKlxuICAgKiBARGVwcmVjYXRlZFxuICAgKiB1dWlkXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIucmFuZG9tLnV1aWRcbiAgICovXG4gIHRoaXMudXVpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkRlcHJlY2F0aW9uIFdhcm5pbmc6IGZha2VyLnJhbmRvbS51dWlkIGlzIG5vdyBsb2NhdGVkIGluIGZha2VyLmRhdGF0eXBlLnV1aWRcIik7XG4gICAgcmV0dXJuIGZha2VyLmRhdGF0eXBlLnV1aWQoKTtcbiAgfTtcblxuICAvKipcbiAgICogYm9vbGVhblxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5ib29sZWFuXG4gICAqL1xuICB0aGlzLmJvb2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJEZXByZWNhdGlvbiBXYXJuaW5nOiBmYWtlci5yYW5kb20uYm9vbGVhbiBpcyBub3cgbG9jYXRlZCBpbiBmYWtlci5kYXRhdHlwZS5ib29sZWFuXCIpO1xuICAgIHJldHVybiBmYWtlci5kYXRhdHlwZS5ib29sZWFuKCk7XG4gIH07XG5cbiAgLy8gVE9ETzogaGF2ZSBhYmlsaXR5IHRvIHJldHVybiBzcGVjaWZpYyB0eXBlIG9mIHdvcmQ/IEFzIGluOiBub3VuLCBhZGplY3RpdmUsIHZlcmIsIGV0Y1xuICAvKipcbiAgICogd29yZFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS53b3JkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICB0aGlzLndvcmQgPSBmdW5jdGlvbiByYW5kb21Xb3JkICh0eXBlKSB7XG5cbiAgICB2YXIgd29yZE1ldGhvZHMgPSBbXG4gICAgICAnY29tbWVyY2UuZGVwYXJ0bWVudCcsXG4gICAgICAnY29tbWVyY2UucHJvZHVjdE5hbWUnLFxuICAgICAgJ2NvbW1lcmNlLnByb2R1Y3RBZGplY3RpdmUnLFxuICAgICAgJ2NvbW1lcmNlLnByb2R1Y3RNYXRlcmlhbCcsXG4gICAgICAnY29tbWVyY2UucHJvZHVjdCcsXG4gICAgICAnY29tbWVyY2UuY29sb3InLFxuXG4gICAgICAnY29tcGFueS5jYXRjaFBocmFzZUFkamVjdGl2ZScsXG4gICAgICAnY29tcGFueS5jYXRjaFBocmFzZURlc2NyaXB0b3InLFxuICAgICAgJ2NvbXBhbnkuY2F0Y2hQaHJhc2VOb3VuJyxcbiAgICAgICdjb21wYW55LmJzQWRqZWN0aXZlJyxcbiAgICAgICdjb21wYW55LmJzQnV6eicsXG4gICAgICAnY29tcGFueS5ic05vdW4nLFxuICAgICAgJ2FkZHJlc3Muc3RyZWV0U3VmZml4JyxcbiAgICAgICdhZGRyZXNzLmNvdW50eScsXG4gICAgICAnYWRkcmVzcy5jb3VudHJ5JyxcbiAgICAgICdhZGRyZXNzLnN0YXRlJyxcblxuICAgICAgJ2ZpbmFuY2UuYWNjb3VudE5hbWUnLFxuICAgICAgJ2ZpbmFuY2UudHJhbnNhY3Rpb25UeXBlJyxcbiAgICAgICdmaW5hbmNlLmN1cnJlbmN5TmFtZScsXG5cbiAgICAgICdoYWNrZXIubm91bicsXG4gICAgICAnaGFja2VyLnZlcmInLFxuICAgICAgJ2hhY2tlci5hZGplY3RpdmUnLFxuICAgICAgJ2hhY2tlci5pbmd2ZXJiJyxcbiAgICAgICdoYWNrZXIuYWJicmV2aWF0aW9uJyxcblxuICAgICAgJ25hbWUuam9iRGVzY3JpcHRvcicsXG4gICAgICAnbmFtZS5qb2JBcmVhJyxcbiAgICAgICduYW1lLmpvYlR5cGUnXTtcblxuICAgIC8vIHJhbmRvbWx5IHBpY2sgZnJvbSB0aGUgbWFueSBmYWtlciBtZXRob2RzIHRoYXQgY2FuIGdlbmVyYXRlIHdvcmRzXG4gICAgdmFyIHJhbmRvbVdvcmRNZXRob2QgPSBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHdvcmRNZXRob2RzKTtcbiAgICB2YXIgcmVzdWx0ID0gZmFrZXIuZmFrZSgne3snICsgcmFuZG9tV29yZE1ldGhvZCArICd9fScpO1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHJlc3VsdC5zcGxpdCgnICcpKTtcbiAgfTtcblxuICAvKipcbiAgICogcmFuZG9tV29yZHNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5yYW5kb20ud29yZHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IGRlZmF1bHRzIHRvIGEgcmFuZG9tIHZhbHVlIGJldHdlZW4gMSBhbmQgM1xuICAgKi9cbiAgdGhpcy53b3JkcyA9IGZ1bmN0aW9uIHJhbmRvbVdvcmRzIChjb3VudCkge1xuICAgIHZhciB3b3JkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNvdW50ID0gZmFrZXIuZGF0YXR5cGUubnVtYmVyKHttaW46MSwgbWF4OiAzfSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpPGNvdW50OyBpKyspIHtcbiAgICAgIHdvcmRzLnB1c2goZmFrZXIucmFuZG9tLndvcmQoKSk7XG4gICAgfVxuICAgIHJldHVybiB3b3Jkcy5qb2luKCcgJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGxvY2FsZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5pbWFnZVxuICAgKi9cbiAgdGhpcy5pbWFnZSA9IGZ1bmN0aW9uIHJhbmRvbUltYWdlICgpIHtcbiAgICByZXR1cm4gZmFrZXIuaW1hZ2UuaW1hZ2UoKTtcbiAgfTtcblxuICAvKipcbiAgICogbG9jYWxlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIucmFuZG9tLmxvY2FsZVxuICAgKi9cbiAgdGhpcy5sb2NhbGUgPSBmdW5jdGlvbiByYW5kb21Mb2NhbGUgKCkge1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KE9iamVjdC5rZXlzKGZha2VyLmxvY2FsZXMpKTtcbiAgfTtcblxuICAvKipcbiAgICogYWxwaGEuIHJldHVybnMgbG93ZXIvdXBwZXIgYWxwaGEgY2hhcmFjdGVycyBiYXNlZCBjb3VudCBhbmQgdXBjYXNlIG9wdGlvbnNcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5yYW5kb20uYWxwaGFcbiAgICogQHBhcmFtIHttaXhlZH0gb3B0aW9ucyAvLyBkZWZhdWx0cyB0byB7IGNvdW50OiAxLCB1cGNhc2U6IGZhbHNlLCBiYW5uZWRDaGFyczogW10gfVxuICAgKi9cbiAgdGhpcy5hbHBoYSA9IGZ1bmN0aW9uIGFscGhhKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGNvdW50OiAxXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGNvdW50OiBvcHRpb25zLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmNvdW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBvcHRpb25zLmNvdW50ID0gMTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudXBjYXNlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBvcHRpb25zLnVwY2FzZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYmFubmVkQ2hhcnMgPT09XCJ1bmRlZmluZWRcIil7XG4gICAgICBvcHRpb25zLmJhbm5lZENoYXJzID0gW107XG4gICAgfVxuXG4gICAgdmFyIHdob2xlU3RyaW5nID0gXCJcIjtcbiAgICB2YXIgY2hhcnNBcnJheSA9IFtcImFcIiwgXCJiXCIsIFwiY1wiLCBcImRcIiwgXCJlXCIsIFwiZlwiLCBcImdcIiwgXCJoXCIsIFwiaVwiLCBcImpcIiwgXCJrXCIsIFwibFwiLCBcIm1cIiwgXCJuXCIsIFwib1wiLCBcInBcIiwgXCJxXCIsIFwiclwiLCBcInNcIiwgXCJ0XCIsIFwidVwiLCBcInZcIiwgXCJ3XCIsIFwieFwiLCBcInlcIiwgXCJ6XCJdO1xuICAgIGlmKG9wdGlvbnMuYmFubmVkQ2hhcnMpe1xuICAgICAgY2hhcnNBcnJheSA9IGFycmF5UmVtb3ZlKGNoYXJzQXJyYXksb3B0aW9ucy5iYW5uZWRDaGFycyk7XG4gICAgfVxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmNvdW50OyBpKyspIHtcbiAgICAgIHdob2xlU3RyaW5nICs9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoY2hhcnNBcnJheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnMudXBjYXNlID8gd2hvbGVTdHJpbmcudG9VcHBlckNhc2UoKSA6IHdob2xlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIGFscGhhTnVtZXJpY1xuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5hbHBoYU51bWVyaWNcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IGRlZmF1bHRzIHRvIDFcbiAgICoge21peGVkfSBvcHRpb25zIC8vIGRlZmF1bHRzIHRvIHsgYmFubmVkQ2hhcnM6IFtdIH1cbiAgICogb3B0aW9ucy5iYW5uZWRDaGFycyAtIGFycmF5IG9mIGNoYXJhY3RlcnMgd2hpY2ggc2hvdWxkIGJlIGJhbm5lZCBpbiBuZXcgc3RyaW5nXG4gICAqL1xuICB0aGlzLmFscGhhTnVtZXJpYyA9IGZ1bmN0aW9uIGFscGhhTnVtZXJpYyhjb3VudCwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgY291bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNvdW50ID0gMTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PVwidW5kZWZpbmVkXCIpe1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYmFubmVkQ2hhcnMgPT09XCJ1bmRlZmluZWRcIil7XG4gICAgICBvcHRpb25zLmJhbm5lZENoYXJzID0gW107XG4gICAgfVxuXG4gICAgdmFyIHdob2xlU3RyaW5nID0gXCJcIjtcbiAgICB2YXIgY2hhcnNBcnJheSA9IFtcIjBcIiwgXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCJhXCIsIFwiYlwiLCBcImNcIiwgXCJkXCIsIFwiZVwiLCBcImZcIiwgXCJnXCIsIFwiaFwiLCBcImlcIiwgXCJqXCIsIFwia1wiLCBcImxcIiwgXCJtXCIsIFwiblwiLCBcIm9cIiwgXCJwXCIsIFwicVwiLCBcInJcIiwgXCJzXCIsIFwidFwiLCBcInVcIiwgXCJ2XCIsIFwid1wiLCBcInhcIiwgXCJ5XCIsIFwielwiXVxuICAgIGlmKG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLmJhbm5lZENoYXJzKSB7XG4gICAgICAgIGNoYXJzQXJyYXkgPSBhcnJheVJlbW92ZShjaGFyc0FycmF5LCBvcHRpb25zLmJhbm5lZENoYXJzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIHdob2xlU3RyaW5nICs9IGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoY2hhcnNBcnJheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdob2xlU3RyaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBARGVwcmVjYXRlZFxuICAgKiBoZXhhRGVjaW1hbFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnJhbmRvbS5oZXhhRGVjaW1hbFxuICAgKiBAcGFyYW0ge251bWJlcn0gY291bnQgZGVmYXVsdHMgdG8gMVxuICAgKi9cbiAgdGhpcy5oZXhhRGVjaW1hbCA9IGZ1bmN0aW9uIGhleGFEZWNpbWFsKGNvdW50KSB7XG4gICAgY29uc29sZS5sb2coXCJEZXByZWNhdGlvbiBXYXJuaW5nOiBmYWtlci5yYW5kb20uaGV4YURlY2ltYWwgaXMgbm93IGxvY2F0ZWQgaW4gZmFrZXIuZGF0YXR5cGUuaGV4YURlY2ltYWxcIik7XG4gICAgcmV0dXJuIGZha2VyLmRhdGF0eXBlLmhleGFEZWNpbWFsKGNvdW50KTtcbiAgfTtcblxuICByZXR1cm4gdGhpcztcblxufVxuXG5tb2R1bGVbJ2V4cG9ydHMnXSA9IFJhbmRvbTtcbiIsIi8vIGdlbmVyYXRlcyBmYWtlIGRhdGEgZm9yIG1hbnkgY29tcHV0ZXIgc3lzdGVtcyBwcm9wZXJ0aWVzXG5cbnZhciBjb21tb25GaWxlVHlwZXMgPSBbXG4gIFwidmlkZW9cIixcbiAgXCJhdWRpb1wiLFxuICBcImltYWdlXCIsXG4gIFwidGV4dFwiLFxuICBcImFwcGxpY2F0aW9uXCJcbl07XG5cbnZhciBjb21tb25NaW1lVHlwZXMgPSBbXG4gIFwiYXBwbGljYXRpb24vcGRmXCIsXG4gIFwiYXVkaW8vbXBlZ1wiLFxuICBcImF1ZGlvL3dhdlwiLFxuICBcImltYWdlL3BuZ1wiLFxuICBcImltYWdlL2pwZWdcIixcbiAgXCJpbWFnZS9naWZcIixcbiAgXCJ2aWRlby9tcDRcIixcbiAgXCJ2aWRlby9tcGVnXCIsXG4gIFwidGV4dC9odG1sXCJcbl07XG5cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIC8vIHNob3J0Y3V0IGlmIEFycmF5LmZyb20gaXMgYXZhaWxhYmxlXG4gIGlmIChBcnJheS5mcm9tKSB7IHJldHVybiBBcnJheS5mcm9tKHNldCk7IH1cblxuICB2YXIgYXJyYXkgPSBbXTtcbiAgc2V0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICB9KTtcbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLnN5c3RlbVxuICovXG5mdW5jdGlvbiBTeXN0ZW0oZmFrZXIpIHtcblxuICAvKipcbiAgICogZ2VuZXJhdGVzIGEgZmlsZSBuYW1lXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuc3lzdGVtLmZpbGVOYW1lXG4gICAqL1xuICB0aGlzLmZpbGVOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSBmYWtlci5yYW5kb20ud29yZHMoKTsgXG4gICAgc3RyID0gc3RyXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAucmVwbGFjZSgvXFxXL2csIFwiX1wiKSArIFwiLlwiICsgZmFrZXIuc3lzdGVtLmZpbGVFeHQoKTs7XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICAvKipcbiAgICogY29tbW9uRmlsZU5hbWVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uY29tbW9uRmlsZU5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4dFxuICAgKi9cbiAgdGhpcy5jb21tb25GaWxlTmFtZSA9IGZ1bmN0aW9uIChleHQpIHtcbiAgICB2YXIgc3RyID0gZmFrZXIucmFuZG9tLndvcmRzKCk7XG4gICAgc3RyID0gc3RyXG4gICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAucmVwbGFjZSgvXFxXL2csIFwiX1wiKTtcbiAgICBzdHIgKz0gXCIuXCIgKyAoZXh0IHx8IGZha2VyLnN5c3RlbS5jb21tb25GaWxlRXh0KCkpO1xuICAgIHJldHVybiBzdHI7XG4gIH07XG5cbiAgLyoqXG4gICAqIG1pbWVUeXBlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuc3lzdGVtLm1pbWVUeXBlXG4gICAqL1xuICB0aGlzLm1pbWVUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0eXBlU2V0ID0gbmV3IFNldCgpO1xuICAgIHZhciBleHRlbnNpb25TZXQgPSBuZXcgU2V0KCk7XG4gICAgdmFyIG1pbWVUeXBlcyA9IGZha2VyLmRlZmluaXRpb25zLnN5c3RlbS5taW1lVHlwZXM7XG5cbiAgICBPYmplY3Qua2V5cyhtaW1lVHlwZXMpLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgIHZhciB0eXBlID0gbS5zcGxpdChcIi9cIilbMF07XG5cbiAgICAgIHR5cGVTZXQuYWRkKHR5cGUpO1xuXG4gICAgICBpZiAobWltZVR5cGVzW21dLmV4dGVuc2lvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBtaW1lVHlwZXNbbV0uZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgICBleHRlbnNpb25TZXQuYWRkKGV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR5cGVzID0gc2V0VG9BcnJheSh0eXBlU2V0KTtcbiAgICB2YXIgZXh0ZW5zaW9ucyA9IHNldFRvQXJyYXkoZXh0ZW5zaW9uU2V0KTtcbiAgICB2YXIgbWltZVR5cGVLZXlzID0gT2JqZWN0LmtleXMoZmFrZXIuZGVmaW5pdGlvbnMuc3lzdGVtLm1pbWVUeXBlcyk7XG5cbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChtaW1lVHlwZUtleXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgY29tbW9ubHkgdXNlZCBmaWxlIHR5cGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uY29tbW9uRmlsZVR5cGVcbiAgICovXG4gIHRoaXMuY29tbW9uRmlsZVR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoY29tbW9uRmlsZVR5cGVzKTtcbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJucyBhIGNvbW1vbmx5IHVzZWQgZmlsZSBleHRlbnNpb25cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uY29tbW9uRmlsZUV4dFxuICAgKi9cbiAgdGhpcy5jb21tb25GaWxlRXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlci5zeXN0ZW0uZmlsZUV4dChmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGNvbW1vbk1pbWVUeXBlcykpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIHJldHVybnMgYW55IGZpbGUgdHlwZSBhdmFpbGFibGUgYXMgbWltZS10eXBlXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIuc3lzdGVtLmZpbGVUeXBlXG4gICAqL1xuICB0aGlzLmZpbGVUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0eXBlU2V0ID0gbmV3IFNldCgpO1xuICAgIHZhciBleHRlbnNpb25TZXQgPSBuZXcgU2V0KCk7XG4gICAgdmFyIG1pbWVUeXBlcyA9IGZha2VyLmRlZmluaXRpb25zLnN5c3RlbS5taW1lVHlwZXM7XG5cbiAgICBPYmplY3Qua2V5cyhtaW1lVHlwZXMpLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgIHZhciB0eXBlID0gbS5zcGxpdChcIi9cIilbMF07XG5cbiAgICAgIHR5cGVTZXQuYWRkKHR5cGUpO1xuXG4gICAgICBpZiAobWltZVR5cGVzW21dLmV4dGVuc2lvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBtaW1lVHlwZXNbbV0uZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgICBleHRlbnNpb25TZXQuYWRkKGV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR5cGVzID0gc2V0VG9BcnJheSh0eXBlU2V0KTtcbiAgICB2YXIgZXh0ZW5zaW9ucyA9IHNldFRvQXJyYXkoZXh0ZW5zaW9uU2V0KTtcbiAgICB2YXIgbWltZVR5cGVLZXlzID0gT2JqZWN0LmtleXMoZmFrZXIuZGVmaW5pdGlvbnMuc3lzdGVtLm1pbWVUeXBlcyk7XG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQodHlwZXMpO1xuXG4gIH07XG5cbiAgLyoqXG4gICAqIGZpbGVFeHRcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uZmlsZUV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWltZVR5cGVcbiAgICovXG4gIHRoaXMuZmlsZUV4dCA9IGZ1bmN0aW9uIChtaW1lVHlwZSkge1xuICAgIHZhciB0eXBlU2V0ID0gbmV3IFNldCgpO1xuICAgIHZhciBleHRlbnNpb25TZXQgPSBuZXcgU2V0KCk7XG4gICAgdmFyIG1pbWVUeXBlcyA9IGZha2VyLmRlZmluaXRpb25zLnN5c3RlbS5taW1lVHlwZXM7XG5cbiAgICBPYmplY3Qua2V5cyhtaW1lVHlwZXMpLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgIHZhciB0eXBlID0gbS5zcGxpdChcIi9cIilbMF07XG5cbiAgICAgIHR5cGVTZXQuYWRkKHR5cGUpO1xuXG4gICAgICBpZiAobWltZVR5cGVzW21dLmV4dGVuc2lvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBtaW1lVHlwZXNbbV0uZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgICBleHRlbnNpb25TZXQuYWRkKGV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHR5cGVzID0gc2V0VG9BcnJheSh0eXBlU2V0KTtcbiAgICB2YXIgZXh0ZW5zaW9ucyA9IHNldFRvQXJyYXkoZXh0ZW5zaW9uU2V0KTtcbiAgICB2YXIgbWltZVR5cGVLZXlzID0gT2JqZWN0LmtleXMoZmFrZXIuZGVmaW5pdGlvbnMuc3lzdGVtLm1pbWVUeXBlcyk7XG5cbiAgICBpZiAobWltZVR5cGUpIHtcbiAgICAgIHZhciBtaW1lcyA9IGZha2VyLmRlZmluaXRpb25zLnN5c3RlbS5taW1lVHlwZXM7XG4gICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChtaW1lc1ttaW1lVHlwZV0uZXh0ZW5zaW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZXh0ZW5zaW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybnMgZGlyZWN0b3J5IHBhdGhcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uZGlyZWN0b3J5UGF0aFxuICAgKi9cbiAgdGhpcy5kaXJlY3RvcnlQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXRocyA9IGZha2VyLmRlZmluaXRpb25zLnN5c3RlbS5kaXJlY3RvcnlQYXRoc1xuICAgIHJldHVybiBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHBhdGhzKTtcbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJucyBmaWxlIHBhdGhcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci5zeXN0ZW0uZmlsZVBhdGhcbiAgICovXG4gIHRoaXMuZmlsZVBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZha2VyLmZha2UoXCJ7e3N5c3RlbS5kaXJlY3RvcnlQYXRofX0ve3tzeXN0ZW0uZmlsZU5hbWV9fS57e3N5c3RlbS5maWxlRXh0fX1cIik7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNlbXZlclxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnN5c3RlbS5zZW12ZXJcbiAgICovXG4gIHRoaXMuc2VtdmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpLFxuICAgICAgZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpLFxuICAgICAgZmFrZXIuZGF0YXR5cGUubnVtYmVyKDkpXS5qb2luKCcuJyk7XG4gIH1cblxufVxuXG5tb2R1bGVbJ2V4cG9ydHMnXSA9IFN5c3RlbTtcbiIsIi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXIudGltZVxuICovXG52YXIgX1RpbWUgPSBmdW5jdGlvbihmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLyoqXG4gICAqIHJlY2VudFxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnRpbWUucmVjZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvdXRwdXRUeXBlIC0gJ2FiYnInIHx8ICd3aWRlJyB8fCAndW5peCcgKGRlZmF1bHQgY2hvaWNlKVxuICAgKi9cbiAgc2VsZi5yZWNlbnQgPSBmdW5jdGlvbihvdXRwdXRUeXBlKSB7XG4gICAgaWYgKHR5cGVvZiBvdXRwdXRUeXBlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBvdXRwdXRUeXBlID0gJ3VuaXgnO1xuICAgIH1cblxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBzd2l0Y2ggKG91dHB1dFR5cGUpIHtcbiAgICAgIGNhc2UgXCJhYmJyXCI6XG4gICAgICAgIGRhdGUgPSBkYXRlLnRvTG9jYWxlVGltZVN0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3aWRlXCI6XG4gICAgICAgIGRhdGUgPSBkYXRlLnRvVGltZVN0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ1bml4XCI6XG4gICAgICAgIGRhdGUgPSBkYXRlLmdldFRpbWUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufTtcblxubW9kdWxlW1wiZXhwb3J0c1wiXSA9IF9UaW1lO1xuIiwidmFyIHVuaXF1ZUV4ZWMgPSByZXF1aXJlKCcuLi92ZW5kb3IvdW5pcXVlJyk7XG4vKipcbiAqXG4gKiBAbmFtZXNwYWNlIGZha2VyLnVuaXF1ZVxuICovXG5mdW5jdGlvbiBVbmlxdWUgKGZha2VyKSB7XG5cbiAgLy8gaW5pdGlhbGl6ZSB1bmlxdWUgbW9kdWxlIGNsYXNzIHZhcmlhYmxlc1xuXG4gIC8vIG1heGltdW0gdGltZSB1bmlxdWUuZXhlYyB3aWxsIGF0dGVtcHQgdG8gcnVuIGJlZm9yZSBhYm9ydGluZ1xuICB2YXIgbWF4VGltZSA9IDEwO1xuXG4gIC8vIG1heGltdW0gcmV0cmllcyB1bmlxdWUuZXhlYyB3aWxsIHJlY3Vyc2UgYmVmb3JlIGFib3J0aW5ncyAoIG1heCBsb29wIGRlcHRoIClcbiAgdmFyIG1heFJldHJpZXMgPSAxMDtcblxuICAvLyB0aW1lIHRoZSBzY3JpcHQgc3RhcnRlZFxuICAvLyB2YXIgc3RhcnRUaW1lID0gMDtcblxuICAvKipcbiAgICogdW5pcXVlXG4gICAqXG4gICAqIEBtZXRob2QgdW5pcXVlXG4gICAqL1xuICB0aGlzLnVuaXF1ZSA9IGZ1bmN0aW9uIHVuaXF1ZSAobWV0aG9kLCBhcmdzLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgb3B0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAodHlwZW9mIG9wdHMubWF4VGltZSAhPT0gJ251bWJlcicpIHtcbiAgICAgIG9wdHMubWF4VGltZSA9IG1heFRpbWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0cy5tYXhSZXRyaWVzICE9PSAnbnVtYmVyJykge1xuICAgICAgb3B0cy5tYXhSZXRyaWVzID0gbWF4UmV0cmllcztcbiAgICB9XG4gICAgb3B0cy5jdXJyZW50SXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIHVuaXF1ZUV4ZWMuZXhlYyhtZXRob2QsIGFyZ3MsIG9wdHMpO1xuICB9XG59XG5cbm1vZHVsZVsnZXhwb3J0cyddID0gVW5pcXVlOyIsIi8qKlxuICpcbiAqIEBuYW1lc3BhY2UgZmFrZXIudmVoaWNsZVxuICovXG52YXIgVmVoaWNsZSA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBmYWtlID0gZmFrZXIuZmFrZTtcblxuICAvKipcbiAgICogdmVoaWNsZVxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnZlaGljbGUudmVoaWNsZVxuICAgKi9cbiAgc2VsZi52ZWhpY2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWtlKCd7e3ZlaGljbGUubWFudWZhY3R1cmVyfX0ge3t2ZWhpY2xlLm1vZGVsfX0nKTtcbiAgfTtcblxuICBzZWxmLnZlaGljbGUuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSByYW5kb20gdmVoaWNsZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiQk1XIEV4cGxvcmVyXCIsIFwiRm9yZCBDYW1yeVwiLCBcIkxhbWJvcmdoaW5pIFJhbmNoZXJvXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIG1hbnVmYWN0dXJlclxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLnZlaGljbGUubWFudWZhY3R1cmVyXG4gICAqL1xuICBzZWxmLm1hbnVmYWN0dXJlciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy52ZWhpY2xlLm1hbnVmYWN0dXJlcik7XG4gIH07XG5cbiAgc2VsZi5tYW51ZmFjdHVyZXIuc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSBtYW51ZmFjdHVyZXIgbmFtZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiRm9yZFwiLCBcIkplZXBcIiwgXCJUZXNsYVwiXVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIG1vZGVsXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIudmVoaWNsZS5tb2RlbFxuICAgKi9cbiAgc2VsZi5tb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy52ZWhpY2xlLm1vZGVsKTtcbiAgfTtcblxuICBzZWxmLm1vZGVsLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgdmVoaWNsZSBtb2RlbC5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiRXhwbG9yZXJcIiwgXCJDYW1yeVwiLCBcIlJhbmNoZXJvXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIHR5cGVcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci52ZWhpY2xlLnR5cGVcbiAgICovXG4gIHNlbGYudHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy52ZWhpY2xlLnR5cGUpO1xuICB9O1xuXG4gIHNlbGYudHlwZS5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHZlaGljbGUgdHlwZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiQ291cGVcIiwgXCJDb252ZXJ0YWJsZVwiLCBcIlNlZGFuXCIsIFwiU1VWXCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIGZ1ZWxcbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci52ZWhpY2xlLmZ1ZWxcbiAgICovXG4gIHNlbGYuZnVlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy52ZWhpY2xlLmZ1ZWwpO1xuICB9O1xuXG4gIHNlbGYuZnVlbC5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIGZ1ZWwgdHlwZS5cIixcbiAgICBcInNhbXBsZVJlc3VsdHNcIjogW1wiRWxlY3RyaWNcIiwgXCJHYXNvbGluZVwiLCBcIkRpZXNlbFwiXVxuICB9O1xuXG4gIC8qKlxuICAgKiB2aW5cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci52ZWhpY2xlLnZpblxuICAgKi9cbiAgc2VsZi52aW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJhbm5lZENoYXJzPVsnbycsJ2knLCdxJ107XG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hbHBoYU51bWVyaWMoMTAsIHtiYW5uZWRDaGFyczpiYW5uZWRDaGFyc30pICtcbiAgICAgIGZha2VyLnJhbmRvbS5hbHBoYSh7IGNvdW50OiAxLCB1cGNhc2U6IHRydWUgLGJhbm5lZENoYXJzOmJhbm5lZENoYXJzfSkgK1xuICAgICAgZmFrZXIucmFuZG9tLmFscGhhTnVtZXJpYygxLCB7YmFubmVkQ2hhcnM6YmFubmVkQ2hhcnN9KSArXG4gICAgICBmYWtlci5kYXRhdHlwZS5udW1iZXIoeyBtaW46IDEwMDAwLCBtYXg6IDEwMDAwMH0pIC8vIHJldHVybiBmaXZlIGRpZ2l0ICNcbiAgICApLnRvVXBwZXJDYXNlKCk7XG4gIH07XG5cbiAgc2VsZi52aW4uc2NoZW1hID0ge1xuICAgIFwiZGVzY3JpcHRpb25cIjogXCJHZW5lcmF0ZXMgYSB2YWxpZCBWSU4gbnVtYmVyLlwiLFxuICAgIFwic2FtcGxlUmVzdWx0c1wiOiBbXCJZVjFNSDY4Mjc2MjE4NDY1NFwiLCBcIjNDN1dSTUJKMkVHMjA4ODM2XCJdXG4gIH07XG5cbiAgLyoqXG4gICAqIGNvbG9yXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIudmVoaWNsZS5jb2xvclxuICAgKi9cbiAgc2VsZi5jb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZSgne3tjb21tZXJjZS5jb2xvcn19Jyk7XG4gIH07XG5cbiAgc2VsZi5jb2xvci5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIGNvbG9yXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcInJlZFwiLCBcIndoaXRlXCIsIFwiYmxhY2tcIl1cbiAgfTtcblxuICAvKipcbiAgICAgKiB2cm1cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZmFrZXIudmVoaWNsZS52cm1cbiAgICAgKi9cbiAgc2VsZi52cm0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hbHBoYSh7IGNvdW50OiAyLCB1cGNhc2U6IHRydWUgfSkgK1xuICAgICAgICAgICAgZmFrZXIuZGF0YXR5cGUubnVtYmVyKHsgbWluOiAwLCBtYXg6IDkgfSkgK1xuICAgICAgICAgICAgZmFrZXIuZGF0YXR5cGUubnVtYmVyKHsgbWluOiAwLCBtYXg6IDkgfSkgK1xuICAgICAgICAgICAgZmFrZXIucmFuZG9tLmFscGhhKHsgY291bnQ6IDMsIHVwY2FzZTogdHJ1ZSB9KVxuICAgICkudG9VcHBlckNhc2UoKTtcbiAgfTtcblxuICBzZWxmLnZybS5zY2hlbWEgPSB7XG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIkdlbmVyYXRlcyBhIHZlaGljbGUgdnJtXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIk1GNTZVUEFcIiwgXCJHTDE5QUFRXCIsIFwiU0YyMFRUQVwiXVxuICB9O1xuXG4gIC8qKlxuICAqIGJpY3ljbGVcbiAgKlxuICAqIEBtZXRob2QgZmFrZXIudmVoaWNsZS5iaWN5Y2xlXG4gICovXG4gIHNlbGYuYmljeWNsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy52ZWhpY2xlLmJpY3ljbGVfdHlwZSk7XG4gIH07XG5cbiAgc2VsZi5iaWN5Y2xlLnNjaGVtYSA9IHtcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiR2VuZXJhdGVzIGEgdHlwZSBvZiBiaWN5Y2xlXCIsXG4gICAgXCJzYW1wbGVSZXN1bHRzXCI6IFtcIkFkdmVudHVyZSBSb2FkIEJpY3ljbGVcIiwgXCJDaXR5IEJpY3ljbGVcIiwgXCJSZWN1bWJlbnQgQmljeWNsZVwiXVxuICB9O1xufTtcblxubW9kdWxlW1wiZXhwb3J0c1wiXSA9IFZlaGljbGU7XG4iLCIvKipcbiAqIEBuYW1lc3BhY2UgZmFrZXIud29yZFxuICovXG52YXIgV29yZCA9IGZ1bmN0aW9uIChmYWtlcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFkamVjdGl2ZSBvZiByYW5kb20gb3Igb3B0aW9uYWxseSBzcGVjaWZpZWQgbGVuZ3RoLlxuICAgKiBJZiBzcGVjaWZpZWQgbGVuZ3RoIGlzIHVucmVzb2x2YWJsZSwgcmV0dXJucyByYW5kb20gYWRqZWN0aXZlLlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLndvcmQuYWRqZWN0aXZlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoXSAtIG9wdGlvbmFsIGxlbmd0aCBvZiB3b3JkIHRvIHJldHVyblxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgICAgICAgICBhIHJhbmRvbSBhZGplY3RpdmVcbiAgICovXG4gIHNlbGYuYWRqZWN0aXZlID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciB3b3JkTGlzdCA9IGZha2VyLmRlZmluaXRpb25zLndvcmQuYWRqZWN0aXZlO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKTtcbiAgICAgIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC5hZGplY3RpdmUuZmlsdGVyKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAgIHJldHVybiB3b3JkLmxlbmd0aCA9PSBsZW5ndGg7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gSWYgcmVzdWx0IG9mIGZpbHRlcmVkIHdvcmQgbGlzdCBpcyB1bmRlZmluZWQsIHJldHVybiBhbiBlbGVtZW50XG4gICAgLy8gZnJvbSB0aGUgdW5maWx0ZXJlZCBsaXN0LlxuICAgIHJldHVybiAoXG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHdvcmRMaXN0KSB8fFxuICAgICAgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy53b3JkLmFkamVjdGl2ZSlcbiAgICApO1xuICB9O1xuICAvKipcbiAgICogUmV0dXJucyBhbiBhZHZlcmIgb2YgcmFuZG9tIG9yIG9wdGlvbmFsbHkgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICogSWYgc3BlY2lmaWVkIGxlbmd0aCBpcyB1bnJlc29sdmFibGUsIHJldHVybnMgcmFuZG9tIGFkdmVyYi5cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci53b3JkLmFkdmVyYlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aF0gLSBvcHRpb25hbCBsZW5ndGggb2Ygd29yZCB0byByZXR1cm5cbiAgICogQHJldHVybnMge3N0cmluZ30gICAgICAgICAgcmFuZG9tIGFkdmVyYlxuICAgKi9cbiAgc2VsZi5hZHZlcmIgPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgdmFyIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC5hZHZlcmI7XG4gICAgaWYgKGxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZW5ndGggPSBwYXJzZUludChsZW5ndGgpO1xuICAgICAgd29yZExpc3QgPSBmYWtlci5kZWZpbml0aW9ucy53b3JkLmFkdmVyYi5maWx0ZXIoZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQubGVuZ3RoID09IGxlbmd0aDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBJZiByZXN1bHQgb2YgZmlsdGVyZWQgd29yZCBsaXN0IGlzIHVuZGVmaW5lZCwgcmV0dXJuIGFuIGVsZW1lbnRcbiAgICAvLyBmcm9tIHRoZSB1bmZpbHRlcmVkIGxpc3QuXG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQod29yZExpc3QpIHx8XG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLndvcmQuYWR2ZXJiKVxuICAgICk7XG4gIH07XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29uanVuY3Rpb24gb2YgcmFuZG9tIG9yIG9wdGlvbmFsbHkgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICogSWYgc3BlY2lmaWVkIGxlbmd0aCBpcyB1bnJlc29sdmFibGUsIHJldHVybnMgcmFuZG9tIGNvbmp1bmN0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGZha2VyLndvcmQuY29uanVuY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGhdIC0gb3B0aW9uYWwgbGVuZ3RoIG9mIHdvcmQgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9ICAgICAgICAgIHJhbmRvbSBjb25qdW5jdGlvblxuICAgKi9cbiAgc2VsZi5jb25qdW5jdGlvbiA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcbiAgICB2YXIgd29yZExpc3QgPSBmYWtlci5kZWZpbml0aW9ucy53b3JkLmNvbmp1bmN0aW9uO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKTtcbiAgICAgIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC5jb25qdW5jdGlvbi5maWx0ZXIoZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQubGVuZ3RoID09IGxlbmd0aDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBJZiByZXN1bHQgb2YgZmlsdGVyZWQgd29yZCBsaXN0IGlzIHVuZGVmaW5lZCwgcmV0dXJuIGFuIGVsZW1lbnRcbiAgICAvLyBmcm9tIHRoZSB1bmZpbHRlcmVkIGxpc3QuXG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQod29yZExpc3QpIHx8XG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLndvcmQuY29uanVuY3Rpb24pXG4gICAgKTtcbiAgfTtcbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaW50ZXJqZWN0aW9uIG9mIHJhbmRvbSBvciBvcHRpb25hbGx5IHNwZWNpZmllZCBsZW5ndGguXG4gICAqIElmIHNwZWNpZmllZCBsZW5ndGggaXMgdW5yZXNvbHZhYmxlLCByZXR1cm5zIHJhbmRvbSBpbnRlcmplY3Rpb24uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIud29yZC5pbnRlcmplY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGhdIC0gb3B0aW9uYWwgbGVuZ3RoIG9mIHdvcmQgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9ICAgICAgICAgIHJhbmRvbSBpbnRlcmplY3Rpb25cbiAgICovXG4gIHNlbGYuaW50ZXJqZWN0aW9uID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciB3b3JkTGlzdCA9IGZha2VyLmRlZmluaXRpb25zLndvcmQuaW50ZXJqZWN0aW9uO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKTtcbiAgICAgIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC5pbnRlcmplY3Rpb24uZmlsdGVyKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAgIHJldHVybiB3b3JkLmxlbmd0aCA9PSBsZW5ndGg7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gSWYgcmVzdWx0IG9mIGZpbHRlcmVkIHdvcmQgbGlzdCBpcyB1bmRlZmluZWQsIHJldHVybiBhbiBlbGVtZW50XG4gICAgLy8gZnJvbSB0aGUgdW5maWx0ZXJlZCBsaXN0LlxuICAgIHJldHVybiAoXG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHdvcmRMaXN0KSB8fFxuICAgICAgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy53b3JkLmludGVyamVjdGlvbilcbiAgICApO1xuICB9O1xuICAvKipcbiAgICogUmV0dXJucyBhIG5vdW4gb2YgcmFuZG9tIG9yIG9wdGlvbmFsbHkgc3BlY2lmaWVkIGxlbmd0aC5cbiAgICogSWYgc3BlY2lmaWVkIGxlbmd0aCBpcyB1bnJlc29sdmFibGUsIHJldHVybnMgcmFuZG9tIG5vdW4uXG4gICAqXG4gICAqIEBtZXRob2QgZmFrZXIud29yZC5ub3VuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoXSAtIG9wdGlvbmFsIGxlbmd0aCBvZiB3b3JkIHRvIHJldHVyblxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgICAgICAgICByYW5kb20gbm91blxuICAgKi9cbiAgc2VsZi5ub3VuID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciB3b3JkTGlzdCA9IGZha2VyLmRlZmluaXRpb25zLndvcmQubm91bjtcbiAgICBpZiAobGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxlbmd0aCA9IHBhcnNlSW50KGxlbmd0aCk7XG4gICAgICB3b3JkTGlzdCA9IGZha2VyLmRlZmluaXRpb25zLndvcmQubm91bi5maWx0ZXIoZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQubGVuZ3RoID09IGxlbmd0aDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBJZiByZXN1bHQgb2YgZmlsdGVyZWQgd29yZCBsaXN0IGlzIHVuZGVmaW5lZCwgcmV0dXJuIGFuIGVsZW1lbnRcbiAgICAvLyBmcm9tIHRoZSB1bmZpbHRlcmVkIGxpc3QuXG4gICAgcmV0dXJuIChcbiAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQod29yZExpc3QpIHx8XG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KGZha2VyLmRlZmluaXRpb25zLndvcmQubm91bilcbiAgICApO1xuICB9O1xuICAvKipcbiAgICogUmV0dXJucyBhIHByZXBvc2l0aW9uIG9mIHJhbmRvbSBvciBvcHRpb25hbGx5IHNwZWNpZmllZCBsZW5ndGguXG4gICAqIElmIHNwZWNpZmllZCBsZW5ndGggaXMgdW5yZXNvbHZhYmxlLCByZXR1cm5zIHJhbmRvbSBwcmVwb3NpdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci53b3JkLnByZXBvc2l0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoXSAtIG9wdGlvbmFsIGxlbmd0aCBvZiB3b3JkIHRvIHJldHVyblxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgICAgICAgICByYW5kb20gcHJlcG9zaXRpb25cbiAgICovXG4gIHNlbGYucHJlcG9zaXRpb24gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgdmFyIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC5wcmVwb3NpdGlvbjtcbiAgICBpZiAobGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxlbmd0aCA9IHBhcnNlSW50KGxlbmd0aCk7XG4gICAgICB3b3JkTGlzdCA9IGZha2VyLmRlZmluaXRpb25zLndvcmQucHJlcG9zaXRpb24uZmlsdGVyKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAgIHJldHVybiB3b3JkLmxlbmd0aCA9PSBsZW5ndGg7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gSWYgcmVzdWx0IG9mIGZpbHRlcmVkIHdvcmQgbGlzdCBpcyB1bmRlZmluZWQsIHJldHVybiBhbiBlbGVtZW50XG4gICAgLy8gZnJvbSB0aGUgdW5maWx0ZXJlZCBsaXN0LlxuICAgIHJldHVybiAoXG4gICAgICBmYWtlci5yYW5kb20uYXJyYXlFbGVtZW50KHdvcmRMaXN0KSB8fFxuICAgICAgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChmYWtlci5kZWZpbml0aW9ucy53b3JkLnByZXBvc2l0aW9uKVxuICAgICk7XG4gIH07XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdmVyYiBvZiByYW5kb20gb3Igb3B0aW9uYWxseSBzcGVjaWZpZWQgbGVuZ3RoLlxuICAgKiBJZiBzcGVjaWZpZWQgbGVuZ3RoIGlzIHVucmVzb2x2YWJsZSwgcmV0dXJucyByYW5kb20gdmVyYi5cbiAgICpcbiAgICogQG1ldGhvZCBmYWtlci53b3JkLnZlcmJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGhdIC0gb3B0aW9uYWwgbGVuZ3RoIG9mIHdvcmQgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9ICAgICAgICAgIHJhbmRvbSB2ZXJiXG4gICAqL1xuICBzZWxmLnZlcmIgPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgdmFyIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC52ZXJiO1xuICAgIGlmIChsZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKTtcbiAgICAgIHdvcmRMaXN0ID0gZmFrZXIuZGVmaW5pdGlvbnMud29yZC52ZXJiLmZpbHRlcihmdW5jdGlvbiAod29yZCkge1xuICAgICAgICByZXR1cm4gd29yZC5sZW5ndGggPT0gbGVuZ3RoO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIElmIHJlc3VsdCBvZiBmaWx0ZXJlZCB3b3JkIGxpc3QgaXMgdW5kZWZpbmVkLCByZXR1cm4gYW4gZWxlbWVudFxuICAgIC8vIGZyb20gdGhlIHVuZmlsdGVyZWQgbGlzdC5cbiAgICByZXR1cm4gKFxuICAgICAgZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudCh3b3JkTGlzdCkgfHxcbiAgICAgIGZha2VyLnJhbmRvbS5hcnJheUVsZW1lbnQoZmFrZXIuZGVmaW5pdGlvbnMud29yZC52ZXJiKVxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5tb2R1bGVbXCJleHBvcnRzXCJdID0gV29yZDtcbiIsIi8vIHRoaXMgcHJvZ3JhbSBpcyBhIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBNZXJzZW5uZSBUd2lzdGVyLCB3aXRoIGNvbmNlYWxtZW50IGFuZCBlbmNhcHN1bGF0aW9uIGluIGNsYXNzLFxuLy8gYW4gYWxtb3N0IHN0cmFpZ2h0IGNvbnZlcnNpb24gZnJvbSB0aGUgb3JpZ2luYWwgcHJvZ3JhbSwgbXQxOTkzN2FyLmMsXG4vLyB0cmFuc2xhdGVkIGJ5IHkuIG9rYWRhIG9uIEp1bHkgMTcsIDIwMDYuXG4vLyBhbmQgbW9kaWZpZWQgYSBsaXR0bGUgYXQganVseSAyMCwgMjAwNiwgYnV0IHRoZXJlIGFyZSBub3QgYW55IHN1YnN0YW50aWFsIGRpZmZlcmVuY2VzLlxuLy8gaW4gdGhpcyBwcm9ncmFtLCBwcm9jZWR1cmUgZGVzY3JpcHRpb25zIGFuZCBjb21tZW50cyBvZiBvcmlnaW5hbCBzb3VyY2UgY29kZSB3ZXJlIG5vdCByZW1vdmVkLlxuLy8gbGluZXMgY29tbWVudGVkIHdpdGggLy9jLy8gd2VyZSBvcmlnaW5hbGx5IGRlc2NyaXB0aW9ucyBvZiBjIHByb2NlZHVyZS4gYW5kIGEgZmV3IGZvbGxvd2luZyBsaW5lcyBhcmUgYXBwcm9wcmlhdGUgSmF2YVNjcmlwdCBkZXNjcmlwdGlvbnMuXG4vLyBsaW5lcyBjb21tZW50ZWQgd2l0aCAvKiBhbmQgKi8gYXJlIG9yaWdpbmFsIGNvbW1lbnRzLlxuLy8gbGluZXMgY29tbWVudGVkIHdpdGggLy8gYXJlIGFkZGl0aW9uYWwgY29tbWVudHMgaW4gdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24uXG4vLyBiZWZvcmUgdXNpbmcgdGhpcyB2ZXJzaW9uLCBjcmVhdGUgYXQgbGVhc3Qgb25lIGluc3RhbmNlIG9mIE1lcnNlbm5lVHdpc3RlcjE5OTM3IGNsYXNzLCBhbmQgaW5pdGlhbGl6ZSB0aGUgZWFjaCBzdGF0ZSwgZ2l2ZW4gYmVsb3cgaW4gYyBjb21tZW50cywgb2YgYWxsIHRoZSBpbnN0YW5jZXMuXG4vKlxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxuICAgQ29kZWQgYnkgVGFrdWppIE5pc2hpbXVyYSBhbmQgTWFrb3RvIE1hdHN1bW90by5cblxuICAgQmVmb3JlIHVzaW5nLCBpbml0aWFsaXplIHRoZSBzdGF0ZSBieSB1c2luZyBpbml0X2dlbnJhbmQoc2VlZClcbiAgIG9yIGluaXRfYnlfYXJyYXkoaW5pdF9rZXksIGtleV9sZW5ndGgpLlxuXG4gICBDb3B5cmlnaHQgKEMpIDE5OTcgLSAyMDAyLCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhLFxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbiAgIGFyZSBtZXQ6XG5cbiAgICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4gICAgIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuICAgICAzLiBUaGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlXG4gICAgICAgIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlblxuICAgICAgICBwZXJtaXNzaW9uLlxuXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gICBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAgIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxuICAgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gICBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gICBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcbiAgIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuXG5cbiAgIEFueSBmZWVkYmFjayBpcyB2ZXJ5IHdlbGNvbWUuXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcbiovXG5cbmZ1bmN0aW9uIE1lcnNlbm5lVHdpc3RlcjE5OTM3KClcbntcbiAgLyogY29uc3RhbnRzIHNob3VsZCBiZSBzY29wZWQgaW5zaWRlIHRoZSBjbGFzcyAqL1xuICB2YXIgTiwgTSwgTUFUUklYX0EsIFVQUEVSX01BU0ssIExPV0VSX01BU0s7XG4gIC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG4gIC8vYy8vI2RlZmluZSBOIDYyNFxuICAvL2MvLyNkZWZpbmUgTSAzOTdcbiAgLy9jLy8jZGVmaW5lIE1BVFJJWF9BIDB4OTkwOGIwZGZVTCAgIC8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gIC8vYy8vI2RlZmluZSBVUFBFUl9NQVNLIDB4ODAwMDAwMDBVTCAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG4gIC8vYy8vI2RlZmluZSBMT1dFUl9NQVNLIDB4N2ZmZmZmZmZVTCAvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cbiAgTiA9IDYyNDtcbiAgTSA9IDM5NztcbiAgTUFUUklYX0EgPSAweDk5MDhiMGRmOyAgIC8qIGNvbnN0YW50IHZlY3RvciBhICovXG4gIFVQUEVSX01BU0sgPSAweDgwMDAwMDAwOyAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG4gIExPV0VSX01BU0sgPSAweDdmZmZmZmZmOyAvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cbiAgLy9jLy9zdGF0aWMgdW5zaWduZWQgbG9uZyBtdFtOXTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICAqL1xuICAvL2MvL3N0YXRpYyBpbnQgbXRpPU4rMTsgLyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG4gIHZhciBtdCA9IG5ldyBBcnJheShOKTsgICAvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgICovXG4gIHZhciBtdGkgPSBOKzE7ICAgICAgICAgICAvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuICBmdW5jdGlvbiB1bnNpZ25lZDMyIChuMSkgLy8gcmV0dXJucyBhIDMyLWJpdHMgdW5zaWdlZCBpbnRlZ2VyIGZyb20gYW4gb3BlcmFuZCB0byB3aGljaCBhcHBsaWVkIGEgYml0IG9wZXJhdG9yLlxuICB7XG4gICAgcmV0dXJuIG4xIDwgMCA/IChuMSBeIFVQUEVSX01BU0spICsgVVBQRVJfTUFTSyA6IG4xO1xuICB9XG5cbiAgZnVuY3Rpb24gc3VidHJhY3Rpb24zMiAobjEsIG4yKSAvLyBlbXVsYXRlcyBsb3dlcmZsb3cgb2YgYSBjIDMyLWJpdHMgdW5zaWdlZCBpbnRlZ2VyIHZhcmlhYmxlLCBpbnN0ZWFkIG9mIHRoZSBvcGVyYXRvciAtLiB0aGVzZSBib3RoIGFyZ3VtZW50cyBtdXN0IGJlIG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyBleHByZXNzaWJsZSB1c2luZyB1bnNpZ25lZCAzMiBiaXRzLlxuICB7XG4gICAgcmV0dXJuIG4xIDwgbjIgPyB1bnNpZ25lZDMyKCgweDEwMDAwMDAwMCAtIChuMiAtIG4xKSkgJiAweGZmZmZmZmZmKSA6IG4xIC0gbjI7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRpdGlvbjMyIChuMSwgbjIpIC8vIGVtdWxhdGVzIG92ZXJmbG93IG9mIGEgYyAzMi1iaXRzIHVuc2lnZWQgaW50ZWdlciB2YXJpYWJsZSwgaW5zdGVhZCBvZiB0aGUgb3BlcmF0b3IgKy4gdGhlc2UgYm90aCBhcmd1bWVudHMgbXVzdCBiZSBub24tbmVnYXRpdmUgaW50ZWdlcnMgZXhwcmVzc2libGUgdXNpbmcgdW5zaWduZWQgMzIgYml0cy5cbiAge1xuICAgIHJldHVybiB1bnNpZ25lZDMyKChuMSArIG4yKSAmIDB4ZmZmZmZmZmYpXG4gIH1cblxuICBmdW5jdGlvbiBtdWx0aXBsaWNhdGlvbjMyIChuMSwgbjIpIC8vIGVtdWxhdGVzIG92ZXJmbG93IG9mIGEgYyAzMi1iaXRzIHVuc2lnZWQgaW50ZWdlciB2YXJpYWJsZSwgaW5zdGVhZCBvZiB0aGUgb3BlcmF0b3IgKi4gdGhlc2UgYm90aCBhcmd1bWVudHMgbXVzdCBiZSBub24tbmVnYXRpdmUgaW50ZWdlcnMgZXhwcmVzc2libGUgdXNpbmcgdW5zaWduZWQgMzIgYml0cy5cbiAge1xuICAgIHZhciBzdW0gPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7ICsraSl7XG4gICAgICBpZiAoKG4xID4+PiBpKSAmIDB4MSl7XG4gICAgICAgIHN1bSA9IGFkZGl0aW9uMzIoc3VtLCB1bnNpZ25lZDMyKG4yIDw8IGkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1bTtcbiAgfVxuXG4gIC8qIGluaXRpYWxpemVzIG10W05dIHdpdGggYSBzZWVkICovXG4gIC8vYy8vdm9pZCBpbml0X2dlbnJhbmQodW5zaWduZWQgbG9uZyBzKVxuICB0aGlzLmluaXRfZ2VucmFuZCA9IGZ1bmN0aW9uIChzKVxuICB7XG4gICAgLy9jLy9tdFswXT0gcyAmIDB4ZmZmZmZmZmY7XG4gICAgbXRbMF09IHVuc2lnbmVkMzIocyAmIDB4ZmZmZmZmZmYpO1xuICAgIGZvciAobXRpPTE7IG10aTxOOyBtdGkrKykge1xuICAgICAgbXRbbXRpXSA9XG5cdFx0XHQvL2MvLygxODEyNDMzMjUzICogKG10W210aS0xXSBeIChtdFttdGktMV0gPj4gMzApKSArIG10aSk7XG5cdFx0XHRhZGRpdGlvbjMyKG11bHRpcGxpY2F0aW9uMzIoMTgxMjQzMzI1MywgdW5zaWduZWQzMihtdFttdGktMV0gXiAobXRbbXRpLTFdID4+PiAzMCkpKSwgbXRpKTtcbiAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG4gICAgICAvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuICAgICAgLy9jLy9tdFttdGldICY9IDB4ZmZmZmZmZmY7XG4gICAgICBtdFttdGldID0gdW5zaWduZWQzMihtdFttdGldICYgMHhmZmZmZmZmZik7XG4gICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xuICAgIH1cbiAgfVxuXG4gIC8qIGluaXRpYWxpemUgYnkgYW4gYXJyYXkgd2l0aCBhcnJheS1sZW5ndGggKi9cbiAgLyogaW5pdF9rZXkgaXMgdGhlIGFycmF5IGZvciBpbml0aWFsaXppbmcga2V5cyAqL1xuICAvKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cbiAgLyogc2xpZ2h0IGNoYW5nZSBmb3IgQysrLCAyMDA0LzIvMjYgKi9cbiAgLy9jLy92b2lkIGluaXRfYnlfYXJyYXkodW5zaWduZWQgbG9uZyBpbml0X2tleVtdLCBpbnQga2V5X2xlbmd0aClcbiAgdGhpcy5pbml0X2J5X2FycmF5ID0gZnVuY3Rpb24gKGluaXRfa2V5LCBrZXlfbGVuZ3RoKVxuICB7XG4gICAgLy9jLy9pbnQgaSwgaiwgaztcbiAgICB2YXIgaSwgaiwgaztcbiAgICAvL2MvL2luaXRfZ2VucmFuZCgxOTY1MDIxOCk7XG4gICAgdGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuICAgIGk9MTsgaj0wO1xuICAgIGsgPSAoTj5rZXlfbGVuZ3RoID8gTiA6IGtleV9sZW5ndGgpO1xuICAgIGZvciAoOyBrOyBrLS0pIHtcbiAgICAgIC8vYy8vbXRbaV0gPSAobXRbaV0gXiAoKG10W2ktMV0gXiAobXRbaS0xXSA+PiAzMCkpICogMTY2NDUyNSkpXG4gICAgICAvL2MvL1x0KyBpbml0X2tleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cbiAgICAgIG10W2ldID0gYWRkaXRpb24zMihhZGRpdGlvbjMyKHVuc2lnbmVkMzIobXRbaV0gXiBtdWx0aXBsaWNhdGlvbjMyKHVuc2lnbmVkMzIobXRbaS0xXSBeIChtdFtpLTFdID4+PiAzMCkpLCAxNjY0NTI1KSksIGluaXRfa2V5W2pdKSwgaik7XG4gICAgICBtdFtpXSA9XG5cdFx0XHQvL2MvL210W2ldICY9IDB4ZmZmZmZmZmY7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0XHR1bnNpZ25lZDMyKG10W2ldICYgMHhmZmZmZmZmZik7XG4gICAgICBpKys7IGorKztcbiAgICAgIGlmIChpPj1OKSB7IG10WzBdID0gbXRbTi0xXTsgaT0xOyB9XG4gICAgICBpZiAoaj49a2V5X2xlbmd0aCkge2o9MDt9XG4gICAgfVxuICAgIGZvciAoaz1OLTE7IGs7IGstLSkge1xuICAgICAgLy9jLy9tdFtpXSA9IChtdFtpXSBeICgobXRbaS0xXSBeIChtdFtpLTFdID4+IDMwKSkgKiAxNTY2MDgzOTQxKSlcbiAgICAgIC8vYy8vLSBpOyAvKiBub24gbGluZWFyICovXG4gICAgICBtdFtpXSA9IHN1YnRyYWN0aW9uMzIodW5zaWduZWQzMigoZGJnPW10W2ldKSBeIG11bHRpcGxpY2F0aW9uMzIodW5zaWduZWQzMihtdFtpLTFdIF4gKG10W2ktMV0gPj4+IDMwKSksIDE1NjYwODM5NDEpKSwgaSk7XG4gICAgICAvL2MvL210W2ldICY9IDB4ZmZmZmZmZmY7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG4gICAgICBtdFtpXSA9IHVuc2lnbmVkMzIobXRbaV0gJiAweGZmZmZmZmZmKTtcbiAgICAgIGkrKztcbiAgICAgIGlmIChpPj1OKSB7IG10WzBdID0gbXRbTi0xXTsgaT0xOyB9XG4gICAgfVxuICAgIG10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbiAgfVxuXG4gIC8qIG1vdmVkIG91dHNpZGUgb2YgZ2VucmFuZF9pbnQzMigpIGJ5IGp3YXR0ZSAyMDEwLTExLTE3OyBnZW5lcmF0ZSBsZXNzIGdhcmJhZ2UgKi9cbiAgdmFyIG1hZzAxID0gWzB4MCwgTUFUUklYX0FdO1xuXG4gIC8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHhmZmZmZmZmZl0taW50ZXJ2YWwgKi9cbiAgLy9jLy91bnNpZ25lZCBsb25nIGdlbnJhbmRfaW50MzIodm9pZClcbiAgdGhpcy5nZW5yYW5kX2ludDMyID0gZnVuY3Rpb24gKClcbiAge1xuICAgIC8vYy8vdW5zaWduZWQgbG9uZyB5O1xuICAgIC8vYy8vc3RhdGljIHVuc2lnbmVkIGxvbmcgbWFnMDFbMl09ezB4MFVMLCBNQVRSSVhfQX07XG4gICAgdmFyIHk7XG4gICAgLyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG4gICAgaWYgKG10aSA+PSBOKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cbiAgICAgIC8vYy8vaW50IGtrO1xuICAgICAgdmFyIGtrO1xuXG4gICAgICBpZiAobXRpID09IE4rMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xuICAgICAgLy9jLy9pbml0X2dlbnJhbmQoNTQ4OSk7IC8qIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZCAqL1xuICAgICAge3RoaXMuaW5pdF9nZW5yYW5kKDU0ODkpO30gLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXG5cbiAgICAgIGZvciAoa2s9MDtrazxOLU07a2srKykge1xuICAgICAgICAvL2MvL3kgPSAobXRba2tdJlVQUEVSX01BU0spfChtdFtraysxXSZMT1dFUl9NQVNLKTtcbiAgICAgICAgLy9jLy9tdFtra10gPSBtdFtraytNXSBeICh5ID4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICAgIHkgPSB1bnNpZ25lZDMyKChtdFtra10mVVBQRVJfTUFTSyl8KG10W2trKzFdJkxPV0VSX01BU0spKTtcbiAgICAgICAgbXRba2tdID0gdW5zaWduZWQzMihtdFtraytNXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdKTtcbiAgICAgIH1cbiAgICAgIGZvciAoO2trPE4tMTtraysrKSB7XG4gICAgICAgIC8vYy8veSA9IChtdFtra10mVVBQRVJfTUFTSyl8KG10W2trKzFdJkxPV0VSX01BU0spO1xuICAgICAgICAvL2MvL210W2trXSA9IG10W2trKyhNLU4pXSBeICh5ID4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG4gICAgICAgIHkgPSB1bnNpZ25lZDMyKChtdFtra10mVVBQRVJfTUFTSyl8KG10W2trKzFdJkxPV0VSX01BU0spKTtcbiAgICAgICAgbXRba2tdID0gdW5zaWduZWQzMihtdFtraysoTS1OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXSk7XG4gICAgICB9XG4gICAgICAvL2MvL3kgPSAobXRbTi0xXSZVUFBFUl9NQVNLKXwobXRbMF0mTE9XRVJfTUFTSyk7XG4gICAgICAvL2MvL210W04tMV0gPSBtdFtNLTFdIF4gKHkgPj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcbiAgICAgIHkgPSB1bnNpZ25lZDMyKChtdFtOLTFdJlVQUEVSX01BU0spfChtdFswXSZMT1dFUl9NQVNLKSk7XG4gICAgICBtdFtOLTFdID0gdW5zaWduZWQzMihtdFtNLTFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV0pO1xuICAgICAgbXRpID0gMDtcbiAgICB9XG5cbiAgICB5ID0gbXRbbXRpKytdO1xuXG4gICAgLyogVGVtcGVyaW5nICovXG4gICAgLy9jLy95IF49ICh5ID4+IDExKTtcbiAgICAvL2MvL3kgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xuICAgIC8vYy8veSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuICAgIC8vYy8veSBePSAoeSA+PiAxOCk7XG4gICAgeSA9IHVuc2lnbmVkMzIoeSBeICh5ID4+PiAxMSkpO1xuICAgIHkgPSB1bnNpZ25lZDMyKHkgXiAoKHkgPDwgNykgJiAweDlkMmM1NjgwKSk7XG4gICAgeSA9IHVuc2lnbmVkMzIoeSBeICgoeSA8PCAxNSkgJiAweGVmYzYwMDAwKSk7XG4gICAgeSA9IHVuc2lnbmVkMzIoeSBeICh5ID4+PiAxOCkpO1xuXG4gICAgcmV0dXJuIHk7XG4gIH1cblxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXG4gIC8vYy8vbG9uZyBnZW5yYW5kX2ludDMxKHZvaWQpXG4gIHRoaXMuZ2VucmFuZF9pbnQzMSA9IGZ1bmN0aW9uICgpXG4gIHtcbiAgICAvL2MvL3JldHVybiAoZ2VucmFuZF9pbnQzMigpPj4xKTtcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpPj4+MSk7XG4gIH1cblxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cbiAgLy9jLy9kb3VibGUgZ2VucmFuZF9yZWFsMSh2b2lkKVxuICB0aGlzLmdlbnJhbmRfcmVhbDEgPSBmdW5jdGlvbiAoKVxuICB7XG4gICAgLy9jLy9yZXR1cm4gZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5NS4wKTtcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApO1xuICAgIC8qIGRpdmlkZWQgYnkgMl4zMi0xICovXG4gIH1cblxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpLXJlYWwtaW50ZXJ2YWwgKi9cbiAgLy9jLy9kb3VibGUgZ2VucmFuZF9yZWFsMih2b2lkKVxuICB0aGlzLmdlbnJhbmRfcmVhbDIgPSBmdW5jdGlvbiAoKVxuICB7XG4gICAgLy9jLy9yZXR1cm4gZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5Ni4wKTtcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICB9XG5cbiAgLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiAoMCwxKS1yZWFsLWludGVydmFsICovXG4gIC8vYy8vZG91YmxlIGdlbnJhbmRfcmVhbDModm9pZClcbiAgdGhpcy5nZW5yYW5kX3JlYWwzID0gZnVuY3Rpb24gKClcbiAge1xuICAgIC8vYy8vcmV0dXJuICgoZ2VucmFuZF9pbnQzMigpKSArIDAuNSkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuICAgIHJldHVybiAoKHRoaXMuZ2VucmFuZF9pbnQzMigpKSArIDAuNSkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xuICB9XG5cbiAgLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKSB3aXRoIDUzLWJpdCByZXNvbHV0aW9uKi9cbiAgLy9jLy9kb3VibGUgZ2VucmFuZF9yZXM1Myh2b2lkKVxuICB0aGlzLmdlbnJhbmRfcmVzNTMgPSBmdW5jdGlvbiAoKVxuICB7XG4gICAgLy9jLy91bnNpZ25lZCBsb25nIGE9Z2VucmFuZF9pbnQzMigpPj41LCBiPWdlbnJhbmRfaW50MzIoKT4+NjtcbiAgICB2YXIgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42O1xuICAgIHJldHVybihhKjY3MTA4ODY0LjArYikqKDEuMC85MDA3MTk5MjU0NzQwOTkyLjApO1xuICB9XG4gIC8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXG59XG5cbi8vICBFeHBvcnRzOiBQdWJsaWMgQVBJXG5cbi8vICBFeHBvcnQgdGhlIHR3aXN0ZXIgY2xhc3NcbmV4cG9ydHMuTWVyc2VubmVUd2lzdGVyMTk5MzcgPSBNZXJzZW5uZVR3aXN0ZXIxOTkzNztcbiIsIi8vIHRoZSBgdW5pcXVlYCBtb2R1bGVcbnZhciB1bmlxdWUgPSB7fTtcblxuLy8gZ2xvYmFsIHJlc3VsdHMgc3RvcmVcbi8vIGN1cnJlbnRseSB1bmlxdWVuZXNzIGlzIGdsb2JhbCB0byBlbnRpcmUgZmFrZXIgaW5zdGFuY2Vcbi8vIHRoaXMgbWVhbnMgdGhhdCBmYWtlciBzaG91bGQgY3VycmVudGx5ICpuZXZlciogcmV0dXJuIGR1cGxpY2F0ZSB2YWx1ZXMgYWNyb3NzIGFsbCBBUEkgbWV0aG9kcyB3aGVuIHVzaW5nIGBGYWtlci51bmlxdWVgXG4vLyBpdCdzIHBvc3NpYmxlIGluIHRoZSBmdXR1cmUgdGhhdCBzb21lIHVzZXJzIG1heSB3YW50IHRvIHNjb3BlIGZvdW5kIHBlciBmdW5jdGlvbiBjYWxsIGluc3RlYWQgb2YgZmFrZXIgaW5zdGFuY2VcbnZhciBmb3VuZCA9IHt9O1xuXG4vLyBnbG9iYWwgZXhjbHVkZSBsaXN0IG9mIHJlc3VsdHNcbi8vIGRlZmF1bHRzIHRvIG5vdGhpbmcgZXhjbHVkZWRcbnZhciBleGNsdWRlID0gW107XG5cbi8vIGN1cnJlbnQgaXRlcmF0aW9uIG9yIHJldHJpZXMgb2YgdW5pcXVlLmV4ZWMgKCBjdXJyZW50IGxvb3AgZGVwdGggKVxudmFyIGN1cnJlbnRJdGVyYXRpb25zID0gMDtcblxuLy8gdW5pcXVlbmVzcyBjb21wYXJlIGZ1bmN0aW9uXG4vLyBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIGNoZWNrIHZhbHVlIGFzIGtleSBhZ2FpbnN0IG9iamVjdCBoYXNoXG52YXIgZGVmYXVsdENvbXBhcmUgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbi8vIGNvbW1vbiBlcnJvciBoYW5kbGVyIGZvciBtZXNzYWdlc1xudW5pcXVlLmVycm9yTWVzc2FnZSA9IGZ1bmN0aW9uIChub3csIGNvZGUsIG9wdHMpIHtcbiAgY29uc29sZS5lcnJvcignZXJyb3InLCBjb2RlKTtcbiAgY29uc29sZS5sb2coJ2ZvdW5kJywgT2JqZWN0LmtleXMoZm91bmQpLmxlbmd0aCwgJ3VuaXF1ZSBlbnRyaWVzIGJlZm9yZSB0aHJvd2luZyBlcnJvci4gXFxucmV0cmllZDonLCBjdXJyZW50SXRlcmF0aW9ucywgJ1xcbnRvdGFsIHRpbWU6Jywgbm93IC0gb3B0cy5zdGFydFRpbWUsICdtcycpO1xuICB0aHJvdyBuZXcgRXJyb3IoY29kZSArICcgZm9yIHVuaXF1ZW5lc3MgY2hlY2sgXFxuXFxuTWF5IG5vdCBiZSBhYmxlIHRvIGdlbmVyYXRlIGFueSBtb3JlIHVuaXF1ZSB2YWx1ZXMgd2l0aCBjdXJyZW50IHNldHRpbmdzLiBcXG5UcnkgYWRqdXN0aW5nIG1heFRpbWUgb3IgbWF4UmV0cmllcyBwYXJhbWV0ZXJzIGZvciBmYWtlci51bmlxdWUoKScpXG59O1xuXG51bmlxdWUuZXhlYyA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZ3MsIG9wdHMpIHtcbiAgLy9jb25zb2xlLmxvZyhjdXJyZW50SXRlcmF0aW9ucylcblxuICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIG9wdHMubWF4VGltZSA9IG9wdHMubWF4VGltZSB8fCAzO1xuICBvcHRzLm1heFJldHJpZXMgPSBvcHRzLm1heFJldHJpZXMgfHwgNTA7XG4gIG9wdHMuZXhjbHVkZSA9IG9wdHMuZXhjbHVkZSB8fCBleGNsdWRlO1xuICBvcHRzLmNvbXBhcmUgPSBvcHRzLmNvbXBhcmUgfHwgZGVmYXVsdENvbXBhcmU7XG5cbiAgaWYgKHR5cGVvZiBvcHRzLmN1cnJlbnRJdGVyYXRpb25zICE9PSAnbnVtYmVyJykge1xuICAgIG9wdHMuY3VycmVudEl0ZXJhdGlvbnMgPSAwO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRzLnN0YXJ0VGltZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgdmFyIHN0YXJ0VGltZSA9IG9wdHMuc3RhcnRUaW1lO1xuXG4gIC8vIHN1cHBvcnQgc2luZ2xlIGV4Y2x1ZGUgYXJndW1lbnQgYXMgc3RyaW5nXG4gIGlmICh0eXBlb2Ygb3B0cy5leGNsdWRlID09PSAnc3RyaW5nJykge1xuICAgIG9wdHMuZXhjbHVkZSA9IFtvcHRzLmV4Y2x1ZGVdO1xuICB9XG5cbiAgaWYgKG9wdHMuY3VycmVudEl0ZXJhdGlvbnMgPiAwKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2l0ZXJhdGluZycsIGN1cnJlbnRJdGVyYXRpb25zKVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2cobm93IC0gc3RhcnRUaW1lKVxuICBpZiAobm93IC0gc3RhcnRUaW1lID49IG9wdHMubWF4VGltZSkge1xuICAgIHJldHVybiB1bmlxdWUuZXJyb3JNZXNzYWdlKG5vdywgJ0V4Y2VlZGVkIG1heFRpbWU6JyArIG9wdHMubWF4VGltZSwgb3B0cyk7XG4gIH1cblxuICBpZiAob3B0cy5jdXJyZW50SXRlcmF0aW9ucyA+PSBvcHRzLm1heFJldHJpZXMpIHtcbiAgICByZXR1cm4gdW5pcXVlLmVycm9yTWVzc2FnZShub3csICdFeGNlZWRlZCBtYXhSZXRyaWVzOicgKyBvcHRzLm1heFJldHJpZXMsIG9wdHMpO1xuICB9XG5cbiAgLy8gZXhlY3V0ZSB0aGUgcHJvdmlkZWQgbWV0aG9kIHRvIGZpbmQgYSBwb3RlbnRpYWwgc2F0aWZpc2VkIHZhbHVlXG4gIHZhciByZXN1bHQgPSBtZXRob2QuYXBwbHkodGhpcywgYXJncyk7XG5cbiAgLy8gaWYgdGhlIHJlc3VsdCBoYXMgbm90IGJlZW4gcHJldmlvdXNseSBmb3VuZCwgYWRkIGl0IHRvIHRoZSBmb3VuZCBhcnJheSBhbmQgcmV0dXJuIHRoZSB2YWx1ZSBhcyBpdCdzIHVuaXF1ZVxuICBpZiAob3B0cy5jb21wYXJlKGZvdW5kLCByZXN1bHQpID09PSAtMSAmJiBvcHRzLmV4Y2x1ZGUuaW5kZXhPZihyZXN1bHQpID09PSAtMSkge1xuICAgIGZvdW5kW3Jlc3VsdF0gPSByZXN1bHQ7XG4gICAgb3B0cy5jdXJyZW50SXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICAvLyBjb25zb2xlLmxvZygnY29uZmxpY3QnLCByZXN1bHQpO1xuICAgIG9wdHMuY3VycmVudEl0ZXJhdGlvbnMrKztcbiAgICByZXR1cm4gdW5pcXVlLmV4ZWMobWV0aG9kLCBhcmdzLCBvcHRzKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmlxdWU7XG4iLCIvKlxuXG5Db3B5cmlnaHQgKGMpIDIwMTItMjAxNCBKZWZmcmV5IE1lYWxvXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZFxuZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbnRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmRcbnRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlXG5Tb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRVxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SXG5DT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG5PVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5CYXNlZCBsb29zZWx5IG9uIEx1a2EgUHVzaWMncyBQSFAgU2NyaXB0OiBodHRwOi8vMzYwcGVyY2VudHMuY29tL3Bvc3RzL3BocC1yYW5kb20tdXNlci1hZ2VudC1nZW5lcmF0b3IvXG5cblRoZSBsaWNlbnNlIGZvciB0aGF0IHNjcmlwdCBpcyBhcyBmb2xsb3dzOlxuXG5cIlRIRSBCRUVSLVdBUkUgTElDRU5TRVwiIChSZXZpc2lvbiA0Mik6XG5cbjxwdXNpYzkzQGdtYWlsLmNvbT4gd3JvdGUgdGhpcyBmaWxlLiBBcyBsb25nIGFzIHlvdSByZXRhaW4gdGhpcyBub3RpY2UgeW91IGNhbiBkbyB3aGF0ZXZlciB5b3Ugd2FudCB3aXRoIHRoaXMgc3R1ZmYuXG5JZiB3ZSBtZWV0IHNvbWUgZGF5LCBhbmQgeW91IHRoaW5rIHRoaXMgc3R1ZmYgaXMgd29ydGggaXQsIHlvdSBjYW4gYnV5IG1lIGEgYmVlciBpbiByZXR1cm4uIEx1a2EgUHVzaWNcblxuKi9cblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uIGdlbmVyYXRlKGZha2VyKSB7XG5cbiAgZnVuY3Rpb24gcm5kKGEsIGIpIHtcbiAgICAvL2NhbGxpbmcgcm5kKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgaWRlbnRpY2FsIHRvIHJuZCgwLCAxMDApXG4gICAgYSA9IGEgfHwgMDtcbiAgICBiID0gYiB8fCAxMDA7XG5cbiAgICBpZiAodHlwZW9mIGIgPT09ICdudW1iZXInICYmIHR5cGVvZiBhID09PSAnbnVtYmVyJykge1xuXG4gICAgICAvLyA5LzIwMTggLSBBZGRlZCBmYWtlciByYW5kb20gdG8gZW5zdXJlIG1lcnNlbm5lIGFuZCBzZWVkXG4gICAgICByZXR1cm4gZmFrZXIuZGF0YXR5cGUubnVtYmVyKHsgbWluOiBhLCBtYXg6IGJ9KTtcblxuICAgIH1cblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09IFwiW29iamVjdCBBcnJheV1cIikge1xuICAgICAgLy9yZXR1cm5zIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhcnJheSAoYSksIGV2ZW4gd2VpZ2h0aW5nXG4gICAgICByZXR1cm4gZmFrZXIucmFuZG9tLmFycmF5RWxlbWVudChhKTtcbiAgICB9XG5cbiAgICBpZiAoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIC8vcmV0dXJucyBhIHJhbmRvbSBrZXkgZnJvbSB0aGUgcGFzc2VkIG9iamVjdDsga2V5cyBhcmUgd2VpZ2h0ZWQgYnkgdGhlIGRlY2ltYWwgcHJvYmFiaWxpdHkgaW4gdGhlaXIgdmFsdWVcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2YXIgcmFuZCA9IHJuZCgwLCAxMDApIC8gMTAwLCBtaW4gPSAwLCBtYXggPSAwLCBrZXksIHJldHVybl92YWw7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBtYXggPSBvYmpba2V5XSArIG1pbjtcbiAgICAgICAgICAgIHJldHVybl92YWwgPSBrZXk7XG4gICAgICAgICAgICBpZiAocmFuZCA+PSBtaW4gJiYgcmFuZCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtaW4gPSBtaW4gKyBvYmpba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0dXJuX3ZhbDtcbiAgICAgIH0oYSkpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIHBhc3NlZCB0byBybmQuICgnICsgKGIgPyBhICsgJywgJyArIGIgOiBhKSArICcpJyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21MYW5nKCkge1xuICAgIHJldHVybiBybmQoWydBQicsICdBRicsICdBTicsICdBUicsICdBUycsICdBWicsICdCRScsICdCRycsICdCTicsICdCTycsICdCUicsICdCUycsICdDQScsICdDRScsICdDTycsICdDUycsXG4gICAgICAnQ1UnLCAnQ1knLCAnREEnLCAnREUnLCAnRUwnLCAnRU4nLCAnRU8nLCAnRVMnLCAnRVQnLCAnRVUnLCAnRkEnLCAnRkknLCAnRkonLCAnRk8nLCAnRlInLCAnRlknLFxuICAgICAgJ0dBJywgJ0dEJywgJ0dMJywgJ0dWJywgJ0hFJywgJ0hJJywgJ0hSJywgJ0hUJywgJ0hVJywgJ0hZJywgJ0lEJywgJ0lTJywgJ0lUJywgJ0pBJywgJ0pWJywgJ0tBJyxcbiAgICAgICdLRycsICdLTycsICdLVScsICdLVycsICdLWScsICdMQScsICdMQicsICdMSScsICdMTicsICdMVCcsICdMVicsICdNRycsICdNSycsICdNTicsICdNTycsICdNUycsXG4gICAgICAnTVQnLCAnTVknLCAnTkInLCAnTkUnLCAnTkwnLCAnTk4nLCAnTk8nLCAnT0MnLCAnUEwnLCAnUFQnLCAnUk0nLCAnUk8nLCAnUlUnLCAnU0MnLCAnU0UnLCAnU0snLFxuICAgICAgJ1NMJywgJ1NPJywgJ1NRJywgJ1NSJywgJ1NWJywgJ1NXJywgJ1RLJywgJ1RSJywgJ1RZJywgJ1VLJywgJ1VSJywgJ1VaJywgJ1ZJJywgJ1ZPJywgJ1lJJywgJ1pIJ10pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tQnJvd3NlckFuZE9TKCkge1xuICAgIHZhciBicm93c2VyID0gcm5kKHtcbiAgICAgICAgY2hyb21lOiAgICAuNDUxMzI4MTA1NjYsXG4gICAgICAgIGlleHBsb3JlcjogLjI3NDc3MDYxODM2LFxuICAgICAgICBmaXJlZm94OiAgIC4xOTM4NDE3MDYwOCxcbiAgICAgICAgc2FmYXJpOiAgICAuMDYxODY3ODExMTgsXG4gICAgICAgIG9wZXJhOiAgICAgLjAxNTc0MjM2OTU1XG4gICAgICB9KSxcbiAgICAgIG9zID0ge1xuICAgICAgICBjaHJvbWU6ICB7d2luOiAuODksICBtYWM6IC4wOSAsIGxpbjogLjAyfSxcbiAgICAgICAgZmlyZWZveDoge3dpbjogLjgzLCAgbWFjOiAuMTYsICBsaW46IC4wMX0sXG4gICAgICAgIG9wZXJhOiAgIHt3aW46IC45MSwgIG1hYzogLjAzICwgbGluOiAuMDZ9LFxuICAgICAgICBzYWZhcmk6ICB7d2luOiAuMDQgLCBtYWM6IC45NiAgfSxcbiAgICAgICAgaWV4cGxvcmVyOiBbJ3dpbiddXG4gICAgICB9O1xuXG4gICAgcmV0dXJuIFticm93c2VyLCBybmQob3NbYnJvd3Nlcl0pXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbVByb2MoYXJjaCkge1xuICAgIHZhciBwcm9jcyA9IHtcbiAgICAgIGxpbjpbJ2k2ODYnLCAneDg2XzY0J10sXG4gICAgICBtYWM6IHsnSW50ZWwnIDogLjQ4LCAnUFBDJzogLjAxLCAnVTsgSW50ZWwnOi40OCwgJ1U7IFBQQycgOi4wMX0sXG4gICAgICB3aW46WycnLCAnV09XNjQnLCAnV2luNjQ7IHg2NCddXG4gICAgfTtcbiAgICByZXR1cm4gcm5kKHByb2NzW2FyY2hdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbVJldmlzaW9uKGRvdHMpIHtcbiAgICB2YXIgcmV0dXJuX3ZhbCA9ICcnO1xuICAgIC8vZ2VuZXJhdGUgYSByYW5kb20gcmV2aXNpb25cbiAgICAvL2RvdHMgPSAyIHJldHVybnMgLngueSB3aGVyZSB4ICYgeSBhcmUgYmV0d2VlbiAwIGFuZCA5XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBkb3RzOyB4KyspIHtcbiAgICAgIHJldHVybl92YWwgKz0gJy4nICsgcm5kKDAsIDkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuX3ZhbDtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uX3N0cmluZyA9IHtcbiAgICBuZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBbcm5kKDEsIDQpLCBybmQoMCwgOSksIHJuZCgxMDAwMCwgOTk5OTkpLCBybmQoMCwgOSldLmpvaW4oJy4nKTtcbiAgICB9LFxuICAgIG50OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcm5kKDUsIDYpICsgJy4nICsgcm5kKDAsIDMpO1xuICAgIH0sXG4gICAgaWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBybmQoNywgMTEpO1xuICAgIH0sXG4gICAgdHJpZGVudDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJuZCgzLCA3KSArICcuJyArIHJuZCgwLCAxKTtcbiAgICB9LFxuICAgIG9zeDogZnVuY3Rpb24gKGRlbGltKSB7XG4gICAgICByZXR1cm4gWzEwLCBybmQoNSwgMTApLCBybmQoMCwgOSldLmpvaW4oZGVsaW0gfHwgJy4nKTtcbiAgICB9LFxuICAgIGNocm9tZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFtybmQoMTMsIDM5KSwgMCwgcm5kKDgwMCwgODk5KSwgMF0uam9pbignLicpO1xuICAgIH0sXG4gICAgcHJlc3RvOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJzIuOS4nICsgcm5kKDE2MCwgMTkwKTtcbiAgICB9LFxuICAgIHByZXN0bzI6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBybmQoMTAsIDEyKSArICcuMDAnO1xuICAgIH0sXG4gICAgc2FmYXJpOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcm5kKDUzMSwgNTM4KSArICcuJyArIHJuZCgwLCAyKSArICcuJyArIHJuZCgwLDIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgYnJvd3NlciA9IHtcbiAgICBmaXJlZm94OiBmdW5jdGlvbiBmaXJlZm94KGFyY2gpIHtcbiAgICAgIC8vaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9HZWNrb191c2VyX2FnZW50X3N0cmluZ19yZWZlcmVuY2VcbiAgICAgIHZhciBmaXJlZm94X3ZlciA9IHJuZCg1LCAxNSkgKyByYW5kb21SZXZpc2lvbigyKSxcbiAgICAgICAgZ2Vja29fdmVyID0gJ0dlY2tvLzIwMTAwMTAxIEZpcmVmb3gvJyArIGZpcmVmb3hfdmVyLFxuICAgICAgICBwcm9jID0gcmFuZG9tUHJvYyhhcmNoKSxcbiAgICAgICAgb3NfdmVyID0gKGFyY2ggPT09ICd3aW4nKSA/ICcoV2luZG93cyBOVCAnICsgdmVyc2lvbl9zdHJpbmcubnQoKSArICgocHJvYykgPyAnOyAnICsgcHJvYyA6ICcnKVxuICAgICAgICAgIDogKGFyY2ggPT09ICdtYWMnKSA/ICcoTWFjaW50b3NoOyAnICsgcHJvYyArICcgTWFjIE9TIFggJyArIHZlcnNpb25fc3RyaW5nLm9zeCgpXG4gICAgICAgICAgICA6ICcoWDExOyBMaW51eCAnICsgcHJvYztcblxuICAgICAgcmV0dXJuICdNb3ppbGxhLzUuMCAnICsgb3NfdmVyICsgJzsgcnY6JyArIGZpcmVmb3hfdmVyLnNsaWNlKDAsIC0yKSArICcpICcgKyBnZWNrb192ZXI7XG4gICAgfSxcblxuICAgIGlleHBsb3JlcjogZnVuY3Rpb24gaWV4cGxvcmVyKCkge1xuICAgICAgdmFyIHZlciA9IHZlcnNpb25fc3RyaW5nLmllKCk7XG5cbiAgICAgIGlmICh2ZXIgPj0gMTEpIHtcbiAgICAgICAgLy9odHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvaGg4NjkzMDEodj12cy44NSkuYXNweFxuICAgICAgICByZXR1cm4gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDYuJyArIHJuZCgxLDMpICsgJzsgVHJpZGVudC83LjA7ICcgKyBybmQoWydUb3VjaDsgJywgJyddKSArICdydjoxMS4wKSBsaWtlIEdlY2tvJztcbiAgICAgIH1cblxuICAgICAgLy9odHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvbXM1Mzc1MDModj12cy44NSkuYXNweFxuICAgICAgcmV0dXJuICdNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSAnICsgdmVyICsgJy4wOyBXaW5kb3dzIE5UICcgKyB2ZXJzaW9uX3N0cmluZy5udCgpICsgJzsgVHJpZGVudC8nICtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uX3N0cmluZy50cmlkZW50KCkgKyAoKHJuZCgwLCAxKSA9PT0gMSkgPyAnOyAuTkVUIENMUiAnICsgdmVyc2lvbl9zdHJpbmcubmV0KCkgOiAnJykgKyAnKSc7XG4gICAgfSxcblxuICAgIG9wZXJhOiBmdW5jdGlvbiBvcGVyYShhcmNoKSB7XG4gICAgICAvL2h0dHA6Ly93d3cub3BlcmEuY29tL2RvY3MvaGlzdG9yeS9cbiAgICAgIHZhciBwcmVzdG9fdmVyID0gJyBQcmVzdG8vJyArIHZlcnNpb25fc3RyaW5nLnByZXN0bygpICsgJyBWZXJzaW9uLycgKyB2ZXJzaW9uX3N0cmluZy5wcmVzdG8yKCkgKyAnKScsXG4gICAgICAgIG9zX3ZlciA9IChhcmNoID09PSAnd2luJykgPyAnKFdpbmRvd3MgTlQgJyArIHZlcnNpb25fc3RyaW5nLm50KCkgKyAnOyBVOyAnICsgcmFuZG9tTGFuZygpICsgcHJlc3RvX3ZlclxuICAgICAgICAgIDogKGFyY2ggPT09ICdsaW4nKSA/ICcoWDExOyBMaW51eCAnICsgcmFuZG9tUHJvYyhhcmNoKSArICc7IFU7ICcgKyByYW5kb21MYW5nKCkgKyBwcmVzdG9fdmVyXG4gICAgICAgICAgICA6ICcoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAnICsgdmVyc2lvbl9zdHJpbmcub3N4KCkgKyAnIFU7ICcgKyByYW5kb21MYW5nKCkgKyAnIFByZXN0by8nICtcbiAgICAgICAgICAgICAgICB2ZXJzaW9uX3N0cmluZy5wcmVzdG8oKSArICcgVmVyc2lvbi8nICsgdmVyc2lvbl9zdHJpbmcucHJlc3RvMigpICsgJyknO1xuXG4gICAgICByZXR1cm4gJ09wZXJhLycgKyBybmQoOSwgMTQpICsgJy4nICsgcm5kKDAsIDk5KSArICcgJyArIG9zX3ZlcjtcbiAgICB9LFxuXG4gICAgc2FmYXJpOiBmdW5jdGlvbiBzYWZhcmkoYXJjaCkge1xuICAgICAgdmFyIHNhZmFyaSA9IHZlcnNpb25fc3RyaW5nLnNhZmFyaSgpLFxuICAgICAgICB2ZXIgPSBybmQoNCwgNykgKyAnLicgKyBybmQoMCwxKSArICcuJyArIHJuZCgwLDEwKSxcbiAgICAgICAgb3NfdmVyID0gKGFyY2ggPT09ICdtYWMnKSA/ICcoTWFjaW50b3NoOyAnICsgcmFuZG9tUHJvYygnbWFjJykgKyAnIE1hYyBPUyBYICcrIHZlcnNpb25fc3RyaW5nLm9zeCgnXycpICsgJyBydjonICsgcm5kKDIsIDYpICsgJy4wOyAnKyByYW5kb21MYW5nKCkgKyAnKSAnXG4gICAgICAgICAgOiAnKFdpbmRvd3M7IFU7IFdpbmRvd3MgTlQgJyArIHZlcnNpb25fc3RyaW5nLm50KCkgKyAnKSc7XG5cbiAgICAgIHJldHVybiAnTW96aWxsYS81LjAgJyArIG9zX3ZlciArICdBcHBsZVdlYktpdC8nICsgc2FmYXJpICsgJyAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vJyArIHZlciArICcgU2FmYXJpLycgKyBzYWZhcmk7XG4gICAgfSxcblxuICAgIGNocm9tZTogZnVuY3Rpb24gY2hyb21lKGFyY2gpIHtcbiAgICAgIHZhciBzYWZhcmkgPSB2ZXJzaW9uX3N0cmluZy5zYWZhcmkoKSxcbiAgICAgICAgb3NfdmVyID0gKGFyY2ggPT09ICdtYWMnKSA/ICcoTWFjaW50b3NoOyAnICsgcmFuZG9tUHJvYygnbWFjJykgKyAnIE1hYyBPUyBYICcgKyB2ZXJzaW9uX3N0cmluZy5vc3goJ18nKSArICcpICdcbiAgICAgICAgICA6IChhcmNoID09PSAnd2luJykgPyAnKFdpbmRvd3M7IFU7IFdpbmRvd3MgTlQgJyArIHZlcnNpb25fc3RyaW5nLm50KCkgKyAnKSdcbiAgICAgICAgICAgIDogJyhYMTE7IExpbnV4ICcgKyByYW5kb21Qcm9jKGFyY2gpO1xuXG4gICAgICByZXR1cm4gJ01vemlsbGEvNS4wICcgKyBvc192ZXIgKyAnIEFwcGxlV2ViS2l0LycgKyBzYWZhcmkgKyAnIChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLycgKyB2ZXJzaW9uX3N0cmluZy5jaHJvbWUoKSArICcgU2FmYXJpLycgKyBzYWZhcmk7XG4gICAgfVxuICB9O1xuXG4gIHZhciByYW5kb20gPSByYW5kb21Ccm93c2VyQW5kT1MoKTtcbiAgcmV0dXJuIGJyb3dzZXJbcmFuZG9tWzBdXShyYW5kb21bMV0pO1xufTtcbiJdfQ==
