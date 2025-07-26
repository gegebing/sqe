<template>
  <div class="app-container">
  <el-drawer
    :title="$t('common.drawer.lan')"
    :visible.sync="visible"
    direction="rtl"
    v-loading="loading"
    @close="colseWin"
    size=500>
    <el-form :inline="true" :model="formInline" size="small">
      <el-row>
        <el-col :offset="21">
          <el-form-item>
            <auth-button type="primary" perms="yqkj_product_type_add" :label="$t('common.table.addBtn')"  size="mini"   @click="addOrEdit(0)" icon="el-icon-circle-plus"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="lanDataList">
      <el-table-column :label="$t('common.table.language')" width="130" align="center">
        <template slot-scope="scope">
          {{ languageConvertEx(scope.row.language)}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('productType.list.table.name')" width="260" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('productType.list.table.ioc')" width="260" align="center">
        <template slot-scope="scope">
          <div class="block">
            <el-image
              style="width: 30px; height: 30px;background-color: #8c939d;border-radius: 4px;"
              :src="scope.row.icon"
              :preview-src-list="scope.row.icons">
              <div slot="error" class="image-slot" >
                <i class="el-icon-picture-outline" ></i>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.op')"   width="220"  align="center">
        <template slot-scope="scope">
          <auth-button type="primary" perms="yqkj_product_type_edit"  size="mini"  :label="$t('common.table.editBtn')"   @click="addOrEdit(scope.row)"/>
          <el-popconfirm   :title="$t('common.tip.del')"   @confirm="del(scope.row.id)">
            <auth-button type="primary" slot="reference" perms="yqkj_product_type_del"  size="mini"  :label="$t('common.table.delBtn')"  />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
    <add-or-update-language v-if="languageVisible" ref="addOrUpdateLanguage" @refreshDataList="fetchData"></add-or-update-language>
  </div>
</template>
<script>
  import {languageConvert} from '@/utils/index'
  import authButton from "@/components/button"
  import addOrUpdateLanguage from "./addOrUpdateLanguage"

  export default {
    components: {authButton, addOrUpdateLanguage},
    data () {
      return {
        prop: {
          disabled:false,
          checkStrictly: true,
        },
        formInline:{
          id:null,
          productTypeCode: null
        },
        options:{
          languageOption:[],
          parentProduct: [],
        },
        lanDataList:[],
        dataRule: {
          name: [
            { required: true, message: this.$t("productType.list.queryFormTip.name"), trigger: 'blur' },
          ]
        },
        loading: false,
        visible: false,
        languageVisible: false
      }
    },
    created() {
    },
    methods: {
      colseWin(){
        //关闭刷新页面
        this.$emit('refreshDataList');
      },
      languageConvertEx(data) {
        return languageConvert(data);
      },
      init(id, productTypeCode) {
        this.loading = true;
        this.visible = true;
        this.formInline.id = id;
        this.formInline.productTypeCode = productTypeCode;
        this.fetchData();
      },
      fetchData() {
        $http.http({
          type: "post",
          url: "yqkjShopProductTypeLanList",
          data: { key: this.formInline.id}
        }).then((data) => {
          this.lanDataList=data.body;
        }).catch(() => {}).finally(()=>{
          this.loading = false;
        });
      },
      del(id) {
        $http.http({
          type: "post",
          url: "yqkjShopProductTypeLanDel",
          data: { key: id}
        }).then((data) => {
        }).catch(() => {}).finally(()=>{
          this.fetchData();
        });
      },
      addOrEdit(data){
        this.languageVisible = true;
        this.$nextTick(() => {
          if (!data) {
            this.$refs.addOrUpdateLanguage.init({
              productTypeCode: this.formInline.productTypeCode
            })
          }else {
            this.$refs.addOrUpdateLanguage.init({
              productTypeCode: data.productTypeCode,
              businessLanguage: data.language,
              icon: data.icon,
              name: data.name,
              id:"1"
            })
          }
        })
      }
    }
  }
</script>
