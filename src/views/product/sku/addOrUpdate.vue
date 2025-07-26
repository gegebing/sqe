<template>
  <el-dialog v-if="visible" :title="!dataForm.id ? $t('common.table.addBtn') : $t('common.table.editBtn')"
             :close-on-click-modal="false"
             v-loading="loading"
             width="30%"
             :visible.sync="visible">

    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <!--上级SKU-->
      <el-form-item :label="$t('shopSku.list.queryForm.parentName')"
                    prop="parentCode">
          <TreeSelect v-model="dataForm.parentCode" v-if="visible"  :option='options.parentProduct' :prop="prop"  :value.sync = "dataForm.parentCode"/>
      </el-form-item>
      <!--SKU名称-->
      <el-form-item :label="$t('shopSku.list.queryForm.name')"
                    prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('shopSku.list.queryFormTip.name')"  maxlength="50" show-word-limit/>
      </el-form-item>
    </el-form>
    <span slot="footer"  class="dialog-footer">
      <el-button @click="visible = false"
                 size="mini">{{$t('common.form.btn.clean')}}</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 size="mini">{{$t('common.form.btn.confirm')}}</el-button>
    </span>

  </el-dialog>
</template>
<script>
  import TreeSelect from "@/components/TreeSelect"

  export default {
    components: {TreeSelect},

    data () {
      return {
        prop: {
          disabled:false,
          checkStrictly: true,
        },
        options:{
          languageOption:[],
          parentProduct: [],
        },
        dataForm:{
          id:null,
          parentCode:'',
          name:null,
          icon:null,
        },
        dataRule: {
          name: [
            { required: true, message: this.$t("productType.list.queryFormTip.name"), trigger: 'blur' },
          ]
        },
        loading: false,
        visible: false,
      }
    },
    created() {
      $http.http({
        type: "post",
        url: "yqkjShopProductSkuList",
        data: {}
      }).then((data) => {
        this.options.parentProduct = data.body;
      }).catch(() => {
      });
    },
    methods: {
      init(data, parentCode) {
        if (data){
          this.dataForm = data;
        }
        if (this.dataForm.id) {
          var index = parentCode.lastIndexOf("|");
          if (index != -1) {
            this.dataForm.parentCode = parentCode.substring(0, index);
          } else {
            this.dataForm.parentCode = "";
          }
        } else {
          if (parentCode) {
            this.dataForm.parentCode = parentCode;
          }
        }
        this.visible = true;
      },
      dataFormSubmit(){
        //数据提交
        this.$refs['dataForm'].validate((valid,message) => {
            if (valid) {
              var url = "yqkjShopProductSkuAdd";
              if (this.dataForm.id) {
                url = "yqkjShopProductSkuEdit"
              }
              $http.http({
                type: "post",
                url: url,
                data: this.dataForm
              }).then((data) => {
                if (data.code == 200) {
                  this.$message({
                    message: this.$t('common.http.successTip'),
                    type: 'success',
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  });

                } else {
                  this.$message.error(data.msg);
                }
              }).catch(() => {});
            }
        });
        }
    }
  }
</script>
