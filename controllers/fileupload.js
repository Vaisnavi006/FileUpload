const { response } = require("express");
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

//localfileupload -> handler function

exports.localFileUpload = async (req,res) => {
    try{

        //fetch file feom request
        const file = req.files.file;
        console.log("file is uploaded ->" ,file);

        //create path where file needs to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH ->", path);

        //add path to move function
        file.mv(path, (err) => {
            console.log(err);
        });

        //create successful response
        res.json({
            success:true,
            message:"Local file uploaded successfully",
        });
    }
    catch(error) {
        console.log("not able to upload the file on server");
        console.log(error);
    }
}

function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {folder};
    console.log("temp file path",file.tempFilePath);

    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


//image upload handler

exports.imageUpload = async (req,res) => {
    try{
        //fetch data
        const {name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:"file format not supported",
            })
        }
        
        // for supported file format
        
        const response = await uploadFileToCloudinary(file, "Vaishnavi");
        console.log(response);

        //Save the entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully uploaded",        
        })
        
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        });
    }
}

//video upload

exports.videoUpload = async (req,res) => {
    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.videoFile;

        //validation
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"file format not supported",
            })
        }

        const response = await uploadFileToCloudinary(file, "Vaishnavi");
        console.log(response);
        
    //Save the entry in db
    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
    })
    
    res.json({
        success:true,
        imageUrl:response.secure_url,
        message:"Video Successfully uploaded",
    })
        
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        });
    }
}

//imageSizeReducer

exports.imageSizeReducer = async (req,res) => {
    try{
        //data fetch 
        const { name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type: ", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"file format not supported",
            })
        }
        
        //File format is supported
        console.log("Uploding a file to folder");
        const response = await uploadFileToCloudinary(file, "Vaishnavi", 90);
        console.log(response);

        //save the entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Video Successfully uploaded",
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong",
        });
    }
}