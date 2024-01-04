// server.ts
require('dotenv').config()

const express = require("express");
const cors = require("cors");
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
import DatabaseAgent from "../server/database";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, async () => {
    try {
        // Create an instance of DatabaseAgent
        const databaseAgentInstance = new DatabaseAgent();

        // Use the getDatabaseConnection method from the instance
        await databaseAgentInstance.connectDirect();

        console.log("LeakyChans WebPortal On Port: ", port);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
});