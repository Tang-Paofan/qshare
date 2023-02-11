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

// $route   POST api/business/getBusiness
// @desc    获取店铺信息
// access   public
router.post('/getBusiness', (req, res) => {
	let sql_name = $sql.business.select_business
	let params = req.body
	sql_name += `a.id=${params.id}`
	if (params.business_name != '') {
		sql_name += ` AND b.business_name LIKE '%${params.business_name === '' ? '' : params.business_name}%'`
	}
	// if (params.status != '') {
	// 	sql_name += ` AND a.status=${params.status}`
	// }
	// if (params.audit_status != '') {
	// 	sql_name += ` AND a.audit_status=${params.audit_status}`
	// }
	if (params.create_time != '') {
		sql_name += ` AND b.create_time BETWEEN '${params.create_time[0] === '' ? '' : params.create_time[0]}' AND '${params.create_time[1] === '' ? '' : params.create_time[1]}'`
	}
	sql_name += ' LIMIT ?,?'
	try {
		conn.query(sql_name, [(params.pageNum - 1) * params.pageSize, params.pageSize], (err, resq) => {
			if (err) throw new Error(err)
			if (resq[0]) jsonWrite(res, '200', '获取全部店铺信息成功！', resq);
			else jsonWrite(res, '-1', '没有获取任何数据！', resq)
		})
	} catch (error) {
		console.log(error)
	}
})


module.exports = router;