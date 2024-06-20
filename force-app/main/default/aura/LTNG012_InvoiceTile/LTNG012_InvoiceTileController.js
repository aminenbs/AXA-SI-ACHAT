({
    handleSuivant : function(component, event, helper) {
        helper.showSpinner(component);
        helper.fireNextUpdateEvent(component, '', null);
    },
    handlePrevious : function(component, event, helper) {
        helper.showSpinner(component);
        helper.firePreviousUpdateEvent(component);
    },
    handleRefuse : function(component, event, helper) {
        component.set('v.showRejectConfirmation', true);
    },
    handleConfirmReject : function(component, event, helper) {
        let commentaire = component.get('v.rejectComment');
        if(commentaire && commentaire.trim()){
            helper.refuseInvoice(component, event, helper);
        }
    },
    handleUpdateInvoice : function(component, event, helper) {

			let diffDays = Math.ceil(Math.abs(new Date(component.get('v.dateDepot') - new Date(component.get('v.dateFacture')).getTime()).getTime()) / (1000 * 3600 * 24));
            if (diffDays > 10) {
               // component.set('v.showConfirmationDateVerif', true);
                helper.showToast('warning','Délai d\'expiration de la facture', 'La différence entre la date de dépôt ('+component.get('v.dateDepot')+') et la date de facture ('+component.get('v.dateFacture')+') est supérieure à 10 jours.'); 
            }

        let isCaisse = component.get('v.invoice.TECH_FactureCaisse__c');
        if(isCaisse) {

            let entityId = component.get('v.selectedEntity.Id');
            if(!entityId){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectEntity"));
                return;
            }
            let numeroFacture = component.get('v.numeroFacture');
            //alert(numeroFacture.replace(/\s/g, '').length);
            if(!numeroFacture || (numeroFacture && numeroFacture.replace(/\s/g, '').length == 0) ) {
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceNumber"));
                return;
            }
            //#CH01 : Start
            let DescriptionComplete = component.get('v.DescriptionComplete');
            if(!DescriptionComplete){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), 'Veuillez saisir la Description Complète');
                return;
            }
            let dateDepot = component.get('v.dateDepot');
            if(!dateDepot){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), 'Veuillez saisir la Date de dépôt');
                return;
            }
            //#CH01 : End
            let dateFacture = component.get('v.dateFacture');
            if(!dateFacture){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceDate"));
                return;
            }
            let invoiceAmount = component.get('v.invoiceAmount');
            if(!invoiceAmount){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceAmount"));
                return;
            }
            let orderFormDisposition = component.get('v.selectedOrderFormDisposition.Id');
            if(!orderFormDisposition){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectOrderFormDisposition"));
                return;
            }
            helper.updateCaisseInvoice(component, event, helper);
        }else{
            
            let diffDays = Math.ceil(Math.abs(new Date(component.get('v.dateFacture')).getTime() - new Date(component.get('v.dateDepot')).getTime()) / (1000 * 3600 * 24));
            
            if (diffDays > 10) {
               // component.set('v.showConfirmationDateVerif', true);
                helper.showToast('warning','Délai d\'expiration de la facture', 'La différence entre la date de dépôt ('+component.get('v.dateDepot')+') et la date de facture ('+component.get('v.dateFacture')+') est supérieure à 10 jours.'); 

            }


            
            let entityId = component.get('v.selectedEntity.Id');
            if(!entityId){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectEntity"));
                return;
            }
            let fournisseurId = component.get('v.selectedFournisseur.Id');
            if(!fournisseurId){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectSupplier"));
                return;
            }
            let numeroFacture = component.get('v.numeroFacture');
            //alert(numeroFacture.replace(/\s/g, '').length);
            if(!numeroFacture || (numeroFacture && numeroFacture.replace(/\s/g, '').length == 0) ) {
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceNumber"));
                return;
            }
            //#CH01 : Start
            let DescriptionComplete = component.get('v.DescriptionComplete');
            if(!DescriptionComplete){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), 'Veuillez saisir la Description Complète');
                return;
            }
            let dateDepot = component.get('v.dateDepot');
            if(!dateDepot){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), 'Veuillez saisir la Date de dépôt');
                return;
            }
            //#CH01 : End
            let dateFacture = component.get('v.dateFacture');
            if(!dateFacture){
                helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceDate"));
                return;
            }
            let contractId = component.get('v.selectedContract.Id');
            let orderFormId = component.get('v.selectedOrderForm.Id');
            let invoiceId = component.get('v.selectedInvoice.Id');
            let invoiceContactId = component.get('v.selectedInvoiceContact.Id');
            
            let recordIdSelected = '';
            if(contractId){
                recordIdSelected = contractId;
            }else if(orderFormId){
                recordIdSelected = orderFormId;
            }else if(invoiceId){
                recordIdSelected = invoiceId;
            }
            

            if(recordIdSelected === ''){
                if(!invoiceContactId){
                    helper.showToast('warning', $A.get("$Label.c.LTNG012_FormulaireNonComplete"), $A.get("$Label.c.LTNG012_SelectInvoiceContact"));
                }else{
                    component.set('v.showConfirmationNoPO', true);
                	return;
                }
            }else{
                helper.updateCurrentInvoice(component, event, helper);
            }
        }        
    },
    selectedContractChange : function(component, event, helper) {
        let selectedRecord = component.get('v.selectedContract');
        if(selectedRecord.Id){
            component.set('v.showSelectedFournisseur', true);
            component.set('v.showSelectedOrderForm', true);
            component.set('v.showSelectedInvoice', true);
            component.set('v.contactFactureRequired', false);
        }else{
            component.set('v.showSelectedFournisseur', false);
            component.set('v.showSelectedOrderForm', false);
            component.set('v.showSelectedInvoice', false);
            component.set('v.contactFactureRequired', true);
        }
    },
    selectedOrderFormChange : function(component, event, helper) {
        let selectedRecord = component.get('v.selectedOrderForm');
        if(selectedRecord.Id){
            component.set('v.showSelectedFournisseur', true);
            component.set('v.showSelectedContract', true);
            component.set('v.showSelectedInvoice', true);
            component.set('v.contactFactureRequired', false);
        }else{
            component.set('v.showSelectedFournisseur', false);
            component.set('v.showSelectedContract', false);
            component.set('v.showSelectedInvoice', false);
            component.set('v.contactFactureRequired', true);
        }
    },
    selectedInvoiceChange : function(component, event, helper) {
        let selectedRecord = component.get('v.selectedInvoice');
        if(selectedRecord.Id){
            component.set('v.showSelectedFournisseur', true);
            component.set('v.showSelectedContract', true);
            component.set('v.showSelectedOrderForm', true);
            component.set('v.contactFactureRequired', false);
        }else{
            component.set('v.showSelectedFournisseur', false);
            component.set('v.showSelectedContract', false);
            component.set('v.showSelectedOrderForm', false);   
            component.set('v.contactFactureRequired', true);
        }
    },
    handleCancelConfirmation : function(component, event, helper) {
        component.set('v.showConfirmationDateVerif', false);
        component.set('v.showConfirmationNoPO', false);
        component.set('v.showRejectConfirmation', false);
        
    },
    handleConfirmPO : function(component, event, helper) {
        helper.updateCurrentInvoice(component, event, helper);
    }
})