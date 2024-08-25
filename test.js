const express = require("express");
const app = express();
const {prismaClient} = require("@prisma/client");
const prisma = new prismaClient();


app.use(express.json());

//create..
app.post("/", async (req, res) => {
    const { username, id, email, password } = req.body;
    const NewUser = await prisma.user.create({
        data: { username, id, email, password },
    });
    res.json(NewUser);
});

//Read..
app.get("/", async (req, res) => {
    const AllUsers = await prisma.user.findMany();
    res.json(AllUsers);
});

//Update..
app.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { username,email,password, } = req.body;
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { username,email,password ,},
    });
    res.json(updatedUser);
});

//delete..
app.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
    });
    res.json(deletedUser);
});

//Listen the data..
app.listen(3000, () => console.log(`Server Running on port 3000`));

