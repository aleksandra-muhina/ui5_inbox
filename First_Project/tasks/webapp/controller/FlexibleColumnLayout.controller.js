sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("sap.f.FlexibleColumnLayoutWithOneColumnStart.controller.FlexibleColumnLayout", {
		onInit() {
			this.oFCL = this.getView().byId("fcl");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
		},

		onRouteMatched(oEvent) {
			const sRouteName = oEvent.getParameter("name");
			const oArguments = oEvent.getParameter("arguments");
			this._updateUIElements();

			this.currentRouteName = sRouteName;
			this.currentTask = oArguments.task;
		},

		onStateChanged(oEvent) {
			const bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");
			this._updateUIElements();
			
			if(bIsNavigationArrow){
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, task: this.currentTask}, true);
			}
		},

		_updateUIElements() {
			const oModel = this.getOwnerComponent().getModel();
			let oUIState;

			this.getOwnerComponent().getHelper().then((oHelper) => {
				oUIState = oHelper.getCurrentUIState();
				oModel.setData(oUIState);
			});
		}
    });
});