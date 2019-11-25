<template>
    <div class="account-add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加账号</span>
            </div>
            <div class="text item">
                <!--样式布局好，就定义一个数据，然后双向绑定-->
                <!--然后自定义验证 rules ,  每一个要验证的地方要用prop绑定rules里的字段-->
                <el-form  :model="accountAddData" :rules="rules" status-icon ref="accountAddFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="accountAddData.account"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input
                                @click.native="revaers" :suffix-icon="isOpen?'iconfont icon-xianshimima':'iconfont icon-buxianshimima'"
                                v-model="accountAddData.password" :type="isOpen?'text':'password'" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="用户组" prop="userGroup">
                        <el-select prop="value" class="userGroup" placeholder="请选择用户组" v-model="accountAddData.userGroup">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通管理员" value="普通管理员"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click.native="addAccount">添加</el-button>
                        <!--element里面有重置封装-->
                        <el-button @click="resetFrom" >重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
    //引入正则工具
    import {reg,accreg } from "../../utils/reg";
    //引入api层的请求方法
    import { accountAdd }from"../../api/account"

    export default {
        data(){
            //自定义规则
            const valiAcc=(rule,value,callback)=>{
                if(value===""){//非空
                   callback(new Error('账号不能为空'))
                }else if(!rule.params.test(value)){//长度验证，引入reg.js
                    callback(new Error('账号为中文、数字且长度3-16位'))
                }else {
                    callback();//成功
                }
            };
            const valiPwd=(rule,value,callback)=>{
                if(value===""){//非空
                    callback(new Error('密码不能为空'))
                }else if(!rule.params.test(value)){//长度验证，引入reg.js
                    callback(new Error('密码只能输入6-20个字母、数字、下划线'))
                }else {
                    callback();//成功
                }
            };


            return{
                isOpen:false,
                accountAddData:{
                    account:"",
                    password:"",
                    userGroup:""
                },
                rules:{//和上面的accountAddData字段对应 直接写自定义验证
                    account:[
                        {
                            required: true,
                            validator:valiAcc,
                            trigger: 'blur',
                            params:accreg()
                        }
                    ],
                    password:[
                        {
                            required: true,
                            validator:valiPwd,
                            trigger: 'blur',
                            params:reg()
                        }
                    ],
                    userGroup:[
                        {
                            required: true,
                            message: '请选择用户组',
                            trigger: 'change'
                        }
                    ]
                }
            }
        },
        methods:{
            revaers(e){
                if(e.target.className.includes("el-input__icon")){
                    this.isOpen=!this.isOpen
                }
            },
            addAccount(){
                //获取到整个表单，然后验证
                this.$refs.accountAddFrom.validate(async valid => {
                    if(valid){//如果都验证成功
                        // console.log("验证成功");
                        //先把api层暴露的方法引入  发送axios.post请求给后台  这注意，要用到ES7的async和await来控制异步
                        //然后注意，要用await就要在这个函数前用上async来修饰他是一个异步函数
                        let {code,msg}=await accountAdd(this.accountAddData);
                        if(code===0){
                            //跳转页面到账户列表
                            this.$router.push("/home/accountlist")
                        }
                    }else {
                        return false;
                    }
                })
            },
            resetFrom(){
                //直接调用组件封装
                this.$refs.accountAddFrom.resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
.account-add{
    .item{
        width: 40%;
        .userGroup{
            width: 100%;
        }
    }
}
</style>