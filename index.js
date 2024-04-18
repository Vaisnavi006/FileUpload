//create app
const express = require("express");
const app = express();

//find port
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//add middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir: '/tem/'
}));

//connect with database
const db = require("./config/database");
db.connect();

//connect with cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//mount api route
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

//activate server
app.listen(PORT, () => {
    console.log(`app is running at ${PORT}`);
})
