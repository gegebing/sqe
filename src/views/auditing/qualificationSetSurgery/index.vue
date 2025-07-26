<template>
  <div class="app-container">
    <el-form
      v-if="showSearch"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="手术编码/名称" prop="oper">
        <el-input
          v-model="queryParams.oper"
          placeholder="请输入手术编码/名称"
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
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column
        label="手术编码"
        align="center"
        prop="operCode"
      ></el-table-column>
      <el-table-column
        label="手术名称"
        align="center"
        prop="operName"
      ></el-table-column>
      <el-table-column
        label="手术等级"
        align="center"
        prop="operLevel"
      ></el-table-column>
      <el-table-column
        label="部门"
        align="center"
        prop="deptName"
      ></el-table-column>
      <el-table-column label="对参与手术的次数要求" align="center">
        <el-table-column
          label="医师"
          align="center"
          prop="doctorCnt"
          :formatter="formatNumber"
        ></el-table-column>
        <el-table-column
          label="主治医师"
          align="center"
          prop="chiefCnt"
          :formatter="formatNumber"
        ></el-table-column>
        <el-table-column
          label="副主任医师"
          align="center"
          prop="deputyCnt"
          :formatter="formatNumber"
        ></el-table-column>
        <el-table-column
          label="主任医师"
          align="center"
          prop="attendCnt"
          :formatter="formatNumber"
        ></el-table-column>
      </el-table-column>
      <el-table-column
        label="创建者"
        align="center"
        prop="creator"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column
        label="修改者"
        align="center"
        prop="updater"
      ></el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="updateTime"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="auto"
      >
        <el-form-item label="手术编码" prop="operId">
          <el-select v-model="form.operId" placeholder="请选择手术编码">
            <el-option
              v-for="(item, index) in operOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="deptId">
          <el-select v-model="form.deptId" placeholder="全部科室">
            <el-option
              v-for="(item, index) in departmentList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="医师参与次数要求(若该职称的医生不可申请该手术权限，请直接填写“不可申请””)"
          prop="doctorCnt"
        >
          <el-switch
            v-model="doctorFlag"
            active-text="可申请"
            inactive-text="不可申请"
          >
          </el-switch>
          <el-input-number
            :disabled="!doctorFlag"
            v-model="form.doctorCnt"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="主治医师参与次数要求(若该职称的医生不可申请该手术权限，请直接填写“不可申请””)"
          prop="chiefCnt"
        >
          <el-switch
            v-model="chiefFlag"
            active-text="可申请"
            inactive-text="不可申请"
          >
          </el-switch>
          <el-input-number
            :disabled="!chiefFlag"
            v-model="form.chiefCnt"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="副主任医师参与次数要求(若该职称的医生不可申请该手术权限，请直接填写“不可申请””)"
          prop="deputyCnt"
        >
          <el-switch
            v-model="deputyFlag"
            active-text="可申请"
            inactive-text="不可申请"
          >
          </el-switch>
          <el-input-number
            :disabled="!deputyFlag"
            v-model="form.deputyCnt"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="主任医师参与次数要求(若该职称的医生不可申请该手术权限，请直接填写“不可申请””)"
          prop="attendCnt"
        >
          <el-switch
            v-model="attendFlag"
            active-text="可申请"
            inactive-text="不可申请"
          >
          </el-switch>
          <el-input-number
            :disabled="!attendFlag"
            v-model="form.attendCnt"
            :min="0"
          ></el-input-number>
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
  </div>
</template>
<script>
import {
  operQualifyAdd,
  operQualifyDelete,
  operQualifyPage,
  operQualifyUpdate,
  deptList,
  operBaseList,
  upTemplateDownload,
  operQualifyExport,
  operQualifyImport
} from "../../../api/operQualify/index.js";
import { childListType } from "@/api/system/dict/index";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
        fileList: [],
        openFile: false,
      open: false,
      title: "",
      loading: false,
      rules: {},
      operOptions: [],
      showSearch: true,
      form: {
        id: undefined,
        deptId: undefined,
        operId: undefined,
        doctorCnt: undefined,
        chiefCnt: undefined,
        deputyCnt: undefined,
        attendCnt: undefined
      },
      doctorFlag: false,
      chiefFlag: false,
      deputyFlag: false,
      attendFlag: false,
      queryParams: {
        oper: "",
        deptId: "",
        pageNum: 1,
        pageSize: 10
      },
      departmentList: [],
      total: 0,
      loading: false,
      tableData: [],
      columns: [
        {
          type: "index",
          align: "center"
        },
        {
          prop: "code",
          label: "证书编号",
          align: "center"
        },
        {
          prop: "name",
          label: "证书名称",
          align: "center"
        },
        {
          prop: "state",
          label: "状态",
          align: "center",
          formatter: (row, column, value) => {
            return row.state === "1" ? "生效" : "禁用";
          }
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "150",
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
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleEdit(event, params.row);
                    }
                  }
                },
                "编辑"
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
      ]
    };
  },
  created() {
    this.getList();
    childListType({ parentId: 2 }).then(res => {
      this.options = res.body;
    });
    deptList().then(res => {
      this.departmentList = res.body;
    });
    operBaseList({}).then(res => {
      this.operOptions = res.body;
    });
  },
  methods: {
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
        formData.append("fileContent", file.file);
        formData.append("fileName", file.file.name);
        formData.append("fileType", 'xlsx');
        operQualifyImport({"fileContent": res, "fileType": '151', "fileName":file.file.name})
        // operQualifyImport(formData)
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
    exist() {
        operQualifyExport({oper: this.queryParams.oper, deptId: this.queryParams.deptId}).then(res => {
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
    formatNumber(row, column, cellValue, index) {
        if (cellValue >= 0) {
            return cellValue
        } else {
            return '不可申请'
        }
    },
    formatDate(row, column, cellValue, index) {
      return parseTime(cellValue);
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
    },
    handleDelete(event, row) {
      this.$confirm("是否确认删除该证书目录的数据项?", "操作确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        operQualifyDelete({ key: parseInt(row.id) }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
          this.open = false;
        });
      });
    },
    importEx() {
      this.fileList = [];
      this.openFile = true;
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
    handleEdit(event, row) {
      this.form = {
        id: row.id,
        deptId: row.deptId,
        operId: row.operId,
        doctorCnt: row.doctorCnt,
        chiefCnt: row.chiefCnt,
        deputyCnt: row.deputyCnt,
        attendCnt: row.attendCnt
      };
      if (this.form.doctorCnt >= 0) {
        this.doctorFlag = true;
      } else {
        this.doctorFlag = false;
      }
      if (this.form.chiefCnt >= 0) {
        this.chiefFlag = true;
      } else {
        this.chiefFlag = false;
      }
      if (this.form.deputyCnt >= 0) {
        this.deputyFlag = true;
      } else {
        this.deputyFlag = false;
      }
      if (this.form.attendCnt >= 0) {
        this.attendFlag = true;
      } else {
        this.attendFlag = false;
      }
      this.title = "编辑";
      this.open = true;
    },
    add() {
      this.title = "添加";
      this.open = true;
      this.form = {
        id: undefined,
        deptId: undefined,
        operCode: undefined,
        doctorCnt: undefined,
        chiefCnt: undefined,
        deputyCnt: undefined,
        attendCnt: undefined
      };
      this.doctorFlag = false;
      this.chiefFlag = false;
      this.deputyFlag = false;
      this.attendFlag = false;
    },
    getList() {
      this.loading = true;
      this.tableData = [];
      operQualifyPage(this.queryParams)
        .then(res => {
          this.tableData = res.body.list;
          this.total = res.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submitForm() {
        console.log(this.doctorFlag);
      if (!this.doctorFlag) {
        this.form.doctorCnt = null;
      } else if (this.doctorFlag && typeof(this.form.doctorCnt) != 'number' ) {
        this.$message({
          message: "请输入医师参与次数要求",
          type: "warning"
        });
        return;
      }
      if (!this.chiefFlag) {
        this.form.chiefCnt = null;
      }else if (this.chiefFlag && typeof(this.form.chiefCnt) != 'number') {
        this.$message({
          message: "请输入主治医师参与次数要求",
          type: "warning"
        });
        return;
      }
      if (!this.deputyFlag) {
        this.form.deputyCnt = null;
      }else if (this.deputyFlag && typeof(this.form.deputyCnt) != 'number') {
        this.$message({
          message: "请输入副主任医师参与次数要求",
          type: "warning"
        });
        return;
      }
      if (!this.attendFlag) {
        this.form.attendCnt = null;
      }else if (this.attendFlag && typeof(this.form.attendCnt) != 'number') {
        this.$message({
          message: "请输入主任医师参与次数要求",
          type: "warning"
        });
        return;
      }
      let obj = Object.assign({}, this.form);
      if (this.form.id) {
        operQualifyUpdate(obj).then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getList();
          this.open = false;
        });
      } else {
        operQualifyAdd(obj).then(res => {
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.getList();
          this.open = false;
        });
      }
    },
    cancel() {
      this.open = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
