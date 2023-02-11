<template>
    <div>
        <h2 v-if="flag">订单验证中...</h2>
        <h2 v-if="!flag">{{ time }}秒回到原页面</h2>
    </div>
</template>

<script>
export default {
    name: 'paySuccess',

    data() {
        return {
            time: 3,
            flag: true,
            userInfo: ''
        };
    },
    created() {
        this.userInfo = this.$store.state.user
        this.load()
    },

    mounted() {
        
    },

    methods: {
        load() {
            let outTradeNo = this.$route.query.out_trade_no
            this.request.post('/api/alipay/query', {
                outTradeNo
            }).then(async resp => {
                this.Timer()
                this.$message.success(resp.data)
                this.flag = false
                await this.searchUserInfo()
                await this.searchUserAccount()
            })
        },
        Timer() {
            setInterval(() => {
                if(this.time == 0) {
                    window.close();
                    return
                }
                this.time--
            }, 1000)
        },
        searchUserAccount () {
            this.request.post('/api/user/selectUserAccount', {
                id: this.$store.state.user.id,
            }).then(res => {
                res.data.forEach(item => {
                    this.userInfo.user_money += parseFloat(item.amount.toFixed(2))
                });
                this.userInfo.user_money = parseFloat(this.userInfo.user_money).toFixed(2)
                this.$store.commit('updateUser', this.userInfo)
                console.log(this.userInfo.user_money)
            }).catch(err => {
                console.log(err)
            })
        },
        searchUserInfo() {
             this.request.post('api/user/getUserById', {
                id: this.$store.state.user.id
            }).then((res) => {
                this.$store.commit('updateUser', res.data[0])
                this.userInfo = this.$store.state.user
                this.selectedOptions = [this.$store.state.user.province, this.$store.state.user.city, this.$store.state.user.area]
            }).catch(err => {
                console.log(err)
            })
        }
    },
};
</script>

<style lang="less" scoped>

</style>