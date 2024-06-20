trigger InvoiceTrigger on Invoice__c (before insert, before update, after insert, after update) {


    if (Trigger.isAfter && Trigger.isUpdate) {
        Logger.debug('InvoiceTrigger: Trigger.isAfter && Trigger.isUpdate : ' +  JSON.serialize((Trigger.isAfter && Trigger.isUpdate)));
        Logger.saveLog();
    
        for (Invoice__c newInvoice : Trigger.new) {
            Invoice__c oldInvoice = Trigger.oldMap.get(newInvoice.Id);
            if (newInvoice.DateDepot__c != oldInvoice.DateDepot__c) {
                Logger.debug('InvoiceTrigger:sendEmails:datedepot changed: ' +  JSON.serialize((newInvoice.DateDepot__c != oldInvoice.DateDepot__c)));
                Logger.saveLog();
            
                ApexHelperMethods.verifyInvoiceDelay(Trigger.new);
                break; // Break out of loop after verifying one invoice
            }
        }
    }


    if(Trigger.isBefore){

        if(Trigger.isInsert){

        }

        if(Trigger.isUpdate){
            ApprovalProcessService.setCurrentApprovers(Trigger.new, Trigger.oldMap);
            SM019_ManageUpdateRecordsPermission.validateUpdatePermission(Trigger.new, Trigger.oldMap, 'Invoice__c', '');
            SM005_InvoiceTriggerHandler.handleBeforUpdate(Trigger.new,Trigger.oldMap);
        }

        if(Trigger.isDelete){

        }

    }
    if(Trigger.isAfter){

        if(Trigger.isInsert){

        }

        if(Trigger.isUpdate){
            SM005_InvoiceTriggerHandler.handleAfterUpdate(Trigger.new,Trigger.oldMap);
            SM005_InvoiceTriggerHandler.updateTotalAmountInvoiced(Trigger.new,Trigger.oldMap);
            SM046_LoiFinance.calculMontantRasPSPP(Trigger.new, Trigger.oldMap);
        }

    }
}