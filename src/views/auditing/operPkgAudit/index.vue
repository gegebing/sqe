<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="" prop="state">
            <el-button-group>
              <el-button :type="buttonState.all" @click="setState(-1)"
                >全部</el-button
              >
              <el-button :type="buttonState.wait" @click="setState(0)"
                >待审批</el-button
              >
              <el-button :type="buttonState.pass" @click="setState(1)"
                >已通过</el-button
              >
              <el-button :type="buttonState.nopass" @click="setState(2)"
                >未通过</el-button
              >
            </el-button-group>
          </el-form-item>
          <el-form-item label="手术包名称" prop="operPkgName">
            <el-input
              v-model="queryParams.operPkgName"
              placeholder="请输入手术包名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="全部状态"
              clearable
            >
              <el-option label="未授权" value="未授权"></el-option>
              <el-option label="科室待审批" value="科室待审批"></el-option>
              <el-option label="医务处待审批" value="医务处待审批"></el-option>
              <el-option label="已通过" value="已通过"></el-option>
              <el-option label="不通过" value="不通过"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间" prop="applyTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="queryTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
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
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="auditList"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="包名"
        align="center"
        prop="name"
        min-width="200"
      />
      <el-table-column
        label="手术数量"
        align="center"
        prop="operCnt"
        width="120"
      />
      <el-table-column
        label="是否需要指导医生"
        align="center"
        prop="directFlag"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.directFlag ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="statusTxt" width="120">
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="approve(scope.row)"
            v-if="scope.row.state === '1' || scope.row.state === '2'"
          >
            审批
          </el-button>
          <el-button size="mini" type="text" @click="getApplyDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 申请详情弹框 -->
    <el-dialog
      :visible.sync="showApplyDetail"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <div id="printContent">
        <el-row>
          <el-col :span="21">
            <div class="dialog-title">
              <div class="line"></div>
              <div class="title">手术基础包审核授权</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="left">
              <el-button
                type="danger"
                size="small"
                v-print="'#applyDetailPrintContent'"
              >
                <i class="el-icon-printer"></i> 打印
              </el-button>
              <el-button type="primary" size="small" @click="submitApprove">
                <i class="el-icon-check"></i> 审批
              </el-button>
            </div>
          </el-col>
        </el-row>

        <div class="information-part" id="applyDetailPrintContent">
          <div class="title">
            <el-row>
              <el-col :span="24">
                <el-form
                  ref="form"
                  label-position="left"
                  :model="applyForm"
                  label-width="110px"
                >
                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">申请人信息</div>
                  </div>
                  <div class="bgw">
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">姓名</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{ applyUserDetail.name }}
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">工号</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{ applyUserDetail.accNo }}
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">职称</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{ applyUserDetail.techQualifyCode }}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">科室</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">
                          {{ applyUserDetail.deptName }}
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">申请时间</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">
                          {{ parseTime(applyForm.applyTime) }}
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">申请手术包信息</div>
                  </div>
                  <div class="bgw">
                    <table class="info-table" style="margin-bottom: 20px;">
                      <tr>
                        <td class="table-title">手术包名称</td>
                        <td class="table-value">{{ applyForm.name || "-" }}</td>
                        <td class="table-title">是否需要指导医生</td>
                        <td class="table-value">
                          {{ applyForm.directFlag ? "是" : "否" }}
                        </td>
                        <td class="table-title">手术数量</td>
                        <td class="table-value">
                          {{ applyForm.operCnt || 0 }}
                        </td>
                      </tr>
                    </table>

                    <div
                      class="operation-history-table-container"
                      v-if="applyForm.operList && applyForm.operList.length > 0"
                    >
                      <table class="operation-history-table">
                        <thead>
                          <tr>
                            <th>手术编码</th>
                            <th>手术名称</th>
                            <th>手术等级</th>
                            <th>手术类型</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(operation, index) in applyForm.operList"
                            :key="index"
                          >
                            <td>{{ operation.code || "-" }}</td>
                            <td>{{ operation.name || "-" }}</td>
                            <td>{{ operation.level || "-" }}</td>
                            <td>{{ operation.tag || "-" }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">申请说明</div>
                  </div>
                  <div class="bgw">
                    <el-input
                      v-model="applyForm.remark"
                      readonly
                      type="textarea"
                      placeholder="无"
                      size="medium"
                      :rows="6"
                    />
                  </div>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 审批弹框 -->
    <el-dialog
      :visible.sync="showApprove"
      :before-close="handleClose"
      title="审批"
    >
      <div class="approve-box">
        <el-form ref="approveForm">
          <el-form-item label="审批操作:">
            <el-radio-group v-model="approveForm.state">
              <el-radio :label="5">批准</el-radio>
              <el-radio :label="4">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见:">
            <el-input
              v-model="approveForm.description"
              type="textarea"
              placeholder="请输入审批意见"
              :rows="4"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeApprove">取 消</el-button>
        <el-button type="primary" @click="submitApproveAction">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审批历史弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="审批历史"
      width="80%"
      :before-close="handleClose"
    >
      <div style="width: 100%; text-align: right">
        <el-button type="danger" v-print="'#printContentHistory'"
          >打印</el-button
        >
      </div>

      <div id="printContentHistory" style="margin-left: 20px;">
        <p>
          申请人：<span
            >{{ applyHistoryForm.applicant }}({{
              applyHistoryForm.applicantId
            }})</span
          >
        </p>
        <p>
          申请手术包：<span>{{ applyHistoryForm.operPkgName }}</span>
        </p>
        <Table
          v-loading="logLoading"
          :table-list="logCustomerList"
          :prop-list="logColumns"
          class="printtablew"
        ></Table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOperPkgApplyDetail,
  operPkgApprove,
  operPkgAuthEmployee,
  operPkgPageAudit
} from "@/api/operPkg/index";
import { auditLogList, employeeDetail } from "@/api/system/qualificationReview";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { parseTime } from "@/utils";
import { getUserInfo } from "@/utils/persistence";
import { Loading } from "element-ui";

export default {
  name: "OperPkgAudit",
  components: {
    Pagination,
    Table
  },
  data() {
    return {
      buttonState: {
        all: "default",
        wait: "default",
        pass: "default",
        nopass: "default"
      },
      logLoading: false,
      logCustomerList: [],
      logColumns: [
        {
          label: "审批人",
          prop: "operator",
          align: "center"
        },
        {
          label: "操作",
          prop: "operType",
          align: "center",
          formatter: row => {
            return row.operType == "5" || row.operType == "6"
              ? "审批通过"
              : row.operType == "8" || row.operType == "4"
              ? "审批不通过"
              : row.operType == "3" || row.operType == "7"
              ? "回退"
              : row.operType == "0"
              ? "提交申请"
              : "其他操作";
          }
        },
        {
          label: "备注",
          prop: "description",
          align: "center"
        },
        {
          label: "操作时间",
          prop: "createTime",
          align: "center",
          formatter: row => {
            return parseTime(row.createTime);
          }
        }
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      dialogVisible: false,
      // 显示搜索条件
      showSearch: true,
      showApplyDetail: false,
      showApprove: false,
      // 总条数
      total: 0,
      // 审核列表数据
      auditList: [],
      // 弹出层标题
      title: "",
      nowState: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        applicantId: null,
        state: null,
        operPkgName: null,
        status: null,
        reviewerId: null
      },
      searchState: ["科室待审批", "医务处待审批"],
      queryTime: [],
      // 表单参数
      applyHistoryForm: {},
      approveForm: {
        applys: [],
        state: null,
        description: "",
        flowId: null
      },
      userInfo: getUserInfo(),
      reviewer: [],
      applyForm: {},
      applyUserDetail: {}
    };
  },
  created() {
    this.buttonState.all = "primary";
    this.searchState = []; // 默认显示全部数据
    this.getList();
  },
  methods: {
    parseTime,

    /**
     * 查看审批历史记录
     * @param {Object} row - 行数据
     */
    auditRecords(row) {
      this.dialogVisible = true;
      this.logLoading = true;
      this.applyHistoryForm = Object.assign({}, row);
      auditLogList({ moduleType: "operPkg", applyId: row.id })
        .then(res => {
          this.logCustomerList = res.body || [];
        })
        .catch(error => {
          console.error("获取审批历史失败:", error);
          this.$message.error("获取审批历史失败");
        })
        .finally(() => {
          this.logLoading = false;
        });
    },

    /**
     * 提交审批
     */
    submitApprove() {
      // 从详情弹框提交审批，直接调用审批逻辑
      this.approve(this.applyForm);
    },

    /**
     * 提交审批操作
     */
    submitApproveAction() {
      if (
        this.approveForm.state === null ||
        this.approveForm.state === undefined
      ) {
        this.$message.error("请选择审批操作");
        return;
      }

      operPkgApprove(this.approveForm)
        .then(res => {
          this.$message.success("审批成功");
          this.showApprove = false;
          this.showApplyDetail = false;
          this.getList();
        })
        .catch(error => {
          console.error("审批失败:", error);
          this.$message.error("审批失败");
        });
    },

    /**
     * 关闭审批弹框
     */
    closeApprove() {
      this.showApprove = false;
      this.approveForm = {
        applys: [],
        state: null,
        description: "",
        flowId: null
      };
    },

    /**
     * 打开审批弹框
     * @param {Object} row - 行数据
     */
    approve(row) {
      this.nowState = row.state;
      this.showApprove = true;
      this.approveForm.applys = [];
      let obj = {
        applyId: row.id,
        operPkgName: row.operPkgName,
        operPkgId: row.operPkgId
      };
      this.approveForm.applys.push(obj);
      this.getEmployeeList(row.id);
    },

    /**
     * 获取申请详情
     * @param {number} id - 申请ID
     */
    getApplyDetail(id) {
      let options = {
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      };
      let loadingInstance = Loading.service(options);

      getOperPkgApplyDetail(id)
        .then(res => {
          employeeDetail({ key: res.data.applicantId })
            .then(r => {
              this.applyForm = res.data;
              this.applyUserDetail = r.body;
              this.showApplyDetail = true;
            })
            .catch(error => {
              console.error("获取申请人详情失败:", error);
              this.$message.error("获取申请人详情失败");
            });
        })
        .catch(error => {
          console.error("获取申请详情失败:", error);
          this.$message.error("获取申请详情失败");
        })
        .finally(() => {
          loadingInstance.close();
        });
    },

    /**
     * 关闭弹框
     */
    handleClose() {
      this.showApplyDetail = false;
      this.showApprove = false;
      this.dialogVisible = false;
    },

    /**
     * 查询审核列表
     */
    getList() {
      this.queryParams.reviewerId = this.userInfo.acc;
      this.queryParams.startTime = this.queryTime[0];
      this.queryParams.endTime = this.queryTime[1];

      this.loading = true;

      // 使用审核专用接口
      const auditParams = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        name: this.queryParams.operPkgName,
        status: this.queryParams.state,
        reviewerId: this.userInfo.acc,
        startTime: this.queryParams.startTime,
        endTime: this.queryParams.endTime
      };

      // 调用审核接口
      operPkgPageAudit(auditParams)
        .then(response => {
          const data = response;
          if (Array.isArray(this.searchState) && this.searchState.length > 0) {
            this.auditList = (data.body?.list || []).filter(item =>
              this.searchState.includes(item.state)
            );
          } else {
            this.auditList = data.body?.list || [];
          }

          // 添加状态文本映射
          this.auditList = this.auditList.map(item => {
            return {
              ...item,
              statusTxt: this.getStatusText(item.state)
            };
          });
          this.total = data.body?.total || 0;
        })
        .catch(error => {
          console.error("获取审核列表失败:", error);
          this.$message.error("获取审核列表失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 设置状态筛选
     * @param {number} state - 状态值
     */
    setState(state) {
      this.queryParams.status = state + 1;
      switch (state) {
        case -1:
          this.buttonState.all = "primary";
          this.buttonState.wait = "default";
          this.buttonState.pass = "default";
          this.buttonState.nopass = "default";
          this.searchState = []; // 显示全部
          break;
        case 0:
          this.buttonState.all = "default";
          this.buttonState.wait = "primary";
          this.buttonState.pass = "default";
          this.buttonState.nopass = "default";
          this.searchState = ["1", "2"]; // 待审批状态
          break;
        case 1:
          this.buttonState.all = "default";
          this.buttonState.wait = "default";
          this.buttonState.pass = "primary";
          this.buttonState.nopass = "default";
          this.searchState = ["3"]; // 已通过状态
          break;
        case 2:
          this.buttonState.all = "default";
          this.buttonState.wait = "default";
          this.buttonState.pass = "default";
          this.buttonState.nopass = "primary";
          this.searchState = ["4", "5", "6", "7"]; // 未通过状态
          break;
        default:
          this.searchState = [];
      }
      this.getList();
    },

    /**
     * 获取状态文本
     */
    getStatusText(state) {
      const statusMap = {
        "1": "科室待审批",
        "2": "医务处待审批",
        "3": "医务处审批通过",
        "4": "科室审批未通过",
        "5": "医务处审批未通过",
        "6": "科室已回退",
        "7": "医务处已回退"
      };
      return statusMap[state] || "未知状态";
    },

    /**
     * 搜索按钮操作
     */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /**
     * 重置按钮操作
     */
    resetQuery() {
      this.queryTime = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        applicantId: null,
        state: null,
        operPkgName: null,
        reviewerId: null
      };
      this.handleQuery();
    },

    /**
     * 获取审批人员列表
     * @param {number} applyId - 申请ID
     */
    getEmployeeList(applyId) {
      operPkgAuthEmployee(applyId)
        .then(res => {
          this.reviewer = res.data || [];
        })
        .catch(error => {
          console.error("获取审批人员列表失败:", error);
          this.reviewer = [];
        });
    },

    /**
     * 多选框选中数据
     * @param {Array} selection - 选中的数据
     */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    }
  }
};
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 20px;
  padding: 20px;
}

.approve-box {
  padding: 20px;
}

.information-part {
  padding: 0 15px;
  background-color: rgb(245, 250, 253);
  -webkit-print-color-adjust: exact;
}

.information-part-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgb(234, 243, 249);
  -webkit-print-color-adjust: exact;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px 10px;
  margin-top: 30px;
}

.information-part-title .line {
  width: 5px;
  height: 24px;
  background: #4171fe;
  -webkit-print-color-adjust: exact;
  border-radius: 4px;
}

.information-part-title .title {
  font-size: 22px;
  color: #333;
  -webkit-print-color-adjust: exact;
  font-weight: bold;
  margin-left: 10px;
}

.table {
  height: 70px;
  display: flex;
  align-items: center;
  border: rgb(238, 238, 238) 1px solid;
  color: rgb(63, 70, 92);
  -webkit-print-color-adjust: exact;
  padding: 0 20px;
  font-weight: normal;
}

.table-title {
  background-color: rgb(245, 250, 253);
  -webkit-print-color-adjust: exact;
}

.table-value {
  background-color: rgb(249, 249, 249);
  -webkit-print-color-adjust: exact;
}

.bgw {
  background-color: white;
}

.dialog-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dialog-title .line {
  width: 5px;
  height: 36px;
  background: #4171fe;
  -webkit-print-color-adjust: exact;
  border-radius: 4px;
}

.dialog-title .title {
  font-size: 36px;
  color: #333;
  font-weight: bold;
  margin-left: 10px;
}

.printtablew {
  width: 680px !important;
  margin: 0 auto;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 8px 12px;
  border: 1px solid #e4e7ed;
  font-size: 14px;
}

.info-table .table-title {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
  width: 120px;
  text-align: center;
}

.info-table .table-value {
  background-color: #fff;
  color: #606266;
  text-align: left;
}

.operation-history-table-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.operation-history-table {
  width: 100%;
  border-collapse: collapse;
}

.operation-history-table thead th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 10;
}

.operation-history-table tbody td {
  padding: 8px;
  border: 1px solid #e4e7ed;
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.operation-history-table tr:nth-child(even) {
  background-color: #fafafa;
}

.operation-history-table tr:hover {
  background-color: #f5f7fa;
}

@media print {
  button {
    display: none !important;
  }

  .bgw {
    background-color: white;
    margin: 0px;
    font-size: 13px !important;
  }

  table {
    padding: 0 !important;
  }

  header,
  footer,
  .no-print {
    display: none;
  }

  @page {
    size: auto;
    margin: 3mm;
  }
}
</style>
