const { MongoClient } = require('mongodb');
require('dotenv').config();


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
        
        //update listing
        await updateList(client, "account2", {balance: 0}) // change values to update DB

        // checks for listing by name
        await findListingByName(client, "account2") // change value to update DB

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

async function updateList(client, accountName, balance) {
    const result = await client.db("banking").collection("accounts").updateOne( { name: accountName}, { $set: balance });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);

    // console.log(result);
}

async function findListingByName(client, nameOfListing) {
    const result = await client.db("banking").collection("accounts").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the db with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}