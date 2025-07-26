<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="formInline.name" placeholder="资源名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="formInline.code" placeholder="资源编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="toAdd" icon="el-icon-circle-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="loading"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="功能名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        label="类型"
        :formatter="famtDictType"
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
        width="300"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toEdit(scope.row)" round>修改</el-button>
          <el-button type="primary" size="mini" @click="del(scope.row.id)" round>删除</el-button>
          <el-button type="primary" size="mini" @click="toAdd(scope.row.value)" icon="el-icon-circle-plus" round>新增</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="500px" :before-close="clean" :close-on-click-modal="false"	>
      <el-form :model="formDialog"  label-width="150px" size="medium" :rules="rules" ref="ruleForm" >
        <el-form-item label="上级资源:"  prop ="parentCode">
          <label slot="label">上级资源:</label>
          <TreeSelect :option='list' :prop="prop" v-if="show" :value.sync = "formDialog.parentCode" :hasDisable="hasDisable" ></TreeSelect>
        </el-form-item>
        <el-form-item label="资源名称:" prop ="funcName">
          <label slot="label">资源名称:</label>
          <el-input v-model="formDialog.funcName" placeholder="资源名称" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型:" prop ="type">
          <el-select v-model="formDialog.type" placeholder="请选择"  style="width: 100%;" clearable >
            <el-option
              v-for="item in dicList.type"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求类型:" prop ="funcMethod">
          <el-select v-model="formDialog.funcMethod" placeholder="请求类型" style="width: 100%;"  clearable >
            <el-option
              v-for="item in dicList.methods"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源编码:" prop ="funcCode">
          <label slot="label">资源编码:</label>
          <el-input v-model="formDialog.funcCode" placeholder="资源编码"  width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源ICON:" prop ="ioc">
          <label slot="label">资源ICON:</label>
          <el-input v-model="formDialog.ioc" placeholder="资源ICON" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <label slot="label">排&emsp;&emsp;&emsp;序:</label>
          <el-input-number v-model="formDialog.sort" :disabled="false" ></el-input-number>
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
        dicList:{
          type:[],//资源类型
          methods: []//方式
        },
        show:true,
        loading:false,
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
          funcName:"",
          funcCode:"",
          funcMethod:"",
          parentCode:"",
          ioc:"",
          type:"",
          sort:"255"
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
      this.fetchDicList();
      this.fetchData();
    },
    methods: {
      del(id){
        var url = "upms_function_del";
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
      famtDictType(row, column){
        let type = row.type;
        if (this.dicList.type) {
          for (var k = 0, length = this.dicList.type.length; k < length; k++) {
            if(this.dicList.type[k].key === type) {
              return this.dicList.type[k].name;
            }
          }
        }
      },
      famtStatus(row, column){
        let status = row.status;
        if (status) {
          return '启用';
        } else {
          return  '禁用';
        }
      },
      toAdd(parentCode) {
        this.resetForm('ruleForm');
        if (parentCode) {
          this.formDialog.parentCode = parentCode;
        }
        this.formTitle = "新增资源";
        this.show = true;
        this.hasDisable = false;
        this.dialogVisible = true;
      },
      toEdit(data) {
        console.log(data);
        this.dialogVisible = true;
        this.show = true;//
        this.hasDisable = true;
        this.resetForm('ruleForm');
        this.formTitle = "编辑资源";
        //初始化数据
        this.formDialog= {
          id: data.id,
          funcName:data.name,
          funcCode: data.funcCode,
          funcMethod: data.funcMethod,
          parentCode: data.value.substr(0, data.value.lastIndexOf("|")),
          ioc: data.icon,
          type: data.type,
          sort: data.sort
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
            var url = "upms_function_add";
            if (this.formDialog.id) {
              url = "upms_function_udpate";
            }  else {
              if (typeof  this.formDialog.parentCode === "object") {
                this.formDialog.parentCode=null;
              }
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
      async  fetchDicList(){
        await  $http.http({
          type: "post",
          url: "system_dic_list",
          data: {key: "upms_function_type"}
        }).then((data) => {
          this.dicList.type = data.body;
        }).catch(() => {
        });
        await  $http.http({
          type: "post",
          url: "system_dic_list",
          data: {key: "upms_function_method"}
        }).then((data) => {
          this.dicList.methods = data.body;
        }).catch(() => {
        });
      },
      fetchData() {
        this.loading = true;
        $http.http({
          type: "post",
          url: "upms_function_tree",
          data: {name: this.formInline.name, code: this.formInline.code}
        }).then((data) => {
          this.tableData = data.body;
          this.list = data.body;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      }
    }
  }
</script>

