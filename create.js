const { MongoClient } = require('mongodb');
require('dotenv').config();


async function main() {

     const uri = process.env.MONGODB_URL;

    const client = new MongoClient(uri);

    try {
        // Create two documents in the 'accounts' collection:
        // {"_id":"account1", "balance":500}
        // {"_id":"account2", "balance":0}
        await client.connect();

        // Create account two c
        await createObject(client, [
            {
                name: "account1",
                balance: 500
            },
            {
                name: "account2",
                balance: 0
            }
        ]);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

async function createObject(client, newListing) {
    const result = await client.db("banking").collection("accounts").insertMany(newListing);
    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}
