<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('product.list.queryForm.name')">
            <el-input v-model="formInline.name" :placeholder="$t('product.list.queryFormTip.name')" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('product.list.queryForm.productCode')">
            <el-input v-model="formInline.productCode" :placeholder="$t('product.list.queryFormTip.productCode')" clearable></el-input>
          </el-form-item>
          <!--上架状态-->
          <el-form-item :label="$t('product.list.queryForm.hasUp')">
            <el-select v-model="formInline.hasUp" :placeholder="$t('common.form.defaultTip.select')"  style="width: 100%;" clearable >
              <el-option
                v-for="item in product.hasUpOption"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <!--商品分类--->
          <el-form-item :label="$t('product.list.queryForm.productType')"
                        prop="parentCode">
            <TreeSelect v-model="formInline.productTypeCode"  :option='product.productTypeData' :prop="prop"  :value.sync = "formInline.productTypeCode"/>
          </el-form-item>
          <!--排序-->
          <el-form-item :label="$t('product.list.queryForm.productSort')">
            <el-select v-model="formInline.sort" :placeholder="$t('common.form.defaultTip.select')"  size="medium" clearable >
              <el-option
                v-for="item in product.productSortOption"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData" size="small" icon="el-icon-search">{{$t('common.table.queryBtn')}}</el-button>
            <auth-button type="primary" perms="yqkj_product_type_add" size="small" :label="$t('product.list.btn.publishProduct')" @click="addOrEdit(0)" icon="el-icon-circle-plus"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--商品列表-->
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
      <el-table-column :label="$t('product.list.table.name')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.list.table.code')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.productCode }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.list.table.productTypeName')" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.productTypeName }}
        </template>
      </el-table-column>
       <el-table-column align="center" :label="$t('product.list.table.productPrice')" width="150" >
        <template slot-scope="scope">
          <span>{{ scope.row.productPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('product.list.table.productCost')" width="150" >
        <template slot-scope="scope">
          <span>{{ scope.row.productCost }}</span>
        </template>
      </el-table-column>

      <!--总库存-->
      <el-table-column align="center" :label="$t('product.list.table.stockNum')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.stockNum }}</span>
        </template>
      </el-table-column>
      <!--销量-->
      <el-table-column align="center" :label="$t('product.list.table.salesNum')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.salesNum }}</span>
        </template>
      </el-table-column>
      <!--商品评分-->
      <el-table-column align="center" :label="$t('product.list.table.score')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <!--商品收藏-->
      <el-table-column align="center" :label="$t('product.list.table.collect')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.collect }}</span>
        </template>
      </el-table-column>
      <!--综合评分-->
      <el-table-column align="center" :label="$t('product.list.table.compScore')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.compScore }}</span>
        </template>
      </el-table-column>
      <!--是否严选-->
      <el-table-column align="center" :label="$t('product.list.table.hasCarefullyChosen')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.hasCarefullyChosen? $t('common.table.yes'):$t('common.table.not')}}</span>
        </template>
      </el-table-column>
      <!--上架状态-->
      <el-table-column align="center" :label="$t('product.list.table.hasUp')" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.hasUp? $t('common.table.yes'):$t('common.table.not')}}</span>
        </template>
      </el-table-column>
      <!--操作用户-->
      <el-table-column align="center" :label="$t('common.table.opUser')" width="150" >
        <template slot-scope="scope">
          <span>{{ opUser(scope.row.createUser,scope.row.updateUser ) }}</span>
        </template>
      </el-table-column>
      <!--更新时间-->
      <el-table-column align="center" :label="$t('common.table.opTime')" width="150">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime, scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column :label="$t('common.table.op')" fixed="right"   width="220"   align="center">
        <template slot-scope="scope">
          <auth-button type="primary" perms="yqkj_shop_manage_edit"  size="mini" v-if="!scope.row.hasUp"  :label="$t('common.table.editBtn')"   @click="addOrEdit(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj_shop_manage_del"  v-if="!scope.row.hasUp"  size="mini"  :label="$t('common.table.delBtn')"   @click="del(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj_product_up" v-if="!scope.row.hasUp"  size="mini"  :label="$t('product.list.queryForm.up')"   @click="up(scope.row.id)"/>
          <auth-button type="primary" perms="yqkj_product_down" v-if="scope.row.hasUp"  size="mini"  :label="$t('product.list.queryForm.down')"   @click="down(scope.row.id)"/>
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
    <language v-if="languageVisible" ref="language" @refreshDataList="fetchData"></language>
  </div>
</template>

<script>
  import {parsePageTimeEx, parseOpUser, languageConvert} from '@/utils/index'
  import addOrUpdate from './addOrUpdate'
  import language from './language'
  import TreeSelect from "@/components/TreeSelect"
  import authButton from "@/components/button"

  export default {
    components: {authButton ,addOrUpdate, language, TreeSelect},
    data() {
    return {
      prop: {
        disabled:false,
        checkStrictly: true,
      },
      product:{
        hasUpOption: options.productHasUpOption,
        productSortOption: options.productSortOption,
        productTypeData:[],
      },
      addOrUpdateVisible:false,
      languageVisible:false,
      list: [],
      total:0,
      pageSize:10,
      pageNum:1,
      listLoading: false,
      formInline: {
        name: '',
        productCode:"",
        productTypeCode:null,
        hasUp: "",
        sort: null
      },
    }
  },
  created() {
    $http.http({
      type: "post",
      url: "yqkjShopProductTypeList",
      data: {}
    }).then((data) => {
      this.product.productTypeData = data.body;
    }).catch(() => {
    });
     this.fetchData()
  },
  methods: {
    del(productId){
      $http.http({
        type: "post",
        url: "yqkjShopProductDel",
        data: {key: productId}
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
    up(productId) {
      $http.http({
        type: "post",
        url: "yqkjShopProductAble",
        data: {key: productId}
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
    down(productId) {
      $http.http({
        type: "post",
        url: "yqkjShopProductDisable",
        data: {key: productId}
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
    // 每页数
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
    addOrEdit(id) {
      //新增
      this.$router.push({
        path: '/product/addOrUpdate',
        query: { prodId: id }
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
        url: "yqkjShopProductList",
        data: {
          pageNum:this.pageNo,
          pageSize:this.pageSize,
          name: this.formInline.name,
          productCode: this.formInline.productCode,
          productTypeCode: this.formInline.productTypeCode,
          hasUp: this.formInline.hasUp,
          productSortEnums: this.formInline.sort
          }
      }).then((data) => {
        this.list=data.body.list;
        this.pageNo = data.body.paegNum;
        this.pageSize = data.body.pageSize;
        this.total = data.body.total;
        this.listLoading = false;
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
