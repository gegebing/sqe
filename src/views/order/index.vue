<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" size="small">
      <el-row :gutter="24">
        <el-col :span="5">
          <!--订单号-->
          <el-form-item :label="$t('order.list.queryForm.orderCode')">
            <el-input v-model="formInline.orderCode" :placeholder="$t('order.list.queryFormTip.orderCode')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <!--定义联系人-->
          <el-form-item :label="$t('order.list.queryForm.conactName')">
            <el-input v-model="formInline.conactName" :placeholder="$t('order.list.queryFormTip.conactName')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <!--联系人手机号-->
          <el-form-item :label="$t('order.list.queryForm.contactPhone')">
            <el-input v-model="formInline.contactPhone" :placeholder="$t('order.list.queryFormTip.contactPhone')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!--订单交易时间-->
          <el-form-item :label="$t('order.list.queryForm.orderTime')">
            <el-date-picker
              v-model="formInline.orderTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              :range-separator="$t('common.components.dateRange.reparator')"
              :start-placeholder="$t('common.components.dateRange.start')"
              :end-placeholder="$t('common.components.dateRange.end')">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="5">
          <!--订单状态-->
          <el-form-item :label="$t('order.list.queryForm.orderStatus')">
            <el-input v-model="formInline.orderStatus" :placeholder="$t('order.list.queryFormTip.orderStatus')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <!--用户姓名-->
          <el-form-item :label="$t('order.list.queryForm.userName')">
            <el-input v-model="formInline.userName" :placeholder="$t('order.list.queryFormTip.userName')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item>
            <el-button type="primary" @click="fetchData" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" :label="$t('common.table.no')" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('baseCms.list.table.code')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('baseCms.list.table.name')" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.language')" width="150" align="center">
        <template slot-scope="scope">
          {{ languageConvertEx(scope.row.language) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('baseCms.list.queryForm.type')" width="180" align="center" :formatter="codeTypeConvert">
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.opUser')" width="200" >
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.opTime')" width="200">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.op')"   width="220"  align="center">
        <template slot-scope="scope">
          <auth-button type="primary" perms="yqkj_shop_manage_edit"  size="mini"  :label="$t('common.table.editBtn')"   @click="addOrEdit(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj_shop_manage_del"  size="mini"  :label="$t('common.table.delBtn')"   @click="del(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <!---分页组建-->
    <el-pagination style=""
                   background
                   :page-sizes="[1,10, 20, 30, 40, 50, 100]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :page-size="pageSize"
                   :current-page="pageNum">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="fetchData"></add-or-update>
  </div>
</template>

<script>
  import {parsePageTime, languageConvert} from '@/utils/index'
  import addOrUpdate from './addOrUpdate'
  import authButton from "@/components/button"

  export default {
    components: { authButton ,addOrUpdate},
    data() {
    return {
      options:{
        type: options.cmsType,
      },
      addOrUpdateVisible:false,
      list: [{}],
      pageSize:10,
      pageNo:1,
      total:0,
      listLoading: false,
      formInline: {
        orderCode: "",
        orderTime: "",
        conactName:"",
        contactPhone:"",
        orderStatus:"",
        userName:""
      },
    }
  },
  created() {
     this.fetchData()
  },
  methods: {
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
    del(id){
      $http.http({
        type: "post",
        url: "yqkjShopCmsDel",
        data: {key: id}
      }).then((data) => {
        if (data.code == 200) {
          this.$message({
            message: this.$t('common.http.successTip'),
            type: 'success',
          });
          this.fetchData();
        } else {
          this.$message.error(data.msg);
        }
      }).catch(() => {});
    },
    addOrEdit(id) {
      //新增协议
      this.addOrUpdateVisible= true;
      this.$nextTick(() => {
        if (id == 0) {
          this.$refs.addOrUpdate.init(null)
        }else {
          this.$refs.addOrUpdate.init(id)
        }
      })
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
    languageConvertEx(lan){
      return languageConvert(lan);
    },
    codeTypeConvert(row, column){
      var type = row.type;
      if (type == 10) {
        return this.$t('baseCms.option.cmsType.privateAgreement');
      } else  if (type == 11) {
        return this.$t('baseCms.option.cmsType.termService');
      }else  if (type == 12) {
        return this.$t('baseCms.option.cmsType.logisticsPolicy');
      }else  if (type == 13) {
        return this.$t('baseCms.option.cmsType.aboutMe');
      }else  if (type == 14) {
        return this.$t('baseCms.option.cmsType.joinMe');
      }else  if (type == 15) {
        return this.$t('baseCms.option.cmsType.register');
      }else  if (type == 16) {
        return this.$t('baseCms.option.cmsType.refundRule');
      }else {
        return "未知协议";
      }
    },
    fetchData() {
      this.listLoading = true
      $http.http({
        type: "post",
        url: "yqkjShopCmsList",
        data: {pageNum:this.pageNo,pageSize:this.pageSize, name: this.formInline.name, type: this.formInline.type}
      }).then((data) => {
        this.listLoading = false;
        this.list=data.body.list;
        this.total=data.body.total;
        this.pageNo=data.body.paegNum;
        this.pageSize=data.body.pageSize;
       }).catch(() => {});
    }
  }
}
</script>
<style>
  .el-drawer.rtl{
    overflow: scroll;
  }
</style>
