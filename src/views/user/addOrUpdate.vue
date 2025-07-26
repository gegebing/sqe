<template>
  <el-dialog v-if="visible" :title="!dataForm.id ? $t('common.table.addBtn') : $t('common.table.editBtn')"
             :close-on-click-modal="false"
             v-loading="loading"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-form-item :label="$t('baseCms.list.queryForm.type')">
        <el-select v-model="dataForm.type"  :placeholder="$t('baseCms.list.queryForm.type')" style="width: 100%;" clearable >
          <el-option
            v-for="item in options.type"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <!--语言-->
      <el-form-item :label="$t('errorMessageTable.list.queryForm.language')">
        <el-select v-model="dataForm.language" :placeholder="$t('common.form.defaultTip.select')"  style="width: 100%;" clearable >
          <el-option
            v-for="item in options.languageOption"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('baseCms.list.table.name')"
                    prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('baseCms.list.queryFormTip.name')" maxlength="50" show-word-limit/>
      </el-form-item>

      <el-form-item :label="$t('baseCms.list.queryForm.content')"   prop="content">
        <tiny-mce  v-model="dataForm.content" :value.sync="dataForm.content" ref="content"></tiny-mce>
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
  import TinyMce from '@/components/tiny-mce'

  export default {
    components: { TinyMce},

    data () {
      return {
        options:{
          languageOption:[],
          type: options.cmsType,
        },
        dataForm:{
          id:null,
          name:null,
          type:null,
          language:null,
          content:null
        },
        dataRule: {
          name: [
            { required: true, message: this.$t('baseCms.list.queryFormTip.name'), trigger: 'blur' }
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
      init(id) {
        this.visible = true;
        this.dataForm = {
          id:null,
          name:null,
          type:null,
          language:null,
        };

        this.dataForm.id = id;
        if (this.dataForm.id) {
          this.loading = true;
          $http.http({
            type: "post",
            url: "yqkjShopCmsDetail",
            data: {key: id}
          }).then((data) => {
            if (data.code == 200) {
               this.dataForm = data.body;
               this.loading = false;
               this.$refs.content.setContent(this.dataForm.content)
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      },
      dataFormSubmit(){
        //数据提交
        this.$refs['dataForm'].validate((valid,message) => {
            if (valid) {
              var url = "yqkjShopCmsAdd";
              if (this.dataForm.id) {
                url = "yqkjShopCmsUpdate"
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
