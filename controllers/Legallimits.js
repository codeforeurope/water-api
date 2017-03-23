/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict'
  // var company = require('../models/Company.js')
  var product = require('../models/Product.js')
  var observation = require('../models/Observation.js')
  var Uom = require('../models/Uom.js').schema
  var Code = require('../models/Code.js').schema
  module.exports.get = function (req, res, next) {
    var params = req.swagger.params
    var mgl = new Uom.model({
      value: 'mg/L',
      label: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'
    })
    // var company = require('../models/Company.js')
    // var product = require('../models/Product.js')

    var natrium = Code.model({ standard: 'CAS', value: '7440-23-5', label: 'Sodium' })
    var kalium = Code.model({ standard: 'CAS', value: '7440-09-7', label: 'Potassium' })
    var calcium = Code.model({ standard: 'CAS', value: '7440-70-2', label: 'Calcium' })
    var nitrat = Code.model({ standard: 'CAS', value: '14797-55-8', label: 'Nitrate' })
    var magnesium = Code.model({ standard: 'CAS', value: '7439-95-4', label: 'Magnesium' })
    var fluorid = Code.model({ standard: 'CAS', value: '16984-48-8', label: 'Fluoride' })
    var chlorid = Code.model({ standard: 'CAS', value: '16887-00-6', label: 'Chloride' })
    var sulfat = Code.model({ standard: 'CAS', value: '14808-79-8', label: 'Sulfate' })
    var hydrogene = Code.model({ standard: 'CAS', value: '1333-74-0', label: 'Hydrogen' })
    var microbacteria = Code.model({ standard: 'CAS', value: '', label: 'Microbacteria' })
    var bicarbonate = Code.model({ standard: 'CAS', value: '', label: 'Bicarbonate (HCO3)' })
    var silica = Code.model({ standard: 'CAS', value: '3163-01-7', label: 'Silicate' })
    var trihalomethane = Code.model({ standard: 'CAS', value: '', label: 'Trihalomethanes (THMS)' })
    var uslimit = product.model({
      name: 'US',
      observations: [
        observation.model({ value: 200, uom: mgl, eqr: natrium }),
        observation.model({ value: null, uom: mgl, eqr: kalium }),
        observation.model({ value: null, uom: mgl, eqr: calcium }),
        observation.model({ value: 50, uom: mgl, eqr: nitrat }),
        observation.model({ value: null, uom: mgl, eqr: magnesium }),
        observation.model({ value: 0, uom: mgl, eqr: fluorid }),
        observation.model({ value: 250, uom: mgl, eqr: chlorid }),
        observation.model({ value: 250, uom: mgl, eqr: sulfat }),
        observation.model({ value: null, uom: mgl, eqr: hydrogene }),
        observation.model({ value: null, uom: mgl, eqr: microbacteria }),
        observation.model({ value: null, uom: mgl, eqr: bicarbonate }),
        observation.model({ value: null, uom: mgl, eqr: silica }),
        observation.model({ value: null, uom: mgl, eqr: trihalomethane })
      ],
      sources: ['https://www.epa.gov/dwstandardsregulations/secondary-drinking-water-standards-guidance-nuisance-chemicals',
        'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Chemicalcontaminants.shtml',
        'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Documents/EDTlibrary/storlist.xls'],
      vendor: null
    })

    var eulimit = product.model({
      name: 'US',
      observations: [
        observation.model({ value: 200, uom: mgl, eqr: natrium }),
        observation.model({ value: 12, uom: mgl, eqr: kalium }),
        observation.model({ value: 400, uom: mgl, eqr: calcium }),
        observation.model({ value: 60, uom: mgl, eqr: nitrat }),
        observation.model({ value: 60, uom: mgl, eqr: magnesium }),
        observation.model({ value: 0, uom: mgl, eqr: fluorid }),
        observation.model({ value: 240, uom: mgl, eqr: chlorid }),
        observation.model({ value: 240, uom: mgl, eqr: sulfat }),
        observation.model({ value: null, uom: mgl, eqr: hydrogene }),
        observation.model({ value: null, uom: mgl, eqr: microbacteria }),
        observation.model({ value: null, uom: mgl, eqr: bicarbonate }),
        observation.model({ value: null, uom: mgl, eqr: silica }),
        observation.model({ value: null, uom: mgl, eqr: trihalomethane })
      ],
      sources: ['url_needed'],
      vendor: null
    })

    var output = [uslimit.toObject(), eulimit.toObject()]
    res.setHeader('content-type', 'application/json')
    res.setHeader('charset', 'utf-8')
    res.end(JSON.stringify(output, null, 2))
  }

  module.exports.post = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ 'operation': 'POST' }, null, 2))
  }

  module.exports.put = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ 'operation': 'PUT' }, null, 2))
  }
  module.exports.delete = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ 'operation': 'DELETE' }, null, 2))
  }
}())
