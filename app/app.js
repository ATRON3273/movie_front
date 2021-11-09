import express from "express";
import morgan from "morgan";
import path from 'path';
import { router } from "./routes/index.js";
import session from 'express-session';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), '/views'));
app.set('port', process.env.PORT || 3000)

app.use(morgan("dev"));
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

// Routes
app.use("/", router)
app.use((req, res) => {
    res.status(404).send('404 NOT FOUND : Sorry cant find that!');
});

app.listen(app.get("port"), () => {
    console.log(`express listening : http://127.0.0.1:3000 ! `)
})