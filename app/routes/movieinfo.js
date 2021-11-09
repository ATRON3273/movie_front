/* 영화, 영화인 검색 결과 페이지 */

import express from "express";

const router = express.Router({ mergeParams: true });

/*
SELECT review_sq, account_id, review_title, score FROM review WHERE movie_code="search_movie_code";
*/

// 영화 정보 페이지
router.get('/movie', function(req, res)
{
    res.render('movieinfo/movie');
});

/*
후기 작성 : 
INSERT INTO review VALUES(
    "movie_code",
    "review_sq",
    "account_id",
    "new_review_title",
    "new_comment",
    "score"
);
*/
router.post('/movie/post_review', function(req, res)
{
    const review = req.body.data;
    

    if (hasSession(req) == true) {
        const session_account_id = req.session.signin_id;
        res.render(MYPAGE, {account_id: session_account_id});
    }
    else {
        res.redirect('/signin');
    }

    res.redirect('/movieinfo/movie');
    console.log(`search : ${keyword}`);
})

// 영화 정보 검색
router.post('/movie/search', function(req, res)
{
    const keyword = req.body.keyword;
    
    /*
        SELECT movie_title
        FROM movie
        WHERE movie_title LIKE "(keyword)%"
        OR movie_title_eng LIKE "(keyword)%"
    */

    const search_list = [
        {
            movie_title: "movie1",
        },
        {
            movie_title: "movie2",
        },
    ]

    res.json({
        search_list,
    });
})

// 영화인 정보 페이지
router.get('/crew', function(req, res)
{
    res.render('movieinfo/crew');
});

// 영화인 정보 검색
router.post('/crew/search', function(req, res)
{
    const keyword = req.body.keyword;
    
    /*
        SELECT crew_name, nationality, crew_birth_date
        FROM crew
        WHERE crew_name LIKE "(keyword)%"
        OR crew_name_eng LIKE "(keyword)%"
    */

    const search_list = [
        {
            movie_title: "movie1",
        },
        {
            movie_title: "movie2",
        },
    ]

    res.json({
        search_list,
    });
})

router.post('/crew', function(req, res)
{
    const keyword = req.body.keyword;
    // query(search)
    res.redirect('/movieinfo/crew');
    console.log(`search : ${keyword}`);
})

// 개별 리뷰 페이지
router.get('/review', function(req, res)
{
    res.render('movieinfo/review');
});

export { router };
