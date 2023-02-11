const express = require("express");
let router = express.Router();
// const mysql = require("mysql");
// const models = require("../config/db")
const $sql = require("../config/sqlMql")
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment')

let jsonWrite = (res, code, msg, data) => {
    let ret = {code,  msg, data }
    res.json(ret);
}

let dateStr = function(str) {
    return new Date(str.slice(0,7));
}

// $route   POST api/user/login
// @desc    登录验证
// access   public
router.post('/login', (req, res) => {
    let sql_name = $sql.user.select_user;
    let params = req.body;
    if(params.isvalidate == 'false') {
        jsonWrite(res, '-2', '验证码错误，请重新输入！', []);
    } else {
        if (params.identifier) {
            sql_name += " AND b.identifier = '"+ params.identifier + "'";
        }
        conn.query(sql_name, (err, result) => {
            if (err) {
                jsonWrite(res, '405', '服务器请求出错', err);
                console.log(err);
            }
            if (result[0] === undefined) {
                jsonWrite(res, '-1', '该账号尚未注册，请注册后登录！', []);
            } else {
                let resultArray = result[0];
                if(resultArray.credential == params.credential) {
                    jsonWrite(res, '200', '登陆成功！', resultArray);
                } else {
                    jsonWrite(res, '0', '密码错误，请重新输入！', [])
                }
            }
        })
    }
});

// $route   POST api/user/register
// @desc    注册
// access   public
router.post('/register', (req, res) => {
    let sql_name = $sql.user.insert_user;
    let sqlInfo = $sql.user.insert_userAuths;
    let params = req.body;
    conn.query(sql_name, [params.nickname, null], (err, result) => {
        if (err) {
            jsonWrite(res, '405', '服务器请求出错', err);
            console.log(err);
        }
        if (result) {
            // console.log(result)
            conn.query(sqlInfo, [result.insertId, params.identifier, params.credential], (er, re) => {
                if(er) {
                    console.log(er);
                    jsonWrite(res, '405', '服务器请求出错', er);
                }
                if(re) {
                    // console.log(re);
                    let results = {
                        id: result.insertId,
                        nickname: params.nickname,
                        identifier: params.identifier,
                        credential: params.credential,
                    }
                    jsonWrite(res, '200', '注册成功！', results);
                }
            })
        }
    })
});

// $route   POST api/user/getUserById
// @desc    获取该用户信息
// access   public
router.post('/getUserById', (req, res) => {
    let params = req.body;
    let sql_name = $sql.user.select_userInfo
    sql_name += ` AND a.id = ${params.id}`
    conn.query(sql_name, (err, results) => {
        if(err) {
            console.log(err);
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取用户信息数据成功！', results);
        }
    })
})

// $route   POST api/user/updateUserById
// @desc    更新该用户信息
// access   public
router.post('/updateUserById', (req, res) => {
    let sql_name = $sql.user.update_userInfo
    let params = req.body
    sql_name += `a.nickname='${params.nickname}',a.avatar='${params.avatar}',b.identifier='${params.identifier}',b.identity_type=${params.identity_type},c.gender=${params.gender},c.province='${params.province}',c.city='${params.city}',c.area='${params.area}',c.address='${params.address}',c.real_name='${params.real_name}',c.identity_card_type=${params.identity_card_type},c.identity_card_no='${params.identity_card_no}',c.phone='${params.phone}',c.email='${params.email}',c.comprehensive_score='${params.comprehensive_score}',c.credit_grade=${params.credit_grade},c.modified_time='${params.modified_time}' WHERE a.id=b.user_id AND a.id=c.user_id AND a.id=${params.id}`
    conn.query(sql_name, (err, results) => {
        if(err) {
            console.log(err);
        }
        if(results.changedRows != null) {
            jsonWrite(res, '200', '修改用户数据成功！', results);
        } else{
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        }
    })
})

// $route   POST api/user/insertUserAccount
// @desc    插入用户账户金额变动表
// access   public
router.post('/insertUserAccount', (req, res) => {
    let sql_name = $sql.user.insert_userAccount
    let params = req.body
    conn.query(sql_name, [params.user_id, params.source, params.source_no, params.amount, params.create_time, params.title, params.body], (err, results) => {
        if(err) {
            console.log(err);
        }
        if(results.insertId == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取用户账户数据成功！', results);
        }
    })
})

// $route   POST api/user/selectUserAccount
// @desc    查找用户账户金额变动表
// access   public
router.post('/selectUserAccount', (req, res) => {
    let sql_name = $sql.user.select_userAccount
    let params = req.body
    sql_name += params.id
    conn.query(sql_name, (err, results) => {
        if(err) {
            console.log(err);
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取所有用户账户数据成功！', results);
        }
    })
})

// $route   POST api/user/getUser
// @desc    获取所有用户信息
// access   public
router.post('/getUser', (req, res) => {
    let sql_name = $sql.user.select_alluser;
    let params = req.body;
    sql_name += ` AND d.user_id = ${params.id}`
    if (params.nickname != '' || params.identifier != '' || params.userId) {
        sql_name += ` AND a.nickname LIKE '%${params.nickname === '' ? '' : params.nickname}%' AND b.identifier LIKE '%${params.identifier === undefined ? '': params.identifier}%'`
    }
		if (params.userId != '') {
			sql_name += ` AND d.customer_id LIKE ${params.userId === '' ? '' : params.userId}`
		}
    sql_name += ' LIMIT ?,?';
    // console.log(params)
    // console.log(sql_name)
    conn.query(sql_name,[(params.pageNum - 1) * params.pageSize, params.pageSize], (err, results, fields) => {
        if(err) {
            console.log(err);
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取所有用户信息数据成功！', results);
        }
    })
});


// $route   POST api/user/userCount
// @desc    获取用户数量
// access   public
router.post('/userCount', (req, res) => {
    let sql_name = $sql.user.select_usercount;
    let params = req.body;
    sql_name += ` AND d.user_id = ${params.id}`
    if (params.nickname != undefined || params.identifier != undefined) {
        sql_name += ` AND a.nickname LIKE '%${params.nickname}%' AND b.identifier LIKE '%${params.identifier}%'`
    }
    conn.query(sql_name, (err, results) => {
        if(err) {
            console.log(err)
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取用户数量数据成功！', results);
        }
    })
})

// $route   GET api/user/businessInfo
// @desc    获取用户店铺信息
// access   public
router.post('/businessInfo', (req, res) => {
    let sql_name = $sql.business.select_businessInfo
    let params = req.body
    sql_name += " b.user_id = " + params.id
    conn.query(sql_name, (err, results) => {
        if (err) {
            jsonWrite(res, '405', '服务器请求出错', err);
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取用户店铺信息数据成功！', results);
        }
    })
})

// $route   POST api/user/lease
// @desc    获取该用户下的所有订单
// access   public
router.post('/lease', (req, res) => {
    let sql_name = $sql.lease.select_lease
    let params = req.body
    sql_name += " WHERE b.id = " + params.id
    if (params.payment_method != '') {
        sql_name += ` AND a.payment_method = ${params.payment_method == '' ? '' : params.payment_method}`
    }
    if ((params.customer_id != '') || (params.customer_name != '') || (params.order_sn != '')) {
        sql_name += ` AND a.customer_id LIKE '%${params.customer_id === '' ? '' : params.customer_id}%' AND a.customer_name LIKE '%${params.customer_name === '' ? '' : params.customer_name}%' AND a.order_sn LIKE '%${params.order_sn === '' ? '' : params.order_sn}%'`
    }
    if (params.pay_time != '') {
        sql_name += ` AND a.pay_time BETWEEN '${params?.pay_time[0] === '' ? '' : params.pay_time[0]}' AND '${params.pay_time[1] === '' ? '' : params.pay_time[1]}'`
    }
    sql_name += ' LIMIT ?,?';
    conn.query(sql_name, [(params.pageNum - 1) * params.pageSize, params.pageSize], (err, results) => {
        if(err) {
            console.log(err);
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取获取订单信息数据成功！', results);
        }
    })
})

// $route   POST api/user/leaseTotal
// @desc    获取该用户下订单数量
// access   public
router.post('/leaseTotal', (req, res) => {
    let sql_name = $sql.lease.select_leaseCount;
    let params = req.body
    sql_name += " WHERE b.id = " + params.id
    if (params.payment_method != '') {
        sql_name += ` AND a.payment_method = ${params.payment_method}`
    }
    if (params.customer_id != '' || params.customer_name != '' || params.order_sn != '') {
        sql_name += ` AND a.customer_id LIKE '%${params.customer_id === undefined ? '' : params.customer_id}%' AND a.customer_name LIKE '%${params.customer_name === undefined ? '' : params.customer_name}%' AND a.order_sn LIKE '%${params.order_sn === undefined ? '' : params.order_sn}%'`
    }
    if (params.pay_time != '') {
        sql_name += ` AND a.pay_time BETWEEN '${params?.pay_time[0] === '' ? '' : params.pay_time[0]}' AND '${params.pay_time[1] === '' ? '' : params.pay_time[1]}'`
    }
    conn.query(sql_name, (err, results) => {
        if(err) {
            console.log(err)
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取用户数量数据成功！', results);
        }
    })
})

// $route   POST api/user/leaseInfo
// @desc    获取该订单详细数据
// access   public
router.post('/leaseInfo', (req, res) => {
    let sql_name = $sql.lease.select_leaseInfo;
    let params = req.body
    sql_name += `  WHERE a.id = ${params.id}`
    conn.query(sql_name, (err, results) => {
        if (err) {
            console.log(err)
        }
        if(results[0] == undefined) {
            jsonWrite(res, '-1', '没有获取任何数据！', [])
        } else{
            jsonWrite(res, '200', '获取订单详细数据成功！', results);
        }
    })
})

// $route   POST api/user/upload/uploadAvatar
// @desc    头像上传
// access   public

// 头像上传
const dir = path.resolve(__dirname, '../public/images/avatar');
// console.log(__dirname)
// 图片大小限制KB
const SIZELIMIT = 500000;

const storage = multer.diskStorage({
    // 指定文件路径
    destination: function(req, file, cb) {
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
router.post('/upload/uploadAvatar',upload.single('file'), (req, res) => {
    // console.log(req.files);  // 上传的文件信息
    if (req.file === undefined) {
        return res.send({
            errno: -1,
            msg: 'no file'
        });
    }
    const {size, mimetype, filename} = req.file;
    const types = ['jpg', 'jpeg', 'png', 'gif'];
    const tmpTypes = mimetype.split('/')[1];
    // 检查文件大小
    if (size >= SIZELIMIT) {
        return res.send({
            errno: -1,
            msg: 'file is too large'
        });
    }
    // 检查文件类型
    else if (types.indexOf(tmpTypes) < 0) {
        return res.send({
            errno: -1,
            msg: 'not accepted filetype'
        });
    }
    // 路径可根据设置的静态目录指定
    const url = 'http://127.0.0.1:8887/server/public/images/avatar/' + filename;
    res.json({
        errno: 0,
        msg: 'upload success',
        url
    });
})
    

module.exports = router;