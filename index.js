console.log('Movie site start');

const express = require('express');
const app = express();

app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post('/login', function(req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    // 로그인 확인
    // check(id, pw);
    res.json({
        message:'success'
    });
    console.log(`id : ${id}, pw : ${pw}`);
});

app.post('/signup', function(req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const email = req.body.email;
    // check(id, pw);
    res.json({
        message:'success'
    });
    console.log(`id : ${id}, pw : ${pw}, nickname : ${nickname}, email : ${email}`);
});

app.post('/mypage', function(req, res) {
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

app.get('/abc', function (req, res) {
    res.send('fddsa')
});
 
app.listen(3000);