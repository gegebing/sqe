<template>
  <div class="app-container">
    <!-- 详情页面 -->
    <div>
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">医师手术级别考核详情</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button type="danger" v-print="'#printContent'">打印</el-button>
            <el-button type="primary" @click="goBack">返回</el-button>
          </div>
        </el-col>
      </el-row>

      <div style="padding: 0px 0px 10px 30px; font-size: 18px; font-weight: 900;color: #20a0ff">
        <i class="el-icon-alarm-clock"></i> 当前节点: {{ applyForm.currentNode || '考核详情' }}
        <span v-if="applyForm.state" style="margin-left: 20px; color: #67c23a;">
          <i class="el-icon-success"></i> 状态: {{ applyForm.state }}
        </span>
        <span v-if="loading" style="margin-left: 20px; color: #409eff;">
          <i class="el-icon-loading"></i> 加载中...
        </span>
      </div>

      <div id="printContent">
        <el-row>
          <el-col :span="24">
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
                          <el-col :span="4">
                            <div class="table table-title">姓名</div>
                          </el-col>
                          <el-col :span="3">
                            <div class="table table-value">{{ applyUserDetail.name }}</div>
                          </el-col>
                          <el-col :span="2">
                            <div class="table table-title">性别</div>
                          </el-col>
                          <el-col :span="3">
                            <div class="table table-value">{{ applyUserDetail.sex == 1 ? "男" : "女" }}</div>
                          </el-col>
                          <el-col :span="2">
                            <div class="table table-title">出生日期</div>
                          </el-col>
                          <el-col :span="3">
                            <div class="table table-value">{{ applyUserDetail.birthDate }}</div>
                          </el-col>
                          <el-col :span="3">
                            <div class="table table-title">职称</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-value">{{ applyUserDetail.techQualifyCode }}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <div class="table table-title">第一学历学位</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyUserDetail.firstEdu }}</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-title">毕业学校及时间</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyUserDetail.firstEduDesc }}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <div class="table table-title">最高学历学位</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyUserDetail.eduLevel }}</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-title">毕业学校及时间</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyUserDetail.highestEduDesc }}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <div class="table table-title">专业特长</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyUserDetail.specialization }}</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-title">原开展手术级别</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyForm.oldRatingName }}</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <div class="table table-title">申请开展手术级别</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{ applyForm.ratingName }}</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-title"></div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value"></div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="4">
                            <div class="table table-title">当前级别手术开展例数</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{applyForm.currentLevelOperationCount}}</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="table table-title">作为一助完成该操作例数</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="table table-value">{{applyForm.firstAssistantOperationCount}}</div>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="information-part-title">
                        <div class="line"></div>
                        <div class="title">专业培训、进修、继续教育起止时间、内容、单位</div>
                      </div>
                      <div class="bgw">
                        <el-input
                          v-model="applyForm.refresherCourse"
                          readonly
                          type="textarea"
                          placeholder="请输入"
                          size="medium"
                          :rows="8"
                        />
                      </div>

                      <div class="information-part-title">
                        <div class="line"></div>
                        <div class="title">专业技术水平简述</div>
                      </div>
                      <div class="bgw">
                        <el-input
                          v-model="applyForm.expertise"
                          readonly
                          type="textarea"
                          placeholder="请输入"
                          size="medium"
                          :rows="8"
                        />
                      </div>
                      <div class="information-part-title">
                        <div class="line"></div>
                        <div class="title">专著、论文科研情况</div>
                      </div>
                      <div class="bgw">
                        <el-input
                          v-model="applyForm.researchPaper"
                          readonly
                          type="textarea"
                          placeholder="请输入"
                          size="medium"
                          :rows="8"
                        />
                      </div>
                    </el-form>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 审批记录 -->
      <!--    <el-card class="box-card" style="margin-top: 20px;">-->
      <!--      <div slot="header" class="clearfix">-->
      <!--        <span>审批记录</span>-->
      <!--      </div>-->
      <!--      <el-table-->
      <!--        v-loading="logLoading"-->
      <!--        :data="resAuitList"-->
      <!--        style="width: 100%"-->
      <!--        border-->
      <!--      >-->
      <!--        <el-table-column-->
      <!--          prop="operator"-->
      <!--          label="审批人"-->
      <!--          align="center"-->
      <!--          width="120"-->
      <!--        />-->
      <!--        <el-table-column-->
      <!--          prop="operType"-->
      <!--          label="审批结果"-->
      <!--          align="center"-->
      <!--          width="120"-->
      <!--        >-->
      <!--          <template slot-scope="scope">-->
      <!--            <span v-if="scope.row.operType === '1'" style="color: #67c23a;">审批通过</span>-->
      <!--            <span v-else-if="scope.row.operType === '2'" style="color: #f56c6c;">审批不通过</span>-->
      <!--            <span v-else>{{ scope.row.operType }}</span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column-->
      <!--          prop="description"-->
      <!--          label="备注"-->
      <!--          align="center"-->
      <!--          min-width="200"-->
      <!--        />-->
      <!--        <el-table-column-->
      <!--          prop="operTime"-->
      <!--          label="审批时间"-->
      <!--          align="center"-->
      <!--          width="180"-->
      <!--        >-->
      <!--          <template slot-scope="scope">-->
      <!--            {{ getCurrentDateg(scope.row.operTime) }}-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
      <!--    </el-card>-->

    </div>
  </div>
</template>

<script>
import { getApply } from "@/api/rating/apply";
import { getReviewByApplyId } from "@/api/rating/review";
import { employeeDetail, auditLogList } from "@/api/system/qualificationReview";
import { getUserInfo } from "@/utils/persistence";
import moment from "moment/moment";

export default {
  name: "detail",
  data() {
    return {
      loading: false,
      logLoading: false,
      applyId: null,
      applyForm: {},
      applyUserDetail: {},
      resAuitList: []
    };
  },
  created() {
    this.initPage();
  },
  methods: {
    // 初始化页面
    initPage() {
      const id = this.$route.params.id || this.$route.query.id;

      if (!id) {
        this.$message.error('缺少申请ID参数');
        this.goBack();
        return;
      }

      this.applyId = id;
      this.getDetails();
    },

    // 格式化时间
    getCurrentDateg(time) {
      if (!time) return '--';
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },

    // 获取详情数据
    async getDetails() {
      this.loading = true;
      try {
        // 获取申请详情
        const detailRes = await getApply(this.applyId);
        this.applyForm = detailRes.data;

        // 获取申请人详情
        await this.getEmployeeDetail(this.applyForm.applicantId);

        // 获取审批记录
        // await this.getAuditList(this.applyId);
      } catch (error) {
        console.error('获取详情失败:', error);
        if (error.response && error.response.status === 404) {
          this.$message.error('申请记录不存在');
        } else if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else {
          this.$message.error('获取详情失败，请稍后重试');
        }
        this.goBack();
      } finally {
        this.loading = false;
      }
    },

    // 获取审批记录
    async getAuditList(id) {
      this.logLoading = true;
      try {
        const auditRes = await auditLogList({
          moduleType: "rating",
          applyId: id
        });
        this.resAuitList = auditRes.body || [];
      } catch (error) {
        console.error('获取审批记录失败:', error);
        this.resAuitList = [];
      } finally {
        this.logLoading = false;
      }
    },

    // 获取员工详情
    async getEmployeeDetail(userId) {
      try {
        const res = await employeeDetail({ key: userId });
        this.applyUserDetail = res.body;
      } catch (error) {
        console.error('获取员工详情失败:', error);
        this.applyUserDetail = {};
      }
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
}

.dialog-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-title .line {
  width: 4px;
  height: 20px;
  background-color: #409eff;
  margin-right: 10px;
}

.dialog-title .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.left {
  text-align: right;
}

.information-part {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.information-part-title {
  display: flex;
  align-items: center;
  margin: 20px 0 10px 0;
}

.information-part-title .line {
  width: 3px;
  height: 16px;
  background-color: #409eff;
  margin-right: 8px;
}

.information-part-title .title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.bgw {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.table {
  padding: 8px 12px;
  border: 1px solid #ebeef5;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.table-title {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #606266;
  justify-content: center;
}

.table-value {
  background-color: white;
  color: #333;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.box-card {
  margin-top: 20px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
