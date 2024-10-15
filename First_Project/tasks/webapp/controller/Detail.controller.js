sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel", 
    "sap/f/library"
], function(Controller, MessageToast, JSONModel, fioriLibrary) {
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

        onEnterFullScreen() {
            /*const sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("RouteDetail", {layout: sNextLayout, task: this._task});*/
            sap.ui.getCore().byId("application-taskstasks-display-component---fcl--fcl").setLayout("MidColumnFullScreen");

            
        },

        onExitFullScreen() {
            /*const sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("RouteDetail", {layout: sNextLayout, task: this._task});*/
            sap.ui.getCore().byId("application-taskstasks-display-component---fcl--fcl").setLayout("TwoColumnsMidExpanded");
        },

        onApprove(oEvent) {
            const oTaskId = oEvent.getSource().getBindingContext("tasks").getProperty("id");
            const sApproveMsg = this.oResourceBundle.getText("approveMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
        },

        onReject(oEvent) {
            const oTaskId = oEvent.getSource().getBindingContext("tasks").getProperty("id");
            const sApproveMsg = this.oResourceBundle.getText("rejectMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
        },

        onForward(oEvent) {
            const oTaskId = oEvent.getSource().getBindingContext("tasks").getProperty("id");
            const sApproveMsg = this.oResourceBundle.getText("forwardMsg");
            MessageToast.show(sApproveMsg);
            this.removeEntry(oTaskId);
        },

        removeEntry(oTaskId) {
            const aTasks = this.oTaskData.getProperty("/tasks"),
                taskIndex = aTasks.findIndex((task) => task.id === oTaskId);
                aTasks.splice(taskIndex, 1);
                this.oTaskData.setProperty("/tasks", aTasks);
        }
    });
});