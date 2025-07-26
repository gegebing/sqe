<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" size="small">
      <el-form-item :label="$t('trans.list.queryForm.name')">
        <el-input v-model="formInline.name" :placeholder="$t('trans.list.queryFormTip.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
        <auth-button type="primary" perms="trans_tlp_add" :label="$t('common.table.addBtn')" @click="addOrEdit(0)" icon="el-icon-circle-plus"/>
      </el-form-item>
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
      <el-table-column :label="$t('trans.list.table.name')" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.transName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trans.list.table.chargeType')" width="150" align="center">
        <template slot-scope="scope">
          {{ convertChargeType(scope.row.chargeType) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trans.list.table.hasDefault')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.hasDefault? $t('common.table.yes'):$t('common.table.not') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('trans.list.table.hasFreeFee')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.hasFreeFee? $t('common.table.yes'):$t('common.table.not') }}
        </template>
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
          <auth-button type="primary" perms="yqkj-shop-trans-edit"  size="mini"  :label="$t('common.table.editBtn')"   @click="addOrEdit(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj-shop-tran-disable" v-if="scope.row.status"  size="mini"  :label="$t('common.table.disAble')"   @click="switchStatus(scope.row)"/>
          <auth-button type="primary" perms="yqkj-shop-tran-able" v-if="!scope.row.status"  size="mini"  :label="$t('common.table.able')"   @click="switchStatus(scope.row)"/>

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
                   ref="addOrUpdate"></add-or-update>
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
      pageNum:1,
      total:0,
      listLoading: false,
      formInline: {
        name: '',
        type: "",
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
    switchStatus(row){
      let  url = "yqkjShopTransDisable";
      if (!row.status) {
          url = "yqkjShopTransAble";
      }
      $http.http({
        type: "post",
        url: url,
        data: {key: row.id}
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
      //新增
      this.$router.push({
        path: '/base/trans/addOrUpdate',
        query: { transId: id }
      })
    },
    convertChargeType(chargeType) {
      if (chargeType === 0) {
        return this.$t('trans.list.table.chargeTypeNum');
      }else if (chargeType === 1) {
        return this.$t('trans.list.table.chargeTypeWeight');
      }else if (chargeType === 2) {
        return this.$t('trans.list.table.chargeTypeVolume');
      }else {
        return "";
      }
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
        return "--";
      }
    },
    fetchData() {
      this.listLoading = true
      $http.http({
        type: "post",
        url: "yqkjShopTransList",
        data: {pageNum:this.pageNo,pageSize:this.pageSize, name: this.formInline.name}
      }).then((data) => {
        this.listLoading = false;
        this.list=data.body.list;
        this.total=data.body.total;
        this.pageNo=data.body.paegNum;
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
