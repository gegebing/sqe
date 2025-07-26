<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px"
        >
          <el-form-item label="" prop="level">
            <el-button-group>
              <el-button :type="buttonState.wait" @click="setSate(0)">待审批<span v-if="reviewNum!=={}"
              >({{ reviewNum.reviewNum }})</span></el-button>
              <el-button :type="buttonState.pass" @click="setSate(1)">已通过<span v-if="reviewNum!=={}"
              >({{ reviewNum.passNum }})</span></el-button>
              <el-button :type="buttonState.nopass" @click="setSate(2)">未通过<span v-if="reviewNum!=={}"
              >({{ reviewNum.backNum }})</span></el-button>
              <!--              <el-button  :type="buttonState.back" @click="setSate(2)">已回退<span v-if="reviewNum!=={}">({{reviewNum.backNum}})</span></el-button>-->
            </el-button-group>
          </el-form-item>
          <el-form-item label="手术级别" prop="level">
            <el-select
              v-model="queryParams.ratingName"
              placeholder="请选择手术级别"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option value="" label="全部"></el-option>
              <el-option v-for="item in manageListOptions" :value="item.name" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间" prop="name">
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table show-header v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="申请人" align="center" prop="applicant"/>
      <el-table-column label="申请手术级别" align="center" prop="ratingName"/>
      <el-table-column label="申请时间" align="center" prop="applyTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.applyTime) }}
        </template>
      </el-table-column>
      <el-table-column label="考核时间" align="center" prop="reviewTime">
        <template slot-scope="scope">
          <div v-if="scope.row.reviewTime!==null&&scope.row.reviewTime!=undefined">
            {{ parseTime(scope.row.reviewTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="state"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="getApplyFrom(scope.row.id)"
          >申请详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.reviewTime==null"
            @click="inputReview(scope.row)"
          >考核录入
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.reviewTime!==null&&scope.row.reviewTime!=undefined"
            @click="getReviewFrom(scope.row)"
          >考核详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="!scope.row.state.includes('待审批')"
            @click="auditRecords(scope.row)"
          >审批历史
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="approve(scope.row)"
            v-if="scope.row.state.includes('待审批')"
          >审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showUserX"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <div id="printContent">
        <el-row>
          <el-col :span="21">
            <div class="dialog-title">
              <div class="line"></div>
              <div class="title">医师手术级别申请【{{ applyForm.ratingName }}】</div>
              <div style="margin-left: auto;">
                <el-button type="danger" v-print="'#printContent'">打印</el-button>
              </div>
            </div>
          </el-col>
        </el-row>


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
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showUserY"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <div id="printContent1">
        <el-row>
          <el-col :span="21">
            <div class="dialog-title">
              <div class="line"></div>
              <div class="title">医师手术级别权限考核表</div>
              <div style="margin-left: auto;">
                <el-button type="danger" v-print="'#printContent1'">打印</el-button>
              </div>
            </div>
          </el-col>
        </el-row>


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
                    <div class="title">考核信息</div>
                  </div>
                  <div class="bgw">
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">申请人</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewUserDetail.name }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">考核人</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.reviewer }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">申请手术级别</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.rating }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">科室</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.deptName }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">患者姓名</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.patient }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">住院号</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.hospitalNum }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">临床诊断</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table table-value2">{{ reviewForm.diagnosis }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">手术名称</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table table-value2">{{ reviewForm.operation }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">主刀（职称）</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.operator }}</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">助手（职称）</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="table table-value2">{{ reviewForm.assistant }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">目前国内外开展该类手术的最新进展（并发症及预后等）</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.progress }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">该患者的手术难点与风险评估</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.difficulties }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">操作过程评分（90分，见操作常规）</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.score }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">专家点评</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.comment }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">实得分</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.actualScore }}</div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table2 table-title">操作结果（10分）</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="table2 table-value2">{{ reviewForm.operatorResult }}</div>
                      </el-col>
                    </el-row>
                  </div>

                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showUser"
      :before-close="handleClose"
      title="审批"
    >
      <div class="approve-box">
        <el-form ref="approveForm">
          <el-form-item label="审批操作:">
            <el-radio-group v-model="approveForm.state">
              <el-radio :label="5" v-if="nowState=='科室待审批'">通过</el-radio>
              <el-radio :label="4" v-if="nowState=='科室待审批'">不通过</el-radio>
              <el-radio :label="3" v-if="nowState=='科室待审批'">回退</el-radio>
              <el-radio :label="6" v-if="nowState=='医务处待审批'">通过</el-radio>
              <el-radio :label="8" v-if="nowState=='医务处待审批'">不通过</el-radio>
              <el-radio :label="7" v-if="nowState=='医务处待审批'">回退</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="回退至:" v-if="approveForm.state=='3'||approveForm.state=='7'">
            <el-select v-model="approveForm.flowId">
              <el-option v-for="item in reviewer" :value="item.id" :label="item.accNo+'-'+item.username">
                {{ item.state }}-{{ item.accNo }}-{{ item.username }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审批意见:">
            <el-input type="textarea" v-model="approveForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeApprove()">取 消</el-button>
              <el-button type="primary" @click="submitApprove()">确 定</el-button>
            </span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="审核记录"
      :visible.sync="dialogVisible_"
      width="50%"
      :before-close="handleClose_"
    >
      <div style="width: 100%; text-align: right">
        <el-button type="danger" v-print="'#printContentss'">打印</el-button>
      </div>

      <div id="printContentss" style="margin-left: 20px; ">
        <p>申请人：<span>{{ applyHForm.applicant }}({{ applyHForm.applicantId }})</span></p>
        <p>申请手术级别： <span>{{ applyHForm.ratingName }}</span></p>
        <Table
          v-loading="logLoading"
          :table-list="logCustomerList"
          :prop-list="logColumns"
          class="printtablew"
        ></Table>
      </div>

<!--      <el-form ref="form" :model="applyHForm" label-width="auto">-->
<!--        <el-form-item label="申请人：">-->
<!--          <span>{{ applyHForm.applicant }}({{ applyHForm.applicantId }})</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="申请手术级别：">-->
<!--          <span>{{ applyHForm.ratingName }}</span>-->
<!--        </el-form-item>-->
<!--        <Table-->
<!--          v-loading="logLoading"-->
<!--          :table-list="logCustomerList"-->
<!--          :prop-list="logColumns"-->
<!--        ></Table>-->
<!--      </el-form>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  listManage,
  listRatingLevel
} from "@/api/rating/manage/index";
import {getUserInfo} from "@/utils/persistence";
import {auditLogList, employeeDetail, ratingEmployee} from "@/api/system/qualificationReview";
import {
  approve,
  getApply,
  getApplyAuthStateNum,
  getApplyStateNum,
  listAuthApply,
  ratingAuthEmployee
} from "@/api/rating/apply";
import {parseTime} from "@/utils";
import {Loading} from 'element-ui';
import {addReview, getReviewByApplyId, updateReview} from "@/api/rating/review";


export default {
  name: "Manage",
  data() {
    return {
      buttonState: {
        wait: 'default',
        pass: 'default',
        nopass: 'default',
        back: 'default'
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
                  : row.operType == "0" ? "提交申请" : '考核录入';
          }
        },
        {
          label: "备注",
          prop: "description",
          align: "center"
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
      dialogVisible_: false,
      // 显示搜索条件
      showSearch: true,
      showUser: false,
      showUserX: false,
      showUserY: false,
      chooseReview: false,
      // 总条数
      total: 0,
      // 资质管理表格数据
      manageList: [],
      manageListOptions: [],
      // 弹出层标题
      title: "",
      nowState: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        startTime: null,
        endTime: null,
        name: null,
        applicantId: null,
        state: null,
        ratingName: null
      },
      searchState: ['科室待审批', '医务处待审批'],
      queryTime: [],
      // 表单参数
      form: {},
      applyHForm: {},
      approveForm: {},
      // 表单校验
      rules: {},
      level: '',
      userInfo: getUserInfo(),
      userDetail: {},
      reviewer: [],
      applyForm: {},
      reviewForm: {},
      reviewUserDetail: {},
      applyUserDetail: {},
      reviewNum: {
        passNum: 0,
        backNum: 0,
        reviewNum: 0
      }
    };
  },
  created() {
    this.buttonState.wait = "primary";
    this.getList(this.searchState);
    this.getRatingLevel();
    this.getOptions();
    this.employeeDetailApi();
  },
  methods: {
    addReview,
    parseTime,
    auditRecords(row) {
      this.dialogVisible_ = true;
      this.logLoading = true;
      this.applyHForm = Object.assign(this.applyHForm, row);
      auditLogList({moduleType: "rating", applyId: row.id})
        .then(res => {
          this.logCustomerList = res.body;
        })
        .finally(() => {
          this.logLoading = false;
        });
    },
    handleClose_() {
      this.dialogVisible_ = false;
    },
    submitApprove() {
      console.log("------------->>>",this.approveForm.state)
      if(this.approveForm.state === null || this.approveForm.state === undefined){
       this.$message.error("请选择《审批操作》");
       return;
      }
      approve(this.approveForm).then(res => {
        console.log(res)
        this.showUser = false
      })
    },
    closeApprove() {
      this.showUser = false
    },
    approve(e) {
      this.nowState = e.state
      console.log(this.nowState)
      this.showUser = true
      this.approveForm.applys = []
      let obj = {
        applyId: e.id,
        rating: e.ratingName,
        ratingId: e.ratingId,
      }
      this.approveForm.applys.push(obj)
      this.getEmployeeList(e.id)
    },
    inputReview(e) {
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      getReviewByApplyId(e.id).then(res => {
        employeeDetail({key: res.data.applicantId}).then(r => {
          console.log(res)
          this.reviewForm = res.data;
          this.reviewUserDetail = r.body
          this.showUser = true;
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        })
      })
    },
    getReviewFrom(e) {
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      getReviewByApplyId(e.id).then(res => {
        employeeDetail({key: res.data.applicantId}).then(r => {
          console.log(res)
          this.reviewForm = res.data;
          this.reviewUserDetail = r.body
          this.showUserY = true;
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        })
      })
    },
    getApplyFrom(e) {
      console.log(e)
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      getApply(e).then(res => {
        employeeDetail({key: res.data.applicantId}).then(r => {
          this.applyForm = res.data;
          this.applyUserDetail = r.body
          this.showUserX = true;
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        })
      })
    },
    updateReview() {
      console.log(this.reviewForm)
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      updateReview(this.reviewForm).then(res => {
        console.log(res)
        this.showUser = false;
        this.getList();
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })

    },
    getEmployeeList(e) {
      ratingAuthEmployee(e).then(res => {
        this.reviewer = res.data
      })
    },
    // 根据员工id查询员工详情
    employeeDetailApi() {
      employeeDetail({key: getUserInfo().acc}).then(res => {
        this.userDetail = res.body;
      });
    },
    handleClose() {
      this.showUser = false;
      this.showUserX = false;
      this.showUserY = false;
    },
    handleReviewClose() {
      this.chooseReview = false
    },
    //申请级别
    applyLevelDetail() {
      console.log(this.level)
      if (this.userInfo != null && this.level.rating.isApply) {
        this.showUser = true
      } else {
        this.$message({
          message: "当前状态不可继续申请",
          type: "warning"
        })
      }
    },
    /** 查询资质管理列表 */
    getOptions() {
      listManage().then(response => {
        this.manageListOptions = response.rows;
      });
    },
    getList(state) {
      this.queryParams.reviewerId = this.userInfo.acc
      this.queryParams.userId = this.userInfo.acc
      this.queryParams.applyTimeStart = this.queryTime[0]
      this.queryParams.applyTimeEnd = this.queryTime[1]
      console.log(this.queryParams)
      this.loading = true;
      listAuthApply(this.queryParams).then(response => {
        if (Array.isArray(state) && state.length > 0) {
          this.manageList = response.rows.filter(item => state.includes(item.state));
        } else {
          this.manageList = response.rows;
        }
        this.getReviewStateNum();
        this.loading = false;
      });
    },
    setSate(state) {
      this.queryParams.status = state + 1;
      switch (state) {
        case 0:
          this.buttonState.wait = "primary"
          this.buttonState.back = "default"
          this.buttonState.pass = "default"
          this.buttonState.nopass = "default"
          this.searchState = ['科室待审批', '医务处待审批']
          this.getList(this.searchState)
          break;
        case 1:
          this.buttonState.wait = "default"
          this.buttonState.back = "default"
          this.buttonState.pass = "primary"
          this.buttonState.nopass = "default"
          this.searchState = ['医务处审批通过']
          this.getList(this.searchState)
          break;
        case 2:
          this.buttonState.wait = "default"
          this.buttonState.back = "default"
          this.buttonState.pass = "default"
          this.buttonState.nopass = "primary"
          this.searchState = ['科室审批未通过', '医务处审批未通过', '科室已回退', '医务处已回退']
          this.getList(this.searchState)
          break;
        default:
          this.getList();
      }
    },
    getReviewStateNum() {
      this.queryParams.reviewerId = this.userInfo.acc
      this.queryParams.id = this.userInfo.acc
      this.queryParams.applyTimeStart = this.queryTime[0]
      this.queryParams.applyTimeEnd = this.queryTime[1]
      getApplyAuthStateNum( this.queryParams).then(res => {
        if (res.data != null) {
          this.reviewNum = res.data
        }
      })

    },
    getRatingLevel() {
      let userInfo = getUserInfo()
      let req = {
        applicantId: userInfo.acc
      }
      listRatingLevel(req).then(res => {
        console.log(res)
        if (res.data.name != 'undefined') {
          this.level = res.data
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        name: null,
        createTime: null
      };
      this.queryParams = {
        startTime: null,
        endTime: null,
        reviewerId: null,
        ratingName: null,
        state: null
      }
      this.buttonState.wait = "default"
      this.buttonState.back = "default"
      this.buttonState.review = "default"
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.searchState);
    },
    /** 重置按钮操作 */
    resetQuery() {

      this.queryTime = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('manage/manage/export', {
        ...this.queryParams
      }, `manage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style>
.title {
  font-weight: bold;
  font-size: 20px;
  padding: 20px;
}

.level_text {
  font-weight: bold;
  font-size: 20px;
  padding: 10px 20px;
}

.btn {
  Width: 160px;
  Height: 46px;
  Rotation: 0;
  border-radius: 5px;
  Padding: 2px 2px 2px 2px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border: none;
  background-color: #084990;
  -webkit-print-color-adjust: exact;
  Align: center;
}

#rectangle {
  width: 5px;
  height: 21px;
  padding: 2px 2px 2px 2px;
  margin-right: 10px;
  border-radius: 100px;
  background-color: #084990;
  -webkit-print-color-adjust: exact;
  box-sizing: border-box;
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
    -webkit-print-color-adjust: exact;
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
      -webkit-print-color-adjust: exact;
      font-weight: bold;
    }
  }
}

.table {
  height: 70px;
  display: flex;
  align-items: center; /* 垂直居中 */
  border: rgb(238, 238, 238) 1px solid;
  color: rgb(63, 70, 92);
  -webkit-print-color-adjust: exact;
  padding: 0 20px;
  font-weight: normal;
}

.table2 {
  height: 181px;
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
  -webkit-print-color-adjust: exact;
}

.table-value {
  background-color: rgb(249, 249, 249);
  -webkit-print-color-adjust: exact;
}

.table-empty {
  background-color: white;
}

.bgw {
  background-color: white;
  //padding: 40px;
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
    -webkit-print-color-adjust: exact;
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

.no-border .el-input__inner {
  border: none !important;
  box-shadow: none !important;
}

.no-border-input textarea.el-textarea__inner {
  border: none;
  box-shadow: none;
}

.printtablew {
  width: 680px !important;
  margin: 0 auto;
}

@media print {
  /* 打印时隐藏不需要的元素 */
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
  header, footer, .no-print {
    display: none;
  }
  @page {
    size: auto; /* auto is the initial value */
    margin: 3mm; /* this affects the margin in the printer settings */
  }
}
</style>
