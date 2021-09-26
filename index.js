const express = require("express");

const dotenv = require("dotenv"); 
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config({path : "./config/config.env"});

const connectDB = require("./config/db"); 
const tracksRoute = require("./routes/tracks");
const albumsRoute = require("./routes/albums");
const artistsRoute = require("./routes/artists");
const errorHandler = require("./middleware/error");
//mongoose Database connection
connectDB();



const app = express();


app.use(express.json());
app.use(helmet());
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}


app.use("/api/v1/tracks", tracksRoute);
app.use("/api/v1/albums", albumsRoute);
app.use("/api/v1/artists", artistsRoute);
app.use(errorHandler);




const PORT = process.env.PORT || 3002
const server = app.listen(PORT, console.log(
    `The Server is running in ${process.env.NODE_ENV} mode on Port ${PORT}`
    ));
//Unhandled promise Rejections handled here
process.on("unhandledRejection", (err,promise)=>{
    console.log(`Error: ${err.message}`)
    server.close(()=>{process.exit(1)});
})
