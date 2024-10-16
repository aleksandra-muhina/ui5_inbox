sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device"
], function (Controller, Device) {
	"use strict";

	return Controller.extend("sap.f.FlexibleColumnLayoutWithOneColumnStart.controller.FlexibleColumnLayout", {
		onInit() {
			this.oFCL = this.getView().byId("fcl");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);

			Device.resize.attachHandler(this.onResize, this);
			this.onResize();
		},

		onRouteMatched(oEvent) {
			const sRouteName = oEvent.getParameter("name");
			const oArguments = oEvent.getParameter("arguments");

			this.currentRouteName = sRouteName;
			this.currentTask = oArguments.task;
		},

		onStateChanged(oEvent) {
			const bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");
			if(bIsNavigationArrow){
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, task: this.currentTask}, true);
			}
		},

		onResize() {
			if(Device.resize.width >= 960) {
				this.getOwnerComponent().getModel("helper").setProperty("/showToggle", true);
			} else {
				this.getOwnerComponent().getModel("helper").setProperty("/showToggle", false);
			}
		}
    });
});