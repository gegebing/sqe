<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px"
        >
          <el-form-item label="" prop="level">
            <el-button-group>
              <el-button :type="buttonState === '待审核' ? 'primary' :'default'" @click="setSate('待审核')">待审核<span
                v-if="reviewNum!=={}"
              >({{ reviewNum.reviewNum }})</span></el-button>
              <el-button :type="buttonState === '同意' ? 'primary' :'default'" @click="setSate('同意')">已通过<span
                v-if="reviewNum!=={}"
              >({{ reviewNum.passNum }})</span></el-button>
              <el-button :type="buttonState === '驳回' ? 'primary' :'default'" @click="setSate('驳回')">未通过<span
                v-if="reviewNum!=={}"
              >({{ reviewNum.backNum }})</span></el-button>
              <!--              <el-button  :type="buttonState.back" @click="setSate(2)">已回退<span v-if="reviewNum!=={}">({{reviewNum.backNum}})</span></el-button>-->
            </el-button-group>
          </el-form-item>
          <el-form-item label="项目名称:" label-width="88px" prop="level">
            <el-input v-model="queryParams.ratingName"></el-input>
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

    <el-table show-header v-loading="loading" :data="manageList">
      <el-table-column label="编号" align="center" label-width="20px" prop="id"/>
      <el-table-column label="申请人" align="center" prop="name"/>
      <el-table-column label="科室" align="center" prop="deptName"/>
      <el-table-column label="申请高风险诊疗技术操作项目名称" align="center" prop="applyName"/>
      <el-table-column label="作为一助完成该操作例数" align="center" prop="applyNum"/>
      <el-table-column label="申请时间" align="center" prop="applyTime">
        <template slot-scope="scope">
          {{ parseTime(scope.row.applyTime) }}
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="state">
        <template slot-scope="scope">
          {{ statusMap[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="getApplyFrom(scope.row.id)"
          >详情
          </el-button>
          <el-button
            size="mini"
            v-if="(scope.row.state === 1 || scope.row.state === 2 ||scope.row.state === 3) && buttonState === '待审核'"
            type="text"
            @click="approve(scope.row)"
          >审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      :visible.sync="dalesShowUser"
      :fullscreen="true"
      :before-close="dalesHandleClose"
    >
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
                  <!-- <div class="information-part-title">
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
                  </div> -->

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
              <el-radio :label="0">通过</el-radio>
              <el-radio :label="1">驳回</el-radio>
            </el-radio-group>
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
  </div>
</template>

<script>
import {
  autolist,
  highListNum,
  committeeApprove,
  departmentApprove,
  getById,
  medicalOfficeApprove,
  auitList
} from "@/api/highrisk";
import {getUserInfo} from "@/utils/persistence";
import {employeeDetail} from "@/api/system/qualificationReview";

import {parseTime} from "@/utils";
import moment from "moment/moment";

export default {
  name: "Manage",
  computed: {
    moment() {
      return moment
    }
  },
  data() {
    return {
      buttonState: "待审核",
      logLoading: false,
      logCustomerList: [],
      statusMap: {
        "1": "科室待审核",
        "2": "医务处待审核",
        "3": "医疗技术管理委员会待审核",
        "4": "科室驳回",
        "5": "医务处驳回",
        "6": "医疗技术管理委员会驳回",
        "7": "已取消",
        "8": "已完成"
      },
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
      dalesShowUser: false,
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
      searchState: "1",
      queryTime: [],
      // 表单参数
      form: {},
      historyOperationDesList: [],
      applyHForm: {},
      approveForm: {},
      // 表单校验
      rules: {},
      resAuitList: [],
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
    this.buttonState = "待审核";
    this.getList(this.buttonState);
    this.getOptions();
    this.employeeDetailApi();
  },
  methods: {
    parseTime,
    getCurrentDate(r) {
      return moment(r).format("YYYY-MM-DD HH:mm:ss");
    },
    submitApprove() {
      console.log("------------->>>", this.approveForm)
      if (this.approveForm.state === null || this.approveForm.state === undefined) {
        this.$message.error("请选择《审批操作》");
        return;
      }
      if (this.nowState === 1) {
        departmentApprove(this.approveForm.id, (this.approveForm.state === 0 ? true : false), this.approveForm.description).then(res => {
          console.log(res)
          this.getList();
          this.showUser = false
          this.dalesShowUser = false
        })
      }
      if (this.nowState === 2) {
        medicalOfficeApprove(this.approveForm.id, (this.approveForm.state === 0 ? true : false), this.approveForm.description).then(res => {
          console.log(res)
          this.getList();
          this.showUser = false
          this.dalesShowUser = false
        })
      }
      if (this.nowState === 3) {
        committeeApprove(this.approveForm.id, (this.approveForm.state === 0 ? true : false), this.approveForm.description).then(res => {
          console.log(res)
          this.getList();
          this.showUser = false
          this.dalesShowUser = false
        })
      }
    },
    dalesHandleClose() {
      this.dalesShowUser = false
    },
    closeApprove() {
      this.showUser = false
    },
    approve(e) {
      this.nowState = e.state
      console.log(this.nowState)
      this.showUser = true
      this.approveForm = {}
      this.approveForm.id = e.id
      // this.approveForm.applys.push(obj)
      // this.getEmployeeList(e.id)
    },

    getApplyFrom(e) {
      let than = this;
      getById(e).then(res => {
        than.applyForm = res.body;
        than.dalesShowUser = true;
        than.historyOperationDesList = JSON.parse(res.body.operationDetailsList);
      })

      auitList(e).then(res => {
        this.resAuitList = res.body;
        console.log("------------>>>>", res)
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
    /** 查询资质管理列表 */
    getOptions() {
      listManage().then(response => {
        this.manageListOptions = response.rows;
      });
    },
    getList(state) {
      const than = this;
      this.queryParams.reviewerId = this.userInfo.acc
      this.queryParams.userId = this.userInfo.acc
      this.queryParams.applyTimeStart = this.queryTime[0]
      this.queryParams.applyTimeEnd = this.queryTime[1]
      this.queryParams.state = this.buttonState;
      console.log(this.queryParams)
      this.loading = true;
      autolist(this.queryParams).then(response => {
        console.log(response.body)
        than.manageList = response.body;
        than.getReviewStateNum();
        than.loading = false;
      });
    },
    setSate(state) {
      this.buttonState = state;
      this.getList(state)
    },
    getReviewStateNum() {
      this.queryParams.reviewerId = this.userInfo.acc
      this.queryParams.id = this.userInfo.acc
      this.queryParams.applyTimeStart = this.queryTime[0]
      this.queryParams.applyTimeEnd = this.queryTime[1]
      this.queryParams.state = this.buttonState;
      highListNum(this.queryParams).then(res => {
        if (res.body != null) {
          this.reviewNum = res.body
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
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.buttonState);
    },
    /** 重置按钮操作 */
    resetQuery() {

      this.queryTime = [];
      this.handleQuery();
    },
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
