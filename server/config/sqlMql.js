var sqlMap = {
    user: {
        // 插入
        insert_user: 'INSERT INTO user (nickname, avatar, role, status) VALUES (?,?,1,1)',
        insert_userAuths: 'INSERT INTO user_auths (user_id, identity_type, identifier, credential) VALUES (?,1,?,?)',
        insert_userAccount: 'INSERT INTO user_account (user_id,source,source_no,amount,create_time,title,body) VALUES (?,?,?,?,?,?,?)',
        // 查找
        select_user: `SELECT a.id,a.nickname,a.role,a.avatar,b.identity_type,b.identifier,b.credential,c.gender,c.credit_grade,c.comprehensive_score FROM ((user a JOIN user_auths b on a.id=b.user_id) JOIN user_info c on a.id=c.user_id) WHERE status = 1`,
        select_userInfo: `SELECT a.id,a.nickname,a.avatar,a.role,a.status,b.identity_type,b.identifier,b.credential,b.create_time,d.zip,d.province,d.city,d.area,d.address,d.real_name,d.identity_card_type,d.identity_card_no,d.phone,d.email,d.gender,d.user_money,d.modified_time,d.credit_grade,d.comprehensive_score FROM (((user a JOIN lease c on a.id=c.customer_id) JOIN user_auths b on c.customer_id=b.user_id) JOIN user_info d on c.customer_id=d.user_id) WHERE status = 1`, 
        select_alluser: 'SELECT distinct a.id,a.nickname,a.role,a.avatar,b.identifier,b.identity_type,b.create_time,c.zip,c.province,c.city,c.identity_card_type,c.identity_card_no,c.phone,c.email,c.gender,c.user_money,c.modified_time,c.credit_grade,c.comprehensive_score FROM (((user a JOIN lease d on a.id=d.customer_id) JOIN user_auths b on d.customer_id=b.user_id) JOIN user_info c on d.customer_id=c.user_id) WHERE status = 1',
        select_usercount: 'SELECT COUNT(distinct a.id) as num FROM (((user a JOIN lease d on a.id=d.customer_id) JOIN user_auths b on d.customer_id=b.user_id) JOIN user_info c on d.customer_id=c.user_id) WHERE status = 1',
        select_userAccount: 'SELECT source,amount,source_no,create_time,title,body,productCode FROM user_account WHERE user_id=',
        // 更新
        update_user: 'UPDATE user a,user_auths b,user_info c SET',
        update_userInfo: 'UPDATE user a,user_auths b,user_info c SET '
    },
    business: {
        // 查找
				select_business: 'SELECT a.nickname,b.id,b.user_id,b.business_name,b.business_describe,b.lease_account,b.order_quantity,b.credit_score,b.complaint_account,b.create_time,b.province,b.city,b.area,b.address,b.auditStatus,b.business_url FROM business b JOIN user a on a.id=b.user_id WHERE ',
        select_businessInfo: 'SELECT b.id,b.user_id,b.business_name,b.business_describe,b.lease_account,b.order_quantity,b.credit_score,b.complaint_account,b.create_time,b.province,b.city,b.area,b.address FROM business b WHERE',
    },
    lease: {
        select_lease: 'SELECT a.id,a.shop_id,a.business_id,a.shop_code,a.order_sn,a.shop_name,a.category,a.customer_id,a.customer_name,a.payment_method,a.order_money,a.district_money,a.payment_money,a.pay_time FROM lease a JOIN user b on a.user_id=b.id',
        select_leaseCount: 'SELECT COUNT(*) as num FROM lease a JOIN user b on a.user_id=b.id',
        select_leaseInfo: 'SELECT * FROM (lease a JOIN business b on a.business_id=b.id) JOIN shop c on c.business_id=b.id'
    },
    shop: {
			// 查找
			select_shop: 'SELECT * FROM (SELECT a.id,a.business_id,a.brand_name,a.shop_name,a.status,a.rent_price,a.rent_type,a.category,a.production_date,a.shop_code,a.audit_status,a.shop_describe,a.shop_url,a.modified_time,a.create_time FROM shop a JOIN user b ON a.user_id=b.id WHERE ',
			select_shopInfo: 'SELECT a.id,a.business_id,a.brand_name,a.shop_name,a.status,a.rent_price,a.rent_type,a.category,a.production_date,a.shop_code,a.audit_status,a.shop_describe,a.shop_url,a.modified_time,a.create_time,b.business_name,b.business_describe,b.lease_account,b.order_quantity,b.credit_score,b.complaint_account,b.create_time,b.province,b.city,b.area,b.address FROM (shop a JOIN user c ON a.user_id=c.id) JOIN business b ON a.business_id=b.id WHERE ',
			select_shopTotal: 'SELECT COUNT(DISTINCT a.shop_code) as num FROM shop a JOIN user b on a.user_id=b.id WHERE ',
			select_shopHistory: 'SELECT a.id,a.user_id,a.business_id,a.brand_name,a.shop_name,a.status,a.rent_price,a.rent_type,a.category,a.production_date,a.shop_code,a.audit_status,a.shop_describe,a.shop_url,a.modified_time,a.create_time,b.nickname FROM shop a JOIN user b ON a.user_id=b.id WHERE ',
			// 插入
			insert_shop: 'INSERT INTO shop (user_id,business_id,brand_name,shop_name,status,rent_price,rent_type,category,production_date,shop_code,audit_status,shop_describe,shop_url,modified_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
			// 删除
			delete_shopById: 'DELETE FROM shop WHERE id='
		}
}

module.exports = sqlMap;