const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const  mongoose = require('mongoose');
const path = require('path');
const app =express();
const ejsMate = require('ejs-mate');
const bcrypt =require('bcrypt');
const methodOverride = require('method-override');

// Router heads
const userRoute=require("./routes/users");
const authRoute =require("./routes/auth");
const User = require('./models/User');
const Admin = require('./models/Admin');


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//env file for data hiding
dotenv.config();

//mongoose.connect('mongodb://localhost:27017/covid');
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("CONNECTED TO DATABASE");
}).catch((err) => {
    console.log("MONGO NOT WORKING");
    console.log(err);
})
// middle ware usage
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//HOME PAGE
app.get('/',(req,res)=>{
    res.render('home');
})


// Register Form
app.get('/register',(req,res)=>{
    res.render('register');
})
//Register as User
app.get('/register/user',(req,res)=>{
        res.render('register1')
});

app.post("/register/user", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = await new User({
        username: req.body.username,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password: hashedPassword,
        age:req.body.age,
        city:req.body.city
    });
    //save user and respond
    const user = await newUser.save();
    console.log("SAVED");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//Register as Organisation
app.get('/register/org',(req,res)=>{
        res.render('register2')
});
app.post("/register/org", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newCenter = await new Admin({
        username: req.body.username,
        vac_center_name:req.body.vac_center_name,
        contact:req.body.contact,
        email:req.body.email,
        password: hashedPassword,
        city:req.body.city
    });
    //save user and respond
    const user = await newCenter.save();
    console.log("Org Registered");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});
// login ,logout
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/logout',(req,res)=>{

      res.render('logout');
})


// APIs related to center 
// Create New


// Post new center
app.post('/centers', async (req, res) => {
    const newCenter = new Admin(req.body);
    await newCenter.save();
    res.redirect(`/centers/${newCenter._id}`);
})
app.get("/centers" ,async(req,res)=>{

    const centers = await Admin.find({});
    res.render('center/centers',{centers});
})
// details of individual center 
app.get("/centers/:id" ,async(req,res)=>{

    const {id} = req.params;
    const center =await Admin.findById(id);
    console.log(center);
    res.render("center/details",{center});
})
// edit center
app.get('/centers/:id/edit', async (req, res) => {
    const { id } = req.params;
    const center= await Admin.findById(id);
    res.render('center/edit', { center });
})
app.put('/centers/:id', async (req, res) => {
    const { id } = req.params;
    const center = await Admin.findByIdAndUpdate(id, req.body,{ runValidators: true, new: true });
    res.redirect(`/centers/${center._id}`);
})
app.get("/test",(req,res)=>{
    res.send("WOOF")
})
// Delete Center
app.delete('/centers/:id', async (req, res) => {

    const { id } = req.params;
    const deletedProduct = await Admin.findByIdAndDelete(id);
    res.redirect('/centers');
})

//Listening port
app.listen(3000,()=>{
    console.log("Port 3000");
})