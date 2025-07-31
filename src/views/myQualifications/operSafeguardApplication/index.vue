<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form
      v-if="showSearch"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="包名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入包名"
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

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 申请列表表格 -->
    <el-table v-loading="loading" :data="applicationList" border stripe>
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
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleApplyAuth(scope.row)"
            >申请授权</el-button
          >
          <el-button size="mini" type="text" @click="handleView(scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleReApplyAuth(scope.row)"
            >重新申请授权</el-button
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

    <!-- 申请授权对话框 -->
    <el-dialog
      :visible.sync="applyAuthDialogVisible"
      :fullscreen="true"
      :before-close="handleApplyAuthClose"
    >
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">申请授权</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button
              type="danger"
              size="small"
              v-print="'#applyAuthPrintContent'"
            >
              <i class="el-icon-printer"></i> 打印
            </el-button>
            <el-button type="primary" size="small" @click="submitApplyAuth">
              <i class="el-icon-check"></i> 提交申请
            </el-button>
          </div>
        </el-col>
      </el-row>

      <div
        class="information-part"
        id="applyAuthPrintContent"
        v-if="currentApplication"
      >
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
                    <td class="table-title">姓名</td>
                    <td class="table-value">{{ currentApplication.applicantName || "-" }}</td>
                    <td class="table-title">工号</td>
                    <td class="table-value">{{ currentApplication.applicantId || "-" }}</td>
                    <td class="table-title">职称</td>
                    <td class="table-value">{{ currentApplication.title || "-" }}</td>
                    <td class="table-title">申请日期</td>
                    <td class="table-value">{{ parseTime(currentApplication.createTime) || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="table-title">科室</td>
                    <td class="table-value">
                      {{ currentApplication.deptName || "-" }}
                    </td>
                    <td class="table-title">申请编号</td>
                    <td class="table-value">
                      {{ currentApplication.id || "-" }}
                    </td>
                    <td class="table-title"></td>
                    <td class="table-value"></td>
                    <td class="table-title"></td>
                    <td class="table-value"></td>
                  </tr>
                </table>
              </div>

              <div class="information-part-title">
                <div class="line"></div>
                <div class="title">申请内容</div>
              </div>
              <div class="bgw">
                <table class="info-table" style="margin-bottom: 20px;">
                  <tr>
                    <td class="table-title">手术基础包名称</td>
                    <td class="table-value">
                      {{ currentApplication.name || "-" }}
                    </td>
                    <td class="table-title">是否需要指导医生</td>
                    <td class="table-value">
                      {{ currentApplication.directFlag ? "是" : "否" }}
                    </td>
                    <td class="table-title">手术数量</td>
                    <td class="table-value">
                      {{ currentApplication.operCnt || 0 }}
                    </td>
                  </tr>
                </table>

                <div class="operation-history-table-container">
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
                        v-for="(operation,
                        index) in currentApplication.operList || []"
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
                <div class="title">备注</div>
              </div>
              <div class="bgw">
                <el-input
                  v-model="applyAuthForm.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入备注信息"
                  maxlength="500"
                  show-word-limit
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      title="手术基础包详情"
      :visible.sync="detailDialogVisible"
      width="60%"
      append-to-body
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="包名">{{
          currentApplication.packageName
        }}</el-descriptions-item>
        <el-descriptions-item label="手术数量">{{
          currentApplication.operationCount
        }}</el-descriptions-item>
        <el-descriptions-item label="是否需要指导医生">{{
          currentApplication.needGuide ? "是" : "否"
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{
          currentApplication.status
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { operPkgPageApply, operPkgApply } from "@/api/operPkg/index";
import { employeeDetail } from "@/api/system/qualificationReview";
import Pagination from "@/components/Pagination";
import RightToolbar from "@/components/RightToolbar";
import { parseTime } from "@/utils";
import { getUserInfo } from "@/utils/persistence";

/**
 * 手术基础包申请列表组件
 * @description 用于管理手术基础包的申请、审核等功能
 */
export default {
  name: "OperSafeguardApplicationList",
  components: {
    Pagination,
    RightToolbar
  },
  data() {
    return {
      // 加载状态
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 申请列表数据
      applicationList: [],
      // 科室列表
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        status: ""
      },
      // 对话框显示状态
      detailDialogVisible: false,
      applyAuthDialogVisible: false,
      // 当前查看的申请
      currentApplication: {},
      // 申请授权表单
      applyAuthForm: {
        remark: "",
        operIds: []
      },
      // 选中的手术操作
      selectedOperations: [],
      // 当前用户信息
      currentUserInfo: {},
      // 用户详细信息
      userDetail: {}
    };
  },
  created() {
    this.getList();
    this.getCurrentUserDetail();
  },
  methods: {
    /**
     * 初始化数据
     */
    async initData() {
      try {
        await this.getDepartmentList();
        await this.getPackageList();
        await this.getList();
      } catch (error) {
        console.error("初始化数据失败:", error);
        this.$message.error("初始化数据失败");
      }
    },

    /**
     * 获取申请列表
     */
    getList() {
      this.loading = true;
      operPkgPageApply(this.queryParams)
        .then(res => {
          console.log(res);
          this.applicationList = res.body.list || [];
          this.total = res.body.total || 0;
          this.loading = false;
        })
        .catch(error => {
          console.error("获取列表数据失败:", error);
          this.$message.error("获取列表数据失败");
          this.loading = false;
        });
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
        name: "",
        status: ""
      };
      this.getList();
    },

    /**
     * 获取当前用户详细信息
     */
    async getCurrentUserDetail() {
      try {
        this.currentUserInfo = getUserInfo();
        if (this.currentUserInfo.acc) {
          const res = await employeeDetail({ key: this.currentUserInfo.acc });
          this.userDetail = res.body || {};
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },

    /**
     * 申请授权
     * @param {Object} row 行数据
     */
    handleApplyAuth(row) {
      // 合并行数据和用户信息
      this.currentApplication = {
        ...row,
        applicantName: this.userDetail.name || this.currentUserInfo.username || "-",
        applicantId: this.userDetail.empNo || this.currentUserInfo.acc || "-",
        title: this.userDetail.techQualifyCode || "-"
      };
      this.applyAuthForm.remark = "";
      this.applyAuthForm.operIds = [];
      this.selectedOperations = [];
      // 默认选中当前包的ID
      if (row.id) {
        this.applyAuthForm.operIds = [row.id];
      }
      this.applyAuthDialogVisible = true;
    },

    /**
     * 查看详情
     * @param {Object} row 行数据
     */
    handleView(row) {
      this.currentApplication = { ...row };
      this.detailDialogVisible = true;
    },

    /**
     * 重新申请授权
     * @param {Object} row 行数据
     */
    handleReApplyAuth(row) {
      this.$message.info(`查看"${row.packageName}"的申请授权详情`);
      // 这里可以跳转到申请授权详情页面或打开详情对话框
      // this.$router.push({ path: '/auth-detail', query: { id: row.id } });
    },

    /**
     * 关闭申请授权对话框
     */
    handleApplyAuthClose() {
      this.applyAuthDialogVisible = false;
      this.currentApplication = {};
      this.applyAuthForm.remark = "";
      this.applyAuthForm.operIds = [];
      this.selectedOperations = [];
    },

    /**
     * 提交申请授权
     */
    submitApplyAuth() {
      // 验证必填项
      if (!this.applyAuthForm.remark.trim()) {
        this.$message.warning("请填写备注信息");
        return;
      }
      
      if (!this.applyAuthForm.operIds.length) {
        this.$message.warning("请选择要申请的操作");
        return;
      }

      this.$confirm("确认提交申请授权吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const submitData = {
            remark: this.applyAuthForm.remark,
            operIds: this.applyAuthForm.operIds
          };
          
          console.log("提交申请数据:", submitData);
          
          // 调用提交申请授权API
          operPkgApply(submitData)
            .then(res => {
              this.$message.success("申请授权提交成功");
              this.applyAuthDialogVisible = false;
              this.getList();
            })
            .catch(error => {
              console.error("提交申请失败:", error);
              this.$message.error("提交申请失败，请稍后重试");
            });
        })
        .catch(() => {});
    },

    /**
     * 导出数据
     */
    handleExport() {
      this.$message.info("导出功能开发中...");
    },

    /**
     * 获取状态标签类型
     * @param {string} status 状态值
     * @returns {string} 标签类型
     */
    getStatusType(status) {
      const typeMap = {
        "0": "warning",
        "1": "success",
        "2": "danger",
        "3": "info"
      };
      return typeMap[status] || "info";
    },

    /**
     * 获取状态文本
     * @param {string} status 状态值
     * @returns {string} 状态文本
     */
    getStatusText(status) {
      const textMap = {
        "0": "待审核",
        "1": "已通过",
        "2": "已拒绝",
        "3": "已撤回"
      };
      return textMap[status] || "未知状态";
    },

    /**
     * 格式化时间
     * @param {string|number} time 时间
     * @returns {string} 格式化后的时间
     */
    parseTime(time) {
      return parseTime(time, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.mb8 {
  margin-bottom: 8px;
}

.dialog-footer {
  text-align: right;
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

// 状态标签样式
.el-tag {
  font-weight: 500;
}

// 操作按钮样式
.el-button--text {
  padding: 0;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}

// 申请授权对话框样式
.dialog-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .line {
    width: 4px;
    height: 20px;
    background-color: #409eff;
    margin-right: 10px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: #909399;
  z-index: 1000;

  &:hover {
    color: #409eff;
  }
}

.information-part {
  padding: 20px;

  .information-part-title {
    display: flex;
    align-items: center;
    margin: 20px 0 15px 0;

    .line {
      width: 3px;
      height: 16px;
      background-color: #409eff;
      margin-right: 8px;
    }

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .bgw {
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
}

// 信息表格样式
.info-table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 8px 12px;
    border: 1px solid #e4e7ed;
    font-size: 14px;

    &.table-title {
      background-color: #f5f7fa;
      font-weight: 600;
      color: #303133;
      width: 120px;
      text-align: center;
    }

    &.table-value {
      background-color: #fff;
      color: #606266;
      text-align: left;
    }
  }
}

// 操作历史表格样式
.operation-history-table-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.operation-history-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
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
  }

  tbody {
    td {
      padding: 8px;
      border: 1px solid #e4e7ed;
      text-align: center;
      color: #606266;
      font-size: 14px;
    }
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  tr:hover {
    background-color: #f5f7fa;
  }
}

.left {
  display: flex;
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

  .info-table {
    font-size: 12px;

    td {
      padding: 6px 8px;

      &.table-title {
        width: 100px;
      }
    }
  }

  .operation-history-table {
    font-size: 12px;

    th,
    td {
      padding: 6px 4px;
    }
  }
}
</style>
