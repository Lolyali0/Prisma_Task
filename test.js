const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json()); // Middleware for parsing JSON bodies

// Middleware to handle invalid JSON format errors
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    next(err);
});

// Create User
app.post("/create", async (req, res) => {
    const { username, email, password } = req.body;

    // Log the request body to check what is being received
    console.log("Request Body:", req.body);

    if (!username  !email  !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newUser = await prisma.user.create({
            data: { username, email, password },
        });
        res.json(newUser);
    } catch (error) {
        // Check for unique constraint violation
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
});

// Read Users
app.get("/users", async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({error: error.message });
    }
});

// Update User
app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!username  !email  !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { username, email, password },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete User
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});