<template>

<!-- 我写了详细注释不舍得山 -->
    <div>
          <!-- 面包屑导航区 -->
          <!-- 很多重复代码可以用插槽或者公共组件 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                 <el-col>
                   <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
              <!-- 展开列 -->
                 <el-table-column type="expand">
                     <template slot-scope="scope">
                             <!-- 权限下数据的渲染 {{scope.row}}-->
                             <!-- 利用三层for循环 -->   
                             <el-row  :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                                  <!-- 渲染一级权限 -->
                                 <el-col :span="5">
                                     <el-tag  closable @close="removeRightById(scope.row,item1.id)" >{{item1.authName}}</el-tag>   
                                     <i class="el-icon-caret-right"></i>       
                              </el-col>
                                  <!-- 渲染二级权限和渲染三级权限 -->
                                 <el-col :span="19">
                                     <!-- 通过 for 循环  -->
                                     <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                         <el-col :span="6">
                                             <el-tag type="success"  closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                               <i class="el-icon-caret-right"></i>       
                                         </el-col>
                                         <el-col :span="18">
                                             <el-tag type="warning" v-for="(item3,id) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                                 {{item3.authName}}
                                             </el-tag>
                                         </el-col>
                                     </el-row>
                                 </el-col>
                             </el-row>                               
                     </template>
                 </el-table-column>
                  <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                      <template slot-scope="scope">
                          <el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>  
                          <el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>  
                          <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>  
                      </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!-- 树形控件 -->
   <el-tree :data="rightsList" :props="treeProps" show-checkbox   node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
   <span slot="footer" class="dialog-footer">
     <el-button @click="setRightDialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
   </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 所有角色列表数据
            rolelist:[],
            // 控制分配权限的对话框的显示与隐藏
            setRightDialogVisible:false,
            // 如果没有失败的话就将数据保存到data中共页面使用
            // 所有权限的数据 默认为空
            rightsList:[],
            // 树形控件的属性绑定对象
             treeProps:{
                 label:"authName",
                 children:"children"
             },
            //  默认选中的节点Id值数组
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:""
        }
    },
    created(){
        this.getRolesList() 
    },
    methods:{
    // 获取所有角色的列表    
     async getRolesList(){
    const {data:res} = await this.$http.get("roles")
     if(res.meta.status!==200){
         return this.$message.error("获取角色列表失败")
     }
     this.rolelist =res.data
     console.log(this.rolelist)
      } ,
       // 根据id删除对应的权限
     async  removeRightById(role,rightId){
    //   弹框提示用户是否要删除
    const confirmResult =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm'){
        return this.$message.info('取消删除')
       }
    //    console.log('确认了删除')
    const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

     if(res.meta.status !== 200) {
         return this.$message.error("删除权限失败")
       }

       
        //不建议去调这个函数因为会发生页面的完整渲染
        // this.getRolesList()
        // 为当前这个角色信息重新赋值一下权限
        // 把服务器返回的最新的权限直接赋值给当前角色的跳转属性这样可以防止怎个列表的刷新 从而提升用户的体验
        // 通俗的说就是删除后页面不会合上

        role.children=res.data
     }  ,
    //  事件处理函数
   //展示分配权限到的对话框
   async  showSetRightDialog(role){
       this.roleId=role.id
    //    tree是树形结构显示
   const {data:res} =   await  this.$http.get ("rights/tree")
   if(res.meta.status !==200){
       return this.$message.error('获取权限失败')
   }
    //    什么时候为他赋值呢 数据获取成功之后
    // 获取到的权限数据保存到data中
     this.rightsList =res.data
     console.log(this.rightsList)

    //  重置为true之前 递归获取三级节点的id
       this.getLeafKeys(role,this.defkeys)
       
       this.setRightDialogVisible=true
     },
 
//   通过递归的形式，获取角色下所有三级权限的id，并保存到数组中defKeys数组中
  getLeafKeys(node,arr){
//   如果当前 node 节点不包含children 属性，则是三级节点
    if(!node.children){
    return arr.push(node.id)
    }
    // 每循环一项拿到一个子节点item，根据item这个item再次调用递归函数
    // 把当前的item当成一个节点给他传进去，arr也传进去
    // 递归完成之后肯定把所有三个节点id都保存到arr中 
    node.children.forEach(
    item => this.getLeafKeys(item,arr))
   },
//   监听分配权限对话框的关闭事件
setRightDialogClosed(){
       // 重新赋值就好了
    this.defKeys=[]
},
//点击为角色分配权限
 async  allotRights(){
// 要拿到所有的key，拿到所有半选和全选的id
   const keys=[
    // 一下把二个数组合成了一个新数组
    ...this.$refs.treeRef.getCheckedKeys(),
    ...this.$refs.treeRef.getHalfCheckedKeys()
]
const idStr = keys.join(",")
const {data:res} =await this.$http.post(
    `roles/${this.roleId}/rights`,
    {rids:idStr}
)
if(res.meta.status !== 200){
    return this.$message.error('分配权限失败')
}
this.$message.success('分配权成功')
this.getRolesList()
this.setRightDialogVisible=false
// console.log(keys)
}
  }  
 }
</script>

<style lang="less" scoped>
    .el-tag{
        margin:7px;
    }
    .bdtop{
     border-top:1px solid #eee;
    }
    .bdbottom{
     border-bottom:1px solid #eee;
    }
    
    .vcenter{
        display: flex;
        align-items: center;
    }

</style>