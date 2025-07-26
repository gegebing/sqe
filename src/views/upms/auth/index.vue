<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="formInline.name" placeholder="权限名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="formInline.code" placeholder="权限编码" clearable></el-input>
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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="权限名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="authCode"
        align="center"
        label="权限编码"
        width="180">
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
        width="350"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>修改</el-button>
          <el-button type="primary" size="mini" @click="del(scope.row.id)" round>删除</el-button>
          <el-button type="primary" size="mini" @click="toConfigFunction(scope.row.id)" round>配置功能</el-button>
          <el-button type="primary" size="mini" @click="toAdd(scope.row.value)" icon="el-icon-circle-plus" round>新增</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="500px" :before-close="clean" :close-on-click-modal="false"	>
      <el-form :model="formDialog"  label-width="150px" size="medium" :rules="rules" ref="ruleForm" >
        <el-form-item label="上级权限:"  prop ="parentCode">
          <label slot="label">上级权限:</label>
          <TreeSelect :option='list' :prop="prop" v-if="show" :value.sync = "formDialog.parentCode" :hasDisable="hasDisable" ></TreeSelect>
        </el-form-item>
        <el-form-item label="权限名称:" prop ="authName">
          <label slot="label">权限名称:</label>
          <el-input v-model="formDialog.authName" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限编码:" prop ="name">
          <label slot="label">权限编码:</label>
          <el-input v-model="formDialog.authCode" width="150" :disabled="hasDisable"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <label slot="label">排&emsp;&emsp;&emsp;序:</label>
          <el-input-number v-model="formDialog.sort" :disabled="false"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clean">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限配置" :visible.sync="configFunction.dialogVisible" width="500px" :close-on-click-modal="false" >
      <el-form :model="formDialog"  label-width="100px" size="medium" :rules="rules" ref="ruleForm"  >
        <el-form-item label="资源:"  prop ="configFunction">
          <label slot="label">资源:</label>
          <TreeSelect :option='configFunction.functionList' :prop="configFunction.prop" v-if="configFunction.show" :value.sync = "configFunction.configFunction"  ></TreeSelect>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanConfigFunction">取 消</el-button>
        <el-button type="primary" @click="udpateConfigFunction">确 定</el-button>
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
          authCode:"",
          parentCode:"",
          funcCode:"",
          sort:"255"
        },
        configFunction:{
          dialogVisible: false,
          functionList:[],
          configFunction:"",
          authId:null,
          show: false,
          prop: {
            disabled:false,
            checkStrictly: true,
            multiple: true
          }
        },
        formInline: {
          id:"",
          code: "",
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
      del(id){
        var url = "upms_auth_del";
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
      udpateConfigFunction() {
        $http.http({
          type: "post",
          url: "upms_auth_udpateFunctionConfig",
          data: {
            one: this.configFunction.configFunction,
            two: this.configFunction.authId
          }
        }).then((data) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          if (data.code == '200') {
            this.configFunction.show = false;
            this.configFunction.dialogVisible = false;
          }
        })
      },
      cleanConfigFunction(){
        this.configFunction.show = false;
        this.configFunction.dialogVisible = false;
      },
      toConfigFunction(authId) {
        this.configFunction.authId = authId;
        $http.http({
          type: "post",
          url: "upms_function_tree",
          data: {
          }
        }).then((data) => {
           if (data.body) {
             this.configFunction.functionList = data.body;
             $http.http({
               type: "post",
               url: "upms_auth_getfunctionConfig",
               data: {
                 key: authId
               }
             }).then((data) => {
               if (data.code == '200') {
                 this.configFunction.configFunction = data.body;
                 this.configFunction.show = true;
                 this.configFunction.dialogVisible = true;
               }
             })
           }
        })
      },
      toAdd(parentCode) {
        this.resetForm('ruleForm');
        this.formTitle = "新增权限";
        if (parentCode) {
          this.formDialog.parentCode = parentCode;
        }
        this.show = true;
        this.hasDisable = false;
        this.dialogVisible = true;
      },
      toEdit(data) {
        this.dialogVisible = true;
        this.show = true;//
        this.hasDisable = true;
        this.resetForm('ruleForm');
        this.formTitle = "编辑权限";
        //初始化数据
        this.formDialog= {
          id: data.id,
          authCode:data.authCode,
          parentCode: data.value.substr(0, data.value.lastIndexOf("|")),
          authName: data.name,
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
            var url = "upms_auth_add";
            if (this.formDialog.id) {
              url = "upms_auth_udpate";
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
              this.clean();
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
          url: "upms_auth_tree",
          data: {name: this.formInline.name, code: this.formInline.code}
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

