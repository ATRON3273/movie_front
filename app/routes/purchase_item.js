/* 영화 예매, 상품 구매 페이지*/

import express from "express";
import { hasSession } from "../utils/sessions.js";

const router = express.Router({ mergeParams: true });

// 상품 선택 페이지
router.get('/select', function(req, res)
{
    if (hasSession(req))
    {
        res.render('purchase/item/select');
    }
    else
    {
        res.redirect('/signin');
    }
});

// 상품 선택 페이지 영화관 리스트 불러오기
router.post('/select/init_theater', function(req, res)
{
    // SELECT theater_code, theater_name FROM theater;

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

// 상품 선택 페이지 영화관 기준 상점 필터링
router.post('/select/filter_store', function(req, res)
{
    const theater_code = req.body.theater_code;

    // 영화관 코드가 F003으로 시작할 때
    // 그 안에 있는 상점도 F003으로 시작할 것임
    // SELECT * FROM store WHERE store_code LIKE 'F003%';

    const store_list = [{
        store_code: "store_code",
        store_name: "store_name",
    }, {
        store_code: "store_code2",
        store_name: "store_name2",
    }];

    res.json({
        store_list,
    });
});

// 상품 선택 페이지 상품 필터링
router.post('/select/filter_item', function(req, res)
{
    const store_code = req.body.store_code;

    // SELECT item_code, item_name, item_category, item_price FROM item WHERE store_code='store_code';

    const item_list = [
        {
            item_code: "213231",
            item_name: "팝콘",
            item_category: "스낵",
            item_price: 4000,
        },
        {
            item_code: "213232",
            item_name: "콜라",
            item_category: "스낵",
            item_price: Math.random(),
        },
        {
            item_code: "213233",
            item_name: "나쵸",
            item_category: "스낵",
            item_price: 3000,
        },
    ]

    res.json({
        item_list,
    });
});

// 상품구매 확인 결제내용 불러오기
router.get('/check', function(req, res)
{
    res.render('purchase/item/check');
});

// 상품 구매 결제 완료 페이지 데이터 불러오기
router.post('/complete/load_data', function(req, res)
{
    const payment_uid = req.body.payment_uid;

    /*
    장바구니 내용(영화관, 상점, 상품, 상품가격, 주문수량)
    SELECT B.basket_uid, S.store_name, I.item_name, I.item_price, B.order_quantity
    FROM basket B, store S, item I
    WHERE S.store_code = B.store_code
    AND S.store_code = I.store_code
    AND I.item_code = B.item_code
    AND B.payment_uid = "payment_uid";

    결제 내용(결제금액, 결제방법)
    SELECT payment_price, payment_method
    FROM payment
    WHERE payment_uid="payment_uid";
    */
    const theater_name = "영화관33";
    const store_name = "스낵코너"
    const basket_list = [{
        basket_uid: "6546",
        item_name: "팝콘",
        item_price: 5000,
        order_quantity: 3
        },
    ];
    const payment_data = {
        payment_price: "payment_price",
        payment_method: "payment_method",
    };

    res.json({
        theater_name: theater_name,
        store_name: store_name,
        basket_list: basket_list,
        payment_data: payment_data
    });
});

// 상품 결제완료 페이지
router.get('/complete', function(req, res)
{
    res.render('purchase/item/complete');
});

export { router };