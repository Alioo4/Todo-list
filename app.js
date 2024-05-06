require("dotenv/config")

const express = require("express");

const Io = require("./io");

const {v4: uuid} = require("uuid");

const app = express();

const todosDb = new Io(`${process.cwd()}/database/todos.json`)

const PORT = +process.env.PORT  ;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server working on PORT: ${PORT}`);
})

app.get("/todos", async (req, res) => {
    let todos = await todosDb.read();

    res.status(201).json({data: todos});
})

app.post("/todos", async (req, res) => {
    let todos = await todosDb.read();

    let{title, note} = req.body

    let newNote = {
        id: uuid(),
        title,
        note
    } 
    todos.push(newNote);
    await todosDb.write(todos);
    res.status(201).json({message: "Successfully note!!!"})  
})

app.put("/todos", async (req, res) => {
    let todos = await todosDb.read();

    let findId = todos.find((note) => {
        return note.id === req.body.id
    })

    if(!findId){
        res.status(403).json({message: "This id not found!!!"})
    }else{
        let newNote = {
            id: req.body.id,
            name: req.body.name,
            note: req.body.note
            }
            todos = todos.filter((el) => {
                return el.id !== newNote.id
            })
            todos.push(newNote)
            await todosDb.write(todos)
            res.status(203).json({messege: "Successfully change!!!"})
    }
})

app.delete("/todos", async (req, res) => {
    let todos = await todosDb.read();

    let findId = todos.find((note) => {
        return note.id === req.body.id
    })
    
    if(!findId){
        res.status(403).json({message: "This id not found!!!"})
    } else{
        todos = todos.filter((el) => {
            return el.id !== req.body.id
        })
        await todosDb.write(todos)
        res.status(203).json({message: "Successfully delete!!!"})
    }
})
