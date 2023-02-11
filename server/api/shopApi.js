var express = require('express');
var router = express.Router();
const moment = require('moment');
const multer = require('multer');
const mysql = require("mysql");
const path = require('path');
const $sql = require("../config/sqlMql")

const jsonWrite = (res, code, msg, data) => {
	let ret = {code,  msg, data }
	res.json(ret);
}

// $route   POST api/shop/upload/uploadShop
// @desc    shop图片上传
// access   public

// shop图片上传
const dir = path.resolve(__dirname, '../public/images/shop');

const storage = multer.diskStorage({
    // 指定文件路径
    destination: function(req, file, cb) {
        // cb(null, './uploads');
        cb(null, dir);
    },
    // 指定文件名
    filename: function(req, file, cb) {
        // filedname指向参数key值
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage
});
router.post('/upload/uploadShop',upload.any(), (req, res) => {
    // console.log(req.files);  // 上传的文件信息
    if (req.files === undefined) {
        return res.send({
            errno: -1,
            msg: 'no file'
        });
    }
    const {size, mimetype, filename} = req.files[0];
    // 路径可根据设置的静态目录指定
    const url = 'http://127.0.0.1:8887/server/public/images/shop/' + filename;
    res.json({
        code: '200',
        msg: 'upload success',
        url
    });
})

// $route   POST api/shop/getShop
// @desc    获取产品详情
// access   public
router.post('/getShop', (req,res) => {
	let sql_name = $sql.shop.select_shop
	let params = req.body
	sql_name += `b.id=${params.id}`
	if (params.shop_name != '' || params.brand_name != '' || params.shop_code != '') {
		sql_name += ` AND a.shop_name LIKE '%${params.shop_name === '' ? '' : params.shop_name}%' AND a.brand_name LIKE '%${params.brand_name === '' ? '' : params.brand_name}%' AND a.shop_code LIKE '%${params.shop_code === '' ? '' : params.shop_code}%'`
	}
	if (params.status != '') {
		sql_name += ` AND a.status=${params.status}`
	}
	if (params.audit_status != '') {
		sql_name += ` AND a.audit_status=${params.audit_status}`
	}
	if (params.production_date != '') {
		sql_name += ` AND a.production_date BETWEEN '${params.production_date[0] === '' ? '' : params.production_date[0]}' AND '${params.production_date[1] === '' ? '' : params.production_date[1]}'`
	}
	sql_name += ' ORDER BY modified_time DESC) temp_table GROUP BY shop_code LIMIT ?,?'
	try {
		conn.query(sql_name, [(params.pageNum - 1) * params.pageSize, params.pageSize], (err, resq) => {
			if (err) throw new Error(err)
			if (resq[0]) jsonWrite(res, '200', '获取全部产品信息成功！', resq);
			else jsonWrite(res, '-1', '没有获取任何数据！', resq)
		})
	} catch (error) {
		console.log(error)
	}	
})

// $route   POST api/shop/getShopTotal
// @desc    获取产品数量
// access   public
router.post('/getShopTotal', (req, res) => {
	let sql_name = $sql.shop.select_shopTotal
	let params = req.body
	sql_name += `b.id=${params.id}`
	try {
		conn.query(sql_name, (err, resq) => {
			if (err) throw new Error(err)
			if (resq[0]) jsonWrite(res, '200', '获取产品数量成功！', resq);
			else jsonWrite(res, '-1', '没有获取任何数据！', resq)
		})
	} catch (error) {
		console.log(error)
	}
})

// $route   POST api/shop/addShop
// @desc    新增产品
// access   public
router.post('/addShop', (req, res) => {
	let sql_name = $sql.shop.insert_shop
	let params = req.body
	params.status = 2
	params.audit_status = 1
	try {
		conn.query(sql_name, [params.user_id, params.business_id,params.brand_name, params.shop_name, params.status, params.rent_price, params.rent_type, params.category, params.production_date, params.shop_code, params.audit_status, params.shop_describe, params.shop_url, params.modified_time], (err, resq) => {
			if (err) throw new Error(err)
			if (resq.affectedRows) jsonWrite(res, '200', '产品添加/更新成功！', resq);
			else jsonWrite(res, '-1', '更新失败！', resq)
		})
	} catch (error) {
		console.log(error)
	}
})

// $route   POST api/shop/getShopHistory
// @desc    查找产品的历史信息
// access   public
router.post('/getShopHistory', (req, res) => {
	let sql_name = $sql.shop.select_shopHistory
	let params = req.body
	sql_name += `a.shop_code='${params.shop_code}' ORDER BY modified_time DESC`
	try {
		conn.query(sql_name, (err, resq) => {
			if (err) throw new Error(err)
			if (resq[0]) jsonWrite(res, '200', '成功获取产品历史记录！', resq);
			else jsonWrite(res, '-1', '获取失败', resq)
		})
	} catch (error) {
		console.log(error)
	}
})

// $route   POST api/shop/deleteShopById
// @desc    删除商品
// access   public
router.post('/deleteShopById', (req, res) => {
	let params = req.body
	for(let i = 0; i < params.deleteList.length; i++){
		let sql_name = $sql.shop.delete_shopById
		sql_name += params.deleteList[i]
		try {
			conn.query(sql_name, (err, resq) => {
				if (err) throw new Error(err)
				if (resq.affectedRows) jsonWrite(res, '200', '删除成功！', resq);
				else jsonWrite(res, '-1', '删除失败', resq)
			})
		} catch (error) {
			console.log(error)
		}
	}
})

module.exports = router;