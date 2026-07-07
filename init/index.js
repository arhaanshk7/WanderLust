const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/airbnb";

const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect(url);
    console.log("MongoDB connected");
}

async function initDB() {
    try {
        // 1. Clear old data
        await Listing.deleteMany({});

        // 2. Insert fresh data
        await Listing.insertMany(initData);

        // 3. Add owner to all listings
        await Listing.updateMany(
            {},
            { $set: { owner: new mongoose.Types.ObjectId("6a313e4fbe69cab5c951ca47") } }
        );

        console.log("All listings seeded and owner added successfully");

    } catch (err) {
        console.log("Error updating data:", err);
    } finally {
        mongoose.connection.close(); // optional but good practice
    }
}

// run
main()
    .then(initDB)
    .catch((err) => {
        console.log(err);
    });