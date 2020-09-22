sap.ui.define(
	[
		'de/mindsquare/ceramtecterminal/controller/BaseController',
		'sap/ui/model/Filter',
		'sap/ui/model/FilterOperator',
		'sap/ui/core/routing/History'
	],
	function(Controller, Filter, FilterOperator, History) {
		'use strict';

		return Controller.extend('de.mindsquare.ceramtecterminal.controller.Arbeitsplatz', {
			onInit: function() {
				this.getRouter().getRoute('toArbeitsplatz').attachMatched(this._handleRouteMatched, this);
			},

			_handleRouteMatched: function(oEvent) {
				this.refreshTime();
				setInterval(
					function() {
						this.refreshTime();
					}.bind(this),
					1000
				);
				var aFilterProduktion = [ new Filter('Status', FilterOperator.EQ, 'Produktion') ];
				aFilterProduktion.push(new Filter('Status', FilterOperator.EQ, 'Vorrüsten'));
				var aFilterVorrat = [ new Filter('Status', FilterOperator.EQ, 'Unterbrochen') ];
				aFilterVorrat.push(new Filter('Status', FilterOperator.EQ, 'Inaktiv'));
				this.getView().byId('ProduktionTable').getBinding('items').filter(aFilterProduktion);
				this.getView().byId('VorratTable').getBinding('items').filter(aFilterVorrat);
				//bind something
			},
			setStatus: function(oEvent) {
				if (!this.Statuswechsel) {
					this.Statuswechsel = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.Statuswechsel',
						this
					);
					this.getView().addDependent(this.Statuswechsel);
				}
				this.sDialogName = 'Statuswechsel';
				this.Statuswechsel.open();
			},
			SchichtbuchMaschine: function() {
				if (!this.SchichtEintrag) {
					this.SchichtEintrag = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.SchichtEintrag',
						this
					);
					this.getView().addDependent(this.SchichtEintrag);
				}
				this.sDialogName = 'SchichtEintrag';
				this.SchichtEintrag.open();
			},
			SchichtbuchVorgang: function(oEvent) {
				this.getView()
					.getModel('functions')
					.setProperty('/Maschine', 'Auftrag: 67328742, Vorgang: 00020, 3115 - Osterwalder Presse 1');
				this.SchichtbuchMaschine();
			},
			EintragSenden: function() {
				//Schichtbucheintrag Maschine
			},
			onSelectProduktion: function(oEvent) {
				this.getView().getModel('functions').setProperty('/showProduktionButtons', true);
				if (this.prevSelectedRow) {
					var cells = this.prevSelectedRow.getCells();
					cells[0].setEnabled(false);
				}
				var selectedRow = oEvent.getParameter('listItem');
				var cells = selectedRow.getCells();
				cells[0].setEnabled(true);
				this.prevSelectedRow = selectedRow;
			},
			onSelectVorrat: function() {
				this.getView().getModel('functions').setProperty('/showVorratButtons', true);
			},
			onImportVorgang: function() {
				if (!this.importVorgang) {
					this.importVorgang = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.importVorgang',
						this
					);
					this.getView().addDependent(this.importVorgang);
				}
				this.sDialogName = 'importVorgang';
				var aFilterVorrat = [ new Filter('Status', FilterOperator.EQ, 'Unterbrochen') ];
				aFilterVorrat.push(new Filter('Status', FilterOperator.EQ, 'Inaktiv'));
				sap.ui.getCore().byId('VorratTableDialog').getBinding('items').filter(aFilterVorrat);
				this.importVorgang.open();
			},
			onRueckmeldung: function() {
				if (!this.Rueckmeldung) {
					this.Rueckmeldung = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.Rueckmeldung',
						this
					);
					this.getView().addDependent(this.Rueckmeldung);
				}
				this.sDialogName = 'Rueckmeldung';
				this.Rueckmeldung.open();
			},
			onRueckmeldungFragment: function() {
				this.onClose(this.sDialogName);
				this.onRueckmeldung();
			},
			onVorgangsdaten: function() {
				if (!this.Vorgangsdaten) {
					this.Vorgangsdaten = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.Vorgangsdaten',
						this
					);
					this.getView().addDependent(this.Vorgangsdaten);
				}
				this.sDialogName = 'Vorgangsdaten';
				this.Vorgangsdaten.open();
			},
			onAddUrsache: function() {
				var sKey = sap.ui.getCore().byId('ComboUrsache').getSelectedKey();
				if (sKey) {
					var items = this.getView().getModel('functions').getProperty('/UrsacheCollection');
					for (var i = 0; i < items.length; i++) {
						if (items[i].Nummer === sKey) {
							items[i].Active = true;
						}
					}
				}
				this.getView().getModel('functions').refresh(true);
			},
			onDeleteUrsache: function(oEvent) {
				var sPath = oEvent.getSource().getParent().getBindingContextPath();
				var oItem = this.getView().getModel('functions').getProperty(sPath);
				oItem.Active = false;
				this.getView().getModel('functions').refresh(true);
			},
			onActionProduktion: function(oEvent) {
				if (!this.PopoverAction) {
					this.PopoverAction = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.PopoverAction',
						this
					);
					this.getView().addDependent(this.PopoverAction);
				}
				this.PopoverAction.openBy(oEvent.getSource());
			},
			onAction2: function(oEvent) {
				if (!this.PopoverAction2) {
					this.PopoverAction2 = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.PopoverAction2',
						this
					);
					this.getView().addDependent(this.PopoverAction2);
				}
				this.PopoverAction2.openBy(oEvent.getSource());
			},
			onWerkerAnmelden: function() {
				this.sDialogName = 'Close';
				this.showIdent();
			},
			onWerkerAbmelden: function() {
				if (!this.WarnungAbmelden) {
					this.WarnungAbmelden = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.WarnungAbmelden',
						this
					);
					this.getView().addDependent(this.WarnungAbmelden);
				}
				this.sDialogName = 'WarnungAbmelden';
				this.WarnungAbmelden.open();
			},
			onAbmeldenVorgang: function() {
				this.onClose(this.sDialogName);
				this.sDialogName = 'AbmeldenVorgang';
				this.showIdent();
			},
			onLoggedUsers: function(oEvent) {
				if (!this.Popover) {
					this.Popover = sap.ui.xmlfragment('de.mindsquare.ceramtecterminal.view.fragments.Popover', this);
					this.getView().addDependent(this.Popover);
				}
				this.Popover.openBy(oEvent.getSource());
			},
			onVorgangUmlagern: function() {
				if (!this.VorgangUmlagern) {
					this.VorgangUmlagern = sap.ui.xmlfragment(
						'de.mindsquare.ceramtecterminal.view.fragments.VorgangUmlagern',
						this
					);
					this.getView().addDependent(this.VorgangUmlagern);
				}
				this.sDialogName = 'VorgangUmlagern';
				this.VorgangUmlagern.open();
			}
		});
	}
);
