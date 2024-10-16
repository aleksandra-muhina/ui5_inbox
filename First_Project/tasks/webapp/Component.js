/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "tasks/tasks/model/models",
        "sap/ui/model/json/JSONModel",
        "sap/f/library", 
        "sap/f/FlexibleColumnLayoutSemanticHelper"
    ],
    function (UIComponent, Device, models, JSONModel, fioriLibrary, FlexibleColumnLayoutSemanticHelper) {
        "use strict";

        return UIComponent.extend("tasks.tasks.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init() {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();
                this.getRouter().attachBeforeRouteMatched(this._onBeforeRouteMatched, this);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.oTaskModel = this.getModel("tasks");
                this.oResourceModel = this.getModel("i18n");
                this.oModel = new JSONModel();
                this.setModel(this.oModel);
                this.oHelperModel = new JSONModel({
                    showToggle: true
                });
                this.setModel(this.oHelperModel, "helper")
            },

            _onBeforeRouteMatched(oEvent) {
                let sLayout = oEvent.getParameters().arguments.layout;

                if(!sLayout) {
                    sLayout = "OneColumn";
                }

                this.oModel.setProperty("/layout", sLayout);
            }
        });
    }
);