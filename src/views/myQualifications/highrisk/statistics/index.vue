<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-row>
      <el-col :span="20">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="130px"
        >
          <el-form-item label="医生工号：" label-width="88px" prop="doctorId">
            <el-input
              v-model="queryParams.doctorId"
              placeholder="请输入医生工号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="科室：" label-width="68px" prop="deptId">
            <el-select
              v-model="queryParams.deptId"
              placeholder="全部科室"
              filterable
              clearable
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
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
      </el-col>
      <el-col :span="4">
        <div class="btn-group">
          <el-button type="primary" size="small" @click="exportData">
            <i class="el-icon-download"></i> 导出
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 统计表格 -->
    <el-table
      show-header
      v-loading="loading"
      :data="statisticsList"
      @selection-change="handleSelectionChange"
      border
      stripe
    >
      <el-table-column
        label="科室"
        align="center"
        prop="deptName"
        width="150"
      />
      <el-table-column
        label="姓名"
        align="center"
        prop="applicantName"
        width="120"
      />
      <el-table-column
        label="职称"
        align="center"
        prop="techQualifyCode"
        width="120"
      />
      <el-table-column
        label="申请高风险诊疗技术项目数量"
        align="center"
        prop="count"
        width="200"
      />
      <el-table-column
        label="已完成总例数"
        align="center"
        prop="totalNum"
        width="150"
      >
        <template slot-scope="scope">
          <span :class="getCompletedCasesClass(scope.row.totalNum)">
            {{ scope.row.totalNum }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近一次申请时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewDetails(scope.row)"
            >详情</el-button
          >
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

    <!-- 详情对话框 -->
    <el-dialog
      :visible.sync="detailDialogVisible"
      :fullscreen="true"
      :before-close="handleDetailClose"
    >
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">统计详情</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button type="danger" size="small" v-print="'#printContent'">
              <i class="el-icon-printer"></i> 打印
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 右上角关闭图标 -->
      <el-button
        type="text"
        @click="detailDialogVisible = false"
        class="close-icon"
      >
        <i class="el-icon-close"></i>
      </el-button>

      <div class="information-part" id="printContent" v-if="selectedRecord">
        <div class="title">
          <el-row>
            <el-col :span="24">
              <div class="information-part-title">
                <div class="line"></div>
                <div class="title">申请人信息</div>
              </div>
              <div class="bgw">
                <table class="info-table">
                  <tr>
                    <td class="table-title">科室</td>
                    <td class="table-value">
                      {{
                        (getPersonInfo() && getPersonInfo().deptName) ||
                          selectedRecord.deptName
                      }}
                    </td>
                    <td class="table-title">姓名</td>
                    <td class="table-value">
                      {{
                        (getPersonInfo() && getPersonInfo().name) ||
                          selectedRecord.doctorName
                      }}
                    </td>
                    <td class="table-title">职称</td>
                    <td class="table-value">
                      {{
                        (getPersonInfo() && getPersonInfo().techQualifyCode) ||
                          selectedRecord.title
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="table-title">年龄</td>
                    <td class="table-value">
                      {{
                        calculateAge(
                          getPersonInfo() && getPersonInfo().birthDate
                        ) || selectedRecord.age
                      }}
                    </td>
                    <td class="table-title">性别</td>
                    <td class="table-value">
                      {{
                        getPersonInfo() && getPersonInfo().sex == "1"
                          ? "男"
                          : "女"
                      }}
                    </td>
                    <td class="table-title">聘任年月</td>
                    <td class="table-value">
                      {{
                        formatDate(getPersonInfo() && getPersonInfo().entryDate)
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="table-title">申请高风险诊疗技术项目数量</td>
                    <td class="table-value">
                      {{
                        (getPersonInfo() && getPersonInfo().count) ||
                          getProjectList().length
                      }}
                    </td>
                    <td class="table-title">已完成总例数</td>
                    <td class="table-value">{{ getTotalCompletedCases() }}</td>
                    <td class="table-title"></td>
                    <td class="table-value"></td>
                  </tr>
                </table>
              </div>

              <div class="information-part-title">
                <div class="line"></div>
                <div class="title">申请高风险诊疗技术项目明细</div>
              </div>
              <div class="bgw">
                <table class="operation-history-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>申请高风险诊疗技术项目名称</th>
                      <th>已完成例数</th>
                      <th>申请日期</th>
                      <th>审批通过日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(project, index) in getProjectList()"
                      :key="project.id"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <div class="input-like">{{ project.applyName }}</div>
                      </td>
                      <td>
                        <div class="input-like">
                          {{ project.applyNum || 0 }}
                        </div>
                      </td>
                      <td>
                        <div class="input-like">
                          {{ formatDateTime(project.applyTime) }}
                        </div>
                      </td>
                      <td>
                        <div class="input-like">
                          {{ getApprovalDate(project.id) }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="information-part-title">
                <div class="line"></div>
                <div class="title">审批记录</div>
              </div>
              <div class="bgw">
                <div
                  class="approval-record-item"
                  v-for="(approvalList, index) in getApprovalOpList()"
                  :key="index"
                >
                  <div class="record-title">
                    申请高风险诊疗技术项目名称：
                    {{
                      getProjectNameByApplyId(
                        approvalList[0] && approvalList[0].applyId
                      )
                    }}
                  </div>
                  <div class="record-subtitle">审批流程：</div>
                  <div
                    class="approval-process"
                    :style="{ '--step-count': approvalList.length }"
                  >
                    <div
                      class="process-step"
                      v-for="(step, stepIndex) in approvalList"
                      :key="step.id"
                    >
                      <div class="step-header">
                        <div class="step-number">{{ stepIndex + 1 }}</div>
                      </div>
                      <div class="step-info">
                        <p>
                          <strong>{{ step.currentNode }}：</strong
                          >{{ step.reviewer }}
                        </p>
                        <p>
                          <strong>审批时间：</strong
                          >{{ formatDateTime(step.createTime) }}
                        </p>
                        <p><strong>审批结果：</strong>{{ step.status }}</p>
                        <p>
                          <strong>审核意见：</strong>{{ step.comment || "无" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  exportStatisticsExcel,
  getStatisticsDetail,
  getStatisticsList
} from "@/api/highrisk";
import { deptList } from "@/api/operQualify";
import Pagination from "@/components/Pagination";
import { download } from "@/plugins/download";
import { parseTime } from "@/utils/index";

/**
 * 高风险诊疗技术统计页面组件
 * @description 用于展示和统计高风险诊疗技术申请情况
 */
export default {
  name: "HighriskStatistics",
  components: {
    Pagination
  },
  data() {
    return {
      // 加载状态
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 统计数据列表
      statisticsList: [],
      // 科室列表
      departmentList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        doctorId: "",
        deptId: ""
      },
      // 详情对话框显示状态
      detailDialogVisible: false,
      // 选中的记录
      selectedRecord: null,
      // 状态映射
      statusMap: {
        0: "申请中",
        1: "已通过",
        2: "已拒绝",
        3: "已撤回",
        4: "科室已回退",
        5: "医务处已回退",
        6: "已授权",
        7: "撤销授权"
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    /**
     * 初始化数据
     */
    async initData() {
      try {
        await this.getDepartmentList();
        await this.getList();
      } catch (error) {
        console.error("初始化数据失败:", error);
        this.$message.error("初始化数据失败");
      }
    },

    /**
     * 获取科室列表
     */
    async getDepartmentList() {
      try {
        const response = await deptList();
        this.departmentList = response.body || [];
      } catch (error) {
        console.error("获取科室列表失败:", error);
        this.$message.error("获取科室列表失败");
      }
    },

    /**
     * 获取统计数据列表
     */
    async getList() {
      this.loading = true;
      try {
        const response = await getStatisticsList({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          doctorId: this.queryParams.doctorId,
          deptId: this.queryParams.deptId
        });
        console.log(response);
        if (response) {
          // 处理分页数据结构
          if (response.records) {
            this.statisticsList = response.records;
            this.total = parseInt(response.total) || 0;
          } else {
            // 兼容直接返回数组的情况
            this.statisticsList = Array.isArray(response) ? response : [];
            this.total = this.statisticsList.length;
          }
        }
      } catch (error) {
        console.error("获取统计数据失败:", error);
        this.$message.error("获取统计数据失败");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 生成模拟数据
     * @returns {Object} 包含列表和总数的对象
     */
    generateMockData() {
      const mockList = [
        {
          deptName: "内科",
          createTime: 1719742800000,
          totalNum: "15",
          techQualifyCode: "住院医师",
          count: "1",
          ids: "1",
          applicantName: "张三",
          userId: "3000"
        },
        {
          deptName: "内科",
          createTime: 1719724800000,
          totalNum: "8",
          techQualifyCode: "主治医师",
          count: "1",
          ids: "2",
          applicantName: "李四",
          userId: "1500"
        },
        {
          deptName: "内科",
          createTime: 1719724800000,
          totalNum: "22",
          techQualifyCode: "主治医师",
          count: "1",
          ids: "3",
          applicantName: "王五",
          userId: "4851"
        }
      ];

      // 根据查询条件过滤数据
      let filteredList = mockList;
      if (this.queryParams.doctorId) {
        filteredList = filteredList.filter(item =>
          item.doctorId.includes(this.queryParams.doctorId)
        );
      }
      if (this.queryParams.deptId) {
        filteredList = filteredList.filter(
          item =>
            item.deptName === this.getDeptNameById(this.queryParams.deptId)
        );
      }

      // 分页处理
      const start = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const end = start + this.queryParams.pageSize;
      const paginatedList = filteredList.slice(start, end);

      return {
        list: paginatedList,
        total: filteredList.length
      };
    },

    /**
     * 根据科室ID获取科室名称
     * @param {string|number} deptId 科室ID
     * @returns {string} 科室名称
     */
    getDeptNameById(deptId) {
      const dept = this.departmentList.find(item => item.id === deptId);
      return dept ? dept.name : "";
    },

    /**
     * 搜索查询
     */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /**
     * 重置查询
     */
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        doctorId: "",
        deptId: ""
      };
      this.getList();
    },

    /**
     * 多选框选中数据
     * @param {Array} selection 选中的数据
     */
    handleSelectionChange(selection) {
      // 处理多选逻辑
      console.log("选中的数据:", selection);
    },

    /**
     * 查看详情
     * @param {Object} row 行数据
     */
    async viewDetails(row) {
      try {
        this.loading = true;
        const response = await getStatisticsDetail(row.id);

        if (response) {
          this.selectedRecord = response;
        } else {
          this.$message.error("获取详情数据失败");
          return;
        }

        this.detailDialogVisible = true;
      } catch (error) {
        console.error("获取详情数据失败:", error);
        this.$message.error("获取详情数据失败");
        return;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 关闭详情对话框
     */
    handleDetailClose() {
      this.detailDialogVisible = false;
      this.selectedRecord = null;
    },

    /**
     * 导出数据
     */
    async exportData() {
      try {
        this.loading = true;
        this.$message.info("正在导出数据，请稍候...");

        const response = await exportStatisticsExcel({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          doctorId: this.queryParams.doctorId,
          deptId: this.queryParams.deptId
        });

        if (response) {
          // 使用download插件下载文件
          const fileName = `高风险诊疗技术统计_${parseTime(
            new Date(),
            "{y}{m}{d}_{h}{i}{s}"
          )}.xlsx`;
          download.excel(response, fileName);
          this.$message.success("导出成功");
        } else {
          this.$message.error("导出失败");
        }
      } catch (error) {
        console.error("导出数据失败:", error);
        this.$message.error("导出数据失败");
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取完成例数的样式类
     * @param {number|string} cases 完成例数
     * @returns {string} CSS类名
     */
    getCompletedCasesClass(cases) {
      const caseNum = parseInt(cases) || 0;
      if (caseNum >= 15) {
        return "text-success";
      } else if (caseNum >= 10) {
        return "text-warning";
      } else {
        return "text-danger";
      }
    },

    /**
     * 获取状态标签类型
     * @param {number} status 状态值
     * @returns {string} 标签类型
     */
    getStatusType(status) {
      const typeMap = {
        0: "info",
        1: "success",
        2: "danger",
        3: "warning",
        4: "warning",
        5: "warning",
        6: "success",
        7: "danger"
      };
      return typeMap[status] || "info";
    },

    /**
     * 获取状态文本
     * @param {number} status 状态值
     * @returns {string} 状态文本
     */
    getStatusText(status) {
      return this.statusMap[status] || "未知状态";
    },

    /**
     * 格式化时间
     * @param {string} time 时间字符串
     * @returns {string} 格式化后的时间
     */
    parseTime(time) {
      return parseTime(time);
    },

    /**
     * 获取第一个审批流程步骤
     * @returns {Array} 审批步骤数组
     */
    getApprovalSteps() {
      return [
        {
          title: "申请人：张三",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "科室主任审核：李四",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "医务处审核：李力",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "医疗技术管理委员会：李力",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        }
      ];
    },

    /**
     * 获取第二个审批流程步骤
     * @returns {Array} 审批步骤数组
     */
    getSecondApprovalSteps() {
      return [
        {
          title: "申请人：张三",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "科室主任审核：李四",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "医务处审核：李力",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        },
        {
          title: "医疗技术管理委员会：李力",
          time: "2025-07-01",
          status: "通过",
          remark: ""
        }
      ];
    },

    /**
     * 获取申请人信息
     * @returns {Object} 申请人信息对象
     */
    getPersonInfo() {
      return this.selectedRecord?.personInfo || {};
    },

    /**
     * 获取项目列表
     * @returns {Array} 项目列表数组
     */
    getProjectList() {
      return this.selectedRecord?.projectList || [];
    },

    /**
     * 获取审批记录列表
     * @returns {Array} 审批记录数组
     */
    getApprovalOpList() {
      return this.selectedRecord?.approvalOpList || [];
    },

    /**
     * 根据申请ID获取项目名称
     * @param {string} applyId 申请ID
     * @returns {string} 项目名称
     */
    getProjectNameByApplyId(applyId) {
      const project = this.getProjectList().find(p => p.id === applyId);
      return project?.applyName || "未知项目";
    },

    /**
     * 计算年龄
     * @param {string} birthDate 出生日期
     * @returns {number} 年龄
     */
    calculateAge(birthDate) {
      if (!birthDate) return "";
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age;
    },

    /**
     * 格式化日期
     * @param {string} dateStr 日期字符串
     * @returns {string} 格式化后的日期
     */
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    },

    /**
     * 格式化日期时间
     * @param {string|number} dateTime 日期时间
     * @returns {string} 格式化后的日期时间
     */
    formatDateTime(dateTime) {
      if (!dateTime) return "";
      const date = new Date(typeof dateTime === "number" ? dateTime : dateTime);
      return parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
    },

    /**
     * 获取总完成例数
     * @returns {number} 总完成例数
     */
    getTotalCompletedCases() {
      const projects = this.getProjectList();
      return projects.reduce((total, project) => {
        return total + (parseInt(project.applyNum) || 0);
      }, 0);
    },

    /**
     * 根据项目ID获取审批通过日期
     * @param {string} projectId 项目ID
     * @returns {string} 审批通过日期
     */
    getApprovalDate(projectId) {
      const approvalList = this.getApprovalOpList();
      for (const approval of approvalList) {
        if (approval[0]?.applyId === projectId) {
          const passedStep = approval.find(
            step => step.status === "通过" || step.status === "已通过"
          );
          if (passedStep) {
            return this.formatDateTime(passedStep.createTime);
          }
        }
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.btn-group {
  text-align: right;
}

.btn {
  width: 180px;
  height: 46px;
  rotation: 0;
  border-radius: 5px;
  padding: 2px 2px 2px 2px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  background-color: #084990;
  -webkit-print-color-adjust: exact;
  align: center;
}

.information-part {
  padding: 0 15px;
  background-color: rgb(245, 250, 253);
  -webkit-print-color-adjust: exact;

  .information-part-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: rgb(234, 243, 249);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 10px 10px;
    margin-top: 30px;

    .line {
      width: 5px;
      height: 24px;
      background: #4171fe;
      -webkit-print-color-adjust: exact;
      border-radius: 4px;
    }

    .title {
      font-size: 22px;
      color: #333;
      font-weight: bold;
    }
  }
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}

.info-table td {
  border: 1px solid #ebeef5;
  padding: 12px 15px;
  font-size: 14px;
}

.table-title {
  background-color: #f5fafd;
  font-weight: bold;
  color: #606266;
  width: 150px;
  text-align: center;
}

.table-value {
  background-color: #fff;
  color: #606266;
}

.bgw {
  background-color: white;
}

.dialog-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .line {
    width: 5px;
    height: 36px;
    background: #4171fe;
    border-radius: 4px;
  }

  .title {
    font-size: 36px;
    color: #333;
    font-weight: bold;
  }
}

.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
}

.text-success {
  color: #67c23a;
  font-weight: 600;
}

.text-warning {
  color: #e6a23c;
  font-weight: 600;
}

.text-danger {
  color: #f56c6c;
  font-weight: 600;
}

// 审批流程样式
.approval-record-item {
  margin-bottom: 30px;
  padding: 20px;
  box-sizing: border-box;
}

.record-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.record-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}

.approval-process {
  display: grid;
  grid-template-columns: repeat(var(--step-count, 1), 1fr);
  position: relative;
  margin: 20px 0;
  padding: 20px 0;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Center text below the circle */
  flex: 1;
  position: relative;
}

.step-header {
  position: relative;
  z-index: 2;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff; /* Make sure background is not transparent */
  border: 2px solid #409eff;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.step-info {
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
  width: 100%;
  padding: 0 10px;
}

.step-info p {
  margin: 5px 0;
}

.process-step:not(:first-child)::before,
.process-step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 15px;
  height: 2px;
  background-color: #409eff;
  z-index: 1; /* Ensure line is behind the circle */
}

.process-step {
  position: relative;
}

.process-step::after {
  content: "";
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  transform: translateX(-50%);
  z-index: 1;
}

.process-step:first-child::after {
  width: 50%;
  left: 75%;
}

.process-step:last-child::after {
  width: 50%;
  left: 25%;
}

.operation-history-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.operation-history-table th,
.operation-history-table td {
  border: 1px solid #ebeef5;
  padding: 12px 15px;
  text-align: center;
  font-size: 14px;
}

.operation-history-table th {
  background-color: #f5fafd;
  font-weight: bold;
  color: #606266;
}

.input-like {
  background-color: #f7f7f7;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  min-height: 36px;
  box-sizing: border-box;
}

// 表格样式优化
::v-deep .el-table {
  .el-table__header {
    th {
      background-color: #f5f7fa;
      color: #303133;
      font-weight: 600;
    }
  }

  .el-table__row {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

// 对话框样式
::v-deep .el-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}

// 关闭图标样式
.close-icon {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 20px;
  color: #909399;
  z-index: 1000;
  padding: 5px;

  &:hover {
    color: #606266;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .el-form--inline .el-form-item {
    display: block;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .approval-flow {
    padding: 10px;
  }

  .flow-step {
    padding: 10px;
  }

  .step-icon {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
}
</style>
