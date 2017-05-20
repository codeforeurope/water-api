/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var models = require('../models');
  module.exports.getlimits = function (req, res, next) {
    var params = req.swagger.params;
    var mgl = models.Uom.model({
      value: {en: 'mg/L'},
      label: {en: 'mg/L'},
      definition: {en: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'}
    });
    var natrium = models.Code.model({ standard: 'CAS', value: '7440-23-5', label: {en:'Sodium'} });
    var kalium = models.Code.model({ standard: 'CAS', value: '7440-09-7', label: {en: 'Potassium'} });
    var calcium = models.Code.model({ standard: 'CAS', value: '7440-70-2', label: {en:'Calcium' }});
    var nitrat = models.Code.model({ standard: 'CAS', value: '14797-55-8', label: {en:'Nitrate' }});
    var magnesium = models.Code.model({ standard: 'CAS', value: '7439-95-4', label: {en:'Magnesium'} });
    var fluorid = models.Code.model({ standard: 'CAS', value: '16984-48-8', label: {en:'Fluoride' }});
    var chlorid = models.Code.model({ standard: 'CAS', value: '16887-00-6', label: {en:'Chloride' }});
    var sulfat = models.Code.model({ standard: 'CAS', value: '14808-79-8', label: {en:'Sulfate' }});
    var hydrogene = models.Code.model({ standard: 'CAS', value: '1333-74-0', label: {en:'Hydrogen' }});
    var microbacteria = models.Code.model({ standard: 'CAS', value: '', label: {en:'Microbacteria' }});
    var bicarbonate = models.Code.model({ standard: 'CAS', value: '', label: {en:'Bicarbonate (HCO3)' }});
    var silica = models.Code.model({ standard: 'CAS', value: '3163-01-7', label: {en:'Silicate' }});
    var trihalomethane = models.Code.model({ standard: 'CAS', value: '', label: {en:'Trihalomethanes (THMS)' }});
    var uslimit = models.Limit.model({
      name: 'US',
      limits: [
        models.Observation.model({ value: 200, uom: mgl, code: natrium }),
        models.Observation.model({ value: null, uom: mgl, code: kalium }),
        models.Observation.model({ value: null, uom: mgl, code: calcium }),
        models.Observation.model({ value: 50, uom: mgl, code: nitrat }),
        models.Observation.model({ value: null, uom: mgl, code: magnesium }),
        models.Observation.model({ value: 0, uom: mgl, code: fluorid }),
        models.Observation.model({ value: 250, uom: mgl, code: chlorid }),
        models.Observation.model({ value: 250, uom: mgl, code: sulfat }),
        models.Observation.model({ value: null, uom: mgl, code: hydrogene }),
        models.Observation.model({ value: null, uom: mgl, code: microbacteria }),
        models.Observation.model({ value: null, uom: mgl, code: bicarbonate }),
        models.Observation.model({ value: null, uom: mgl, code: silica }),
        models.Observation.model({ value: null, uom: mgl, code: trihalomethane })
      ],
      sources: ['https://www.epa.gov/dwstandardsregulations/secondary-drinking-water-standards-guidance-nuisance-chemicals',
        'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Chemicalcontaminants.shtml',
        'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Documents/EDTlibrary/storlist.xls'],
      authority: null
    });

    var eulimit = models.Limit.model({
      name: 'US',
      limits: [
        models.Observation.model({ value: 200, uom: mgl, code: natrium }),
        models.Observation.model({ value: 12, uom: mgl, code: kalium }),
        models.Observation.model({ value: 400, uom: mgl, code: calcium }),
        models.Observation.model({ value: 60, uom: mgl, code: nitrat }),
        models.Observation.model({ value: 60, uom: mgl, code: magnesium }),
        models.Observation.model({ value: 0, uom: mgl, code: fluorid }),
        models.Observation.model({ value: 240, uom: mgl, code: chlorid }),
        models.Observation.model({ value: 240, uom: mgl, code: sulfat }),
        models.Observation.model({ value: null, uom: mgl, code: hydrogene }),
        models.Observation.model({ value: null, uom: mgl, code: microbacteria }),
        models.Observation.model({ value: null, uom: mgl, code: bicarbonate }),
        models.Observation.model({ value: null, uom: mgl, code: silica }),
        models.Observation.model({ value: null, uom: mgl, code: trihalomethane })
      ],
      sources: ['url_needed'],
      authority: null
    });

    var output = [uslimit.toJSONLocalizedOnly('en','en'), eulimit.toJSONLocalizedOnly('en','en')];
    res.setHeader('content-type', 'application/json');
    res.setHeader('charset', 'utf-8');
    res.end(JSON.stringify(output, null, 2));
  };
}());
