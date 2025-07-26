<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="formInline.name" placeholder="部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="状态" clearable>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="toAdd" icon="el-icon-circle-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="部门名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="leadName"
        align="center"
        label="负责人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        width="150"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="famtStatus"
        width="150"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        width="150"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="sort"
        width="300"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  v-if="scope.row.status" @click="status(scope.row.id, scope.row.status)" round>禁用</el-button>
          <el-button type="primary" size="mini"  v-else-if="!scope.row.status" @click="status(scope.row.id, scope.row.status)" round>启用</el-button>
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>修改</el-button>
          <el-button type="primary" size="mini" @click="del(scope.row.id)" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="500px" :before-close="clean" :close-on-click-modal="false"	>
      <el-form :model="formDialog"  label-width="150px" size="medium" :rules="rules" ref="ruleForm" >
        <el-form-item label="上级部门:"  prop ="parentCode">
          <label slot="label">上级部&emsp;门:</label>
          <TreeSelect :option='list' :prop="prop" v-if="show" :value.sync = "formDialog.parentCode" :hasDisable="hasDisable" ></TreeSelect>
        </el-form-item>
        <el-form-item label="部门名称:" prop ="name">
          <label slot="label">部门名&emsp;称:</label>
          <el-input v-model="formDialog.name" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人:" prop ="leadName">
          <el-input v-model="formDialog.leadName" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门电&emsp;话:" prop ="phone">
          <label slot="label">部门电&emsp;话:</label>

          <el-input v-model="formDialog.phone" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门邮&emsp;箱:" prop ="email">
          <label slot="label">部门邮&emsp;箱:</label>
          <el-input v-model="formDialog.email" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <label slot="label">排&emsp;&emsp;&emsp;序:</label>
          <el-input-number v-model="formDialog.sort" :disabled="false" width="150"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clean">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import TreeSelect from "@/components/TreeSelect"
  export default {
    components: { TreeSelect },
    data() {
      return {
        show:true,
        hasDisable: false,
        prop: {
          disabled:false,
          checkStrictly: true,
        },
        list:  [],
        formTitle:"",
        dialogVisible: false,
        formDialog:{
          id:"",
          name:"",
          parentCode:"",
          leadName:"",
          phone:"",
          email:"",
          sort:"255"
        },
        formInline: {
          status: '',
          name: ""
        },
        tableData: [],
        rules: {
        }
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      status(id,hasAble){
        var url = "upms_depart_able";
        if (hasAble) {
          url = "upms_depart_disable";
        }
        $http.http({
          type: "post",
          url: url,
          data: {
            key:id,
          }
        }).then((data) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.fetchData();
      }).catch(() => {
      });
    },
      del(id){
        var url = "upms_depart_del";
        $http.http({
          type: "post",
          url: url,
          data: {
            key:id,
          }
        }).then((data) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.fetchData();
        }).catch(() => {
        });
      },
      famtStatus(row, column){
        let status = row.status;
        if (status) {
          return '启用';
        } else {
          return  '禁用';
        }
      },
      cleanAdd() {
        this.dialogVisible = false;
      },
      toAdd() {
        this.resetForm('ruleForm');
        this.formTitle = "新增部门";
        this.show = true;
        this.dialogVisible = true;
      },
      toEdit(data) {
        this.dialogVisible = true;
        this.show = true;
        this.hasDisable = true;
        this.resetForm('ruleForm');
        this.formTitle = "编辑部门";
        //初始化数据
        this.formDialog= {
          id:data.id,
          name:data.name,
          parentCode: data.value.substr(0, data.value.lastIndexOf("|")),
          leadName:data.leadName,
          phone:data.phone,
          email:data.email,
          sort:"255"
        }
      },
      clean(){
        this.dialogVisible = false;
        this.show = false;
        this.formDialog = {
          sort:"255"
        };
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var url = "upms_depart_add";
            if (this.formDialog.id) {
              url = "upms_depart_udpate";
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
              this.resetForm('ruleForm');
              this.cleanAdd();
              this.fetchData();

            }).catch(() => {
              this.listLoading = false;
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.formDialog = {
          sort:"255"
        };
      },
      fetchData() {
        this.listLoading = true;
        $http.http({
          type: "post",
          url: "upms_depart_tree",
          data: {name: this.formInline.name, status: this.formInline.status}
        }).then((data) => {
          this.tableData = data.body;
          this.list = data.body;
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        });
      }
    }
  }
</script>

