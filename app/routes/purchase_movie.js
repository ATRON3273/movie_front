/* 영화 예매, 상품 구매 페이지*/

import express from "express";
import { hasSession, isAccountSession, isCustomerSession } from "../utils/sessions.js";

const router = express.Router({ mergeParams: true });

// 인당 티켓 가격
const ticket_adult_price = 8000;
const ticket_child_price = 5000;
// 결제금액에 대한 포인트 적립 비율 값
const points_ratio = 0.1;

// 영화예매(장소, 일정 선택) 페이지
router.get('/select', function(req, res)
{
    if (hasSession(req))
    {
        res.render('purchase/movie/select');
    }
    else
    {
        res.redirect('/signin');
    }
});

// 검색 항목 범위를 변경
router.post('/select/set_list', function(req, res)
{
    const date = req.body.date;
    const movie = req.body.movie || null;
    const theater = req.body.theater || null;

    // query(search)
    
    /*
    theater_list -> date
    
    SELECT DISTINCT screen_code
    FROM movie_session
    WHERE session_date="date"
    AND movie_code="movie";?
    */

    /*
    movie_list ->

    SELECT DISTINCT movie_code
    FROM movie_session
    WHERE session_date="date"
    AND <screen_code로 영화관 정보 추출>;?
    */
    const theater_list = [];
    const movie_list = [];

    res.json({
        theater_list: theater_list,
        movie_list: movie_list,
    });
})

// 상영일정 선택 페이지 영화관 리스트 초기화
router.post('/select/init_theater', function(req, res)
{
    /*
    쿼리문 우예 짜지;
    SELECT T.theater_code, T.theater_name
    FROM movie_session MS, session S, theater T 
    WHERE S.session LIKE T.theater_code ;
    */
    const theater_list = [
        {
            theater_code: "theater_code",
            theater_name: "theater_name",
        },
        {
            theater_code: "theater_code1",
            theater_name: "theater_name2",
        },
    ]

    res.json({
        theater_list,
    });
});

// 상영일정 선택 페이지 날짜 변경
router.post('/select/change_theater_list', function(req, res)
{
    const session_date = req.body.session_date;

    /*
        SELECT M.movie_title, S.movie_code
        FROM movie M, movie_session S
        WHERE M.movie_code = S.movie_code
        AND session_date = "session_date";
    */

    const theater_list = [
        {
            theater_code: "theater_code",
            theater_name: "theater_name",
        },
        {
            theater_code: "theater_code1",
            theater_name: "theater_name2",
        },
    ]

    res.json({
        theater_list: theater_list,
    });
});


// 상영일정 선택 페이지 영화를 기준으로 영화관 목록 바꾸기
router.post('/select/change_movie_list', function(req, res)
{
    const date = req.body.session_date;
    const theater_code = req.body.movie_code;

    /*
    쿼리문 망할
        SELECT theater_code FROM theater_code WHERE 
        SELECT screen_code FROM screen WHERE screen_code = (
            SELECT screen_code FROM movie_session WHERE movie_code = "movie_code";
    )
    */ 

    const movie_list = [
        {
            movie_code: "movie_code",
            movie_title: "movie_title",
        },
        {
            movie_code: "movie_code1",
            movie_title: "movie_title1",
        },
    ]

    res.json({
        movie_list,
    });
});

// 상영일정 선택 페이지 상영일정 필터링
router.post('/select/filter_session', function(req, res)
{
    const session_date = req.body.session_date || null;
    const theater_code = req.body.theater_code || null;
    const movie_code = req.body.movie_code || null;

    // SELECT FROM WHERE;

    const session_list = [
        {
            session_uid: "654654",
            theater_name: "청량리 롯데시네마",
            screen_name: "session1",
            movie_title: "분노의 질주",
            session_datetime: "12:35",
        },
        {
            session_uid: "654654",
            theater_name: "청량리 롯데시네마",
            screen_name: "session2",
            movie_title: "귀멸의 칼날",
            session_datetime: "14:50",
        }
    ]

    res.json({
        session_list,
    });
});

// 영화예매(좌석 선택) 페이지
router.get('/seat', function(req, res)
{
    const session_uid = req.query.session_uid;
    
    /*
    SELECT screen_code
    FROM movie_session
    WHERE session_uid = "session_uid";
    */

    // find max_row and max_col freom screen_code

    const screen_code = "screen_code";
    const max_row_num = 3;
    const max_col_num = 3;
    const reserve_status_enum = {
        AVAILABLE: true,
        NOTAVAILABLE: false,
        PROCESSING: false,
        RESERVED: false,
    };

    const seat_list = [
        {
            seat_uid: "222",
            seat_row: 0,
            seat_col: 1,
            seat_category: "prime",
            seat_status: true,
            reserve_status: reserve_status_enum.PROCESSING
        },
        {
            seat_uid: "223",
            seat_row: 0,
            seat_col: 2,
            seat_category: "prime",
            seat_status: false,
            reserve_status: reserve_status_enum.NOTAVAILABLE
        },
        {
            seat_uid: "224",
            seat_row: 1,
            seat_col: 0,
            seat_category: "prime",
            seat_status: true,
            reserve_status: reserve_status_enum.AVAILABLE
        },
        {
            seat_uid: "225",
            seat_row: 1,
            seat_col: 1,
            seat_category: "prime",
            seat_status: true,
            reserve_status: reserve_status_enum.AVAILABLE
        },
        {
            seat_uid: "226",
            seat_row: 2,
            seat_col: 2,
            seat_category: "prime",
            seat_status: true,
            reserve_status: reserve_status_enum.AVAILABLE
        },

    ];

    res.render('purchase/movie/seat', {
        session_uid,
        screen_code,
        max_row_num,
        max_col_num,
        seat_list,
    });
});

// 영화예매(좌석 선택) 페이지
router.post('/seat/get_seat', function(req, res)
{
    const screen_code = req.query.screen_code;

    /*
    SELECT S.seat_uid, S.seat_row, S.seat_col, S.seat_category, S.seat_status, R.reserve_status
    FROM seat S, reserve R
    WHERE S.seat_uid = R.seat_uid
    AND screen_code = "screen_code";
    */
   
    const seat_list = [
        {
            seat_uid: "222",
            seat_row: 1,
            seat_col: 2,
            seat_category: "prime",
            seat_status: true,
            reserve_status: "예약 중"
        },
        {
            seat_uid: "223",
            seat_row: 0,
            seat_col: 1,
            seat_category: "prime",
            seat_status: true,
            reserve_status: null
        },
    ];

    res.json({
        seat_list,
    });
});

// 영화예매 확인 페이지
router.get('/check', function(req, res)
{
    const session_uid = req.query.session_uid;
    const adult_no = req.query.adult_no;
    const child_no = req.query.child_no;
    const reserved_seat_list = encodeURIComponent(JSON.stringify(req.query.reserve_seat_list));
    // 티켓 가격 계산
    const payment_price = ticket_adult_price * adult_no + ticket_child_price * child_no;
    
    /*
    SELECT T.theater_name, S.screen_name, M.movie_title
    FROM theater T, screen S, movie_session M
    WHERE T.theater_code = S.theater_code
    AND S.screen_code = M.screen_code
    AND S.session_uid = "session_uid"
    ;
    */
    
    // 성인, 청소년 수에 맞춰 티켓의 가격 책정

    const theater_name = "theater1";
    const screen_name = "3관";
    const movie_title = "인디펜던스 데이";

    console.log(reserved_seat_list)

    res.render('purchase/movie/check', {
        theater_name,
        screen_name,
        movie_title,
        reserved_seat_list,
        adult_no,
        child_no,
        payment_price,
    });
});

// 영화예매 확인 페이지 현재 로그인 중인 세션의 유저 customer_code를 얻음
router.post('/check/customer_code', function(req, res)
{
    // 회원 로그인인 경우
    if (isAccountSession(req))
    {
        const signin_type = "account";
        const session_account_id = req.session.sign_id;
        /*
        // account의 customer_code를 검색
        SELECT customer_code
        FROM account
        WHERE account_id = "session_account_id";
        */
        const customer_code = "account_customer_code";
        res.json({customer_code,});
    }
    // 비회원 로그인인 경우
    else if (isCustomerSession(req))
    {
        const signin_type = "customer";
        const session_customer_name = req.session.name;
        const session_birth_date = req.session.birth_date;
        const session_phone = req.session.phone;
        /*
        // customer_code 얻어옴
        SELECT customer_code
        FROM customer
        WHERE customer_name = "session_customer_name"
        AND customer_birth_date = "session_birth_date"
        AND phone = "session_phone";
        */
        const customer_code = "customer_code";
        res.json({customer_code,});
    }
    // 세션이 없다면 null 반환
    else
    {
        res.json({customer_code: null});
    }
});

// 영화예매 확인 페이지 결제 가능 여부 확인
router.post('/check/check_payment', function(req, res)
{
    const payment_price = req.body.payment_price;
    const payment_method = req.body.payment_method;

    // 결제방법으로 결제 가능 여부 확인
    switch (payment_method)
    {
    case "신용카드":
    case "무통장입금":
    case "카카오페이":
        // 위 3가지 경우 현재는 결제되었다고 가정
        // 회원, 비회원 로그인 모두 true
        res.json({result: true});
        break;
    case "포인트":
        // 회원 로그인일 경우
        if (isAccountSession(req))
        {
            // SELECT points FROM account WHERE account_id;
            // 현재 계정의 포인트 값을 확인
            const cur_points = 300;
            // 현재 포인트 값보다 결제금액이 크거나 같으면 true
            if (payment_price <= cur_points)
            {        
                res.json({result: true});
            }
            else
            {        
                res.json({result: false});
            }
        }
        // 비회원 로그인의 경우 포인트 결제 불가능
        else
        {        
            res.json({result: false});
        }
        break;
    default:
        res.json({result: false});
    }
});

// 영화예매 확인 페이지 결제 진행
router.post('/check/process_payment', function(req, res)
{
    const customer_code = req.body.customer_code;
    const payment_price = req.body.payment_price;   // ticket_price와 동일
    const payment_method = req.body.payment_method;
    const ticket_price = req.body.payment_price;    // payment_price와 동일
    const adult_no = req.body.adult_no;
    const child_no = req.body.child_no;
    const reserve_status = req.body.reserve_status;    

    /*
    // payment 데이터 생성
    INSERT INTO payment VALUES(
        "customer_code", 
        "payment_price",
        "payment_method"
    );
    */

    // payment_uid 받아서 저장
    const payment_uid = "payment_uid";
    
    /*
    // ticket 데이터 생성
    INSERT INTO ticket VALUES(
        "payment_uid",
        "ticket_price",
        "adult_no",
        "child_no",
        "reserve_status"
    );
    */
    const ticket_uid = "ticket_uid";
    /*
    // 해당 티켓으로 예약한 상영일정의 좌석 예약 상태 추가
    // session_uid 값 읽어오기
    SELECT session_uid
    FROM reserve
    WHERE ticket_uid="ticket_uid";
    */
    const session_uid = "session_uid";
    /*
    INSERT INTO reserve VALUES(
        "session_uid",
        "seat_uid",
        "ticket_uid",
        "RESERVED" // reserve.reserve_status
    );

    // payment_history 데이터 생성
    SELECT payment_uid
    FROM payment
    WHERE customer_code;
    INSERT INTO payment_history VALUES(
        "payment_history_sq", 
        "payment_uid",
        "결제" // payment_status
    );
    */

    // 회원 로그인 중이라면 포인트 데이터 생성
    if (isAccountSession(req))
    {
        // 포인트로 결제했다면 포인트 사용
        if (payment_method == "포인트")
        {
        const session_account_id = req.session.sign_id;
        const points_value = payment_price;
        /*
        INSERT INTO account_points VALUES(
            "session_account_id",
            "points_sq..?",
            "사용",
            points_value,
            "영화 티켓 예약 결제"
        );
        */
        }
        // 포인트 이외의 방법으로 결제했다면 포인트 적립
        else
        {
        const session_account_id = req.session.sign_id;
        const points_value = payment_price * points_ratio;
        /*
        INSERT INTO account_points VALUES(
            "session_account_id",
            "points_sq..?",
            "적립",
            points_value,
            "영화 티켓 예약 결제"
        );
        */
        }
    }
    res.json({
        payment_uid,
        ticket_uid,
        session_uid,
        result: true
    });
});

// 상품 결제완료 페이지
router.get('/complete', function(req, res)
{
    const payment_uid = req.query.payment_uid;

    res.render('purchase/movie/complete', {payment_uid,});
});

// 상품 결제완료 페이지
router.post('/complete/load_data', function(req, res)
{
    const payment_uid = req.body.payment_uid;
    const ticket_uid = req.body.ticket_uid;    
    const session_uid = req.body.session_uid;
    
    /*
    // 영화관 이름, 상영관 이름, 상영영화제목
    SELECT T.theater_name, S.screen_name, M.movie_title
    FROM theater T, screen S, movie_session M 
    WHERE T.theater_code = S.theater_code
    AND S.screen_code = M.screen_code
    AND session_uid = "session_uid";

    // 예약 좌석
    SELECT S.seat_row, S.seat_col
    FROM S.seat, R.reserve
    WHERE S.seat_uid = R.seat_uid
    AND session_uid = "session_uid"
    AND ticket_uid = "ticket_uid";
    */
    const seat_list = [{
        seat_row: "row_val1",
        seat_col: "col_val1",
        seat_category: "prime"
    },
    {
        seat_row: "row_val2",
        seat_col: "col_val2",
        seat_category: "prime"
    }];
    /*
    // 결제금액, 결제방법
    SELECT payment_price, payment_method
    FROM payment
    WHERE payment_uid = "payment_uid";
    */

    res.json({
        theater_name,
        screen_name,
        movie_title,
        seat_list,
        payment_price,
        payment_method
    });
});

export { router };
