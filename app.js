if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// * LIBRARY ----------------------------------------------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo");

// * UTILS ----------------------------------------------------------------
const ExpressError = require("./utils/ExpressError");

// * MODELS ----------------------------------------------------------------
const User = require("./models/user");

// * ROUTES ----------------------------------------------------------------
const campgroundsRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

// connect to database
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
// "mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl),
    {
        useNewUrlParser: true,
        useCreateUrlParser: true,
        useUnifiedTopology: true,
    };

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
// end connect to database

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const secret = process.env.SECRET;

//? session mongo
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
    console.log("Session Store Connect Mongo Error", err);
});

//? session Config untuk menyeting session
const sessionConfig = {
    store,
    name: "session", //? memberi nama cookie agar keamanan data terjaga
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //? ini adalah settingan kadaluarsa cookie, jika sudah kadaluarsa maka perlu di perbarui
        httpOnly: true, //? untuk keamanan cookie
        // secure: true, //? untuk keamanan ketika di deploy, akan tetapi kalau disisi localhost berdampak buruk
        expires: Date.now(),
        maxAge: 1000 * 60 * 60 * 24, //? urutannya 1000 milisecond * 60 Detik * 60 Menit * 24 Jam, ini akan menghitung berapa milisecond dalam satu hari
    },
};
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
    mongoSanitize({
        replaceWith: "_", //? ini melarang penggunaan '$' di query, dan mengubah menjadi '_'
    })
);

// * ROUTES
app.use(session(sessionConfig)); //? session utama
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];

const connectSrcUrls = ["https://api.mapbox.com/", "https://events.mapbox.com/"];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: ["self", "blob:", "data:", "https://res.cloudinary.com/dflfrprqg/", "https://unsplash.com/"],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// HASHING PASSWORD
app.use(passport.initialize());
app.use(passport.session()); //? pastikan penggunaan ini di bawah dari session utama
passport.use(new LocalStrategy(User.authenticate())); //? melakukan authentication menggunakan passport local untuk USER

passport.serializeUser(User.serializeUser()); //? untuk mengidentifikasi pengguna
passport.deserializeUser(User.deserializeUser()); //? untuk mengembalikan pengguna dalam bentuk objek
// END HASHING PASSWORD

//! letak middleware di bawah penggunaan app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);
app.use(express.static(path.join(__dirname, "public"))); //? middleware untuk mengakses berkas yang ada di public
// * END ROUTES

app.get("/", async (req, res) => {
    res.render("home");
});

// error handler
app.get("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something went wrong!!";
    res.status(statusCode).render("error", { err });
});
// end error handler

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
