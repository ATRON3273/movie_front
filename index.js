console.log('Movie site start');

const express = require('express');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

function hasSession(req)
{
    // not not을 통해 bool 형으로 형변환
    return !!req.session.views;
}

function initSession(req, id, nickname, email)
{
    req.session.views = 1;
    req.session.id = id;
    req.session.nickname = nickname;
    req.session.email = email;
}

function destorySession(req)
{
    req.session.destroy();
}

app.post('/login', function(req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    // 로그인 확인
    // check(id, pw);
    initSession(req, id);
    res.json({
        result: true,
    });
    console.log(`id : ${id}, pw : ${pw}`);
});

app.post('/signup', function(req, res)
{
    const id = req.body.id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    // check(id, pw);
    res.json({
        result: true,
    });
    console.log(`id : ${id}, pw : ${pw}, nickname : ${nickname}, email : ${email}`);
});

app.post('/mypage', function(req, res)
{
    if (hasSession(req) == false)
    {
        res.redirect('/login');
        return;
    }

    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    // check(id, pw);
    res.json({
        message:'success'
    });
    console.log(`pw : ${pw}, nickname : ${nickname}, email : ${email}`);
});

app.post('/', function(req, res) {
    const search_keyword = req.body.search_keyword;
    // query(search)
    res.json({
        message:'success'
    });
    console.log(`search : ${search_keyword}`);
});

app.get('/', function(req, res)
{
    res.render('index')
});

app.get('/login', function(req, res)
{
    if (hasSession(req) == true)
    {
        res.redirect('/')
    }
    else
    {
        res.render('login')
    }

})

app.get('/signup', function(req, res)
{
    if (hasSession(req) == true)
    {
        res.redirect('/');
    }
    else
    {
        res.render('signup');
    }
});

app.get('/mypage', function(req, res)
{
    if (hasSession(req) == true)
    {
        res.render('mypage', {account_id: 'abcd'});
    }
    else
    {
        res.redirect('/login');
    }
});

app.listen(3000);
