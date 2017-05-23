(function() {
  'use strict';
  var Nominatim = require('node-nominatim2');
  var nominatim = new Nominatim({
    useragent: 'codeforeurope-water-api',
    referer: 'https://github.com/codeforeurope/water-api',
    timeout: 1000
  });

  var getLatLon = function(result){
    var out = {};
    if (Array.isArray(result)) {
      // get the relation, skip the nodes.
      result = result[0];
    }
    out = {
      lat: result.lat,
      lon: result.lon
    };
    return out;
  };
  /**
   * Cleans a nominatim result into usable content.
   * @param {*} result
   */
  var clean = function(result) {
    var out = {};
    var osm = {};
    if (Array.isArray(result)) {
      // get the relation, skip the nodes.
      result = result[0];
    }

    if (typeof(result) === "object") {
      out = result.address;
      if (result.osm_type && result.osm_id) {
        osm = {
          type: result.osm_type,
          id: result.osm_id
        };
      } else {
        osm = {
          type: "place_id",
          id: result.place_id
        };
      }
      if (out.house_number) delete out.house_number;
      if (out.road) delete out.road;
      if (out.postcode) delete out.postcode;
      if (["ie", "nl"].indexOf(out.country_code) !== -1) {
        return {
          "jurisdiction": out.town || out.city,
          "type": "local government",
          "country": out.country_code,
          "osm": osm
        };
      } else {
        return out;
      }
    } else {
      return out;
    }
  };
  var search = function(options, callback) {
    // See if we can find a municipality in the database
    // No municipality found? Try nominatim!
    nominatim.search(options, function(err, res, data) {
      if(err) callback(err, null);
      var result;
      if(data){
        if (data.error) {
          err = new Error(data.error);
          callback(err,null);
        } else {
          result = getLatLon(data);
          reverse(result, function(err, data){
            callback(err, data || null);
          });
        }
      } else {
        err = new Error("Geocoder unavailable");
        callback(err,null);
      }
    });
  };

  var reverse = function(options, callback) {
    // See if we can find a municipality in the database
    // No municipality found? Try nominatim!
    options.featuretype = "city";
    options.osm_type = "R";
    options.zoom = 10;
    nominatim.reverse(options, function(err, res, data) {
      if(err) callback(err, null);
      var result;
      if(data){
        if (data.error) {
          err = new Error(data.error);
        } else {
          result = clean(data);
        }
        callback(err, result || null);
      } else {
        err = new Error("Geocoder unavailable");
        callback(err,null);
      }
    });
  };

  module.exports.getjurisdiction = function(req, res, next) {
    var params = req.swagger.params;
    res.setHeader('content-type', 'application/json');
    if (params.q.value) {
      search({q: params.q.value}, function(err, data) {
        if (err) next(err);
        res.end(JSON.stringify(data, null, 2));
      });
    } else if (params.lat.value && params.lon.value) {
      reverse({
        lat: params.lat.value,
        lon: params.lon.value
      }, function(err, data) {
        if (err) next(err);
        res.end(JSON.stringify(data, null, 2));
      });
    } else {
      next(new Error('Please add q= or a lat= and lon= to the get request'));
    }
  };
}());
