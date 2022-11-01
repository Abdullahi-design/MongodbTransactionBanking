const { MongoClient } = require('mongodb');
require('dotenv').config();
const { findName } = require('./read.js')


// Check in the README.md file on how to run this script 

async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */

     const uri = process.env.MONGODB_URL;

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Check account balance
        const accountBalance = await findName(client, "account1");
        // console.log(accountBalance);

        // Transfer $100 from "account1" to "account2"
        await transferMoney(client, accountBalance, "account1", "account2", 500);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);


async function transferMoney(client, accountBalance, account1, account2, amount) {

    /**
     * The accounts collection in the banking database
     */
    const accountsCollection = client.db("banking").collection("accounts");

    // Step 1: Start a Client Session
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#startSession for the startSession() docs
    const session = client.startSession();

    // Step 2: Optional. Define options for the transaction
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        // Note: The callback for withTransaction MUST be async and/or return a Promise.
        // See https://mongodb.github.io/node-mongodb-native/3.6/api/ClientSession.html#withTransaction for the withTransaction() docs        
        const transactionResults = await session.withTransaction(async () => {

            // Important:: You must pass the session to each of the operations   

            //First: checks if account is more than tha amount to be transfered
            //Second: Remove the money from the first account

            if(accountBalance < amount) {
                await session.abortTransaction();
                console.log('Account is less than zero');
            } else {
                console.log('amount greater dan 0');
                const subtractMoneyResults = await accountsCollection.updateOne(
                    { name: account1 },
                    { $inc: { balance: amount * -1 } }, // we might want to add charges and give customer a percentage
                    { session });
                    console.log(`your acc bal is ${accountBalance}`);
                console.log(`${subtractMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account1}.`);
                console.log(`${subtractMoneyResults.modifiedCount} document(s) was/were updated to remove the money.`);
                if (subtractMoneyResults.modifiedCount !== 1 ) {
                    await session.abortTransaction();
                }
            }
            

            // Add the money to the second account
            if(accountBalance < amount) {
                
                console.log('money will not go');
            } else{
                const addMoneyResults = await accountsCollection.updateOne(
                    { name: account2 },
                    { $inc: { balance: amount } },
                    { session });
                console.log(`${addMoneyResults.matchedCount} document(s) found in the accounts collection with _id ${account2}.`);
                console.log(`${addMoneyResults.modifiedCount} document(s) was/were updated to add the money.`);
                if (addMoneyResults.modifiedCount !== 1 ) {
                    await session.abortTransaction();
                    
                }
            }

        }, transactionOptions);

        if (transactionResults, accountBalance) {
            console.log("The money was successfully transferred. Database operations from the transaction are now visible outside the transaction.");
            console.log(`your new acc bal is ${accountBalance}`);
        } else {
            console.log("The money was not transferred. The transaction was intentionally aborted.");
        }
    } catch (e) {
        console.log("The money was not transferred. The transaction was aborted due to an unexpected error: " + e);
    } finally {
        // Step 4: End the session
        await session.endSession();
    }

}

