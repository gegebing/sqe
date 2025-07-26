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
      <!--语言-->
      <el-form-item :label="$t('errorMessageTable.list.queryForm.language')">
        <el-select v-model="dataForm.businessLanguage" :placeholder="$t('common.form.defaultTip.select')"  style="width: 100%;" clearable >
          <el-option
            v-for="item in options.languageOption"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <!--分类名称-->
      <el-form-item :label="$t('productType.list.queryForm.name')"
                    prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('productType.list.queryFormTip.name')"  maxlength="50" show-word-limit/>
      </el-form-item>
      <!--分类图片-->
      <el-form-item :label="$t('productType.list.table.ioc')"
                    prop="icon">
          <pic-upload v-model="dataForm.icon" fileTypeCode="100002" :value.sync="dataForm.icon"></pic-upload>
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
  import picUpload from '@/components/pic-upload'
  import TreeSelect from "@/components/TreeSelect"


  export default {
    components: { picUpload, TreeSelect},

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
          businessLanguage:'',
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
        url: "system_dic_list",
        data: {key: "language_key"}
      }).then((data) => {
        this.options.languageOption = data.body;
      }).catch(() => {
      });
    },
    methods: {
      init(data) {
        this.dataForm = data;
        this.visible = true;
      },
      dataFormSubmit(){
        //数据提交
        this.$refs['dataForm'].validate((valid,message) => {
            if (valid) {
              var url = "yqkjShopProductTypeEdit";
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
