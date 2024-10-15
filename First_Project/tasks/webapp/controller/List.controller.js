sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    "sap/f/library"
],
function (Controller, Device, Filter, FilterOperator, Sorter, Fragment, fioriLibrary) {
    "use strict";

    return Controller.extend("tasks.tasks.controller.List", {
        onInit() {
            this.oTaskModel = this.getOwnerComponent().getModel("tasks");
            this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.oTitle = this.getView().byId("tableTitle");
            this.oTable = this.getView().byId("taskTable");
            this._mViewSettingsDialogs = {};

            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onAfterRendering() {
            this.updateTaskNumber();
            /*const widthDiv = document.getElementById("application-taskstasks-display");
            widthDiv.classList.remove("sapUShellApplicationContainerLimitedWidth");*/
        },

        updateTaskNumber() {
            const oTableItems = this.oTable.getBinding("items").getLength();
            this.oTaskModel.setProperty("/tableCounter", oTableItems);
            /*const sTitleText = this.oResourceBundle.getText("title", [oTableItems]);
            this.oTitle.setText(sTitleText);*/

        },
        
        onTaskPress(oEvent) {
            const oTask = oEvent.getParameter("listItem"),
                taskPath = oTask.getBindingContext("tasks").getPath(),
                task = taskPath.split("/").slice(-1).pop();

            this.oRouter.navTo("RouteDetail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, task: task});
        },

        onSearch(oEvent) {
            let oTableSearchState = [];
            const sQuery = oEvent.getParameter("query");

            if(sQuery && sQuery.length > 0) {
                oTableSearchState = [new Filter("name", FilterOperator.Contains, sQuery)];
            }
            
            this.getView().byId("taskTable").getBinding("items").filter(oTableSearchState, "Application");
            this.updateTaskNumber();
        },

        getViewSettingsDialog(sDialogFragmentName) {
            let pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

            if (!pDialog) {
                pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: sDialogFragmentName,
                    controller: this
                }).then((oDialog) => {
                    if(Device.system.desktop){
                        oDialog.addStyleClass("sapUiSizeCompact");
                    }
                    return oDialog;
                });
                this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            }
            return pDialog;
        },

        onSortButtonPress() {
            this.getViewSettingsDialog("tasks.tasks.view.SortingDialog")
                .then((oViewSettingsDialog) => {
                    oViewSettingsDialog.open();
            });
        },

        onFilterButtonPress() {
            this.getViewSettingsDialog("tasks.tasks.view.FilterDialog")
                .then((oViewSettingsDialog) => {
                    oViewSettingsDialog.open();
                });
        },

        onGroupButtonPress() {
            this.getViewSettingsDialog("tasks.tasks.view.GroupDialog")
                .then((oViewSettingsDialog) => {
                    oViewSettingsDialog.open();
                });
        },

        onSortDialogConfirm(oEvent) {
            const mParams = oEvent.getParameters(),
                oBinding = this.oTable.getBinding("items");
            let sPath,
                bDescending,
                aSorters = [];
            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;

            if(sPath === "priority") {
                const oSorter = new Sorter(sPath, bDescending, false, (a, b) => {
                    const aPriorityOrder = ["VERY HIGH", "HIGH", "MEDIUM", "LOW"];
                    return aPriorityOrder.indexOf(a) - aPriorityOrder.indexOf(b);
                });
                aSorters.push(oSorter);
            } else {
                aSorters.push(new Sorter(sPath, bDescending));
            }
            oBinding.sort(aSorters);
        },

        onFilterDialogConfirm(oEvent) {
            const mParams = oEvent.getParameters(),
                oBinding = this.oTable.getBinding("items");
            let aFilters = [];

            mParams.filterItems.forEach((oItem) => {
                const sFilterKey = oItem.getParent().getKey();  
                const sFilterValue = oItem.getKey();            
                const oFilter = new Filter({
                    path: sFilterKey,                           
                    operator: FilterOperator.EQ,   
                    value1: sFilterValue                        
                });
                aFilters.push(oFilter); 
            });
			oBinding.filter(aFilters);
            this.updateTaskNumber();
        },

        onGroupDialogConfirm(oEvent) {
            const mParams = oEvent.getParameters(),
                oBinding = this.oTable.getBinding("items");
            let sPath,
                bDescending,
                vGroup,
                aGroup = [];

            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = (oContext) => {
                    const value = oContext.getProperty(sPath);
                    return {
                        key: value,
                        text: value
                    };
                };

                if(sPath === "priority"){
                    const oSorter = new Sorter(sPath, bDescending, vGroup, (a, b) => {
                        const aPriorityOrder = ["VERY HIGH", "HIGH", "MEDIUM", "LOW"];
                        return aPriorityOrder.indexOf(a) - aPriorityOrder.indexOf(b);
                    });
                    aGroup.push(oSorter);
                } else {
                    aGroup.push(new Sorter(sPath, bDescending, vGroup));
                }
                oBinding.sort(aGroup);
            } else {
                oBinding.sort();
            }
        }
    
    });
});
