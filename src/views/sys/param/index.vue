<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="编码">
        <el-input v-model="formInline.code" placeholder="code" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData" icon="el-icon-search">查询</el-button>
        <auth-button type="primary" perms="upms_param_add" label="新增" @click="toAdd" icon="el-icon-circle-plus"/>
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
      <el-table-column label="编码" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="值" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
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
      <el-table-column label="操作"   width="230"  align="center">>
        <template slot-scope="scope">
          <auth-button type="primary" perms="upms_param_disable"  size="mini" :disabled="scope.row.status"  label="禁用"   @click="disable(scope.row.id, scope.row.status)"/>
          <auth-button type="primary" perms="upms_param_able"  size="mini" :disabled="!scope.row.status"  label="启用" @click="able(scope.row.id, scope.row.status)"/>
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>修改</el-button>
          <el-button type="primary" size="mini" @click="toDel(scope.row.id)" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="450px" top="15%">
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm" >
        <el-form-item label="编码:"  prop ="code" >
          <el-input v-model="formDialog.code" width="150"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值:" prop ="value">
          <el-input v-model="formDialog.value" width="150"   autocomplete="off"></el-input>
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
  </div>
</template>

<script>
  import {parsePageTime} from '@/utils/index'
  import authButton from "@/components/button"

  export default {
    components: { authButton },

    data() {
      return {
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
        formDialog:{
          code:"",
          value:"",
          status: false,
          id:null
        },
        formInline: {
          code: '',
        },
        rules: {
          code: [
            {required: true, message: '请输入组名称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在1到128个字符', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请输入组编码', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在1到32个字符', trigger: 'blur'}
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
      toDel(id) {
        this.formDialog.id = id;
        this.hasDel = true;
      },
      switchStatusM(){
        var url = "system_param_able";
        if (this.formDialog.status) {
          url = "system_param_disable";
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
          url: "system_param_del",
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
            var url = "system_param_add";
            if (this.formDialog.id) {
              url = "system_param_udpate";
            }
            $http.http({
              type: "post",
              url: url,
              data: {
                code: this.formDialog.code,
                value: this.formDialog.value,
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
        this.formDialog.value = data.value;
        this.formDialog.code = data.code;
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
        this.formDialog.value = null;
        this.formDialog.id = null;
      },
      queryData() {
        this.pageNo = 0;
        this.fetchData();
      }
      ,
      fetchData() {
        this.listLoading = true;
        var startTime = null, endTime = null;
        if (this.formInline.start) {
          startTime = this.formInline.start[0];
          endTime = this.formInline.start[1];
        }
        $http.http({
          type: "post",
          url: "system_param_list",
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
