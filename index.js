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

// 메인 페이지
app.get('/', function(req, res)
{
    res.render('index')
});

// 메인 페이지 검색
app.post('/', function(req, res) {
    // query(search)
    res.json({
        message:'success'
    });
});

// 로그인 페이지
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
});

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

// 회원가입 페이지
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

app.post('/signup', function(req, res)
{
    const id = req.body.id;
    const pw = req.body.pw;
    const name = req.body.name;
    const birth = req.body.birth;
    const phone = req.body.phone;
    const nickname = req.body.nickname;
    const email = req.body.email;

    var verified_data = false;
    /* 중복 아이디 검사 코드 */
    // 
    if (verified_data)
    {
        res.json({
            result: true,
        });
        console.log(`id : ${id}, pw : ${pw}, name : ${name}, birth : ${birth}, phone : ${phone}, nickname : ${nickname}, email : ${email}`);
    }
    else
    {
        res.json({
            result: false,
        });
        console.log('Sign up Failed');
    }
    });

app.get('/item', function(req, res)
{
    res.render('item');
});

// 회원 계정 마이 페이지
app.get('/mypage', function(req, res)
{
    if (hasSession(req) == true)
    {
        // ???
        const id = req.session.id;
        res.render('mypage', {account_id: id});
    }
    else
    {
        res.redirect('/login');
    }
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

    // 변경된 데이터 DB 입력 코드

    res.json({
        message:'success'
    });
    console.log(`pw : ${pw}, nickname : ${nickname}, email : ${email}`);
});

app.get('/reserve/', function(req, res)
{
    res.render('/reserve/index')
});

app.get('/reserve/seat', function(req, res)
{
    res.render('/reserve/seat')
});

// 영화정보 페이지
app.get('/movieinfo/movie', function(req, res)
{
    const search_keyword = req.body.keyword;
    console.log(`search : ${search_keyword}`);

    res.render('movieinfo/movie');
});

app.post('movieinfo/movie', function(req, res)
{
    const keyword = req.body.keyword;
    // query(search)
    res.redirect('/movieinfo/movie');
    console.log(`search : ${keyword}`);
})


// 관리자 메인 페이지
app.get('/admin', function(req, res)
{
    if (hasSession(req) == true)
    {
        res.redirect('/admin/login');
    }
    else
    {
        res.render('admin');
    }
});

// 관리자 로그인 페이지
app.get('/admin/login', function(req, res)
{
    if (hasSession(req) == true)
    {
        res.redirect('/admin');
    }
    else
    {
        res.render('admin/login');
    }
});

app.listen(3000);
