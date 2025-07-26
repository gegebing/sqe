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
      <el-form-item label="手术等级" prop="level">
        <el-select v-model="queryParams.level" placeholder="全部" filterable>
          <el-option
            v-for="(dict, index) in levelList"
            :key="index"
            :label="dict"
            :value="dict"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="全部" filterable>
          <el-option
            v-for="dict in stateList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人/工号" prop="applicant">
        <el-input
          v-model="queryParams.applicant"
          placeholder="请输入申请人/工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-col :span="1.5"
        ><el-button
          icon="el-icon-document-copy"
          :disabled="!batchChange"
          size="mini"
          @click="batchApproval"
          >批量审批</el-button
        ></el-col
      >
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <Table
      v-loading="loading"
      :table-list="dataList"
      :prop-list="columns"
      @handleSelectionChange="handleSelectionChange"
    ></Table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item v-if="!batch" label="申请人：">
          <span>{{ form.applicantName }}</span>
        </el-form-item>
        <el-form-item v-if="!batch" label="资质："> </el-form-item>
        <el-form-item v-if="!batch" label="">
          申请<span style="color: #333;font-weight: bold;">{{
            form.operBaseInfo.level
          }}</span
          >手术<span style="color: #333;font-weight: bold;">{{
            form.operBaseInfo.name
          }}</span
          >的独立完成权限
        </el-form-item>
        <el-form-item v-if="!batch" label="">
          申请人参与此手术<span style="color: #333;font-weight: bold;">0</span
          >次
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="form.directFlag">
            <el-radio :label="true">需要指导医师</el-radio>
            <el-radio :label="false">不需要指导医师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="audit(1)">允 许</el-button>
        <el-button type="danger" @click="audit(2)">拒 绝</el-button>
        <el-button v-if="!batch" type="primary" @click="openLog"
          >查看审核记录</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="审核记录"
      :visible.sync="dialogVisible_"
      width="80%"
      :before-close="handleClose_"
    >
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="申请人：">
          <span>{{ form.applicantName }}({{ form.applicantId }})</span>
        </el-form-item>
        <el-form-item label="申请手术：">
          <span>{{ form.operBaseInfo.name }}{{ form.operBaseInfo.code }}</span>
        </el-form-item>
        <Table
          v-loading="logLoading"
          :table-list="logCustomerList"
          :prop-list="logColumns"
        ></Table>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { operAuthPage, operBaseLevelEnum, operAuthAudit } from "@/api/operAuth";
import { auditLogList } from "@/api/system/qualificationReview";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      logLoading: false,
      dialogVisible: false,
      dialogVisible_: false,
      loading: false,
      dataList: [],
      logColumns: [
        {
          label: "审批人",
          prop: "operator",
          align: "center"
        },
        {
          label: "是否通过",
          prop: "operType",
          align: "center",
          formatter: row => {
            return row.operType == "1"
              ? "审批通过"
              : row.operType == "2"
              ? "审批不通过"
              : "";
          }
        },
        {
          label: "备注",
          prop: "description",
          align: "center"
        }
      ],
      columns: [
        {
          type: "selection",
          align: "center"
        },
        {
          label: "科室",
          prop: "deptName",
          align: "center"
        },
        {
          label: "工号",
          prop: "applicantId",
          align: "center"
        },
        {
          label: "姓名",
          prop: "applicantName",
          align: "center"
        },
        {
          label: "聘用职称",
          prop: "applicant",
          align: "center"
        },
        {
          label: "手术编码",
          prop: "code",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.code);
          }
        },
        {
          prop: "name",
          label: "手术名称",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.name);
          }
        },
        {
          prop: "level",
          label: "手术等级",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.level);
          }
        },
        {
          prop: "directFlag",
          label: "是否需要指导医师",
          align: "center",
          render(h, params) {
            if (typeof params.row.directFlag === "boolean") {
              if (params.row.directFlag) {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            } else {
              return h("span", "");
            }
          }
        },
        {
          label: "状态",
          prop: "state",
          align: "center",
          render(h, params) {
            const stateList = [
              {
                id: "0",
                name: "待审批"
              },
              {
                id: "1",
                name: "审批通过"
              },
              {
                id: "2",
                name: "审批不通过"
              },
              {
                id: "3",
                name: "被取消"
              },
              {
                id: "4",
                name: "待审核"
              },
              {
                id: "5",
                name: "可申请"
              }
            ];
            if (params.row.state) {
              return h(
                "span",
                stateList.find(item => item.id === params.row.state).name
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          label: "备注",
          prop: "remark",
          align: "center"
        },
        {
          prop: "applyTime",
          label: "申请时间",
          align: "center",
          formatter: row => {
            if (row.applyTime) {
              return parseTime(row.applyTime);
            } else {
              return "";
            }
          }
        },
        {
          prop: "lastAuditTime",
          label: "最后审批时间",
          align: "center",
          formatter: row => {
            if (row.lastAuditTime) {
              return parseTime(row.lastAuditTime);
            } else {
              return "";
            }
          }
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
                    size: "mini"
                    // icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.state == "0" ? "" : "none"
                  },
                  on: {
                    click: () => {
                      this.handleExplain(event, params.row);
                    }
                  }
                },
                "审批"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini"
                    // icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.state != "0" ? "" : "none"
                  },
                  on: {
                    click: () => {
                      this.auditRecords(event, params.row);
                    }
                  }
                },
                "审核记录"
              )
            );
            return h("div", arr);
          }
        }
      ],
      showSearch: true,
      queryParams: {
        oper: "",
        level: "",
        state: "0,1,2",
        applicant: "",
        pageNum: 1,
        pageSize: 10,
        moduleType: "oper"
      },
      total: 0,
      stateList: [
        {
          id: "0,1,2",
          name: "全部"
        },
        {
          id: "4",
          name: "待审批"
        },
        {
          id: "1",
          name: "审批通过"
        },
        {
          id: "2",
          name: "审批不通过"
        }
      ],
      levelList: [],
      form: {
        operBaseInfo: {
          code: "",
          id: "",
          level: "",
          name: "",
          tag: ""
        },
        directFlag: true,
        description: ""
      },
      logCustomerList: [],
      handleSelectionArray: [],
      batch: false
    };
  },
  computed: {
    batchChange: function() {
      if (this.handleSelectionArray.length > 0) {
        let allStatesZero = this.handleSelectionArray.every(
          item => item.state === "0"
        );
        return allStatesZero;
      } else {
        return false;
      }
    }
  },
  created() {
    this.getList();
    operBaseLevelEnum({}).then(res => {
      this.levelList = res.body;
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.handleSelectionArray = val;
    },
    batchApproval() {
      this.dialogVisible = true;
      this.batch = true;
    },
    openLog() {
      this.dialogVisible_ = true;
      this.logLoading = true;
      auditLogList({ moduleType: "oper", applyId: this.form.id })
        .then(res => {
          this.logCustomerList = res.body;
        })
        .finally(() => {
          this.logLoading = false;
        });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleClose_() {
      this.dialogVisible_ = false;
    },
    getList() {
      this.loading = true;
      operAuthPage(this.queryParams)
        .then(res => {
          this.dataList = res.body.list;
          this.total = res.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleExplain(e, row) {
      this.dialogVisible = true;
      this.batch = false;
      this.form = Object.assign(this.form, row);
    },
    auditRecords(e, row) {
      this.dialogVisible_ = true;
      this.logLoading = true;
      this.form = Object.assign(this.form, row);
      auditLogList({ moduleType: "oper", applyId: row.id })
        .then(res => {
          this.logCustomerList = res.body;
        })
        .finally(() => {
          this.logLoading = false;
        });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
    },
    audit(val) {
      let obj = {};
      if (this.batch) {
        obj.applys = [];
        this.handleSelectionArray.forEach(element => {
          obj.applys.push({
            applyId: element.id,
            operCode: element.operBaseInfo.code,
            operId: element.operBaseInfo.id,
            operName: element.operBaseInfo.name
          });
        });
        (obj.state = val), (obj.description = this.form.description);
        obj.directFlag = this.form.directFlag;
      } else {
        obj = {
          applys: [
            {
              applyId: this.form.id,
              operCode: this.form.operBaseInfo.code,
              operId: this.form.operBaseInfo.id,
              operName: this.form.operBaseInfo.name
            }
          ],
          state: val,
          description: this.form.description,
          directFlag: this.form.directFlag
        };
      }

      operAuthAudit(obj).then(res => {
        this.dialogVisible = false;
        this.getList();
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
