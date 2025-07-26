<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户组名称">
        <el-input v-model="formInline.name" placeholder="用户组名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户组编码">
        <el-input v-model="formInline.code" placeholder="用户组编码" clearable></el-input>
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
      <el-table-column label="用户组编码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupCode }}
        </template>
      </el-table-column>
      <el-table-column label="用户组名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" align="center"  :formatter="famtStatus">
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="150">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"   width="350"  align="center">>
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  v-if="scope.row.status" @click="disable(scope.row.id, scope.row.status)" round>禁用</el-button>
          <el-button type="primary" size="mini"  v-else-if="!scope.row.status" @click="able(scope.row.id, scope.row.status)" round>启用</el-button>
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>修改</el-button>
          <el-button type="primary" size="mini" @click="toDel(scope.row.id)" round>删除</el-button>
          <el-button type="primary" size="mini" @click="toConfigAuth(scope.row.id)" round>配置权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="450px" top="15%">
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm" >
        <el-form-item label="用户组名称:"  prop ="name" >
          <el-input v-model="formDialog.name" width="150"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户组编码:" prop ="code">
          <el-input v-model="formDialog.code" width="150"   autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="opData">确 定</el-button>
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
    <el-dialog title="权限权限" :visible.sync="configAuth.dialogVisible" width="500px" :close-on-click-modal="false" >
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
        <el-form-item label="权限:"  prop ="configAuth">
          <label slot="label">权限:</label>
          <TreeSelect :option='configAuth.authList' :prop="configAuth.prop" v-if="configAuth.show" :value.sync = "configAuth.configAuth"></TreeSelect>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanConfigAuth">取 消</el-button>
        <el-button type="primary" @click="udpateConfigAuth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {parsePageTime} from '@/utils/index'
  import TreeSelect from "@/components/TreeSelect"

  export default {
    components: { TreeSelect },
    data() {
      return {
        formTitle:"",
        formSwitchStatusTitle:"",
        hasDel: false,
        switchStatus: false,
        dialogVisible:false,
        list: [{
        }],
        configAuth:{
            dialogVisible: false,
            authList:[],
            configAuth:"",
            roleId:null,
            show: false,
            prop: {
            disabled:false,
              checkStrictly: true,
              multiple: true
          }
        },
        pageSize:10,
        pageNo:1,
        total:0,
        listLoading: false,
        formDialog:{
          code:"",
          name:"",
          status: false,
          id:null
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
      cleanConfigAuth(){
        this.configAuth.show = false;
        this.configAuth.dialogVisible = false;
      },
      toConfigAuth(roleId) {
        this.configAuth.roleId = roleId;
        $http.http({
          type: "post",
          url: "upms_auth_tree",
          data: {
          }
        }).then((data) => {
          if (data.body) {
            this.configAuth.authList = data.body;
            $http.http({
              type: "post",
              url: "upms_group_getGroupConfigAuth",
              data: {
                key: roleId
              }
            }).then((data) => {
              if (data.code == '200') {
                this.configAuth.configAuth = data.body;
                this.configAuth.show = true;
                this.configAuth.dialogVisible = true;
              }
            })
          }
        })
      },
    udpateConfigAuth() {
      $http.http({
        type: "post",
        url: "upms_group_updateGroupConfigAuth",
        data: {
          one: this.configAuth.configAuth,
          two: this.configAuth.roleId
        }
      }).then((data) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        if (data.code == '200') {
          this.configAuth.show = false;
          this.configAuth.dialogVisible = false;
        }
      })
    },
      toDel(id) {
        this.formDialog.id = id;
        this.hasDel = true;
      },
      switchStatusM(){
        var url = "upms_group_able";
        if (this.formDialog.status) {
          url = "upms_group_disable";
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
      opData(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var url = "upms_group_add";
            if (this.formDialog.id) {
              url = "upms_group_udpate";
            }
            $http.http({
              type: "post",
              url: url,
              data: {
                groupCode: this.formDialog.code,
                groupName: this.formDialog.name,
                id: this.formDialog.id
              }
            }).then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.fetchData();
              this.dialogVisible = false;
              this.formTitle = "";
            }).catch(() => {
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      parsePageTimeEx(date) {
        return parsePageTime(date);
      },
      skuList(productId){
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.fetchData();
      },
      toEdit(data){
        this.resetForm('formDialog');
        this.dialogVisible = true;
        this.formTitle = "编辑";
        this.formDialog.id = data.id;
        this.formDialog.name = data.groupName;
        this.formDialog.code = data.groupCode;
      },
      toAdd(){
        this.resetForm('formDialog');
        this.dialogVisible = true;
        this.formTitle = "新增";
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
        this.formDialog.code = null;
        this.formDialog.name = null;
        this.formDialog.id = null;
      },
      queryData() {
        this.pageNo = 0;
      },
      fetchData() {
        this.listLoading = true;
        var startTime = null, endTime = null;
        if (this.formInline.start) {
          startTime = this.formInline.start[0];
          endTime = this.formInline.start[1];
        }
        $http.http({
          type: "post",
          url: "upms_group_list",
          data: {
            pageNum:this.pageNo,
            pageSize: this.pageSize,
            code:this.formInline.code,
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
