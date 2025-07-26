<template>
  <div class="app-container">
    <div class="app-container">
      <el-form
        v-if="showSearch"
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        label-position="left"
        label-width="60px"
      >
        <el-form-item label="包名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入包名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="科室" prop="deptId">
          <el-select
            v-model="queryParams.deptId"
            placeholder="全部科室"
            filterable
          >
            <el-option
              v-for="dict in departmentList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-add" size="mini" @click="add"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-add"
            size="mini"
            @click="importEx"
            >Excel导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-add"
            size="mini"
            @click="downloadTemplate"
            >Excel模板下载</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-add"
            size="mini"
            @click="exist"
            >Excel导出</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <Table
        v-loading="loading"
        :table-list="dataList"
        :prop-list="columns"
      ></Table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <el-dialog :title="title" :visible.sync="open" width="65%" append-to-body>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="160px"
        >
          <el-form-item label="科室:" prop="deptId">
            <el-select
              v-model="form.deptId"
              placeholder="全部科室"
              filterable
            >
              <el-option
                v-for="dict in departmentList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="手术基础包名称:">
            <el-input
              v-model="form.name"
              placeholder="请输入手术基础包名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否需要指导医生:" prop="directFlag">
            <el-radio v-model="form.directFlag" :label="true">是</el-radio>
            <el-radio v-model="form.directFlag" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item prop="operIds" label="手术基础包内权限维护:">
            <el-row>
              <el-col>
                <el-button type="primary" size="mini" @click="addOperList">新增</el-button>
              </el-col>
            </el-row>
            <Table
              :table-list="checkdataList"
              :prop-list="check_columns"
              :maxHeight="200"
            ></Table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm"
            >确 定</el-button
          >
          <el-button size="small" @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="Excel导入"
        :visible.sync="openFile"
        width="30%"
        append-to-body
      >
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
            >Excel导入</el-button
          >
        </el-upload>
      </el-dialog>
      <checkOperTable :openOper.sync="openOper" :dataList="checkdataList" @postCheckdataList="postCheckdataList"></checkOperTable>
    </div>
  </div>
</template>
<script>
import { deptList } from "@/api/operQualify/index";
import {
  operPkgAdd,
  operPkgBatchUpload,
  operPkgPage,
  upTemplateDownload,
  upTemplateImport,
  operPkgDelete,
  operPkgDetail,
  operPkgUpdate
} from "@/api/operPkg/index";
import { parseTime } from "@/utils";
import checkOperTable from './checkOperTable.vue'
export default {
    components: {
        checkOperTable
    },
  data() {
    return {
      fileList: [],
      columns: [
        {
          prop: "deptName",
          label: "部门",
          align: "center"
        },
        {
          prop: "name",
          label: "包名",
          align: "center"
        },
        {
          prop: "operCnt",
          label: "手术数量",
          align: "center"
        },
        {
          prop: "directFlag",
          label: "是否需要指导医生",
          align: "center",
          formatter: row => {
            return row.directFlag ? "是" : "否";
          }
        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "center",
          formatter: row => {
            return parseTime(row.createTime);
          }
        },
        {
          prop: "creator",
          label: "创建者",
          align: "center"
        },
        {
          prop: "updateTime",
          label: "修改时间",
          align: "center",
          formatter: row => {
            return parseTime(row.updateTime);
          }
        },
        {
          prop: "updater",
          label: "修改者",
          align: "center"
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "300",
          render: (h, params) => {
            const arr = [];
            arr.push(
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0"
                  },
                  on: {
                    click: () => {
                      this.empower(event, params.row);
                    }
                  }
                },
                "申请授权"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(event, params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-delete"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleDelete(event, params.row);
                    }
                  }
                },
                "删除"
              )
            );
            return h("div", arr);
          }
        }
      ],
      openOper: false,
      showSearch: true,
      loading: false,
      unCheckloading: false,
      checkloading: false,
      dataList: [],
      unCheckdataList: [],
      checkdataList: [],
      departmentList: [],
      queryParams: {
        name: "",
        deptId: "",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      title: "",
      open: false,
      form: {
        id: "",
        name: "",
        deptId: "",
        directFlag: true
      },
      rules: {
      },
      openFile: false,
      checkdataList: [],
      check_columns: [
        {
          type: "selection",
          align: "center"
        },
        {
          prop: "code",
          label: "手术编码",
          align: "center",
        },
        {
          prop: "name",
          label: "手术名称",
          align: "center",
        },
        {
          prop: "level",
          label: "手术等级",
          align: "center",
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "100",
          render: (h, params) => {
            const arr = [];
            arr.push(
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-delete"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleOperDelete(event, params.row);
                    }
                  }
                },
                "删除"
              )
            );
            return h("div", arr);
          }
        }
      ],
    };
  },
  created() {
    deptList().then(res => {
      this.departmentList = res.body;
    });
    this.getList();
    
  },
  methods: {
    filterMethod(query, item) {
      return item.pinyin.indexOf(query) > -1;
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.openFile = false;
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    updateLoad(file) {
      this.fileToBase64(file.file).then(res => {
        const formData = new FormData();
        // 将 base64 数据作为表单字段添加到 FormData 对象中
        formData.append("file", file.file);
        operPkgBatchUpload({"fileContent": res, "fileType": '151', "fileName":file.file.name})
          .then(data => {
            if (data.body && data.body.length >0 ) {
                let str = data.body.map(e=> {
                    return '第'+e.rowNo+'行'+e.msg
                }).join(',')
                this.$message.error(str);
            } else {
            this.$message.success("导入成功");
            this.getList();
            }
            console.log(data);
          })
          .catch(() => {});
      });
    },
    handleQuery() {
      this.getList();
    },
    empower(row) {
        
    },
    importEx() {
      this.fileList = [];
      this.openFile = true;
    },
    resetQuery() {
      this.queryParams = {
        name: "",
        deptId: ""
      };
      this.getList();
    },
    add() {
        this.form = {
        id: "",
        name: "",
        deptId: "",
        directFlag: true
      }
      this.open = true;
      this.checkdataList = [];
      console.log(this.form);
      this.title = "新增";
    },
    handleEdit(e, row) {
      this.title = "编辑";
      this.open = true;
      operPkgDetail({key: row.id}).then(res => {
        this.form = res.body;
        this.checkdataList = res.body.operList;
        console.log(this.checkdataList);
    })
    },
    getList() {
      this.loading = true;
      operPkgPage(this.queryParams).then(res => {
        this.loading = false;
        this.dataList = res.body.list;
        this.total = res.body.total;
        console.log(res.body.list);
      });
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
    exist() {
      upTemplateImport({name: this.queryParams.name, deptId: this.queryParams.deptId}).then(res => {
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        const a = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        a.href = href;
        a.download = "导出列表";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(href);
      });
    },
    edit(row) {
      this.title = "编辑";
      this.open = true;
      this.form = {
        id: row.id,
        name: row.name,
        deptId: row.deptId
      };
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
            if (this.checkdataList.length === 0) {
                this.$message.error("请选择手术");
                return;
            }
            let arr = []
            this.checkdataList.forEach(element => {
                arr.push(element.id)
            });
            let obj = {
                "deptId": this.form.deptId,
                "directFlag": this.form.directFlag,
                "id": this.form.id,
                "name": this.form.name,
                "operIds": arr,
            }
          if (this.form.id) {
            this.loading = true;
            operPkgUpdate(obj).then(res => {
              this.$message.success("修改成功");
              this.loading = false;
              this.open = false;
              this.getList();
            });
          } else {
            this.loading = true;
            operPkgAdd(obj).then(res => {
                this.$message.success("新增成功");
              this.loading = false;
              this.open = false;
              this.getList();
            })
          }
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.open = false;
    },
    handleDelete(e, row) {
      this.$confirm("确认删除该记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          operPkgDelete({ key: row.id }).then(res => {
            this.$message.success("删除成功");
            this.getList();
          });
        })
        .finally(() => {
          this.loading = false;
        });
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
    handleOperDelete(e, row) {
        // 删除当前checkdataList中数据
        this.checkdataList.forEach((item, index) => {
            if (item.id === row.id) {
                this.checkdataList.splice(index, 1);
            }
        });
        this.$message.success("删除成功");
    },
    addOperList() {
        this.openOper = true
    },
    postCheckdataList(val) {
        this.checkdataList = val
    }
  }
};
</script>
<style lang="scss" scoped></style>
