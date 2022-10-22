
🍁 Sending funds from one account to another in mongodb 🌿

🍁🌿

#####

 Before running this script...

   1. Create a database named 'banking'

   2. Create a collection named 'accounts' in the database

   3. Create two documents in the 'accounts' collection:
         {"_id":"account1", "balance":500}
         {"_id":"account2", "balance":0}

   4. Optional: add schema validation to ensure an account balance cannot drop below 0.
      See https:docs.mongodb.com/manual/core/schema-validation/ for details on how to 
      enable schema validation. Configuring schema validation in MongoDB Compass is an
      easy way to add schema validation to an existing database: https:docs.mongodb.com/compass/current/validation/

        <!-- {
            $jsonSchema: {
                properties: {
                    balance: {
                    minimum: 0,
                    description: 'account balance cannot be negative'
                    }
                }
            }        
        } -->

🍁🌿

🍁 To run any file, open the on terminal and execute "node transcationBanking"🌿





