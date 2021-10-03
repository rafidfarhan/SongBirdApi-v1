const express = require("express");

const dotenv = require("dotenv"); 
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config({path : "./config/config.env"});

const connectDB = require("./config/db"); 
const authRoute = require("./routes/auth");
const tracksRoute = require("./routes/tracks");
const albumsRoute = require("./routes/albums");
const artistsRoute = require("./routes/artists");
const playlistsRoute = require("./routes/playlists");
const usersRoute = require("./routes/users");
const searchRoute = require("./routes/search");

const errorHandler = require("./middleware/error");
//mongoose Database connection
connectDB();



const app = express();


app.use(express.json());
app.use(cookieParser());

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());


app.use(hpp());
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tracks", tracksRoute);
app.use("/api/v1/albums", albumsRoute);
app.use("/api/v1/artists", artistsRoute);
app.use("/api/v1/playlists", playlistsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/search", searchRoute);
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
