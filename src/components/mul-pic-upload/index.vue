<template>
  <div v-loading="loading">
    <draggable tag="ul" v-model="allListChild" v-bind="dragOptions" @update="datadragEnd" @start="drag = true" @end="drag = false" style="margin-left:-40px;">
      <div class="img-wrapper" v-for="(item,index) in allListChild" :key="index">
        <el-image :src="item.imgUrl"  >
        </el-image>
        <div class="operate-wrap" :title="$t('common.components.mulFile.sortTip')">
          <div class="operate-bg"></div>
          <i class="el-icon-delete del-icon" @click="deleImg(item.URL,index)"></i>
          <i class="el-icon-zoom-in preview-icon" @click="handlePictureCardPreview(item.imgUrl,index)"></i>
        </div>
        <el-dialog :visible.sync="dialogVisible" :title="$t('common.components.mulFile.title')">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </draggable>
    <el-upload ref='upload' list-type="picture-card" :limit="20"
               :show-file-list="false" multiple
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               action = "http"
               :fileTypeCode ="fileTypeCode"
               :http-request	="updateLoad"
               :on-success="uploadAppSuccess"
               :on-error="handleImageError"
               :before-upload="beforeAvatarUpload"
               accept=".gif,.jpeg,.jpg,.JPG,.JPEG,.png,.svg,.ico"
               :title="$t('common.components.mulFile.upload')">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
  import draggable from "vuedraggable";
  export default {
    name: "DragUpload",
    props: {
      allList:Array,
      fileTypeCode: {
        default: '',
        type: String
      },
    },
    components: {
      draggable,
    },
    data() {
      return {
        loading: false,
        allListChild: this.allList,
        imgUrl: '',
        drag: false,
        uploadForm: {}, //
        dialogVisible: false,
        dialogImageUrl: '',
      };
    },
    methods: {
      fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },
      updateLoad(v1) {
        this.fileToBase64(v1.file).then(v => {
          $http.http({
            type: "post",
            url: "fileUpload",
            data: {fileType: this.fileTypeCode, fileContent: v, fileName: v1.file.name }
          }).then((data) => {v
            if (data.code == 200) {
              this.uploadAppSuccess(data.body.location);
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {});
        });
      },
      beforeAvatarUpload(file) {
        this.loading = true;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error(this.$t("common.components.mulFile.uploadSize"))
          return
        }
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      uploadAppSuccess(url) {
        var temp = {
          imgUrl: url,
          orderNumber: this.allListChild.length
        };
        this.allListChild.push(temp) // 启动拖拽功能
        this.$emit('mulPicUploadChange', this.allListChild)
        setTimeout(this.loading = false, 10000)
      },
      // 上传图片失败
      handleImageError(err, file) {
        this.loading = false
      },
      //删除图片
      deleImg(data, index) {
        this.allListChild.splice(index, 1)
        this.$emit('mulPicUploadChange', this.allListChild)
      },
      // 拖动排序
      datadragEnd() {
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
        this.allListChild.map((item, index) => {
          item.orderNumber = index
        })
        this.$emit('mulPicUploadChange', this.allListChild)
      }

    },
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      },
    },
  }
</script>
<style lang="less" scoped>
  .img-list {
    display: inline-block;
  }
  .img-wrapper {
    float: left;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    width: 148px;
    height: 148px;
    overflow: hidden;
    &:hover {
      .operate-wrap {
        display: block;
      }
    }
  }
  .operate-wrap {
    display: none;
  }
  .operate-bg {
    background: #000000;
    width: 148px;
    height: 148px;
    opacity: 0.4;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
  }
  .del-icon {
    position: absolute;
    top: 0;
    right: 36px;
    font-size: 25px;
    line-height: 142px;
    color: #ffffff;
    z-index: 10;
  }
  .preview-icon {
    position: absolute;
    top: 0;
    left: 36px;
    font-size: 25px;
    line-height: 142px;
    color: #ffffff;
    z-index: 10;
  }
</style>
