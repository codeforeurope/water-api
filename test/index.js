// Swagger, general API testing
require("./testSwagger");

// Model testing
//require("./testUom");
describe('Preparing data', function() {
  require("./testUom");
  require("./testCode");
  require("./testCompany");
  require("./testProduct");
  require("./testLimits");
  require("./testZone");
  require("./testObservation");
  require("./testReport");
});

describe('Updating', function() {
  require("./testLocation");
});

describe('Testing GET routes', function() {
  require("./testGet");
  require("./testJurisdiction");
  require("./testObservationAverage");
});
