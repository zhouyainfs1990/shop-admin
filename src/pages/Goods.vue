<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">商品列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="router-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 商品列表 -->
			<el-table
				:data="goodsData"
				border
				style="width: 100%"
			>
				<el-table-column
					label="一级分类"
					width="100"
                    prop = "firstcatename"
				>
					<!-- <template slot-scope="scope">
						{{ scope.row.firstcatename }}
					</template> -->
				</el-table-column>
                <el-table-column
					label="二级分类"
					width="100"
				>
					<template slot-scope="scope">
						{{ scope.row.secondcatename }}
					</template>
				</el-table-column>
				<el-table-column
					label="商品名称"
					width="180"
				>
					<template slot-scope="scope">
						{{ scope.row.goodsname }}
					</template>
				</el-table-column>
				<el-table-column
					label="销售价"
					width="100"
				>
					<template slot-scope="scope">
						{{ scope.row.price }}
					</template>
				</el-table-column>
				<el-table-column
					label="市场价"
					width="100"
				>
					<template slot-scope="scope">
						{{ scope.row.market_price }}
					</template>
				</el-table-column>
				<el-table-column
					label="状态"
					width="80"
				>
					<template slot-scope="scope">
						<el-tag
							effect="dark"
							type="success"
							v-if="scope.row.status===1"
						>启用</el-tag>
						<el-tag
							effect="dark"
							type="danger"
							v-else
						>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							size="mini"
							@click="handleEdit(scope.row)"
						>编辑</el-button>
						<el-button
							size="mini"
							type="danger"
							@click="handleDelete(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
            <el-pagination
				background
				layout="prev, pager, next"
				:page-size="pagesize"
				:total="pagecount"
                @current-change="handleCurrentChange"
			>
			</el-pagination>
		</div>
		<!-- 商品添加/修改
            open:打开对话框触发
            close: 关闭对话框触发
         -->
		<el-dialog
			:title="'商品'+tip"
			:visible.sync="infoVisible"
			@close="handleReset"
            @opened="handleOpen"
		>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
                <el-form-item label="一级分类" prop="first_cateid">
                    <el-select 
                        v-model="form.first_cateid" 
                        placeholder="请选择分类"
                        @change="handleCateChange"
                    >
                        <el-option
                            v-for="item in firstarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" prop="second_cateid">
                    <el-select v-model="form.second_cateid" placeholder="请选择分类">
                        <el-option
                            v-for="item in secondarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsname">
                    <el-input v-model="form.goodsname" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-change="handleChangeFile"
                        :file-list="fileList"
                        :multiple="false"
                        :auto-upload="false"
                        ref="prodimg"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url" alt=""
                            >
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                >
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="商品规格名">
                    <!-- handleSpecsChange:规格切换的回调函数
                        通过选择规格,获取规格值
                     -->
                    <el-select v-model="form.specsid" @change="handleSpecsChange" filterable placeholder="请选择商品规格名">
                        <el-option
                            v-for="item in specsarr"
                            :key="item.id"
                            :label="item.specsname"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品规格值">
                    <!-- multiple:可选复数个 -->
                    <el-select v-model="form.specsattr" :multiple="true" placeholder="请选择商品规格值">
                        <el-option
                            v-for="item in specsattrs"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售价">
                    <el-input v-model="form.price" type="number" :disabled="!form.status"></el-input>
                </el-form-item>
                <el-form-item label="市场价">
                    <el-input v-model="form.market_price" type="number" :disabled="!form.status"></el-input>
                </el-form-item>
                <el-form-item label="是否新品">
                    <template>
                        <el-radio v-model="form.isnew" :label="true">是</el-radio>
                        <el-radio v-model="form.isnew" :label="false">否</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="是否热卖">
                    <template>
                        <el-radio v-model="form.ishot" :label="true">是</el-radio>
                        <el-radio v-model="form.ishot" :label="false">否</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="商品描述">
                    <!-- 富文本编译器的容器 -->
                    <div id="editor" ref="editorElem" style="text-align:left"></div>
                </el-form-item>
                <el-form-item label="状态">
                    <template>
                        <el-radio v-model="form.status" :label="true">上架</el-radio>
                        <el-radio v-model="form.status" :label="false">下架</el-radio>
                    </template>
                </el-form-item>
            </el-form>
            <div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="handleReset('form')">取 消</el-button>
				<el-button
					type="primary"
					@click="handleSubmit('form')"
				>确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import E from 'wangeditor'
export default {
	data() {
		return {
            // 商品数据
            goodsData: [],
            pagesize:2,
            page:1,
            pagecount:0,
            // 显示对话框
			infoVisible: false,
            tip: '添加',
            // 富文本编译器实例
            editor: null,
			form: {
				first_cateid: '',
                second_cateid: '',
                goodsname: '',
                img: '',
                price: '',
                market_price: '',
                description:'',
                specsid: '',
                specsattr:'',
                isnew:false,
                ishot:false,
                status: true
            },
            //一级分类列表
            firstarr: [],
            // 二级分类列表
            secondarr:[],
            // 属性类表
            specsarr: [],
            // 属性值列表
            specsattrs: [],
            // 验证规则
			rules: {
				cateid: [
					{ required: true, message: '请选择商品分类', trigger: 'blur' }
				],
				title: [
					{ required: true, message: '请输入商品标题', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
				]
            },
            // 放大显示图片
			dialogImageUrl: '',
			dialogVisible: false,
            disabled: false,
            // 照片墙列表
			fileList: []
		}
    },
    mounted() {
        this.getCount();
        this.getPage();
    },
	methods: {
        //商品数量
		getCount() {
			this.$http.get("/api/goodscount").then(res => {
				this.pagecount = res.list[0].total;
			})
        },
        //当前页数的商品
		getPage() {
			this.$http.get('/api/goodslist', {params:{ size: this.pagesize, page: this.page }}).then(res => {
				this.goodsData = res.list || [];
			})
        },
        // 获取分类
        getCategory(pid=0){
            this.$http.get('/api/catelist',{params: { pid:pid }}).then(res => {
                // pid 为0，获取一级分类
                if(pid === 0){
                    this.firstarr = res.list;
                }else{
                    // 获取二级分类
                    this.secondarr = res.list;
                }
			})
        },
        //获取属性值
        getSpecs(){
            // 属性列表,如果 this.form.specsid 为空字符串,
            // 通过添加来获取属性值,由于没有属性名,获取的属性值列表为空


            // 通过添加打开,this.form.specsid 设为当前的商品 属性值
            // 获取属性值
            this.$http.get('/api/specslist').then(res=>{
                // console.log(res,this.form.specsid)
                // 获取规格
                this.specsarr = res.list;
                this.specsarr.map(item=>{
                    if(item.id === this.form.specsid){
                        // 规格属性
                        this.specsattrs = item.attrs;
                    }
                });
                // 
                // console.log(this.specsattrs)
            });
        },
        // 切换分类,传入一级分类的id ,一级的id就是二级的pid
        handleCateChange(pid){
            console.log(pid)
            this.secondarr = [];
            this.getCategory(pid)
        },
        // 添加按钮
		handleAdd() {
            // 获取一级分类
            this.getCategory();
            // 获取商品规格
            this.getSpecs();
			$(".el-upload-list--picture-card").html("")
            this.infoVisible = true;
        },
        // 编辑按钮
		handleEdit(row) {
            this.infoVisible = true;
			let id = row.id;
            this.tip = '修改'
			this.$http.get('/api/goodsinfo', {params:{ id }}).then(res => {
                let info = res.list;
                this.getCategory();
                if(info.first_cateid){
                    this.getCategory(info.first_cateid);
                }
                // 向其中添加 id,来决定新增还是 修改
                info.id = id;
                // 新品
                info.isnew = info.isnew == 1 ? true : false;
                // 热卖
                info.ishot = info.ishot == 1 ? true : false;
                // 状态
                info.status = info.status == 1 ? true : false;
                console.log(info)
                this.form = info;
                // 重新获取属性值
                this.getSpecs();
                // 字符串变数组
                this.form.specsattr = info.specsattr.split(',')
				if (info.img) {
					this.fileList = [{ name: '', url: this.imgdomain + info.img }]
                }
			})
        },
        // 提交
		handleSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
                }
				this.form.isnew = this.form.isnew ? 1 : 2;
				this.form.ishot = this.form.ishot ? 1 : 2;
                this.form.status = this.form.status ? 1 : 2;
                // 规格值重新 数组变字符串
                this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(",") : ""
                let url = this.form.id ? '/api/goodsedit' : '/api/goodsadd';
				var data = new FormData();
				for (let i in this.form) {
					data.append(i, this.form[i]);
				}
				axios({
					method: 'post',
					url,
					data,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': sessionStorage.getItem('token')
					}
				}).then(res => {
                    // console.log(res)
					if (res.code == 200) {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'success'
						});
						this.infoVisible = false;
                        this.getPage();
                        this.getCount();
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: 'error'
						});
					}
				})
			});
        },
        // 重置
		handleReset() {
           console.log("close")
			this.infoVisible = false;
			this.tip = '添加';
			this.form = {
                first_cateid: '',
                second_cateid: '',
                goodsname: '',
                img: '',
                price: '',
                market_price: '',
                description:'',
                specsid: '',
                specsattr:'',
                isnew:false,
                ishot:false,
                status: true
			};
            $(".el-upload-list--picture-card").html("");
            
        },
        // 打开对话框， 富文本编辑
        handleOpen(){
            // console.log("open")
            // 清空富文本编辑内内容
            $('#editor').empty();
            // 1.创建实例，传入容器的名称作为参数，指定容器
            this.editor = new E('#editor');
            // 2.绑定用户的输入操作事件：  html 用户输入的内容
            this.editor.customConfig.onchange = (html) => {
                // console.log(html)
                // 将用户输入的内容和 表单描述绑定
                this.form.description = html;
            };
            //3. 创建富文本编辑器
            this.editor.create();
            
            // 富文本编辑框预设文字
            this.editor.txt.html(this.form.description);
        },
        // 删除
		handleDelete(row) {
			this.$http.post('/api/goodsdelete', { id: row.id }).then(res => {
				if (res.code != 200) {
					this.$message({
						showClose: true,
						message: res.msg,
						type: 'error'
					});
				} else {
                    this.categorys = res.list
                    this.getCount();
                    this.getPage();
				}
			})
        },
        // 图片删除
		handleRemove() {
			$(".el-upload-list--picture-card").html("")
        },
        // 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
        },
        // 图片切换
		handleChangeFile(file) {
			this.form.img = file.raw
        },
        // 页面切换
		handleCurrentChange: function (currentPage) {
			this.page = currentPage;
            this.getPage();
            
        },
        // 属性切换
        handleSpecsChange(){

            var nowselect = this.specsarr.find((d,i)=>{
                return d.id === this.form.specsid
            });
            // 获取属性值
            console.log(nowselect,this.specsarr)
            this.specsattrs = nowselect.attrs;
        }
	}
}
</script>

<style>
</style>