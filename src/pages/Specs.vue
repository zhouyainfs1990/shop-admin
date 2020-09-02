<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">规格列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="router-container">
			<el-button
				type="primary"
				@click="handleAdd"
			>添加</el-button>
			<!-- 规格列表 -->
			<el-table
				:data="specsData"
				border
				style="width: 100%"
			>
				<el-table-column
					label="属性名称"
					width="180"
                    prop = "specsname"
				>
					<!-- <template slot-scope="scope">
						{{ scope.row.specsname }}
					</template> -->
				</el-table-column>
                <!-- 属性栏 -->
				<el-table-column
					label="属性值"
					width="180"
				>
					<template slot-scope="scope">
                        <!-- 生成多个属性标签 -->
						<el-tag
							v-for="(item,index) in scope.row.attrs"
							:key="index"
						>{{ item }}</el-tag>
					</template>
				</el-table-column>
                <!-- 状态 -->
				<el-table-column
					label="状态"
					width="100"
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
                <!-- 操作 -->
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
		</div>
		<!-- 规格添加/修改 -->
		<el-dialog
			:title="'规格'+tip"
			:visible.sync="infoVisible"
		>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <!-- 属性名称 -->
                <el-form-item label="属性名称" prop="specsname">
                    <el-input v-model="form.specsname"></el-input>
                </el-form-item>
                <!-- 属性值 -->
                <el-form-item label="属性值" prop="attrs">
                    <!-- v-model 不能绑定 v-for 的item,把数据变为数组成员的对象的属性-->
                    <div class="attr-box" v-for="(item,index) in form.attrs" :key="index" >
                      <el-input type="text" v-model="item.value" ></el-input>
                      <!-- 根据index 来决定 显示哪个按钮 -->
                      <el-button dark type="primary" v-if="index===0" @click='handleAddAttr'>添加属性</el-button>
                      <el-button dark type="danger" v-if="index>0" @click='handleRemoveAttr(index)'>删除</el-button>
                    </div>
                </el-form-item>
                 <el-form-item label="状态">
                    <el-switch v-model="form.status"></el-switch>
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
export default {
	data() {
		return {
            // 表格数据
            specsData: [],
            // 每一页数据
            pagesize: 10,
            // 第一页
            page: 1,
            // 
            pagecount: 0,
            // 对话框标题文字
            tip: '添加',
            // 表单对话框课件
            infoVisible: false,
            // 表单数据
            form: {
                // 规格名称
                specsname: '',
                // 属性
                attrs:[{
                    value:""
                }],
                // 状态
                status: true
            },
            // 验证规则
            rules: {
                specsname: [
                    { required: true, message: '请输入规格标题', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ]
            }
		}
    },
    // 获取初始表格数据源
    mounted() {
        this.getCount();
        this.getPage();
	},
	methods: {
        // 规格的数量
        getCount(){
            this.$http.get("/api/specscount").then(res=>{
                this.pagecount = res.list ? res.list[0].total : 0;
            })
        },
        // 根据页数获取 当前页数的数据
        getPage(){
            this.$http.get('/api/specslist',{params:{size:this.pagesize,page:this.page}}).then(res => {
                console.log(res);
                this.specsData = res.list || [];
            })
        },
        // 添加按钮
		handleAdd() {
            // 对话框课件
            this.infoVisible = true;
        },
        // 修改
		handleEdit(row) {
            this.tip = '修改';
            this.infoVisible = true;
			let id = row.id;
			this.$http.get('/api/specsinfo', {params:{
                id
            }}).then( res => {
                console.log(res)
                //数据的转化，将 数字字符串成员转化为 对象成员
                let attrs = res.list[0].attrs.map(item=>{
                    return {
                        value:item
                    }
                })
                // console.log(attrs)
                this.form.attrs = attrs;
                // 利用id 来做提交
                this.form.id = res.list[0].id
                this.form.specsname = res.list[0].specsname
				this.form.status = res.list[0].status===1?true:false;
			})
        },
        // 提交
        handleSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false;
                }
                this.form.status = this.form.status ? 1 : 2;

                let attrs = this.form.attrs.map(item=>item.value);
                this.form.attrs = attrs.join(",");

                let url = this.form.id ? '/api/specsedit' : '/api/specsadd';
                this.$http.post(url,this.form).then(res=>{
                    if(res.code == 200){
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        this.infoVisible = false;
                        this.getPage();
                    }else{
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
            });
        },
        // 取消按钮
        handleReset() {
			this.infoVisible = false;
			this.tip = '添加';
			this.form = {
				specsname: '',
                attrs:[{value:''}],
                status: true
			}
        },
        // 删除按钮
		handleDelete(row) {
            this.$confirm('此操作将永久删除规格, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                // 点击确定之后的操作
				this.$http.post('/api/specsdelete', { id: row.id }).then(res => {
					if (res.code === 200) {
						this.$message({
							type: 'success',
							message: res.msg
                        });
                        console.log(res.list)
                        // let list = res.list.map(item=>{
                        //     item.attrs = item.attrs.split(",");
                        //     return item;
                        // })
                        // this.specsData = list;
                        this.getPage();
					} else {
						this.$message({
							type: 'error',
							message: res.msg
						});
					}
				})
			})
        },
        // 属性删除
        handleRemoveAttr(index){
            this.form.attrs.splice(index, 1)
        },
        // 添加属性
        handleAddAttr() {
            this.form.attrs.unshift({value: ''});
        }
	}
}
</script>

<style >
/* 修改组件样式不能设置为作用域样式，避免影响其它组件中使用该组件间受到影响，用自己设置的容器包裹它 */
    /* .attr-box .el-input{
        width:200px;
    } */
</style>