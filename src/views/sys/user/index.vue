<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户名称">
        <el-input v-model="formInline.name" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户组">
        <el-input v-model="formInline.code" placeholder="用户组" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="toAdd" icon="el-icon-circle-plus">新增</el-button>

      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="账户" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center"  :formatter="famtStatus">
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="170">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"   width="320"  align="left" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  v-if="scope.row.status" @click="disable(scope.row.id, scope.row.status)" round>禁用</el-button>
          <el-button type="primary" size="mini"  v-else-if="!scope.row.status" @click="able(scope.row.id, scope.row.status)" round>启用</el-button>
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>编辑</el-button>
          <el-button type="primary" size="mini" @click="toDetail(scope.row)" round>详情</el-button>
          <el-dropdown  @command="handleCommand">
            <el-button  type="primary" size="mini"   round>
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{userId:scope.row.id,type:'password'}">重置密码</el-dropdown-item>
              <el-dropdown-item :command="{userId:scope.row.id,type:'role'}">设置角色</el-dropdown-item>
              <el-dropdown-item :command="{userId:scope.row.id,type:'depart'}">设置用户部门</el-dropdown-item>
              <el-dropdown-item :command="{userId:scope.row.id,type:'group'}">设置用户组</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
      <el-dialog title="新增用户" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false"  center style="overflow: hidden">
        <div style="overflow-y: auto; height: 400px">
        <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
          <el-form-item label="登陆账户:"  prop ="accNo" >
            <el-input v-model="formDialog.accNo" width="150"  placeholder="登陆账户"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名:" prop ="username">
            <el-input v-model="formDialog.username" width="150"  placeholder="用户姓名"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop ="nickName">
            <el-input v-model="formDialog.nickName" width="150"  placeholder="用户昵称"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" prop ="password">
            <el-input v-model="formDialog.password" type="password" width="150" placeholder="用户密码"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户角色:" prop ="roleIds">
            <el-select v-model="formDialog.roleIds" placeholder="请选择"  style="width: 100%;" clearable >
              <el-option
                v-for="item in dicList.roleList"
                multiple="true"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户组:" prop ="departId">
            <el-select v-model="formDialog.groupId" placeholder="请选择"  style="width: 100%;" clearable >
              <el-option
                v-for="item in dicList.groupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门:" prop ="departId">
            <TreeSelect :option='dicList.departList' v-if="show" :value.sync = "formDialog.departId" ></TreeSelect>
          </el-form-item>
          <el-form-item label="性别:" prop ="sex">
            <el-radio v-model="formDialog.sex" :label="1">保密</el-radio>
            <el-radio v-model="formDialog.sex" :label="2">男</el-radio>
            <el-radio v-model="formDialog.sex" :label="3">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期:" prop ="birthDay">
            <el-date-picker
              v-model="formDialog.birthDay"
              format="yyyy-MM-dd"
              type="datetime"
              placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="电子邮箱:" prop ="email">
            <el-input v-model="formDialog.email"  width="150" placeholder="电子邮箱"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop ="mobile">
            <el-input v-model="formDialog.mobile"  width="150" placeholder="联系电话"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="工作职务:" prop ="job">
            <el-input v-model="formDialog.job"  width="150" placeholder="工作职务"   autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
      </el-dialog>
    <el-dialog title="用户详情" :visible.sync="dialogVisibleDetail" width="600px" :close-on-click-modal="false"  center style="overflow: hidden">
      <DescriptionList title="" col="12" :content="dialogDetail">
        <Description term="用户姓名">{{dialogDetail.username}}</Description>
        <Description term="登陆账户">{{dialogDetail.accNo}}</Description>
        <Description term="用户昵称">{{dialogDetail.nickName}}</Description>
        <Description term="用户组">{{dialogDetail.groupName}}</Description>
        <Description term="用户部门">{{dialogDetail.departName}}</Description>
        <Description term="用户邮件">{{dialogDetail.email}}</Description>
        <Description term="用户手机">{{dialogDetail.mobile}}</Description>
        <Description term="用户角色">{{dialogDetail.roleNames}}</Description>
      </DescriptionList>
    </el-dialog>
    <el-dialog title="密码修改" :visible.sync="dialogVisiblPassword" width="500px" :close-on-click-modal="false" >
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
      <el-form-item label="用户密码:" prop ="password">
          <el-input v-model="formPassword.password" width="150"  placeholder="用户密码"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblPassword = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="部门修改" :visible.sync="dialogVisiblDepart" width="500px" :close-on-click-modal="false"  >
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
        <el-form-item label="归属部门:" prop ="departCode">
          <TreeSelect :option='dicList.departList' v-if="show" :value.sync = "formDepart.departCode" ></TreeSelect>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clean('depart')">取 消</el-button>
        <el-button type="primary" @click="editDepart">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户组修改" :visible.sync="dialogVisiblGroup" width="500px" :close-on-click-modal="false" >
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
        <el-form-item label="用户密码:" prop ="password">
          <el-input v-model="formPassword.password" width="150"  placeholder="用户密码"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblGroup = false">取 消</el-button>
        <el-button type="primary" @click="editGroup">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户角色修改" :visible.sync="dialogVisiblRole" width="500px" :close-on-click-modal="false" >
      <el-form :model="formRole"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
        <el-form-item label="用户角色:" prop ="password">
          <el-select v-model="formRole.roleIds" placeholder="请选择"  style="width: 100%;" multiple clearable >
            <el-option
              v-for="item in dicList.roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblRole = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="dialogVisibleEdit" width="600px" :close-on-click-modal="false"  center style="overflow: hidden">
      <div style="overflow-y: auto; height: 400px">
        <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
          <el-form-item label="用户姓名:" prop ="username">
            <el-input v-model="formDialog.username" width="150"  placeholder="用户姓名"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop ="nickName">
            <el-input v-model="formDialog.nickName" width="150"  placeholder="用户昵称"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop ="sex">
            <el-radio-group v-model="formDialog.sex">
              <el-radio :label="1">保密</el-radio>
              <el-radio :label="2">男</el-radio>
              <el-radio :label="3">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期:" prop ="birthDay">
            <el-date-picker
              v-model="formDialog.birthDay"
              format="yyyy-MM-dd"
              type="datetime"
              placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="电子邮箱:" prop ="email">
            <el-input v-model="formDialog.email"  width="150" placeholder="电子邮箱"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop ="mobile">
            <el-input v-model="formDialog.mobile"  width="150" placeholder="联系电话"   autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="工作职务:" prop ="job">
            <el-input v-model="formDialog.job"  width="150" placeholder="工作职务"   autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="switchStatus"
        width="30%">
        <span>{{formSwitchStatusTitle}}?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="switchStatus = false">取 消</el-button>
          <el-button type="primary" @click="switchStatusM">确 定</el-button>
        </span>
      </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="hasDel"
      width="30%">
      <span>是否要删除?</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="hasDel = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </span>
    </el-dialog>
    <el-pagination style=""
                   background
                   :page-sizes="[1,10, 20, 30, 40, 50, 100]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-size="pageSize"
                   :current-page="pageNo">
    </el-pagination>
  </div>
</template>

<script>
  import {parsePageTime} from '@/utils/index'
  import TreeSelect from "@/components/TreeSelect"
  import DescriptionList from "@/components/descrip"
  import user from "../../../store/modules/user";



  export default {
    components: { TreeSelect, DescriptionList },
    data() {
      return {
        dicList:{
          departList: [],
          roleList: [],
          groupList:[]
        },
        dialogVisibleEdit: false,
        dialogVisiblPassword:false,
        dialogVisiblDepart:false,
        dialogVisiblGroup:false,
        dialogVisiblRole:false,
        dialogVisibleDetail: false,
        show:true,
        formTitle:"",
        formSwitchStatusTitle:"",
        hasDel: false,
        switchStatus: false,
        dialogVisible:false,
        list: [{
        }],
        pageSize:10,
        pageNo:1,
        total:0,
        listLoading: false,
        dialogDetail:{
          accNo: "",
          birthDay: "",
          createTime: "",
          createUser: "",
          departCode: "",
          departId: "",
          email: "",
          groupId: "",
          groupName: "",
          hasDel: "",
          id: "",
          job: "",
          mobile: "",
          nickName: "",
          password: "",
          roleIds: "",
          roleNames: "",
          sex: "",
          status: "",
          type: "",
          updateTime: "",
          updateUser: "",
          username: ""
        },
        formRole:{
          id:null,
          roleIds:"",
        },
        formGroup:{
          id:null,
          password:"",
        },
        formDepart:{
          id:null,
          departCode:"",
        },
        formPassword:{
          id:null,
          password:"",
        },
        formDialog:{
          id:null,
          accNo:"",
          nickName:"",
          username:"",
          password:"",
          email:"",
          mobile:"",
          sex:"1",
          job: "",
          birthDay:"",
          departId:"",
          groupId:"",
          roleIds:""
        },
        formInline: {
          code: '',
          name: ""
        },
        rules: {
          name: [
            {required: true, message: '请输入组名称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在3到64个字符', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入组编码', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在4到128个字符', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.fetchData();
      this.initData();
    },
    methods: {
      disable(id, status){
        this.switchStatus = true;
        this.formSwitchStatusTitle = "确定要禁用";
        this.formDialog.id = id;
        this.formDialog.status = status;
      },
      able(id, status){
        this.switchStatus = true;
        this.formSwitchStatusTitle = "确定要启用";
        this.formDialog.id = id;
        this.formDialog.status = status;
      },
      handleCommand(command){
        $http.http({
          type: "post",
          url: "upms_user_detail",
          data: {
            key: command.userId
          }
        }).then((data) => {
          if (data.body) {
            if(command.type === "password") {
              this.dialogVisiblPassword = true;
              this.formPassword.id = command.userId;
            }else if (command.type === "depart") {
              this.formDepart.departCode = data.body.departCode;
              this.formDepart.id=command.userId;
              this.show = true;
              this.dialogVisiblDepart= true;
             }else if (command.type === "group") {
              this.dialogVisiblGroup= true;
              this.formGroup.id=command.userId;
            }else if (command.type === "role") {
              this.dialogVisiblRole = true;
              this.formRole.id = command.userId;
              var roleArray = [];
              if (data.body.roleIds) {
                var splitArray = data.body.roleIds.split(",");
                for(var i = 0; i < splitArray.length; i++) {
                  roleArray.push(splitArray[i]);
                }
              }
              this.formRole.roleIds=roleArray;
             }
          }
        })

      },
      clean(type){
        this.show = false;
        if (type === 'depart') {
          this.dialogVisiblDepart = false;
        }
      },
      editRole() {
        var roleIds = "";
        for(var i = 0; i < this.formRole.roleIds.length; i++){
          if (roleIds) {
            roleIds += ",";
          }
          roleIds += this.formRole.roleIds[i];
        }
          $http.http({
          type: "post",
          url: "upms_user_role",
          data: {
            one: roleIds,
            two: this.formRole.id
          }
        }).then((data) => {
          if (data.body) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
          this.dialogVisiblRole = false;
          this.fetchData();
        }).catch(() => {
        });
      },
      editGroup() {
        $http.http({
          type: "post",
          url: "upms_user_password",
          data: {
            one: this.formPassword.password,
            two: this.formPassword.id
          }
        }).then((data) => {
          if (data.body) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
          this.dialogVisiblPassword = false;
          this.fetchData();
        }).catch(() => {
        });
      },
      editDepart() {
        $http.http({
          type: "post",
          url: "upms_user_depart",
          data: {
            one: this.formDepart.departCode,
            two: this.formDepart.id
          }
        }).then((data) => {
          if (data.body) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
          this.dialogVisiblDepart = false;
          this.fetchData();
        }).catch(() => {
        });
      },
      editPassword() {
        $http.http({
          type: "post",
          url: "upms_user_password",
          data: {
            one: this.formPassword.password,
            two: this.formPassword.id
          }
        }).then((data) => {
          if (data.body) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
          this.dialogVisiblPassword = false;
          this.fetchData();
        }).catch(() => {
        });
      },
      toDel(id) {
        this.formDialog.id = id;
        this.hasDel = true;
      },
      parsePageTimeEx(date) {
        return parsePageTime(date);
      },
      switchStatusM(){
        var url = "upms_user_able";
        if (this.formDialog.status) {
          url = "upms_user_disable";
        }
        $http.http({
          type: "post",
          url: url,
          data: {
            key:this.formDialog.id,
          }
        }).then((data) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.switchStatus = false;
            this.fetchData();
        }).catch(() => {
        });
      },
      del() {
        $http.http({
          type: "post",
          url: "upms_group_del",
          data: {
            ids:this.formDialog.id,
          }
        }).then((data) => {
          this.resetForm('ruleForm');
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.hasDel = false;
          this.fetchData();
        }).catch(() => {
        });
      },
      submitData(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var url = "upms_user_add";
            if (this.formDialog.id) {
              url = "upms_user_udpate";
            }
            $http.http({
              type: "post",
              url: url,
              data: this.formDialog
            }).then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.fetchData();
              this.dialogVisible = false;
              this.dialogVisibleEdit = false;
              this.formTitle = "";
            }).catch(() => {
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.fetchData();
      },
      toDetail(data){
        this.resetForm('ruleForm');
        this.dialogDetail = {};
        this.dialogVisibleDetail = true;
        $http.http({
          type: "post",
          url: "upms_user_detail",
          data: {
            key: data.id
          }
        }).then((data) => {
          this.dialogDetail = data.body;
        }).catch(() => {
        });

      },
      toEdit(data){
        this.resetForm('ruleForm');
        this.dialogVisibleEdit = true;
        this.formDialog={
          id:data.id,
          nickName: data.nickName,
          username:data.username,
          email:data.email,
          mobile:data.mobile,
          sex: data.sex,
          job: data.job,
          birthDay:data.birthDay,
        };
      },
      toAdd(){
        this.resetForm('ruleForm');
        this.show = true;
        this.dialogVisible = true;
        this.formTitle = "新增用户";
      },
      famtStatus(row, column){
        let status = row.status;
        if (status) {
          return '启用';
        } else {
          return  '禁用';
        }
      },
      resetForm(formName) {
        this.formDialog={};
      },
      queryData() {
        this.pageNo = 0;
        this.fetchData();
      },
      initData() {
        //角色
        $http.http({
          type: "post",
          url: "upms_role_list",
          data: {
            pageNum:1,
            pageSize: 10000,
          }
        }).then((data) => {
           this.dicList.roleList = data.body.list;
        }).catch(() => {
        });
        //用户组
        $http.http({
          type: "post",
          url: "upms_group_list",
          data: {
            pageNum:1,
            pageSize: 1000,
          }
        }).then((data) => {
          this.dicList.groupList = data.body.list;
        }).catch(() => {
        });
        //部门
        $http.http({
          type: "post",
          url: "upms_depart_tree",
          data: {}
        }).then((data) => {
          this.dicList.departList = data.body;
        }).catch(() => {
        });

      },
      fetchData() {
        this.listLoading = true;
        $http.http({
          type: "post",
          url: "upms_user_list",
          data: {
            pageNum:this.pageNo,
            pageSize: this.pageSize,
            name: this.formInline.name,
          }
        }).then((data) => {
          this.listLoading = false;
          this.list=data.body.list;
          this.total=data.body.total;
          this.pageNo=data.body.paegNum;
          this.pageSize=data.body.pageSize;;
        }).catch(() => {
          this.listLoading = false;
        });
      }
    }
  }
</script>
