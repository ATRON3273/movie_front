console.log('Hello world');

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
 
app.get('/abc', function (req, res) {
    res.send('fddsa')
});
 
app.listen(3000);