const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Employee = require("./Employee");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/employee-form", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Add Employee Route
app.post("/employee", (req, res) => {
  const newEmployee = new Employee({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    doe: req.body.doe,
    dob: req.body.dob,
  });

  newEmployee
    .save()
    .then((employee) => res.json(employee))
    .catch((err) => res.status(400).json(err));
});

app.get("/getData",async (req,res) =>{
  const data = await Employee.find();
  res.json(data);
});

app.delete('/delete/:id', (req, res) => {
  Employee.findByIdAndDelete(req.params.id, (err, employee) => {
  if (err) return res.status(500).send(err);
  if (!employee) return res.status(404).send('Employee not found');
  
  return res.send('Employee deleted successfully');
  });
  });

  app.put('/updateEmployee/:id', function (req, res) {
    Employee.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address, doe: req.body.doe, dob: req.body.dob } }, { new: true }, function (err, employee) {
        if (err) {
            return res.send(err);
        } else if (!employee) {
            return res.status(404).send('Employee not found');
        }
        return res.json(employee);
    });
});

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
