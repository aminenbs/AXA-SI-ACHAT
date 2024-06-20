({
    showToast : function(type, title, message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": type,
            "title": title,
            "duration":'5000',
            "message": message
        });
        toastEvent.fire();
    }, handleUpdateVerif : function(component, event, helper) {
                        let diffDays = Math.ceil(Math.abs(new Date(component.get('v.dateFacture')).getTime() - new Date(component.get('v.dateDepot')).getTime()) / (1000 * 3600 * 24));
            
            if (diffDays > 10) {
               // component.set('v.showConfirmationDateVerif', true);
                helper.showToast('warning','Délai d\'expiration de la facture', 'La différence entre la date de dépôt ('+component.get('v.dateDepot')+') et la date de facture ('+component.get('v.dateFacture')+') est supérieure à 10 jours.'); 

            }
        },
    fireNextUpdateEvent : function(component, lastAction, invoice) {
        var compEvent = component.getEvent("selectStep");
        compEvent.setParams({
            "selectedStep"  :   component.get('v.currentInvoiceStep') + 1,
            "lastAction"    :   lastAction,
            "invoice"       :   invoice
        });
        compEvent.fire();
    },
    firePreviousUpdateEvent : function(component) {
        var compEvent = component.getEvent("selectStep");
        compEvent.setParams({
            "selectedStep" : component.get('v.currentInvoiceStep') - 1
        });
        compEvent.fire();
    },
    showSpinner : function(component){
        component.set('v.spinner', '');
    },
    hideSpinner : function(component){
        component.set('v.spinner', 'slds-hide');
    },
    refuseInvoice : function(component, event, helper){
        helper.showSpinner(component);
        var action = component.get('c.rejectInvoice');
        action.setParams({
            invoiceId	: component.get('v.invoice.Id'),
            comment		: component.get('v.rejectComment')
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                let result = response.getReturnValue();
                if(result){
                    console.error(' ==========> Updated invoice :');
                    console.log(result);
                    helper.showToast('success', result.Name, 'Facture refusée');
                    helper.fireNextUpdateEvent(component, 'REFUSED', result);
                }else{
                    helper.showToast('warning', 'Erreur', $A.get("$Label.c.LTNG012_CantRefuseInvoice"));
                }
            }else if(response.getState() === "ERROR"){
                var errors = action.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        helper.showToast('error', 'Erreur', errors[0].message);
                    }
                }
            }else{
                helper.handleErrors($A.get("$Label.c.LTNG_InternalErrorContactAdmin"));
            }
            helper.hideSpinner(component);
        });
        $A.enqueueAction(action);
        
    },
    updateCurrentInvoice : function(component, event, helper){
        helper.showSpinner(component);
        let entityId = component.get('v.selectedEntity.Id');
        let fournisseurId = component.get('v.selectedFournisseur.Id');
        let contractId = component.get('v.selectedContract.Id');
        let orderFormId = component.get('v.selectedOrderForm.Id');
        let invoiceId = component.get('v.selectedInvoice.Id');
        let invoiceContactId = component.get('v.selectedInvoiceContact.Id');
        let numFacture = component.get('v.numeroFacture');
        let dateFacture = component.get('v.dateFacture');
        
        let recordIdSelected = '';
        if(contractId){
            recordIdSelected = contractId;
        }else if(orderFormId){
            recordIdSelected = orderFormId;
        }else if(invoiceId){
            recordIdSelected = invoiceId;
        }
        if(fournisseurId /**Add && numFacture && dateFacture if they should be required */){
            var action = component.get('c.updateInvoice');
            action.setParams({
                invoiceId               : component.get('v.invoice.Id'),
                entityId				: entityId,
                supplierInvoiceNumber   : numFacture,
                invoiceDate             : dateFacture,
                supplierId              : fournisseurId,
                relatedToId             : recordIdSelected,
                invoiceContactId        : invoiceContactId,
                descriptionComplete		: component.get('v.DescriptionComplete'), //#CH01
                dateDepot		        : component.get('v.dateDepot') //#CH01
            });
            action.setCallback(this, function(response) {
                if(response.getState() === 'SUCCESS') {
                    let result = response.getReturnValue();
                    if(result){
                        console.error(' ==========> Updated invoice :');
                        console.log(result);
                        helper.showToast('success', result.Name, $A.get("$Label.c.LTNG_InvoiceUpdated"));
                        helper.fireNextUpdateEvent(component, 'INDEXED', result);
                    }else{
                        helper.showToast('warning', 'Erreur', $A.get("$Label.c.LTNG012_CantMAJInvoice"));
                    }
                }else if(response.getState() === "ERROR"){
                    var errors = action.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            helper.showToast('error', 'Erreur', errors[0].message);
                        }
                    }
                }else{
                    helper.handleErrors($A.get("$Label.c.LTNG_InternalErrorContactAdmin"));
                }
                helper.hideSpinner(component);
            });
            $A.enqueueAction(action);
        }else{
            helper.showToast('warning', '', $A.get("$Label.c.LTNG012_FormulaireNonComplete"));
            helper.hideSpinner(component);
        }
    },
    updateCaisseInvoice : function(component, event, helper){
        helper.showSpinner(component);
        let numFacture = component.get('v.numeroFacture');
        let dateFacture = component.get('v.dateFacture');
		let entityId = component.get('v.selectedEntity.Id');
        
        var action = component.get('c.updateInvoiceCaisse');
        action.setParams({
            invoiceId 				: component.get('v.invoice.Id'),
            entityId				: component.get('v.selectedEntity.Id'),
            supplierInvoiceNumber   : numFacture,
            invoiceDate             : dateFacture,
            invoiceAmount			: component.get('v.invoiceAmount'),
            orderformId				: component.get('v.selectedOrderFormDisposition.Id'),
            transactionNumber		: component.get('v.transactionNumber'),
            comment					: component.get('v.comment'),
            descriptionComplete		: component.get('v.DescriptionComplete'), //#CH01
            dateDepot		        : component.get('v.dateDepot') //#CH01
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                let result = response.getReturnValue();
                if(result){
                    console.error(' ==========> Updated invoice :');
                    console.log(result);
                    helper.showToast('success', result.Name, 'Facture bien mise à jour');
                    helper.fireNextUpdateEvent(component, 'INDEXED', result);
                }else{
                    helper.showToast('warning', 'Erreur', $A.get("$Label.c.LTNG012_CantMAJInvoice"));
                    helper.hideSpinner(component);
                }
            }else if(response.getState() === "ERROR"){
                helper.handleErrors(response.getError());
                helper.hideSpinner(component);
            }else{
                helper.handleErrors($A.get("$Label.c.LTNG_InternalErrorContactAdmin"));
                helper.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
    },
    handleErrors: function (errors) {
        // Configure error toast
        let toastParams = {
            mode:"sticky",
            title: "Erreur",
            message: errors, // Default error message
            type: "error"
        };
        // Pass the error message if any
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        // Fire error toast
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    }
})