/*
http://www.eupedia.com/europe/european_mineral_waters.shtml
*/

(function () {
  'use strict';
  var company = require('../models/Company.js');
  var product = require('../models/Product.js');
  var observation = require('../models/Observation.js');
  var Uom = require('../models/Uom.js');
  var Code = require('../models/Code.js');
  module.exports.get = function (req, res, next) {
    var params = req.swagger.params;
    var mgl = new Uom.model({
      value: 'mg/L',
      label: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'
    });
    var natrium = new Code.model({standard: 'CAS', value: '7440-23-5', label: 'Sodium'});
    var kalium = new Code.model({standard: 'CAS', value: '7440-09-7', label: 'Potassium'});
    var calcium = new Code.model({standard: 'CAS', value: '7440-70-2', label: 'Calcium'});
    var magnesium = new Code.model({standard: 'CAS', value: '7439-95-4', label: 'Magnesium'});
    var fluorid = new Code.model({standard: 'CAS', value: '16984-48-8', label: 'Fluoride'});
    var chlorid = new Code.model({standard: 'CAS', value: '16887-00-6', label: 'Chloride'});
    var sulfat = new Code.model({standard: 'CAS', value: '14808-79-8', label: 'Sulfate'});
    var hydrogene = new Code.model({standard: 'CAS', value: '1333-74-0', label: 'Hydrogen'});
    var nitrat = new Code.model({standard: 'CAS', value: '14797-55-8', label: 'Nitrate'});
    var bicarbonate = new Code.model({standard: 'CAS', value: '', label: 'Bicarbonate (HCO3)'});
    var silica = new Code.model({standard: 'CAS', value: '3163-01-7', label: 'Silicate'});
    var trihalomethane = new Code.model({standard: 'CAS', value: '', label: 'Trihalomethanes (THMS)'});
    var microbacteria = new Code.model({standard: 'CAS', value: '', label: 'Microbacteria'});

    var wueteria = new company.model({
      code: 'wueteria',
      name: 'Wüteria Mineralquellen GmbH & Co. KG',
      url: 'http://wueteria.de',
      country: 'Germany'
    });
    var teusser = new company.model({
      code: 'teuser',
      name: 'Teusser Mineralbrunnen Karl Rössle GmbH & Co KG',
      url: 'http://wueteria.de',
      country: 'Germany'
    });
    var jointhepipe = new company.model({
      code: 'jointhepipe',
      name: 'Join-The-Pipe',
      url: 'http://join-the-pipe.org/',
      country: 'Netherlands'
    });
    var vittel = new company.model({
      code: 'vittel',
      name: 'Vittel',
      url: 'www.nestle-waters.com/brands/vittel',
      country: ''
    });
    var volvic = new company.model({
      code: 'volvic',
      name: 'Volvic',
      url: 'www.nestle-waters.com/brands/vittel',
      country: ''
    });
    /*	"salvus": {
		"natrium": 19.9,
		"kalium": 1.1,
		"calcium": 76,
		"magnesium": 4,
		"chlorid": 50,
		"nitrat": 0,
		"sulfat": 40,
		"sources": ["http://www.salvus.de/produkte/salvus-mineralwasser-naturell/"]
	},
	"apodis": {
		"natrium": 19,
		"kalium": 1.3,
		"calcium": 110.2,
		"magnesium": 5.9,
		"chlorid": 42,
		"nitrat": 0,
		"sulfat": 73,
		"sources": ["http://www.mineralwasser-genuss.de/apodis/"]
	},
	"sawell": {
		"natrium": 22,
		"kalium": 0.7,
		"calcium": 76,
		"magnesium": 3.8,
		"chlorid": 52,
		"nitrat": 0,
		"sulfat": 52,
		"sources": ["http://www.mineralwasser-genuss.de/sawell/"]
	},

  */
    var volvicwater = new product.model({
      name: 'Volvic',
      observations: [
        new observation.model({value: 11.6, uom: mgl, eqr: natrium}),
        new observation.model({value: 71, uom: mgl, eqr: bicarbonate}),
        new observation.model({value: 31.7, uom: mgl, eqr: silica}),
        new observation.model({value: 6.2, uom: mgl, eqr: kalium}),
        new observation.model({value: 11.5, uom: mgl, eqr: calcium}),
        new observation.model({value: 8, uom: mgl, eqr: magnesium}),
        new observation.model({value: null, uom: mgl, eqr: fluorid}),
        new observation.model({value: 13.5, uom: mgl, eqr: chlorid}),
        new observation.model({value: 8.1, uom: mgl, eqr: sulfat}),
        new observation.model({value: null, uom: mgl, eqr: hydrogene}),
        new observation.model({value: 6.9, uom: mgl, eqr: nitrat}) // 6.3 Wikipedia
      ],
      sources: ['http://books.google.de/books?id=lzEoGWyqMBwC&pg=PA198&lpg=PA198&dq=volvic+nitratgehalt&source=bl&ots=pJEE0i9HwK&sig=OI_PeSr_QGBCfpeVCu70N4ohy8g&hl=de&ei=4-yvSuHrJ8jK_gbV0p3ZDA&sa=X&oi=book_result&ct=result&resnum=6#v=onepage&q&f=false'],
      vendor: volvic
    });
    var vittelwater = new product.model({
      name: 'Vittel',
      observations: [
        new observation.model({value: 7.7, uom: mgl, eqr: natrium}),
        new observation.model({value: 5.2, uom: mgl, eqr: kalium}),
        new observation.model({value: 94, uom: mgl, eqr: calcium}),
        new observation.model({value: 20, uom: mgl, eqr: magnesium}),
        new observation.model({value: 0.22, uom: mgl, eqr: fluorid}),
        new observation.model({value: 3.8, uom: mgl, eqr: chlorid}),
        new observation.model({value: 120, uom: mgl, eqr: sulfat}),
        new observation.model({value: 455, uom: mgl, eqr: hydrogene}),
        new observation.model({value: 120, uom: mgl, eqr: nitrat})
      ],
      sources: ['http://books.google.de/books?id=lzEoGWyqMBwC&pg=PA198&lpg=PA198&dq=volvic+nitratgehalt&source=bl&ots=pJEE0i9HwK&sig=OI_PeSr_QGBCfpeVCu70N4ohy8g&hl=de&ei=4-yvSuHrJ8jK_gbV0p3ZDA&sa=X&oi=book_result&ct=result&resnum=6#v=onepage&q&f=false"]'],
      vendor: vittel
    });

    var heiligenquelleclassic = new product.model({
      name: 'HEILIGENQUELLE CLASSIC',
      observations: [
        new observation.model({value: 10.7, uom: mgl, eqr: natrium}),
        new observation.model({value: 2.6, uom: mgl, eqr: kalium}),
        new observation.model({value: 118, uom: mgl, eqr: calcium}),
        new observation.model({value: 48, uom: mgl, eqr: magnesium}),
        new observation.model({value: 0.22, uom: mgl, eqr: fluorid}),
        new observation.model({value: 43, uom: mgl, eqr: chlorid}),
        new observation.model({value: 68, uom: mgl, eqr: sulfat}),
        new observation.model({value: 455, uom: mgl, eqr: hydrogene})
      ],
      sources: ['http://wueteria.de/unser-wasser/unsere-mineralwasserquellen/'],
      vendor: wueteria
    });
    var teussernaturell = new product.model({
      name: 'Teusser Naturell',
      observations: [
        new observation.model({value: 53, uom: mgl, eqr: natrium}),
        new observation.model({value: 7, uom: mgl, eqr: kalium}),
        new observation.model({value: 537, uom: mgl, eqr: calcium}),
        new observation.model({value: 0.5, uom: mgl, eqr: nitrat}),
        new observation.model({value: 92, uom: mgl, eqr: magnesium}),
        new observation.model({value: 0.21, uom: mgl, eqr: fluorid}),
        new observation.model({value: 27, uom: mgl, eqr: chlorid}),
        new observation.model({value: 1467, uom: mgl, eqr: sulfat}),
        new observation.model({value: 357, uom: mgl, eqr: hydrogene})
      ],
      sources: ['http://www.teusser.de/index.php?id=225'],
      vendor: teusser
    });

    var output = [heiligenquelleclassic.toObject(), teussernaturell.toObject(), vittel.toObject(), volvicwater.toObject()];
    res.setHeader('content-type', 'application/json');
    res.setHeader('charset', 'utf-8');
    res.end(JSON.stringify(output, null, 2));
  };

  module.exports.post = function (req, res, next) {
    var params = req.swagger.params;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({'operation': 'POST'}, null, 2));
  };

  module.exports.put = function (req, res, next) {
    var params = req.swagger.params;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({'operation': 'PUT'}, null, 2));
  };
  module.exports.delete = function (req, res, next) {
    var params = req.swagger.params;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({'operation': 'DELETE'}, null, 2));
  };
}());
