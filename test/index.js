// Swagger, general API testing
require("./testSwagger");

// Model testing

describe('Preparing data', function() {
  require("./testUom");
  require("./testCode");
  require("./testCompany");
  require("./testProduct");
  require("./testNorms");
  require("./testLocation");
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
