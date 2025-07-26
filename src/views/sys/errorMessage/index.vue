<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="form-inline">
      <el-form-item :label="$t('errorMessageTable.list.queryForm.language')">
        <el-select v-model="formInline.language"   style="width: 100%;" clearable >
          <el-option
            v-for="item in languageOption"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('errorMessageTable.list.queryForm.code')">
        <el-input v-model="formInline.code" placeholder="code" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('errorMessageTable.list.queryForm.tip')">
        <el-input v-model="formInline.message" placeholder="message" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryData" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
        <auth-button type="primary" perms="app_message_manage_add" :label="$t('common.table.addBtn')" @click="toAdd" icon="el-icon-circle-plus"/>
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
      <el-table-column align="center" :label="$t('common.table.no')" width="80">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('errorMessageTable.list.queryForm.type')" width="200" align="center"  :formatter="codeTypeConvert">
      </el-table-column>
      <el-table-column :label="$t('errorMessageTable.list.queryForm.language')" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.language }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('errorMessageTable.list.queryForm.code')" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('errorMessageTable.list.queryForm.tip')" width="500" align="center">
        <template slot-scope="scope">
          {{ scope.row.message }}
        </template>
      </el-table-column>  
      <el-table-column align="center" :label="$t('common.table.opUser')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.opTime')" width="200">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.op')"  fixed="right"  width="230"  align="center">
        <auth-button type="primary" perms="app_message_manage_update"  size="mini"  :label="$t('common.table.editBtn')"   @click="edit(scope.row.id)"/>
      </el-table-column>
    </el-table>
    <!--新增-->
    <el-dialog :title="$t('common.table.addBtn')" :visible.sync="dialogVisible" width="450px" top="15%" ref="ruleForm" :rules="rules">
      <el-form :model="formDialog"  label-width="100px" size="medium" >
        <el-form-item :label="$t('errorMessageTable.list.queryForm.type')">
          <el-select v-model="formDialog.codeType" :placeholder="$t('common.form.defaultTip.select')"  style="width: 100%;" clearable >
            <el-option
              v-for="item in codeTypeOption"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('errorMessageTable.list.queryForm.language')">
          <el-select v-model="formDialog.language" :placeholder="$t('common.form.defaultTip.select')"  style="width: 100%;" clearable >
            <el-option
              v-for="item in languageOption"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('errorMessageTable.list.queryForm.code')" prop ="code">
          <el-input v-model="formDialog.code" width="150"   autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('errorMessageTable.list.queryForm.tip')" prop ="message">
          <el-input v-model="formDialog.message" width="150"   autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('common.form.btn.clean')}}</el-button>
        <el-button type="primary" @click="add">{{$t('common.form.btn.confirm')}}</el-button>
      </div>
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
    rules:{

    },
    data() {
      return {
        dialogVisible:false,
        listLoading:false,
        codeTypeOption:[
          {
            name:this.$t('errorMessageTable.option.codeType.admin'),
            key:'0',
            value:'0'
          },
          {
            name:this.$t('errorMessageTable.option.codeType.app'),
            key:'1',
            value:'1'
          }
        ],
        languageOption:{},
        formDialog:{
          id:null,
          language: null,
          code: null,
          message: null
        },
        list: [{
        }],
        pageSize:10,
        pageNo:1,
        total:0,
        formInline: {
          language: '',
          message: '',
          code:'',
          codeType:""
        }
      }
    },
    created() {
      this.fetchData();
       $http.http({
        type: "post",
        url: "system_dic_list",
        data: {key: "language_key"}
      }).then((data) => {
        this.languageOption = data.body;
      }).catch(() => {
      });
    },
    methods: {
      edit(){

      },
      codeTypeConvert(row, column){
        if (row.codeType == 0) {
          return this.$t('errorMessageTable.option.codeType.admin');
        }
        if (row.codeType == 1) {
          return this.$t('errorMessageTable.option.codeType.app');
        }
      },
      add(){
        $http.http({
          type: "post",
          url: "frameworkErrorMessage_add",
          data: this.formDialog
        }).then((data) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.fetchData();
          this.dialogVisible = false;
        }).catch(() => {
          this.dialogVisible = false;
        });
      },
      toAdd(){
        this.formDialog={};
        this.dialogVisible = true;
      },
      parsePageTimeEx(date) {
        return parsePageTime(date);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.fetchData();
      },
      queryData() {
        this.pageNo = 0;
        this.fetchData();
      },
      fetchData() {
        this.listLoading = true;
        $http.http({
          type: "post",
          url: "frameworkErrorMessage_list",
          data: {
            pageNum:this.pageNo,
            pageSize: this.pageSize,
            language:this.formInline.language,
            code: this.formInline.code,
            message: this.formInline.message
          }
        }).then((data) => {
          this.listLoading = false;
          this.list=data.body.list;
          this.total=data.body.total;
          this.pageNo=data.body.paegNum;
          this.pageSize=data.body.pageSize;
        }).catch(() => {
          this.listLoading = false;
        });
      }
    }
  }
</script>
