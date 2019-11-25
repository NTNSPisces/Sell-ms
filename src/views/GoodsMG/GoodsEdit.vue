<template>
    <div class="goods-add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>编辑商品</span>
            </div>
            <div class="text item">
                <el-form :disabled="isSave" :model="goodsAddForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品名称" prop="name">
                        <el-input  v-model="goodsAddForm.goodsname"></el-input>
                    </el-form-item>

                    <el-form-item label="商品分类">
                        <el-select  v-model=" goodsAddForm.goodscategory" placeholder="请选择商品分类">
                            <el-option label="蛋糕" value="蛋糕"></el-option>
                            <el-option label="咖啡" value="咖啡"></el-option>
                            <el-option label="火锅" value="火锅"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品特色" prop="type">
                        <el-checkbox-group  v-model="goodsAddForm.goodsfeature">
                            <el-checkbox label="美食/餐厅线上活动"></el-checkbox>
                            <el-checkbox label="地推活动"></el-checkbox>
                            <el-checkbox label="线下主题活动"></el-checkbox>
                            <el-checkbox label="单纯品牌曝光"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="商品图片" prop="type">
                        <el-upload

                                class="avatar-uploader"
                                action="http://127.0.0.1:5000/goods/upload"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                        >
                            <!--如果图片路径没有就显示i，有就显示图片-->
                            <img v-if="goodsAddForm.imgUrl" :src="serveUrl+goodsAddForm.imgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="是否促销" prop="resource">
                        <el-radio-group  v-model="goodsAddForm.isPromotion">
                            <el-radio label="促销"></el-radio>
                            <el-radio label="不促销"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="食品规格" prop="resource">
                        <el-radio-group  v-model="goodsAddForm.standard">
                            <el-radio label="单规格"></el-radio>
                            <el-radio label="多规格"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--多规格区域-->
                    <div class="Specifications" v-show="!flage">
                        <div class="sp-btn">
                            <el-button type="primary" @click="addSpecifications">添加规格</el-button>
                        </div>
                        <div class="sp-table">
                            <el-table
                                    :data="goodsAddForm.spTableData"
                                    stripe
                                    style="width: 100%">
                                <el-table-column
                                        prop="standard"
                                        label="规格"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="packagePrice"
                                        label="包装费"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="price"
                                        label="价格">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                                @click="delTable(scope.$index)"
                                                size="mini"
                                                type="danger"
                                        >删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                    <el-form-item v-show="flage" label="包装费" style="margin-top: 20px" prop="resource">
                        <el-input-number v-model="goodsAddForm.packagePrice" :min="1" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>

                    <el-form-item   v-show="flage" label="价格" prop="resource">
                        <el-input-number v-model="goodsAddForm.price" :min="20"  label="描述文字"></el-input-number>
                    </el-form-item>

                    <el-form-item style="margin-top: 20px"  label="商品描述">
                        <el-input  v-model="goodsAddForm.goodsdesc" type="textarea"></el-input>
                    </el-form-item>

                </el-form>
                <!--按钮-->
                <el-button :type="isSave?'primary':'danger'" @click="edit">{{ text }}</el-button>
                <el-button @click="save">保存</el-button>

                <!--添加规格模态框-->
                <el-dialog width="350px" title="添加规格" :visible.sync="dialogFormVisible">
                    <el-form :model="spData">
                        <el-form-item label="规格">
                            <el-select style="width: 250px" v-model="spData.standard" placeholder="请选择规格">
                                <el-option label="默认" value="默认"></el-option>
                                <el-option label="小" value="小"></el-option>
                                <el-option label="中" value="中"></el-option>
                                <el-option label="大" value="大"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="价格">
                            <el-input style="width: 250px" :min="0" :max="10" v-model="spData.price"
                                      autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="包装费">
                            <el-input style="width: 235px" v-model="spData.packagePrice" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureAddSpecification">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>
<script>
    //引入保存请求函数
    import {goodsedit} from "../../api/goods"
    import local from "../../utils/local";


    export default {
        data() {
            return {
                //服务器地址
                serveUrl: "http://127.0.0.1:5000/upload/goods/",
                //商品表单
                goodsAddForm: {
                    goodsname: "",
                    goodscategory: "",
                    imgUrl: "",
                    goodsfeature: [],
                    isPromotion: "",
                    standard: "",
                    packagePrice: "",
                    price: "",
                    goodsdesc: "",
                    // 表单数据
                    spTableData: [{
                        standard:"默认",
                        packagePrice:"2",
                        price:"10"
                    }],
                },
                //模态框数据
                spData: {
                    standard: "",
                    packagePrice: "",
                    price: ""
                },
                dialogFormVisible: false,
                isSave:true,
                id:""
            }
        },
        methods: {
            //添加规格
            addSpecifications() {
                this.dialogFormVisible = !this.dialogFormVisible
            },
            //模态框的确定按钮
            sureAddSpecification() {
                //关闭模态框
                this.dialogFormVisible = false;
                //将数据添加到表单里
                this.goodsAddForm.spTableData.unshift(this.spData);
                //数据会关联，然后清除
                this.spData = {
                    standard: "",
                    packagePrice: "",
                    price: ""
                }
            },
            //规模表格的删除
            delTable(index) {
                //根据当前索引值删除，因为这就是纯前端的交互，可以用索引值
                this.goodsAddForm.spTableData.splice(index, 1)
            },
            //图片上传成功的钩子函数
            handleAvatarSuccess(res, file) {
                let {code, imgUrl} = res;
                if (code === 0) {
                    this.goodsAddForm.imgUrl = imgUrl;
                }
            },
            //图片上传前的钩子函数
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
            //发送请求获取商品信息--挨个解构，免得错误
            async getgoodedit(){
                //获取本地单条信息的数据
                let res=JSON.parse(window.sessionStorage.getItem("editgoodmsg"));
                this.id=res.id;//把ID存起，下面保存修改需要带id参数
                this.goodsAddForm.goodsname=res.goodsname;
                this.goodsAddForm.goodscategory=res.goodscategory;
                this.goodsAddForm.goodsfeature=JSON.parse(res.goodsfeature);
                this.goodsAddForm.imgUrl=res.imgUrl;
                this.goodsAddForm.isPromotion=res.isPromotion;
                this.goodsAddForm.goodsdesc=res.goodsdesc;
                //先把规格转成对象
                res.standard=JSON.parse(res.standard);
                //对规则进行判断，显示单双
                if(res.standard[0].standard==="单规格"){
                    this.goodsAddForm.standard="单规格";
                    this.goodsAddForm.packagePrice=res.standard[0].packagePrice;
                    this.goodsAddForm.price=res.standard[0].price
                }else {
                    this.goodsAddForm.standard="多规格";
                    this.goodsAddForm.spTableData=res.standard
                }
            },
            //点击修改按钮接触禁用
            edit(){
                this.isSave=!this.isSave;
            },
            //点击保存按钮发送请求且禁用按钮
            async save(){
                let{goodsname,goodsfeature,goodscategory,imgUrl,isPromotion,goodsdesc,standard,packagePrice,price,spTableData}=this.goodsAddForm;
                let msg={
                    id:this.id,
                    goodsname,
                    goodscategory,
                    goodsfeature:JSON.stringify(goodsfeature),
                    imgUrl,
                    isPromotion,
                    goodsdesc,
                    standard:standard==="单规格"
                        ? JSON.stringify([{standard, packagePrice, price}])
                        : JSON.stringify(spTableData)
                }
                let{code}=await goodsedit(msg)
                if(code===0){
                    this.$router.push("/home/goodslist")
                }
            }
        },
        created(){
            //回填数据
            this.getgoodedit()
        },
        computed:{
            flage(){
                return this.goodsAddForm.standard==="单规格"?true:false
            },
            //点击切换修改和取消文字
            text(){
                return this.isSave?"修改":"取消"
            }
        }
    }
</script>

<style lang="less" scoped>
    .goods-add {
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9 !important;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader-icon:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            border: 1px dotted #ccc;
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
        .Specifications {
            width: 600px;
            display: flex;
            flex-direction: column;
            .sp-btn {
                flex: 0 0 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .sp-table {
                flex: 1;
            }
        }
    }
</style>