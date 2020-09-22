sap.ui.define([
  "sap/ui/test/Opa5",
  "de/mindsquare/ceramtecterminal/test/integration/arrangements/Startup",
  "de/mindsquare/ceramtecterminal/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    pollingInterval: 1
  });

});
