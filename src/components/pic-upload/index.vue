<template>
  <div>
    <el-upload
      class="pic-uploader-component"
      :http-request	="updateLoad"
      :show-file-list="false"
      action="http://"
      :before-upload="beforeAvatarUpload">
      <img v-if="picUrl" :src="picUrl" class="pic">
      <i v-else class="el-icon-plus pic-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        picUrl: this.value
      }
    },
    props: {
      fileTypeCode: {
        default: '',
        type: String
      },
      value: {
        default: '',
        type: String
      }
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
              this.picUrl = data.body.location;
              this.handleUploadSuccess()
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {});
        });

      },
      // 图片上传
      handleUploadSuccess () {
        this.$emit('input', this.picUrl)
      },
      // 限制图片上传大小
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 20
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg'
        if (!isJPG) {
          this.$message.error(this.$t("common.file.picFormat"))
        }
        if (!isLt2M) {
          this.$message.error(this.$t("common.file.maxSize"))
        }
        return isLt2M && isJPG
      }
    }
  }
</script>

<style lang="scss">
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .pic {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .pic-uploader-component .el-upload:hover {
    border-color: #409EFF;
  }

</style>
