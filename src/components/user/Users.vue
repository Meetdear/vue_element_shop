<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
          
         <el-row :gutter="20">
             <el-col :span="8">
                   <!-- 搜索与添加区域 -->
               <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
               </el-input>
             </el-col>
             <el-col :span="4">
                 <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
             </el-col>
         </el-row>

         <!-- 用户列表区域 -->
         <el-table :data="userlist" border stripe>
             <el-table-column type="index"> </el-table-column>
             <el-table-column label="姓名" prop="username"> </el-table-column>
             <el-table-column label="邮箱" prop="email"> </el-table-column>
             <el-table-column label="电话" prop="mobile"> </el-table-column>
             <el-table-column label="角色" prop="role_name"> </el-table-column>
             <el-table-column label="状态" prop="mg_state" >
                 <!-- 通过作用域插槽接收了这个scope.row这个属性 -->
              <template slot-scope="scope">
                  <!-- 数据渲染完了这个作用域插槽不要了 -->
                  <!-- {{scope.row}} -->
                  <el-switch
               v-model="scope.row.mg_state" 
               @change="userStateChanged(scope.row.id)">
              </el-switch>

                 </template>
             </el-table-column>
             <el-table-column label="操作" width="180px">
                 <!--slot-scope="scope"=> 接受一下作用域插槽的数据scope -->
                  <template slot-scope="scope">
                      <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                      <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                          <!-- 分配角色按钮 -->
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="
                            false">
                             <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                           </el-tooltip>
                           
                  </template>
            </el-table-column>
         </el-table>
        <!-- 分页区域 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size=" queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        </el-card> 

  <!--添加用用户对话框  -->
    <el-dialog
     title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
    >
    <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" 
    ref="addFormRef" 
    label-width="70px">
    <el-form-item label="用户名"
     prop="username">
      <el-input
        v-model="addForm.username">
       </el-input>
    </el-form-item>
    <el-form-item label="密码"
     prop="password">
      <el-input
        v-model="addForm.password">
       </el-input>
    </el-form-item>
    <el-form-item label="邮箱"
     prop="email">
      <el-input
        v-model="addForm.email">
       </el-input>
    </el-form-item>
    <el-form-item label="手机"
     prop="mobile">
      <el-input
        v-model="addForm.mobile">
       </el-input>
    </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
     <el-dialog
  title="修改用户信息"
  :visible.sync="editDialogVisible"
  width="50%">
  <!--  -->
<el-form :model="editForm" :rules=" editFormRules" ref="editFormRef" label-width="70px" @slose="editDialogClosed">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>   
    </div> 
</template>

<script>
export default {
    data(){
        // 验证邮箱规则
        var checkEmail = (rule,value,cb)=>{
          // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    //   验证是否合法
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
          }
        cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号规则
        var checkMobile  = (rule,value,cb)=>{
              // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
     }
        return {
            // 获取用户列表的参数对象
            queryInfo:{
                //搜索关键子
                query:'',
                // 当前的页数
                pagenum:1,
                // 当前每页显示多少条数据
                pagesize:2
            },
            //  layout="total, sizes, prev, pager, next, jumper"用来显示页面上共有几条不同类型数据  

            userlist:[],
            // 总共有多少条数据
            total:0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible:false,
            // 添加用户的表单数据
            addForm:{
                username:"",
                 password:"",
                email:"",
                mobile:""
            },
            //添加表单的验证规则对象
            addFormRules:{
                username:[
                    // 必填项
                   {required:true,message:"请输入用户名",trigger:"blur"},
                  // 验证规则
                   {min:3,max:10,message:"用户名的长度在3~10个字符之间",trigger:"blur"} 
                ],
                password: [ // 必填项
                 { required:true,
                   message:"请输入密码",trigger:"blur"},
                  // 验证规则
                   { 
                       min:6,
                       max:15,
                       message:"用户名的长度在6~15个字符之间",trigger:"blur"} 
              ],
              email:[
                    { required:true,
                   message:"请输入邮箱",trigger:"blur"},
                   {validator:checkEmail,trigger:"blur"} 
              ],
              mobile:[
                     { required:true,
                   message:"请输入手机号码",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"}  
              ]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            // 查询到的用户信息对象
            editForm:{},
            // 修改表单的验证规则对象
            editFormRules:{
              email:[
                 {required:true,message:"请输入用户名",trigger:"blur"},
                  {validator:checkEmail,trigger:"blur"} 
              ],
                mobile:[
                     { required:true,
                   message:"请输入手机号码",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"}  
              ]
            }
        }
        
    },
    // 从页面创建期间就会调用这个函数 this.getUserList()从而发起一次ajax数据请求
    created(){
        this.getUserList()
    },
    methods:{
       async getUserList(){
        //用了await 就会得到一个数据对象 紧接着可以载这个数据对象上解构复制出一个data属性中命名为res
         const {data:res} = await  this.$http.get('users',{//get请求会返回一个promise对象，为了简化promise操作我们用async和await优化这次异步操作
              params:this.queryInfo
            })
            if(res.meta.status !==200) {
             return this.$message.error('获取用户列表失败')
             
            }
            // 为data中userlist\total数据赋值
            this.userlist = res.data.users
            this.total=res.data.total
            console.log(res)

        },
        //监听pagesize改变的事件 也就是每页多少条数据
        handleSizeChange(newSize){
            console.log(newSize)
            // 把监听到的值保存到queryInfo.pagesize里面去
            // 根据最新的newsize从新发起数据请求
            this.queryInfo.pagesize = newSize
            //从而获得这一页得最新数据
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
               console.log(newPage)
            //   复制完毕之后呢
             this.queryInfo.pagenum = newPage
            //  也需要重新获取一下数据
              this.getUserList()
        },
        // 监听switch开关状态的改变
        async userStateChanged(userinfo){
          console.log(userinfo)
         const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
         if(res.meta.status!==200){
             userinfo.mg_state = !userinfo.mg_state
             return this.$message.error("更新用户状态失败")
         }
         this.$message.success('更新用户状态成功')
        },
        // 监听添加用户对话框的关闭(@close)事件
        addDialogClosed(){
        // 拿到表单的引用再调用resetFields
        this.$refs.addFormRef.resetFields()
      }  ,
    //  点击按钮添加新用户
      addUser(){
    //   添加表单的预校验
       this.$refs.addFormRef.validate( async valid =>{
         // console.log(valid)
          if(!valid) return
        //   可以发起添加用户的网络请求
         const {data:res} = await this.$http.post('users',this.addForm)
         if(res.meta.status  !==201){
             this.$message.error("添加用户失败")
         }
         this.$message.success("添加用户成功")
        //  隐藏添加的对话框
         this.addDialogVisible = false
        // 重新获取用户列表数据
         this.getUserList()
        })
      },
      // 展示编辑用户的对话框
     async  showEditDialog(id){
        //  console.log(id)
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !==200){
        return this.$message.error('查询用户信息失败')
      }
        this.editForm = res.data
        this.editDialogVisible= true
       },
      //  监听修改用户对话框的关闭事件
      // 修改表单的重置操作
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo(){
        // 进行表单的预验证
        this.$refs.editFormRef.validate( async valid=>{
            // console.log(valid)
            if(!valid) return
            // 发起修改用户信息的数据请求
            const {data:res} = await this.$http.put("users/"+this.editForm.id,{
              //包括提交修改后用户的信息
              email:this.editForm.email,
              mobile:this.editForm.mobile
          })
          // 判断这次请求是否成功
          if(res.meta.status !==200) {
            return this.$message.error('更新用户信息失败！')
          }

          // 关闭对话框
           this.editDialogVisible=false,
          // 刷新数据列表
          this.getUserList()
          // 提示修改成功
          this.$message.success("更新用户信息成功")
        })
      } ,
       // 根据Id删除对应的用户信息
   async removeUserById(id){
      // 询问用户是否删除数据
       const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        // }).catch(err =>{
        //   return err
        // })
        }).catch(err => err)
        //如果用户确认删除，则返回值为字符串 confirm
        //如果用户取消删除，则返回值为字符串 cancel
        // console.log(confirmResult) 
        if(confirmResult !=="confirm"){
          return this.$message.info("已取消删除")
        }
        // console.log('确认了删除')
        //删除用户信息
         const {data:res} = await  this.$http.delete('users/'+id)
         if(res.meta.status!==200){
           return this.$message.error("删除用户失败！")
         }

         this.$message.success("删除用户成功")
         this.getUserList()
      }
    }
 }
</script>

<style lang="less" scoped>
  
</style>