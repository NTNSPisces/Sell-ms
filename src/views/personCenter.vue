<template>
    <div class="person-center">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>个人中心</span>
            </div>
            <div>
                <span>用户名：
                    {{ personalmsg.account }}
                </span>
                <el-divider></el-divider>
                <span>创建时间：
                    {{ personalmsg.ctime | fiterTime}}
                </span>
                <el-divider></el-divider>
                <span>用户组：
                    {{ personalmsg.userGroup }}
                </span>
                <el-divider></el-divider>
                <span>用户头像：</span>
                <el-upload
                        style="margin-top: 10px;"
                        class="avatar-uploader"
                        action="http://127.0.0.1:5000/account/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="personalmsg.imgUrl" :src="serveApi+personalmsg.imgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <!--点击上传按钮，要实现图片上传且头部图像同时更改。需要使用到组件之间的通信
                    先再main.js建一个bus中介，然后用兄弟间的传值方式。
                -->
                <el-button type="success" style="margin-left: 45px;margin-top: 10px;" @click="uploadavatar">上传头像</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
    import {accountinfo,avataredit} from "../api/account"
    import moment from "moment"

    export default {
        data() {
            return {
                serveApi: "http://127.0.0.1:5000/upload/account/",
                personalmsg: {
                    account: "",
                    ctime: "",
                    imgUrl: "",
                    userGroup: ""
                }
            }
        },
        created() {
            this.getaccountinfo()
        },
        methods: {
            //获取个人信息
            async getaccountinfo() {
                let {accountInfo} = await accountinfo();
                //回填数据
                this.personalmsg = accountInfo;
            },
            //图片上传成功
            handleAvatarSuccess(res) {
                let {code, imgUrl} = res;
                //图片回传
                if (code === 0) {
                    this.personalmsg.imgUrl = imgUrl
                }
            },
            //图片上传前（固定写法）
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //点击按钮上传头像
            async uploadavatar(){

                let{code}=await avataredit({imgUrl:this.personalmsg.imgUrl})
                if(code===0){
                    //给弄一个组件发送自定义监听事件
                    this.$bus.$emit("updataavatar")
                }
            }
        },
        filters: {
            fiterTime(res) {
                return res = moment(res).format("YYYY-MM-DD hh:mm:ss")
            }
        }
    }
</script>
<style lang="less">
    .person-center {
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>