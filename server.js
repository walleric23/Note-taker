const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const uniqid = require("uniqid");
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for landing page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    res.send(data);
  })
);

app.post("/api/notes", (req, res) =>
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    notes.push({
      id: uniqid(),
      ...req.body,
    });
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err, data) => {
      res.json(req.body);
    });
  })
);

app.delete("/api/notes/:id", (req, res) =>
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile("./db/db.json", JSON.stringify(filteredNotes), (err, data) => {
      res.json(req.body);
    });
  })
);
// if no routes match this defaults to index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
