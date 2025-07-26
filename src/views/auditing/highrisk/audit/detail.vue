<template>
  <!-- 高风险审核详情 -->
  <div class="app-container">
    <div id="printContent">
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">高风险诊疗技术操作资格申请表</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button type="danger" v-print="'#printContent'">打印</el-button>
            <el-button type="primary"
                       v-if="(applyForm.state === 1 || applyForm.state === 2 || applyForm.state === 3) && buttonState  === '待审核'"
                       @click="approve(applyForm)">审批
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div style="padding: 0px 0px 10px 30px; font-size: 18px; font-weight: 900;color: #20a0ff"><i
        class="el-icon-alarm-clock"></i> 当前节点: {{ applyForm.currentNode }}
      </div>

      <div class="information-part">
        <div class="title">
          <el-row>
            <el-col :span="24">
              <el-form
                ref="form"
                label-position="left"
                :model="form"
                label-width="110px"
              >
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">申请人信息</div>
                </div>
                <div class="bgw">
                  <el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">姓名</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ applyForm.name }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">性别</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ applyForm.sex == 1 ? "男" : "女" }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">年龄</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-value">{{ applyForm.age }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">申请日期</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ getCurrentDate(applyForm.applyTime) }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">任职科室</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ applyForm.deptName }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">职称</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ applyForm.techQualifyCode }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">聘任年月</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">{{ applyForm.entryDate }}</div>
                      </el-col>
                    </el-row>
                  </el-row>
                </div>
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">历史操作明细</div>
                </div>
                <div class="bgw" style="width: 98%; margin: 10px 30px 10px 30px">
                  <table class="operation-history-table">
                    <tr>
                      <th>序号</th>
                      <th>已完成高风险诊疗技术项目名称</th>
                      <th>已完成例数</th>
                    </tr>
                    <tr v-for="(item, index) in historyOperationDesList" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.applyName }}</td>
                      <td>{{ item.applyNum }}</td>
                    </tr>
                  </table>

                  <div style="margin-top: 20px; font-size: 16px; font-weight: bold;margin-bottom: 20px;">其它需要说明:
                  </div>
                  <div>
                    <el-input v-model="applyForm.qtDescribe" :disabled="true" type="textarea" maxlength="2000"
                              show-word-limit :rows="5" placeholder="请输入其它需要说明"></el-input>
                  </div>
                </div>

                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">本次申请明细</div>
                </div>
                <div class="bgw">
                  <div
                    style="display: flex; flex-direction: row;  justify-content: center;align-items: center; padding: 10px;">
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">（新增）高风险诊疗技术操作项目名称</div>
                    <div style="width: 100%;">
                      <el-input :disabled="true" v-model="applyForm.applyName" type="textarea" maxlength="2000"
                                show-word-limit :rows="5"
                                placeholder="请输入该项目高风险诊疗技术操作项目名称"></el-input>
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;align-items: center; margin: 10px;">
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">作为一助完成该操作例数（要求≥15例）</div>
                    <div style="width: 100%;">
                      <el-input :disabled="true" v-model="applyForm.applyNum" type="textarea" maxlength="2000"
                                show-word-limit :rows="5" placeholder="请输入该项目完成该操作例数"></el-input>
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;align-items: center; margin: 10px;">
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">在该操作过程中有无严重并发症或医疗纠纷
                    </div>
                    <div style="width: 100%;">
                      <el-input :disabled="true" v-model="applyForm.applyMessage" type="textarea" maxlength="2000"
                                show-word-limit :rows="5" placeholder="请输入"></el-input>
                    </div>
                  </div>
                </div>

                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">审批记录</div>
                </div>
                <div class="bgw">
                  <table class="operation-history-table">
                    <tr>
                      <th>
                        节点
                      </th>
                      <th>
                        审批人
                      </th>
                      <th>
                        操作行为
                      </th>
                      <th>
                        操作时间
                      </th>
                    </tr>
                    <tr v-for="item in resAuitList" style="font-size: 16px; font-weight: bold;">
                      <td>
                        {{ item.currentNode }}
                      </td>
                      <td>
                        {{ item.reviewer }}
                      </td>
                      <td>
                        {{ item.status }}
                        <div v-if="item.comment">{{ item.comment }}</div>
                      </td>
                      <td>
                        {{ moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
                      </td>
                    </tr>
                  </table>
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
import {
  getById,
  auitList
} from "@/api/highrisk";
import {getUserInfo} from "@/utils/persistence";
import {employeeDetail} from "@/api/system/qualificationReview";

import moment from "moment/moment";

export default {
  name: "detail",
  data() {
    return {
      // 申请详情数据
      applyForm: {},
      // 历史操作明细列表
      historyOperationDesList: [],
      // 审批记录列表
      resAuitList: [],

      // 编辑模式相关数据
      typel: false,
      userDetail: {},
      form: {},
      historyOperationList: [],
      operation: {
        applyName: null,
        applyNum: null
      },
      operationShow: false
    };
  },
  created() {
    this.initPage();
  },
  methods: {
    // 初始化页面
    initPage() {
      const id = this.$route.params.id || this.$route.query.id;
        this.getDetails(id)
    },

    // 获取用户详情
    async employeeDetailApi() {
      try {
        const res = await employeeDetail({key: getUserInfo().acc});
        this.userDetail.applyTime = this.getCurrentDate();
        this.userDetail = res.body;
      } catch (error) {
        console.error('获取用户详情失败:', error);
      }
    },

    // 格式化时间
    getCurrentDateg(time) {
      if (!time) return '--';
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },

    // 获取当前时间
    getCurrentDate() {
      return moment().format("YYYY-MM-DD HH:mm:ss");
    },

    // 获取详情数据
    async getDetails(id) {
      try {
        // 获取申请详情
        const detailRes = await getById(id);
        this.applyForm = detailRes.body;

        // 解析历史操作明细
        if (this.applyForm.operationDetailsList) {
          this.historyOperationDesList = JSON.parse(this.applyForm.operationDetailsList);
        }

        // 获取审批记录
        await this.getAuditList(id);
      } catch (error) {
        console.error('获取详情失败:', error);
        this.$message.error('获取详情失败');
      } finally {
      }
    },

    // 获取审批记录
    async getAuditList(id) {
      try {
        const auditRes = await auitList(id);
        this.resAuitList = auditRes.body || [];
      } catch (error) {
        console.error('获取审批记录失败:', error);
        this.$message.error('获取审批记录失败');
      }
    },

    // 添加历史操作明细
    addHistoryOperation() {
      this.operationShow = true;
    },

    // 删除历史操作明细
    deleteHistoryOperation(row) {
      const index = this.historyOperationList.findIndex(item => item.id === row.id);
      if (index !== -1) {
        this.historyOperationList.splice(index, 1);
      }
    },

    // 保存操作明细
    addOperation() {
      if (!this.operation.applyName || this.operation.applyName.trim() === "") {
        this.$message.error("名称不能为空");
        return;
      }

      if (!this.operation.applyNum || this.operation.applyNum.trim() === "") {
        this.$message.error("已完成例数不能为空");
        return;
      }

      this.operationShow = false;
      this.operation.id = this.historyOperationList.length + 1;
      this.historyOperationList.push({...this.operation});
      this.operation = { applyName: null, applyNum: null };
    },

    // 取消操作明细
    delOperation() {
      this.operationShow = false;
      this.operation = { applyName: null, applyNum: null };
    },

    // 提交表单
    submitForm() {
      // 确保是新建申请，清除可能存在的ID
      delete this.form.id;

      this.form.applicantId = this.userDetail.id;
      this.form.name = this.userDetail.name;
      this.form.sex = this.userDetail.sex;
      this.form.age = this.userDetail.age;
      this.form.applyTime = this.getCurrentDate();
      this.form.deptId = this.userDetail.deptId;
      this.form.deptName = this.userDetail.deptName;
      this.form.techQualifyCode = this.userDetail.techQualifyCode;
      this.form.entryDate = this.userDetail.entryDate;
      this.form.operationDetailsList = JSON.stringify(this.historyOperationList);

      submitApplication(this.form).then(response => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.goBack();
      }).catch(error => {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
};
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
