<template>
  <!-- 手术权限申请-申请详情 -->
  <div class="app-container">
    <div id="printContent">
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">手术权限申请</div>
          </div>
        </el-col>
      </el-row>

      <!-- 申请人信息部分 -->
      <div class="information-part">
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
                    <el-row>
                      <el-col :span="2">
                        <div class="table table-title">姓名</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ applyForm.applicantName }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">职称</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ applyForm.techQualifyCode || '--' }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">科室</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ applyForm.deptName }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">申请时间</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">{{ getCurrentDate(applyForm.applyTime) }}</div>
                      </el-col>
                    </el-row>
                    <el-row>

                      <el-col :span="2">
                        <div class="table table-title">状态</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ getStatusText(applyForm.state) }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">最后审批时间</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">{{ getCurrentDate(applyForm.lastApprovalTime) }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">授权时间</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="table table-value">{{ getCurrentDate(applyForm.authTime) }}</div>
                      </el-col>
                    </el-row>
                  </el-row>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 申请内容部分 -->
      <div class="information-part">
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
                  <div class="title">申请内容</div>
                </div>
                <div class="bgw">
                  <el-row>
                    <el-row>
                      <el-col :span="3">
                        <div class="table table-title">手术名称</div>
                      </el-col>
                      <el-col :span="7">
                        <div class="table table-value">{{ (applyForm.operBaseInfo && applyForm.operBaseInfo.name) || '--' }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">手术等级</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ (applyForm.operBaseInfo && applyForm.operBaseInfo.level) || '--' }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">手术类型</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">{{ (applyForm.operBaseInfo && applyForm.operBaseInfo.tag) || '--' }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <div class="table table-title">是否需要指导医师</div>
                      </el-col>
                      <el-col :span="18">
                        <div class="table table-value">{{ applyForm.needSupervisor ? '是' : '否' }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="2">
                        <div class="table table-title">备注</div>
                      </el-col>
                      <el-col :span="22">
                        <div class="table table-value">{{ applyForm.remarks || '--' }}</div>
                      </el-col>
                    </el-row>
                  </el-row>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operationApplyDetail } from "@/api/operAuth";
import moment from "moment/moment";
export default {
  name: "details",
  data() {
    return {
      applyForm: {},
      operId: null
    }
  },
  created() {
    // 获取路由参数
    const id = this.$route.params.id || this.$route.query.id;
    if (id) {
      this.operId = id;
      console.log(this.operId);
      this.getDetail();
    }
  },
  methods: {
    // 获取申请详情
    getDetail() {
      if (!this.operId) {
        this.$message.error('操作ID不能为空');
        return;
      }
      console.log('获取详情，操作ID:', this.operId);
      operationApplyDetail(this.operId).then(res => {
        console.log(res)
        this.applyForm = res
        console.log('this.applyForm', this.applyForm)
      }).catch(error => {
        this.$message.error('获取详情失败');
        console.error('获取详情失败:', error);
      });
    },
    getCurrentDate(time) {
      if (!time) return '--';
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getStatusText(state) {
      const statusMap = {
        '0': '申请中',
        '1': '已通过',
        '2': '已拒绝',
        '3': '已授权'
      };
      return statusMap[state] || '未知状态';
    }
  }
}
</script>


<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.dialog-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.line {
  width: 5px;
  height: 21px;
  background-color: #084990;
  border-radius: 100px;
  margin-right: 10px;
}

.title {
  font-weight: bold;
  font-size: 20px;
}

.left {
  text-align: right;
}

.information-part {
  padding: 0 15px;
  background-color: rgb(245, 250, 253);
}

.information-part-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgb(234, 243, 249);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px 10px;
  margin-top: 20px;
}

.information-part-title .line {
  width: 5px;
  height: 21px;
  background-color: #084990;
  border-radius: 100px;
  margin-right: 10px;
}

.information-part-title .title {
  font-weight: bold;
  font-size: 16px;
}

.bgw {
  background-color: white;
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.table {
  padding: 10px;
  border: 1px solid #e4e7ed;
  text-align: center;
  min-height: 20px;
}

.table-title {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #606266;
}

.table-value {
  background-color: white;
  color: #303133;
}

.operation-history-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.operation-history-table th,
.operation-history-table td {
  border: 1px solid #e4e7ed;
  padding: 12px;
  text-align: center;
}

.operation-history-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #606266;
}

.operation-history-table td {
  background-color: white;
  color: #303133;
}

/* 表格样式优化 */
.table {
  height: 75px;
  display: flex;
  align-items: center; /* 垂直居中 */
  border: rgb(238, 238, 238) 1px solid;
  color: rgb(63, 70, 92);
  -webkit-print-color-adjust: exact;
  padding: 0 20px;
  font-weight: normal;
}

.table-title {
  background-color: rgb(245, 250, 253);
}

.table-value {
  background-color: rgb(249, 249, 249);
}

/* 医疗操作历史表格样式 */
.operation-history-table {
  width: 100%;
  border-collapse: collapse; /* 合并边框 */
  margin-top: 15px;
}

/* 表头样式 */
.operation-history-table th {
  background-color: #f5f7fa; /* 浅灰色背景 */
  color: #333; /* 深灰色文字 */
  font-weight: 500; /* 中等字体粗细 */
  padding: 12px 15px; /* 内边距 */
  border: 1px solid #e0e0e0; /* 1px边框 */
  text-align: center; /* 文字居中 */
}

/* 表格单元格样式 */
.operation-history-table td {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

/* 行悬停效果 */
.operation-history-table tr:hover td {
  background-color: #f9f9f9; /* 浅灰色悬停背景 */
}

/* 操作按钮布局 */
.operation-history-table .btn-group {
  display: flex;
  justify-content: center; /* 按钮居中排列 */
  gap: 5px; /* 按钮间距 */
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 5px;
}

/* 确保表格在打印时正确显示 */
@media print {
  .app-container {
    background-color: white !important;
  }

  .left {
    display: none;
  }

  .information-part {
    background-color: white !important;
  }

  .bgw {
    background-color: white !important;
    font-size: 13px !important;
  }

  table {
    padding: 0 !important;
  }

  header, footer, .no-print {
    display: none;
  }

  @page {
    size: auto; /* auto is the initial value */
    margin: 3mm; /* this affects the margin in the printer settings */
  }
}


</style>
