// imports the express npm module
const express = require("express");

// imports the cors npm module
const cors = require("cors");

// imports the Pool object from the pg npm module, specifically
const Pool = require("pg").Pool;

// This creates a new connection to our database. Postgres listens on port 5432 by default
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "users_app",
    password: "postgres",
    port: 5432,
});

// Creates a new instance of express for our app
const app = express();

// .use is middleware - something that occurs between the request and response cycle.
app.use(cors());

// We will be using JSON objects to communicate with our backend, no HTML pages.
app.use(express.json());

// This route will return 'Hi There' when you go to localhost:3001/ in the browser
app.get("/", (req, res) => {
    res.send("Hi There");
});

app.get("/api/users", (request, response) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) throw error;

        console.log(results);
        response.status(200).json(results.rows);
    });
});

// app.put("/api/users/:id", (request, response) => {
//     const { id } = parseInt(request.params);
//     const { firstname, lastname, emailaddress } = request.body;
//
//     // For PUT, we expect all fields to be provided.
//     // If any field is missing, return an error response.
//     if (!firstname || !lastname || !emailaddress) {
//         return response.status(400).json({ error: "Missing fields for update" });
//     }
//
//     const query = `
//         UPDATE users
//         SET firstname = $1, lastname = $2, emailaddress = $3
//         WHERE id = $4
//         RETURNING *;
//     `;
//
//     const values = [firstname, lastname, emailaddress, id];
//
//     // Execute the query
//     pool.query(query, values, (error, results) => {
//         if (error) {
//             throw error;
//         }
//
//         // If no rows are returned, the user does not exist
//         if (results.rowCount === 0) {
//             return response.status(404).json({ error: "User not found" });
//         }
//
//         // Return the updated user
//         response.status(200).json(results.rows[0]);
//     });
// });

app.patch("/api/users/:id", (request, response) => {
    const id = parseInt(request.params.id); // Parse the id directly from request.params.id
    const {firstname, lastname, emailaddress} = request.body; // extract firstname, lastname, emailaddress

    // Start building the query dynamically based on provided fields
    const fields = [];
    const values = [];

    // Check which fields are provided and prepare them for the query
    if (firstname) {
        values.push(firstname);
        fields.push(`firstname = $${values.length}`);
    }
    if (lastname) {
        values.push(lastname);
        fields.push(`lastname = $${values.length}`);
    }
    if (emailaddress) {
        values.push(emailaddress);
        fields.push(`emailaddress = $${values.length}`);
    }

    // If no fields to update were provided, return an error
    if (fields.length === 0) {
        return response.status(400).json({error: "No fields provided for update"});
    }

    // Construct the SQL query dynamically based on provided fields
    const query = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${values.length + 1} RETURNING *;
    `;

    // Add the user's id to the values array for the query's WHERE clause
    values.push(id);

    // Execute the query
    pool.query(query, values, (error, results) => {
        if (error) {
            throw error;
        }

        // If no rows are returned, the user does not exist
        if (results.rowCount === 0) {
            return response.status(404).json({error: "User not found"});
        }

        // Return the updated user
        response.status(200).json(results.rows[0]);
    });
});


// This tells the express application to listen for requests on port 3001
app.listen("3001", () => {
});