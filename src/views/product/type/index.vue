<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" size="small">
      <el-form-item :label="$t('productType.list.queryForm.name')">
        <el-input v-model="formInline.name" :placeholder="$t('productType.list.queryFormTip.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
        <auth-button type="primary" perms="yqkj_product_type_add" :label="$t('common.table.addBtn')" @click="addOrEdit(0)" icon="el-icon-circle-plus"/>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column align="center" :label="$t('common.table.no')" width="100">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('productType.list.table.name')" width="260" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('productType.list.table.ioc')" width="150" align="center">
        <template slot-scope="scope">
          <div class="block">
            <el-image
              style="width: 30px; height: 30px;background-color: #8c939d;border-radius: 4px;"
              :src="scope.row.icon"
              :preview-src-list="scope.row.icons">
              <div slot="error" class="image-slot" >
                <i class="el-icon-picture-outline"  ></i>
              </div>
            </el-image>
          </div>

        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.status')" width="180" align="center" :formatter="codeStatusConvert">
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.opUser')" width="200" >
        <template slot-scope="scope">
          <span>{{ opUser(scope.row.createUser,scope.row.updateUser ) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.opTime')" width="200">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime, scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.op')"   width="350"  align="center">
        <template slot-scope="scope">
          <auth-button type="primary" perms="yqkj_product_type_edit"  size="mini"  :label="$t('common.table.editBtn')"   @click="addOrEdit(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj_shop_productType_lan"  size="mini"  :label="$t('common.table.lan')"   @click="language(scope.row.id, scope.row.productTypeCode)"/>
          <auth-button type="primary" v-if="!scope.row.status" perms="yqkj_product_type_disable"  size="mini"  :label="$t('common.table.able')"   @click="switchStatus(scope.row.id, scope.row.status)"/>
          <auth-button type="primary" v-if="scope.row.status" perms="yqkj_product_type_able"  size="mini"  :label="$t('common.table.disAble')"   @click="switchStatus(scope.row.id, scope.row.status)"/>
          <auth-button type="primary" perms="yqkj_product_type_add" :label="$t('common.table.addBtn')"  size="mini" @click="addOrEdit(0, scope.row.value)" icon="el-icon-circle-plus"/>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="fetchData"></add-or-update>
    <language v-if="languageVisible" ref="language" @refreshDataList="fetchData"></language>
  </div>
</template>

<script>
  import {parsePageTimeEx, parseOpUser, languageConvert} from '@/utils/index'
  import addOrUpdate from './addOrUpdate'
  import language from './language'


  import authButton from "@/components/button"

  export default {
    components: {authButton ,addOrUpdate, language},
    data() {
    return {
      addOrUpdateVisible:false,
      languageVisible:false,
      list: [],
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
    switchStatus(id, status){
      var url = "yqkjShopProductTypeDisable";
      if (!status) {
        url = "yqkjShopProductTypeAble";
      }
      $http.http({
        type: "post",
        url: url,
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
    language(id, productTypeCode){
      //语言包管理
      this.languageVisible = true;
      this.$nextTick(() => {
        this.$refs.language.init(id, productTypeCode);
      });
    },
    addOrEdit(id, parentCode) {
      //新增
      this.addOrUpdateVisible= true;
      this.$nextTick(() => {
        if (id == 0) {
          this.$refs.addOrUpdate.init(null, parentCode)
        }else {
          this.$refs.addOrUpdate.init(id)
        }
      })
    },
    opUser(createUser, updateUser){
      return parseOpUser(createUser, updateUser);
    },
    parsePageTimeEx(createDate, updateDate) {
      return parsePageTimeEx(createDate, updateDate);
    },
    codeStatusConvert(row, column){
      var type = row.status;
      if (type == false) {
        return this.$t('common.table.disAble');
      } else  if (type == true) {
        return this.$t('common.table.able');
      } {
        return this.$t("common.table.notStatus");
      }
    },
    fetchData() {
      this.listLoading = true
      $http.http({
        type: "post",
        url: "yqkjShopProductTypeList",
        data: {pageNum:this.pageNo,pageSize:this.pageSize, name: this.formInline.name}
      }).then((data) => {
        this.listLoading = false;
        this.list=data.body;
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
