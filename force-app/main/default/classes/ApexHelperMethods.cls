public class ApexHelperMethods {

    // Make shouldLog final so it's evaluated once
    private static final Boolean SHOULD_LOG = loadShouldLog();

    public static void verifyInvoiceDelay(List<SObject> newObj) {
        logDebug('ApexHelperMethods:verifyInvoiceDelay:START');
        logDebug('ApexHelperMethods:verifyInvoiceDelay:SHOULD_LOG: '+SHOULD_LOG);

        for (SObject obj : newObj) {
            if (obj instanceof Invoice__c) {
                Invoice__c invoice = (Invoice__c) obj;
                if (invoice.Delay_Days__c > 10) {
                    sendEmails(invoice);
                }
            }
        }
    }

    private static void sendEmails(Invoice__c invoice) {
        logDebug('ApexHelperMethods:sendEmails:invoice: ' + JSON.serialize(invoice));

        String currentUserEmail = UserInfo.getUserEmail();
        String currentUserName = UserInfo.getLastName();
        Account supplier = getSupplier(invoice.Supplier__c);

        sendUserEmail(invoice, currentUserEmail, currentUserName);
        
        if (supplier != null && supplier.EmailPrincipale__c != null) {
            sendSupplierEmail(invoice, supplier.EmailPrincipale__c, supplier.Name);
        } else {
            logDebug('Supplier does not exist or does not have an email address');
        }
    }

    private static void sendUserEmail(Invoice__c invoice, String userEmail, String userName) {
        logDebug('ApexHelperMethods:sendUserEmail:userEmail: ' + userEmail);
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{userEmail, 'fatima.aitchaouit@axa.ma', 'fatine.moutaouakil@axa.ma', 'othman.aitaddi@axa.ma','abderrahim.bidaoui@axa.ma'});
        email.setSubject('Retard de facture pour l\'utilisateur actuel. Facture :' + invoice.Name);
        email.setPlainTextBody(('Bonjour ' + ',\n\n\n\t Veuillez noter que la facture du ' + userName 
                              + ' avec date facture fournisseur  ' + invoice.SupplierInvoiceNumber__c 
                              + ' VS ' + invoice.Name 
                              + ' a fait objet de retard de plus de 10 jours, entre date de facture du  '+ DateTime.newInstance(invoice.InvoiceDate__c.year(), invoice.InvoiceDate__c.month(), invoice.InvoiceDate__c.day()).format('dd-MM-yyyy')  
                              + '& date de réception par le Bureau d’ordre '+ DateTime.newInstance(invoice.DateDepot__c.year(), invoice.DateDepot__c.month(), invoice.DateDepot__c.day()).format('dd-MM-yyyy')
                              + '. Ainsi, pour respecter les dispositions de la loi 69-21 de la loi de finance 2023, un mail a été envoyé au prestataire concerné pour substituer la facture en retard'
                              + ' \n\n\t   A noter que la facture peut faire objet de comptabilisation à raison des exceptions (Organismes publics) ou retard toléré, selon la gestion du département comptabilité. '
                              + ' \n\n  Cordialement,\n Bureau D’ordre AXA Assurance Maroc'
                              ));
        
        logDebug('ApexHelperMethods:sendUserEmail:email: ' + JSON.serialize(email));
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});
    }

    private static void sendSupplierEmail(Invoice__c invoice, String supplierEmail, String supplierName) {
        logDebug('ApexHelperMethods:sendSupplierEmail:supplierEmail: ' + supplierEmail);

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{supplierEmail});
        email.setSubject('Notification de retard de facture pour le fournisseur. Facture :' + invoice.Name);
        email.setPlainTextBody('Bonjour ' + supplierName + ',\n\n Veuillez noter que la facture  ' + invoice.SupplierInvoiceNumber__c 
                              + ' VS ' + invoice.Name 
                              + ' a fait objet de retard de plus de 10 jours, entre date de facture du '+ DateTime.newInstance(invoice.InvoiceDate__c.year(), invoice.InvoiceDate__c.month(), invoice.InvoiceDate__c.day()).format('dd-MM-yyyy')  
                              + ' & date de réception par le Bureau d’ordre  '+ DateTime.newInstance(invoice.DateDepot__c.year(), invoice.DateDepot__c.month(), invoice.DateDepot__c.day()).format('dd-MM-yyyy')
                              + '. Ainsi, pour respecter les dispositions de la loi 69-21 de la loi de finance 2023, on vous prie de bien vouloir remplacer la facture en objet, par une nouvelle, comportant une date de facture ne dépassant pas les 10 jours de la date de son dépôt '
                              + ' \n\n  Cordialement,\n Bureau D’ordre AXA Assurance Maroc'
                              );
        
        logDebug('ApexHelperMethods:sendSupplierEmail:email: ' + JSON.serialize(email));
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});
    }

    private static Account getSupplier(Id supplierId) {
        return [
            SELECT EmailPrincipale__c, Name 
            FROM Account 
            WHERE Id = :supplierId 
            LIMIT 1
        ];
    }

    private static Boolean loadShouldLog() {
        try {
            Logging_Settings__c setting = Logging_Settings__c.getInstance(UserInfo.getUserId());
            return setting != null && setting.Enabled__c;

        } catch (Exception e) {
            Logger.error('ApexHelperMethods:loadShouldLog:e: ' + e.getMessage());
            Logger.saveLog();
            return true;
        }

    }

    private static void logDebug(String message) {
        if (SHOULD_LOG) {
            Logger.debug(message);
            Logger.saveLog();
        }
    }
}