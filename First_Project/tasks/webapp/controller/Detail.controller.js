sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel", 
    "sap/f/library",
    "sap/ui/Device"
], function(Controller, MessageToast, JSONModel, fioriLibrary, Device) {
    "use strict";
    
    return Controller.extend("tasks.tasks.controller.Detail", {
        
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("RouteDetail").attachPatternMatched(this.onObjectMatched, this);
            this.oRouter.getRoute("RouteList").attachPatternMatched(this.onObjectMatched, this);

            this.buttonEnterFullScreen = this.getView().byId("enterFullScreenBtn");
            this.buttonExitFullScreen = this.getView().byId("exitFullScreenBtn");
            this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.oTaskData = this.getOwnerComponent().getModel("tasks");
            this.oModel = this.getOwnerComponent().getModel();
        },

        onObjectMatched(oEvent) {
            /*this._task = oEvent.getParameter("arguments").task;
            this.getView().bindElement({
                path: "/tasks/" + this._task,
                model: "tasks"
            })*/

            const sId = oEvent.getParameter("arguments").task;
            const aTasks = this.oTaskData.getProperty("/tasks");
            const oSelected = aTasks.find((task) => task.id === sId);
            let oSelectedTaskModel = new JSONModel(oSelected);
            this.getView().setModel(oSelectedTaskModel, "selectedTask");
        }, 

        onClose() {
            //const sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("RouteList", {layout: fioriLibrary.LayoutType.OneColumn});
        },

        onToggleExpand() {
            const oFCL = this.getView().getParent().getParent(),
            sCurrentLayout = oFCL.getLayout(),
            oToggleButton = this.getView().byId("toggleExpand");

            if(sCurrentLayout === fioriLibrary.LayoutType.TwoColumnsMidExpanded) {
                oFCL.setLayout(fioriLibrary.LayoutType.MidColumnFullScreen);
                oToggleButton.setIcon("sap-icon://exit-full-screen");
            } else {
                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                oToggleButton.setIcon("sap-icon://full-screen");
            }
        },

        onApprove() {
            const oTaskId = this.getView().getModel("selectedTask").getData().id;
            const sApproveMsg = this.oResourceBundle.getText("approveMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
            this.oRouter.navTo("RouteList", {layout: fioriLibrary.LayoutType.OneColumn});
        },

        onReject() {
            const oTaskId = this.getView().getModel("selectedTask").getData().id;
            const sApproveMsg = this.oResourceBundle.getText("rejectMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
            this.oRouter.navTo("RouteList", {layout: fioriLibrary.LayoutType.OneColumn});
        },

        onForward() {
            const oTaskId = this.getView().getModel("selectedTask").getData().id;
            const sApproveMsg = this.oResourceBundle.getText("forwardMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
            this.oRouter.navTo("RouteList", {layout: fioriLibrary.LayoutType.OneColumn});
        },

        removeEntry(oTaskId) {
            const aTasks = this.oTaskData.getProperty("/tasks"),
                taskIndex = aTasks.findIndex((task) => task.id === oTaskId);
                aTasks.splice(taskIndex, 1);
                this.oTaskData.setProperty("/tasks", aTasks);
        }
    });
});