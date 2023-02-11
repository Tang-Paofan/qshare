var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const request = require('request');
const alipaySdk = require('../config/alipay');
const axios = require('axios')
const moment = require('moment')

// vuksec0493@sandbox.com

const AlipayFormData = require('alipay-sdk/lib/form').default; 
router.post('/pcpay', (req, res) => {
    (async () => {        
        const formData = new AlipayFormData();
        formData.setMethod('get');
        formData.addField('charset', 'utf-8');
        formData.addField('timestamp', moment().format("YYYY-MM-DD HH:mm:ss"));
        formData.addField('return_url', 'http://127.0.0.1:8080/paySuccess'); 
        formData.addField('bizContent', {
            outTradeNo: req.body.outTradeNo, 
            productCode: 'FAST_INSTANT_TRADE_PAY', 
            totalAmount: '9.99', 
            subject: '商品', 
            body: '商品详情', 
        });        
        const result = await alipaySdk.exec(
            'alipay.trade.page.pay', // 统一收单下单并支付页面接口
            {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
            {formData: formData},);     
        res.json({
            code: '200',
            url: result,
            outTradeNo: req.body.outTradeNo,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
            subject: '商品', // 订单标题
            body: '商品详情', // 订单描述
        });

    })();
});

router.post('/query', function (req, res) {
    (async function () {
        const {outTradeNo} = req.body;
        const formData = new AlipayFormData();
        formData.setMethod('get');
        formData.addField('bizContent', {
            outTradeNo
        });        // 通过该接口主动查询订单状态        
        const result = await alipaySdk.exec(          
            'alipay.trade.query', {},{
            formData: formData
        },);
    axios({
        method: 'GET',
        url: result
    }).then(data => {
        let r = data.data.alipay_trade_query_response;
        if (r.code === '10000') { // 接口调用成功
            switch (r.trade_status) {
                case 'WAIT_BUYER_PAY':
                    res.send({code: '300', data: '交易创建，等待买家付款'});
                    break;
                case 'TRADE_CLOSED':
                    res.send({code: '300', data: '未付款交易超时关闭，或支付完成后全额退款'});
                    break;
                case 'TRADE_SUCCESS':
                    res.send({code: '200', data: '交易支付成功'});
                    break;
                case 'TRADE_FINISHED':
                    res.send('交易结束，不可退款');
                    break;
            }
        } else if (r.code === '40004') {
            res.send({code: '200', data: '交易不存在'});
        }
    }).catch(err => {
        res.json({
            msg: '查询失败',
            err
        });
    });
})();
})
;

module.exports = router;