const express = require("express");
const logger = require("morgan");
const path = require("path");
const hbs = require("hbs");


const registerRouter = require("./routes/registerRouter");
const adminRouter = require("./routes/adminRouter");
const moderRouter = require("./routes/moderRouter");
const authRouter = require("./routes/loginRouter");
const roomPage = require("./routes/roomPage");
const mainPage = require("./routes/mainPageRouter");
const logout = require("./routes/logout");

const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();


const app = express();
const PORT = 3000;

app.set("view engine", "hbs");


app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


hbs.registerHelper("checkForAdmin", (user) => {
  if (!user) {
    return false;
  }
  if (user.role.admin != true) {
    return false;
  } else {
    return true;
  }
});

app.use(
  session({
    name: "sId",
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: "moon cat",
    resave: false,
  })
);


app.use("/signup", registerRouter);
app.use("/moder", moderRouter);
app.use("/", authRouter);
app.use("/mainpage", mainPage);
app.use("/roompage", roomPage);
app.use("/admin", adminRouter);
app.use("/logout", logout);


app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
