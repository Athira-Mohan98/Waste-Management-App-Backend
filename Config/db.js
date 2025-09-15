const mongoose = require('mongoose')
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("server connected to DB");
}).catch((err)=>{

    console.log("Error connecting to DB", err);
})

