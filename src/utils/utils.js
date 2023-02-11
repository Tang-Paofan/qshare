let utils = {
    RegExp: {
        emailReg : /^[a-z0-9A-Z]+([-|_|\.]+[a-z0-9A-Z]+)*@([a-z0-9A-Z]+[-|\.])+[a-zA-Z]{2,5}$/,
        idCardReg : /^(([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))))$/,
        phoneReg : /^1[34578]\d{9}$/,
        credentialReg: /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-z\d#@!~%^&*]{8,12}/
    },
    creditLevel(val) {
        switch(val) {
            case 1:
                return '极好'
                break
            case 2:
                return '良好'
                break
            case 3:
                return '一般'
                break
            case 4:
                return '较差'
                break
            case 5:
                return '很差'
                break
            default:
                break
        }
    },
    sexJudge(val) {
        switch(val){
            case 1:
                return '男'
                break
            case 2:
                return '女'
            default:
                break
        }
    },
    creditGradeTag(val) {
        switch(val){
            case 1:
                return 'success'
                break
            case 2:
                return ''
                break
            case 3:
                return 'info'
                break
            case 4:
                return 'warning'
                break
            case 5:
                return 'danger'
                break
            default:
                break 
        }
    },
    category(val) {
        switch(val) {
            case 1:
                return '充电宝'
                break
            case 2:
                return '共享单车'
                break
            case 3:
                return '游戏卡'
                break
            case 4:
                return '服装'
                break
            case 5:
                return '游戏机'
                break
            case 6:
                return '数码'
                break
            case 7:
                return '办公用品'
                break
						case 8:
								return '生活用品'
								break
            default:
                break
        }
    },
    paymentFormat(val) {
        switch(val) {
            case 1:
                return "现金"
                break
            case 2:
                return "账户余额"
                break
            case 3:
                return "网银"
                break
            case 4:
                return "支付宝"
                break
            case 5:
                return "微信"
                break
            default:
                return
        }
    },
		shopAuditStatus(val) {
			switch(val) {
				case 1:
					return '审核中'
					break
				case 2:
					return '审核失败'
					break
				case 3:
					return '审核成功'
					break
				default:
					break
			}
		},
		shopStatus(val) {
			switch(val) {
				case 1:
					return '下架'
					break
				case 2:
					return '闲置'
					break
				case 3:
					return '售出'
					break
				case 3:
					return '租赁中'
					break
				default:
					break
			}
		},
    toStorage (num, digits) {
        digits = digits || 2
        if (num < 1024) {
          return num + 'B'
        }
        num = (num * 1000 / 1024)
        const si = [
          { value: 1E18, symbol: 'E' },
          { value: 1E15, symbol: 'P' },
          { value: 1E12, symbol: 'T' },
          { value: 1E9, symbol: 'G' },
          { value: 1E6, symbol: 'M' },
          { value: 1E3, symbol: 'K' }
        ]
        for (let i = 0; i < si.length; i++) {
          if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
              si[i].symbol + 'B'
          }
        }
      },
      
      /**
       * 图片大小校验
       * @param {file} file el-upload文件对象
       * @param {number} size 限制的文件大小(kb) 默认10M
       */
    validImgUpload (file, size) {
        size = +size || 10240
        const isSizeOut = file.size / 1024 > size
        if (isSizeOut) {
          Message.error('上传图片大小不能超过' + toStorage(size * 1024))
        }
        return !isSizeOut
      },
      
      /**
       * 创建唯一的字符串
       * @return {string} ojgdvbvaua40
       */
    createUniqueString () {
        const timestamp = +new Date() + ''
        const randomNum = parseInt((1 + Math.random()) * 65536) + ''
        return (+(randomNum + timestamp)).toString(32)
      }
}



export default utils