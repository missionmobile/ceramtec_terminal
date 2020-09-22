sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "de/mindsquare/ceramtecterminal/model/formatter",
  'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function(Controller, History, UIComponent, formatter, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("de.mindsquare.ceramtecterminal.controller.BaseController", {

    formatter: formatter,

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     * @public
     * @param {string} sName the model name
     * @returns {sap.ui.model.Model} the model instance
     */
    getModel: function(sName) {
      return this.getView().getModel(sName);
    },

    /**
     * Convenience method for setting the view model in every controller of the application.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     */
    setModel: function(oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    /**
     * Convenience method for getting the resource bundle.
     * @public
     * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
     */
    getResourceBundle: function() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    /**
     * Method for navigation to specific view
     * @public
     * @param {string} psTarget Parameter containing the string for the target navigation
     * @param {mapping} pmParameters? Parameters for navigation
     * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
     */
    navTo: function(psTarget, pmParameters, pbReplace) {
      this.getRouter().navTo(psTarget, pmParameters, pbReplace);
    },

    getRouter: function() {
      return UIComponent.getRouterFor(this);
    },

    onNavBack: function() {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.back();
      } else {
        this.getRouter().navTo("RouteMainView", {}, true /*no history*/ );
      }
    },

    onClose: function (sWindow) {
      var sCommand = "this." + sWindow + ".close()";
      eval(sCommand);
      sCommand = "this." + sWindow + ".destroy()";
      eval(sCommand);
      sCommand = "delete this." + sWindow;
      eval(sCommand);
    },
    onSelectActivity: function(oEvent) {
      var oModel = this.getView().getModel('functions');
      oModel.setProperty("/selectedActivity", oEvent.getParameter('item').getKey());
    },
    onSelectVorgang: function(oEvent) {
      var oModel = this.getView().getModel('functions');
      oModel.setProperty("/selectedVorgang", oEvent.getParameter('item').getKey());
    },

    refreshTime: function() {
			this.getView().getModel('functions').setProperty('/date', new Date().toLocaleDateString());
			this.getView().getModel('functions').setProperty('/time', new Date().toLocaleTimeString());
    },
    
    showIdent: function() {
			if (!this.identDialog) {
				this.identDialog = sap.ui.xmlfragment(
					'de.mindsquare.ceramtecterminal.view.fragments.identDialog',
					this
				);
				this.getView().addDependent(this.identDialog);
			}
			this.identDialog.open();
    },
    showContact: function() {
      if (!this.contactPerson) {
        this.contactPerson = sap.ui.xmlfragment(
          'de.mindsquare.ceramtecterminal.view.fragments.contactPerson',
          this
        );
        this.getView().addDependent(this.contactPerson);
      }
      this.contactPerson.open();
    },
    onIdent: function() {
      //identification
      this.identDialog.close();
      switch (this.sDialogName) {
        case 'Gemeinkosten':
          if (!this.selectGemein) {
            this.selectGemein = sap.ui.xmlfragment(
              'de.mindsquare.ceramtecterminal.view.fragments.selectGemein',
              this
            );
            this.getView().addDependent(this.selectGemein);
          }
          this.selectGemein.open();
          break;
        case 'Pause':
          if (!this.pauseDialog) {
            this.pauseDialog = sap.ui.xmlfragment(
              'de.mindsquare.ceramtecterminal.view.fragments.pauseDialog',
              this
            );
            this.getView().addDependent(this.pauseDialog);
          }
          var aFilterFest = [ new Filter('Duration', FilterOperator.GT, 0) ];
          var aFilterDynamic = [ new Filter('Duration', FilterOperator.EQ, 'Dynamic') ];
          sap.ui.getCore().byId('TableFest').getBinding('items').filter(aFilterFest);
          sap.ui.getCore().byId('TableDynamic').getBinding('items').filter(aFilterDynamic);
          this.pauseDialog.open();
          break;
        case 'Externe Mehrmaschinenbedienung':
          if (!this.externDialog) {
            this.externDialog = sap.ui.xmlfragment(
              'de.mindsquare.ceramtecterminal.view.fragments.externDialog',
              this
            );
            this.getView().addDependent(this.externDialog);
          }
          this.externDialog.open();
          break;
        case 'activityDialog':
          if (!this.activityDialog) {
            this.activityDialog = sap.ui.xmlfragment(
              'de.mindsquare.ceramtecterminal.view.fragments.activityDialog',
              this
            );
            this.getView().addDependent(this.activityDialog);
          }
          var oItemsExtern = sap.ui.getCore().byId("VorgangExternTable").getBinding("items");
          oItemsExtern.filter([new Filter('Werker', FilterOperator.EQ, 'Daniel Raßbach')]);
          var oItemsGemein = sap.ui.getCore().byId("GemeinTable").getBinding("items");
          oItemsGemein.filter([new Filter('Active', FilterOperator.EQ, true)]);
          this.activityDialog.open();
          break;
      }
    },
    allFunctions: function(oEvent) {
      this.sDialogName = 'activityDialog';
      this.showIdent();
    }

  });

});
