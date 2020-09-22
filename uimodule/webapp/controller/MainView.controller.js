sap.ui.define(
	[
		'de/mindsquare/ceramtecterminal/controller/BaseController',
		'sap/ui/model/Filter',
		'sap/ui/model/FilterOperator'
	],
	function(Controller, Filter, FilterOperator) {
		'use strict';

		return Controller.extend('de.mindsquare.ceramtecterminal.controller.MainView', {
			onInit: function() {
				this.getRouter().getRoute('RouteMainView').attachMatched(this._handleRouteMatched, this);
				this.getRouter().getRoute('').attachMatched(this._handleRouteMatched, this);
			},
			_handleRouteMatched: function(oEvent) {
				this.refreshTime();
				setInterval(
					function() {
						this.refreshTime();
					}.bind(this),
					1000
				);
				//bind something
			},

			showTerminals: function(oEvent) {
				if (!this.Terminals) {
					this.Terminals = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.Terminals',
						this
					);
					this.getView().addDependent(this.Terminals);
				}
				this.Terminals.openBy(oEvent.getSource());
			},

			onChooseTerminal: function(oEvent) {
				//switch Terminal
			},

			onPressFunction: function(oEvent) {
				if (!this.identDialog) {
					this.identDialog = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.identDialog',
						this
					);
					this.getView().addDependent(this.identDialog);
				}
				this.sDialogName = oEvent.getSource().getHeader();
				this.identDialog.open();
			},

			onPressTile: function(oEvent) {
				//Set Ist-Abreitsplatz ja nein
				this.getView().getModel("functions").setProperty("/Platzname", oEvent.getSource().getHeader());
				this.getRouter().navTo("toArbeitsplatz");
			},

			onSwitchActive: function(oEvent) {
				var oCtx = oEvent.getSource().getBindingContext('functions');
				var oModel = this.getView().getModel('functions');
				if (oEvent.getParameter('state')) {
					oModel.setProperty('Time', new Date().toLocaleTimeString(), oCtx);
					oModel.setProperty('Date', new Date().toLocaleDateString(), oCtx);
				} else {
					oModel.setProperty('Time', null, oCtx);
					oModel.setProperty('Date', null, oCtx);
				}
			},

			onSwitchActivePause: function(oEvent) {
				var oCtx = oEvent.getSource().getBindingContext('functions');
				var oModel = this.getView().getModel('functions');
				var sMinutes = oCtx.getProperty('Duration');
				var oDate = new Date();
				if (oEvent.getParameter('state')) {
					oModel.setProperty('FromTime', oDate.toLocaleTimeString(), oCtx);
					oModel.setProperty('FromDate', oDate.toLocaleDateString(), oCtx);
					if (!isNaN(sMinutes)) {
						if (sMinutes == 30) {
							oModel.getProperty()
						}
						oDate.setMinutes(oDate.getMinutes() + sMinutes);
						oModel.setProperty('ToTime', oDate.toLocaleTimeString(), oCtx);
						oModel.setProperty('ToDate', oDate.toLocaleDateString(), oCtx);
						oEvent.getSource().setEnabled(false);
					}
				} else {
					if (isNaN(sMinutes)) {
						oModel.setProperty('ToTime', oDate.toLocaleTimeString(), oCtx);
						oModel.setProperty('ToDate', oDate.toLocaleDateString(), oCtx);
						oEvent.getSource().setEnabled(false);
					}
				}
			},

			onPressCountGemein: function(oEvent) {
				if (!this.Popover) {
					this.Popover = sap.ui.xmlfragment('de.mindsquare.ceramtecterminal.view.fragments.Popover', this);
					this.getView().addDependent(this.Popover);
				}
				this.Popover.openBy(oEvent.getSource());
			},
			onPressCountPause: function(oEvent) {
				this.onPressCountGemein(oEvent);
			},
			onSelectVorgaenge: function(oEvent) {
				var oTable = sap.ui.getCore().byId('VorgangTable');
				var oBinding = oTable.getBinding('items');
				var aFilters = [];
				var oModel = this.getView().getModel('functions');
				if (oEvent.getParameter('item').getKey() === 'Alle') {
					oModel.setProperty('/notall', false);
				} else {
					aFilters.push(new Filter('Werker', FilterOperator.EQ, 'Daniel Raßbach'));
					oModel.setProperty('/notall', true);
				}
				oBinding.filter(aFilters);
			},
			addNewVorgang: function() {
				var oModel = this.getView().getModel('functions');
				oModel.setProperty('/newAuftrag', '');
				oModel.setProperty('/newVorgang', '');
				if (!this.newVorgang) {
					this.newVorgang = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.newVorgang',
						this
					);
					this.getView().addDependent(this.newVorgang);
				}
				this.newVorgang.open();
			},

			addVorgang: function(oEvent) {
				var oModel = this.getView().getModel('functions');
				var aVorgang = oModel.getProperty('/VorgangCollection');
				var oObject = {};
				oObject.Auftrag = oModel.getProperty('/newAuftrag');
				oObject.Vorgang = oModel.getProperty('/newVorgang');
				oObject.Werker = 'Daniel Raßbach';
				oObject.Active = true;
				oObject.Time = new Date().toLocaleTimeString();
				oObject.Date = new Date().toLocaleDateString();
				aVorgang.push(oObject);
				oModel.setProperty('/VorgangCollection', aVorgang);
				this.newVorgang.close();
			},

			onDeleteVorgang: function(oEvent) {
				var oCtx = oEvent.getSource().getBindingContext('functions');
				var oModel = this.getView().getModel('functions');
				var aVorgang = oModel.getProperty('/VorgangCollection');
				aVorgang.splice(oCtx.getPath().substr(oCtx.getPath().length - 1), 1);
				oModel.refresh(true);
			}
		});
	}
);
