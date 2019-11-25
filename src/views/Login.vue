<template>
    <div class="login">
        <el-form  :model="loginFrom" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <h1 class="title">系统登录</h1>
            <el-form-item  prop="account">
                <el-input v-model="loginFrom.account" prefix-icon="iconfont icon-zhanghao"   autocomplete="off"></el-input>
            </el-form-item>
            <!--prop和rules里面的验证字段对应-->
            <el-form-item prop="password">
                <!--眼睛的图标和显示类型根据isOpen变化-->
                <el-input @click.native="clcikRevers" v-model="loginFrom.password" prefix-icon="iconfont icon-mima"
                          :suffix-icon="isOpen?'iconfont icon-xianshimima':'iconfont icon-buxianshimima'"
                          :type="isOpen?'text':'password'"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <!--给登录注册一个事件-->
                <el-button type="primary" @click="submitFrom" >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    //引入验证函数
    import { reg } from "../utils/reg";
    //引入登录请求
    import { accountLogin } from"../api/account"
    //引入本地存储函数
    import local from "../utils/local"


    export default {
        data(){
            //自定义验证函数
            var validpwd=(rule, value, callback)=>{//rule是验证对象，value是取到的值，callback是回调
                if(value===""){//判空
                    callback(new Error('密码不能为空'))
                }else if(!rule.pattern.test(value)){//rule.pattern方法拿到自定义的正则规则，去验证填写的值，返回布尔值
                    callback(new Error('密码只能输入6-20个字母、数字、下划线 '))
                }else {//成功验证
                    callback();
                }
            };
            return{
                //表单数据双向绑定
                loginFrom:{
                    account:"",
                    password:""
                },
                //判断是否显示密码数字
                isOpen:false,
                rules: {//element-ui内置的验证规则
                    acc: [//validateacc是一个方法名，失焦后触发
                        { required:true,message:"账号名不能为空",trigger:"blur"},//非空
                        {min:3,max:6,message:"账号名长度为3-6位",trigger:"blur"}//长度
                    ],
                    pwd: [
                        // { required:true,message:"密码不能为空",trigger:"blur"},//非空
                        // {min:3,max:6,message:"密码长度为3-6位",trigger:"blur"}//长度
                        //自定义验证规则 validapwd是一个函数名，写在data后return前,自己写一个正则规则字段。
                        //但是因为可能多次使用到这个验证规则，所以我们可以把它抽出去。
                        {validator:validpwd,pattern:reg(),trigger:"blur"}
                    ]
                }
            }
        },
        methods:{
            //点击输入框使眼睛的动态数据取反
            clcikRevers(e){
                //如果没有返回判断，那么点击整个input框都会触发效果
                //e.target事件对象源，拿到点击对象，然后去取class名，判断是否包含这个属性，然后才取反
                if(e.target.className.includes("el-input__icon")){
                    this.isOpen=!this.isOpen;
                }
            },
            submitFrom(){
                //取到整个表单
                this.$refs.loginForm.validate(async  valid=>{//validate属性会把取到的整个表单信息走一次他定义的验证，返回一个布尔值
                    if(valid){//如果返回true，则验证成功可以提交
                        //取当前值传给后端
                        let {code,token,role}=await accountLogin(this.loginFrom);
                        if(code===0){
                            //将获取到的令牌存入本地存储中，用来做路由守护和身份鉴权
                            local.set("token",token);
                            //跳转页面到首页
                            this.$router.push("/home");
                            //将身份验证存入本地
                            local.set("role",role)
                        }
                    }else {//验证失败
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="less" >
    .login{
        height: 100%;
        background-color: #2D3A4B;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-form{
            width: 400px;
            .el-form-item{
                .el-form-item__content{
                    margin: 0!important;
                    .el-input__inner{
                        background-color: #283443;
                        border: 1px solid #ccc;
                        color:#fff;
                        padding-left: 40px;
                    }
                    .icon-mima{
                        font-size: 23px;
                    }
                    .icon-zhanghao{
                        font-size: 20px;
                        margin-left: 2px;
                    }
                    .el-button{
                        width: 400px;
                    }
                }
            }
            .title{
                font-size: 25px;
                font-weight:bolder;
                color:#fff;
                margin-bottom: 30px;
                text-align: center;
            }
        }
    }

</style>