<template>
  <div class="app-container">
    <h3>手术编码替换说明:</h3>
    <p>1.修改功能表:基础手术表、手术权限、手术申请资质要求、限制类手术标签。</p>
    <p>2.修改过程不可逆，点了导入后关闭网页不会停止修改。</p>
    <p>3.若Excel内容条数较多，修改时间将延长，请耐心等待。</p>
    <p>4.Excel的每一条记录，若成功被识别，将会记录一条日志记录。</p>
    <p>
      5.请使用Excel(Excel)模板文件修改后，进行导入，注意Excel(Excel)模板文件中，不能出现一些备注，空单元格，空行等一系列的内容，否则导入很可能失败。
    </p>
    <p>
      6.若有多个现有手术合并成单个手术，请点击<el-button
        type="primary"
        size="mini"
        >手术权限去重</el-button
      >用以清除重复的手术权限，清除的手术会以被取消的手术得以保留
    </p>
    <div>
      <el-button type="primary" size="mini" @click="downloadTemplate"
        >Excel模板下载</el-button
      >
    </div>
    <div style="margin-top: 10px;width: 200px;">
      <el-upload
        class="upload-demo"
        ref="upload"
        :http-request="updateLoad"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :limit="1"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="mini" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="mini"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
  </div>
</template>
<script>
import {
  upTemplateDownload,
  operBaseUpload
} from "@/api/system/surgicalCode/index";
export default {
  components: {},
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    downloadTemplate() {
      upTemplateDownload().then(res => {
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        const a = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        a.href = href;
        a.download = "模版";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(href);
      });
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    // handleFileUpload(event) {
    //         const file = event.target.files[0];
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onload = () => {
    //                 this.base64Data = reader.result;
    //             };
    //             reader.readAsDataURL(file);
    //         }
    //     },
    updateLoad(file) {
        console.log(file);
      this.fileToBase64(file.file).then(res => {
        const formData = new FormData();
        // 将 base64 数据作为表单字段添加到 FormData 对象中
        formData.append('file', file.file);
        operBaseUpload(formData)
          .then(data => {
            console.log(data);
            this.$message.success("导入成功"); 
          })
          .catch(() => {});
      });
    }
  },
  created() {}
};
</script>
