<template>
  <!-- 手术级别详情及申请 -->
  <div class="app-container">
    <!-- 详情页面 -->
    <div v-if="!isEdit">
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">医师手术级别申请详情</div>
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
        <i class="el-icon-alarm-clock"></i> 当前节点: {{ applyForm.currentNode || '申请详情' }}
        <span v-if="applyForm.state" style="margin-left: 20px; color: #67c23a;">
          <i class="el-icon-success"></i> 状态: {{ applyForm.state }}
        </span>
        <span v-if="loading" style="margin-left: 20px; color: #409eff;">
          <i class="el-icon-loading"></i> 加载中...
        </span>
      </div>

      <div id="printContent">
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
                  <!-- 申请人信息 -->
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
                          <div class="table table-value">{{ applyForm.applicant || userDetail.name }}</div>
                        </el-col>
                        <el-col :span="2">
                          <div class="table table-title">性别</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-value">{{ userDetail.sex == 1 ? "男" : "女" }}</div>
                        </el-col>
                        <el-col :span="2">
                          <div class="table table-title">出生日期</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-value">{{ userDetail.birthDate }}</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-title">申请日期</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-value">{{ getCurrentDateg(applyForm.applyTime) }}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">任职科室</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.deptName || userDetail.deptName }}</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-title">职称</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ userDetail.techQualifyCode }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">专业特长</div>
                        </el-col>
                        <el-col :span="5">
                          <div class="table table-value">{{ userDetail.specialization }}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">第一学历学位</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="table table-value">{{ userDetail.firstEdu }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">毕业学校及时间</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="table table-value">{{ userDetail.firstEduDesc }}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">最高学历学位</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="table table-value">{{ userDetail.eduLevel }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">毕业学校及时间</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="table table-value">{{ userDetail.highestEduDesc }}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">原开展手术级别</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.oldRatingName }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">申请开展手术级别</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.ratingName }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">考核人</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.reviewer }}</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">当前级别手术开展例数</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.currentLevelOperationCount }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">作为一助完成该操作例数</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.firstAssistantOperationCount }}</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">申请状态</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">{{ applyForm.state }}</div>
                        </el-col>
                      </el-row>
                    </el-row>
                  </div>

                  <!-- 专业培训信息 -->
                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">专业培训、进修、继续教育起止时间、内容、单位</div>
                  </div>
                  <div class="bgw">
                    <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.refresherCourse"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="专业培训、进修、继续教育起止时间、内容、单位">
                        </el-input>
                      </div>
                    </div>
                  </div>

                  <!-- 专业技术水平简述 -->
                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">专业技术水平简述</div>
                  </div>
                  <div class="bgw">
                    <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.expertise"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="专业技术水平简述">
                        </el-input>
                      </div>
                    </div>
                  </div>

                  <!-- 专著、论文科研情况 -->
                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">专著、论文科研情况</div>
                  </div>
                  <div class="bgw">
                    <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.researchPaper"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="专著、论文科研情况">
                        </el-input>
                      </div>
                    </div>
                  </div>

                  <!-- 审批流程记录 -->
                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">审批流程记录</div>
                  </div>
                  <div class="bgw">
                    <table class="operation-history-table">
                      <tr>
                        <th>审批人</th>
                        <th>操作</th>
                        <th>备注</th>
                        <th>操作时间</th>
                      </tr>
                      <tr v-for="item in resAuitList" :key="item.id" style="font-size: 16px; font-weight: bold;">
                        <td>{{ item.deptName }}-{{ item.operator }}</td>
                        <td>
                          {{ item.operType == "5" || item.operType == "6"
                            ? "审批通过"
                            : item.operType == "8" || item.operType == "4"
                              ? "审批不通过"
                              : item.operType == "3" || item.operType == "7"
                                ? "回退"
                                : item.operType == "0" ? "提交申请" : '考核录入' }}
                        </td>
                        <td>{{ item.description || '--' }}</td>
                        <td>{{ getCurrentDateg(item.createTime) }}</td>
                      </tr>
                      <tr v-if="resAuitList.length === 0">
                        <td colspan="4" style="text-align: center; color: #999;">暂无审批记录</td>
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

    <!-- 申报页面 -->
    <div v-if="isEdit">
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">医师手术级别申请（新建申请）</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button type="primary" @click="saveDraft">暂存</el-button>
            <el-button type="success" @click="submitForm">提交</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 申请状态信息 -->
      <div class="status-info" v-if="level">
        <el-row>
          <el-col :span="12">
            <div class="level_text">
              <span id="rectangle"></span>
              当前手术等级：<span style="font-size: 24px;color: #084990">{{ level.now.name }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="level_text">
              申请手术等级：<span style="font-size: 24px;color: #084990">{{ level.next.name }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="information-part" v-loading="loading">
        <div class="title">
          <el-row>
            <el-col :span="24">
              <el-form
                ref="form"
                label-position="left"
                :model="form"
                label-width="110px"
              >
                <!-- 申请人信息 -->
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
                        <div class="table table-value">{{ userDetail.name }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">性别</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ userDetail.sex == 1 ? "男" : "女" }}</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">出生日期</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ userDetail.birthDate }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">申请日期</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">{{ getCurrentDate() }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">任职科室</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ userDetail.deptName }}</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">职称</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ userDetail.techQualifyCode }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">专业特长</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">{{ userDetail.specialization }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">第一学历学位</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">{{ userDetail.firstEdu }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">毕业学校及时间</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">{{ userDetail.firstEduDesc }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">最高学历学位</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">{{ userDetail.eduLevel }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">毕业学校及时间</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value">{{ userDetail.highestEduDesc }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">原开展手术级别</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ level.now.name }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">申请开展手术级别</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">{{ level.next.name }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">考核人</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          <el-select
                            v-model="form.reviewId"
                            filterable
                            placeholder="请选择考核人"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in reviewer"
                              :key="item.accNo"
                              :value="item.accNo"
                              :label="item.accNo + '-' + item.username"
                            >
                              {{ item.accNo }}-{{ item.username }}
                            </el-option>
                          </el-select>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">当前级别手术开展例数</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          <el-input-number
                            v-model="form.currentLevelOperationCount"
                            :min="0"
                            :max="9999"
                            size="small"
                            style="width: 100%"
                          />
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">作为一助完成该操作例数</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          <el-input-number
                            v-model="form.firstAssistantOperationCount"
                            :min="0"
                            :max="9999"
                            size="small"
                            style="width: 100%"
                          />
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title"></div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value"></div>
                      </el-col>
                    </el-row>
                  </el-row>
                </div>

                <!-- 专业培训信息 -->
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">专业培训、进修、继续教育起止时间、内容、单位</div>
                </div>
                <div class="bgw">
                  <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.refresherCourse"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入专业培训、进修、继续教育起止时间、内容、单位">
                      </el-input>
                    </div>
                  </div>
                </div>

                <!-- 专业技术水平简述 -->
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">专业技术水平简述</div>
                </div>
                <div class="bgw">
                  <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.expertise"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入专业技术水平简述">
                      </el-input>
                    </div>
                  </div>
                </div>

                <!-- 专著、论文科研情况 -->
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">专著、论文科研情况</div>
                </div>
                <div class="bgw">
                  <div style="display: flex; flex-direction: row; justify-content: center;align-items: center; padding: 10px;">
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.researchPaper"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入专著、论文科研情况">
                      </el-input>
                    </div>
                  </div>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!-- 申请提示对话框 -->
    <el-dialog
      title="申请提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="warning-info">
        <i class="el-icon-warning"></i>
        <span>您不符合申请该手术级别的条件，若有疑问，请联系医务处</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import {
  listRatingLevel,
  applyLevel,
  getManage
} from "@/api/rating/manage/index";
import {
  apply,
  authApplyCheck,
  getApply
} from "@/api/rating/apply/index";
import {
  employeeDetail,
  ratingEmployee,
  auditLogList
} from "@/api/system/qualificationReview";
import { getUserInfo } from "@/utils/persistence";

export default {
  name: "details",
  data() {
    return {
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      isEdit: false, // 是否为编辑模式（申请模式）
      applyId: null, // 申请ID，用于详情模式
      level: null,
      userDetail: {},
      reviewer: [],
      check: {
        pass: false,
        reapply: false
      },
      form: {
        currentLevelOperationCount: 0,
        firstAssistantOperationCount: 0,
        refresherCourse: '',
        expertise: '',
        researchPaper: '',
        reviewId: ''
      },
      applyForm: {}, // 用于详情模式的数据
      resAuitList: [], // 审批记录列表
      rules: {
        currentLevelOperationCount: [
          { required: true, message: '请输入当前级别手术开展例数', trigger: 'blur' }
        ],
        firstAssistantOperationCount: [
          { required: true, message: '请输入作为一助完成该操作例数', trigger: 'blur' }
        ],
        refresherCourse: [
          { required: true, message: '请输入专业培训信息', trigger: 'blur' }
        ],
        expertise: [
          { required: true, message: '请输入专业技术水平简述', trigger: 'blur' }
        ],
        researchPaper: [
          { required: true, message: '请输入专著、论文科研情况', trigger: 'blur' }
        ],
        reviewId: [
          { required: true, message: '请选择考核人', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.initPage();
  },
  methods: {
    // 初始化页面
    initPage() {
      const id = this.$route.params.id || this.$route.query.id;
      const type = this.$route.params.type || this.$route.query.type;

      // 判断是否为编辑模式
      this.isEdit = type === 'edit';

      if (this.isEdit) {
        // 编辑模式：新建申请
        this.initEditMode();
      } else {
        // 详情模式：查看详情
        this.getDetails(id);
      }
    },

    // 初始化编辑模式
    async initEditMode() {
      this.loading = true;
      try {
        // 新建申请，获取用户信息和级别信息
        await this.getRatingLevel();
        await this.getEmployeeDetail();
        await this.getReviewerList();
        await this.checkApplyCondition();
      } catch (error) {
        console.error('初始化申请失败:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else {
          this.$message.error('初始化申请失败，请稍后重试');
        }
        this.goBack();
      } finally {
        this.loading = false;
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
      if (!id) {
        this.$message.error('缺少申请ID参数');
        this.goBack();
        return;
      }

      this.loading = true;
      try {
        // 获取申请详情
        const detailRes = await getApply(id);
        this.applyForm = detailRes.data;

        // 获取申请人详情
        await this.getEmployeeDetail(this.applyForm.applicantId);

        // 获取审批记录
        await this.getAuditList(id);
      } catch (error) {
        console.error('获取详情失败:', error);
        if (error.response && error.response.status === 404) {
          this.$message.error('申请记录不存在');
        } else if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else {
          this.$message.error('获取详情失败，请稍后重试');
        }
        // this.goBack();
      } finally {
        this.loading = false;
      }
    },

    // 获取审批记录
    async getAuditList(id) {
      try {
        const auditRes = await auditLogList({
          moduleType: "rating",
          applyId: id
        });
        this.resAuitList = auditRes.body || [];
      } catch (error) {
        this.loading = false;
        console.error('获取审批记录失败:', error);
        // 审批记录获取失败不影响主流程，只记录错误
        this.resAuitList = [];
      }
    },

    // 获取手术级别信息
    async getRatingLevel() {
      const userInfo = getUserInfo();
      const req = { applicantId: userInfo.acc };
      const res = await listRatingLevel(req);
      this.level = res.data;
    },

    // 获取员工详情
    async getEmployeeDetail(userId) {
      const userInfo = userId || getUserInfo();
      const res = await employeeDetail({ key: userInfo.acc || userInfo });
      this.userDetail = res.body;
    },

    // 获取考核人列表
    async getReviewerList() {
      const res = await ratingEmployee('S001');
      this.reviewer = res.data;
    },

    // 检查申请条件
    async checkApplyCondition() {
      if (this.level && this.level.next) {
        const res = await authApplyCheck({ key: this.level.next.id });
        this.check = res.data;
      }
    },

    // 提交表单
    async submitForm() {
      try {
        // 确认提交
        await this.$confirm('确认提交申请吗？提交后将无法修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 表单验证
        if (!this.form.currentLevelOperationCount || this.form.currentLevelOperationCount < 0) {
          this.$message.error('请输入当前级别手术开展例数');
          return;
        }
        if (!this.form.firstAssistantOperationCount || this.form.firstAssistantOperationCount < 0) {
          this.$message.error('请输入作为一助完成该操作例数');
          return;
        }
        if (this.form.currentLevelOperationCount > 9999) {
          this.$message.error('当前级别手术开展例数不能超过9999');
          return;
        }
        if (this.form.firstAssistantOperationCount > 9999) {
          this.$message.error('作为一助完成该操作例数不能超过9999');
          return;
        }
        if (!this.form.refresherCourse || this.form.refresherCourse.trim() === '') {
          this.$message.error('请输入专业培训信息');
          return;
        }
        if (this.form.refresherCourse.length > 2000) {
          this.$message.error('专业培训信息不能超过2000字');
          return;
        }
        if (!this.form.expertise || this.form.expertise.trim() === '') {
          this.$message.error('请输入专业技术水平简述');
          return;
        }
        if (this.form.expertise.length > 2000) {
          this.$message.error('专业技术水平简述不能超过2000字');
          return;
        }
        if (!this.form.researchPaper || this.form.researchPaper.trim() === '') {
          this.$message.error('请输入专著、论文科研情况');
          return;
        }
        if (this.form.researchPaper.length > 2000) {
          this.$message.error('专著、论文科研情况不能超过2000字');
          return;
        }
        if (!this.form.reviewId) {
          this.$message.error('请选择考核人');
          return;
        }

        this.submitLoading = true;

        // 构建提交数据
        const submitData = {
          ...this.form,
          applicantId: this.userDetail.id,
          applicant: this.userDetail.name,
          ratingName: this.level.next.name,
          oldRatingName: this.level.now.name,
          ratingId: this.level.next.id,
          deptId: this.userDetail.deptId,
          deptName: this.userDetail.deptName,
          source: "apply",
          reviewer: this.reviewer.find(item => item.accNo == this.form.reviewId)?.username,
          reviewDeptId: this.reviewer.find(item => item.accNo == this.form.reviewId)?.deptId
        };

        await apply(submitData);

        this.$message({
          message: "申请提交成功",
          type: "success"
        });

        this.goBack();
      } catch (error) {
        console.error('提交申请失败:', error);
        if (error === 'cancel') {
          return; // 用户取消操作
        }
        if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else if (error.message) {
          this.$message.error(error.message);
        } else {
          this.$message.error('提交申请失败，请稍后重试');
        }
      } finally {
        this.submitLoading = false;
      }
    },

    // 返回上一页
    async goBack() {
      if (this.isEdit && this.hasFormChanged()) {
        try {
          await this.$confirm('表单已修改，确定要离开吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        } catch (error) {
          if (error === 'cancel') {
            return;
          }
        }
      }
      this.$router.go(-1);
    },

    // 暂存功能
    saveDraft() {
      // 这里可以添加暂存逻辑
      this.$message({
        message: "暂存成功",
        type: "success"
      });
    },

    // 检查表单是否有修改
    hasFormChanged() {
      return this.form.currentLevelOperationCount !== 0 ||
             this.form.firstAssistantOperationCount !== 0 ||
             this.form.refresherCourse !== '' ||
             this.form.expertise !== '' ||
             this.form.researchPaper !== '' ||
             this.form.reviewId !== '';
    },

    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
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

.status-info {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.level_text {
  font-weight: bold;
  font-size: 18px;
  padding: 10px 0;
  display: flex;
  align-items: center;
}

#rectangle {
  width: 5px;
  height: 21px;
  margin-right: 10px;
  border-radius: 100px;
  background-color: #084990;
  box-sizing: border-box;
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
  transition: all 0.3s ease;
}

.information-part-title:hover {
  background: rgb(224, 233, 239);
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
  height: 75px;
  display: flex;
  align-items: center; /* 垂直居中 */
  border: rgb(238, 238, 238) 1px solid;
  color: rgb(63, 70, 92);
  -webkit-print-color-adjust: exact;
  padding: 0 20px;
  font-weight: normal;
  transition: all 0.3s ease;
}

.table:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-title {
  background-color: rgb(245, 250, 253);
}

.table-value {
  background-color: rgb(249, 249, 249);
}

.table-value2 {
  background-color: rgb(249, 249, 249);
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

.warning-info {
  color: #e6a23c;
  background-color: #fdf6ec;
  border: 1px solid #f5dab1;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.warning-info i {
  margin-right: 8px;
  font-size: 16px;
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

  .table {
    border: 1px solid #000 !important;
    background-color: white !important;
    color: #000 !important;
  }

  .table-title {
    background-color: #f5f5f5 !important;
    font-weight: bold !important;
  }

  .table-value {
    background-color: white !important;
  }

  .operation-history-table {
    border-collapse: collapse !important;
  }

  .operation-history-table th,
  .operation-history-table td {
    border: 1px solid #000 !important;
    padding: 8px !important;
    background-color: white !important;
    color: #000 !important;
  }

  .operation-history-table th {
    background-color: #f5f5f5 !important;
    font-weight: bold !important;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .information-part-title .title {
    font-size: 16px;
  }

  .table {
    height: 60px;
    padding: 0 10px;
  }

  .dialog-title .title {
    font-size: 18px;
  }

  .left {
    text-align: center;
  }

  .operation-history-table {
    font-size: 12px;
  }

  .operation-history-table th,
  .operation-history-table td {
    padding: 8px;
  }

  .status-info {
    padding: 15px;
  }

  .level_text {
    font-size: 16px;
  }

  .bgw {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 5px;
  }

  .table {
    height: 50px;
    padding: 0 5px;
    font-size: 12px;
  }

  .information-part-title .title {
    font-size: 14px;
  }

  .dialog-title .title {
    font-size: 16px;
  }

  .operation-history-table {
    font-size: 10px;
  }

  .operation-history-table th,
  .operation-history-table td {
    padding: 5px;
  }
}

</style>

<style>
.marginlf0 .el-form-item__content{
  margin-left: 0!important;
}
</style>
