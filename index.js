const express = require('express');
const expressSession = require('express-session');
const pug = require('pug');
const path = require('path');
const route = require('./routes/routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');

let app = express();

app.use(cors());
app.use(expressSession({ secret: "secret", saveUninitialized: true, resave: true }));


const checkAuth = (req,res,next) => {
    if(req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
};

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');

app.use(express.static(path.join(__dirname+'/public')));

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.get('/', route.root);
app.post('/', urlencodedParser, route.login);
app.get('/moviePage', checkAuth, route.moviePage);
app.get('/logout', checkAuth, route.logout);
app.get('/editAccount', checkAuth, route.editAccount);
app.get('/adminPage', checkAuth, route.adminPage);
app.get('/signup', route.signup);


const handleSend = (req, res) => {
    const secret_key = process.env.SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => res.json({ google_response }))
        .catch(error => res.json({ error }));
};

app.post('/signup', handleSend)
app.post('/updateAccountData', urlencodedParser, route.updateAccountInfo);
app.post('/deleteAccount', urlencodedParser, route.deleteAccount);
app.post('/makeAdmin', urlencodedParser, route.makeAdmin);
app.post('/makeNotAdmin', urlencodedParser, route.makeNotAdmin);
app.post('/deleteReview', urlencodedParser, route.deleteReview);
app.post('/signup', urlencodedParser, route.createAccount);
app.post('/moviePage', urlencodedParser, route.moviePageSearch);
app.post('/sendReview', urlencodedParser, route.test);
app.post('/editReview', urlencodedParser, route.test);

app.get('/forgotPasswordSendEmail', route.sendEmailForPassword);
app.post('/forgotPasswordSendEmail', urlencodedParser, route.processSendEmailForPassword);
app.get('/reset', route.resetPasswordPage)
app.get('/:excess', route.root)

app.listen(3000);
