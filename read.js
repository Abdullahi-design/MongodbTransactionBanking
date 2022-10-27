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

        // // check
        await findName(client, "account2");

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

async function findName(client, newListing) {
    const result = await client.db("banking").collection("accounts").findOne({ name: newListing });
    console.log(`Found listing(s) in the collection with the name ${newListing}`);
    // console.log(result);
    return result.balance
}

module.exports = { findName }
