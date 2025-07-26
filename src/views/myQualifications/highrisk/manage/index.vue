<template>
  <div class="app-container">
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
          <el-form-item label="项目名称：" label-width="88px" prop="level">
            <el-input
              v-model="queryParams.ratingName"
              placeholder="请选择项目名称"
            ></el-input>
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
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <button class="btn" @click="applyClick()">高风险诊疗技术申请</button>
      </el-col>
    </el-row>

    <el-table
      show-header
      v-loading="loading"
      :data="manageList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="申请高风险诊疗技术操作项目名称"
        align="center"
        prop="applyName"
      />
      <el-table-column
        label="作为一助完成该操作例数"
        align="center"
        prop="applyNum"
      />
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
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state === 1"
            size="mini"
            type="text"
            @click="withdraw(scope.row.id)"
            >撤回
          </el-button>
          <el-button
            v-if="
              scope.row.state === 7 ||
                scope.row.state === 4 ||
                scope.row.state === 5 ||
                scope.row.state === 6
            "
            size="mini"
            type="text"
            @click="tjApplyFrom(scope.row)"
            >重新申请
          </el-button>
          <el-button
            v-if="!check.reapply"
            size="mini"
            type="text"
            @click="getApplyFrom(scope.row.id)"
            >详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="showUser"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="21">
          <div class="dialog-title">
            <div class="line"></div>
            <div class="title">高风险诊疗技术操作资格申请表</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="left">
            <el-button type="primary" @click="showUser = false">暂存</el-button>
            <el-button type="success" @click="submitForm">提交</el-button>
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
                        <div class="table table-value">
                          {{ userDetail.name }}
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">性别</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-value">
                          {{ userDetail.sex == 1 ? "男" : "女" }}
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-title">年龄</div>
                      </el-col>
                      <el-col :span="2">
                        <div class="table table-value">
                          {{ userDetail.age }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">申请日期</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{
                            typel
                              ? getCurrentDateg(userDetail.applyTime)
                              : getCurrentDate()
                          }}
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="table table-title">任职科室</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{ userDetail.deptName }}
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table table-title">职称</div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-value">
                          {{ userDetail.techQualifyCode }}
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="table table-title">聘任年月</div>
                      </el-col>
                      <el-col :span="5">
                        <div class="table table-value">
                          {{ userDetail.entryDate }}
                        </div>
                      </el-col>
                    </el-row>
                  </el-row>
                </div>
                <!-- <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">历史操作明细</div>
                  <div style="margin-left: auto;">
                    <el-button type="success" @click="addHistoryOperation">新增</el-button>
                  </div>
                </div>
                <div class="bgw" style="width: 98%; margin: 10px 30px 10px 30px">
                  <table class="operation-history-table">
                    <tr>
                      <th>序号</th>
                      <th>已完成高风险诊疗技术项目名称</th>
                      <th>已完成例数</th>
                      <th style="width: 220px;">操作</th>
                    </tr>
                    <tr v-for="(item, index) in historyOperationList" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.applyName }}</td>
                      <td>{{ item.applyNum }}</td>
                      <td>
                        <div class="btn-group">
                          <el-button size="mini" type="text" @click="deleteHistoryOperation(item)">删除</el-button>
                        </div>
                      </td>
                    </tr>
                    <tr v-show="operationShow">
                      <td>{{ form.operationDetailsList ? form.operationDetailsList.length + 1 : 1 }}</td>
                      <td>
                        <el-input v-model="operation.applyName" style="width: 280px;"></el-input>
                      </td>
                      <td>
                        <el-input v-model="operation.applyNum" style="width: 180px;"></el-input>
                      </td>
                      <td>
                        <div class="btn-group">
                          <el-button size="mini" type="success" @click="addOperation()">保存</el-button>
                          <el-button size="mini" type="danger" @click="delOperation()">取消</el-button>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top: 20px; font-size: 16px; font-weight: bold;margin-bottom: 20px;">其它需要说明:
                  </div>
                  <div>
                    <el-input v-model="form.qtDescribe" type="textarea" maxlength="2000" show-word-limit :rows="5"
                              placeholder="请输入其它需要说明"></el-input>
                  </div>
                </div> -->

                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">本次申请明细</div>
                </div>
                <div class="bgw">
                  <div
                    style="display: flex; flex-direction: row;  justify-content: center;align-items: center; padding: 10px;"
                  >
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                      （新增）高风险诊疗技术操作项目名称
                    </div>
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.applyName"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入该项目高风险诊疗技术操作项目名称"
                      ></el-input>
                    </div>
                  </div>
                  <div
                    style="display: flex; flex-direction: row;align-items: center; margin: 10px;"
                  >
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                      作为一助完成该操作例数（要求≥15例）
                    </div>
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.applyNum"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入该项目完成该操作例数"
                      ></el-input>
                    </div>
                  </div>
                  <div
                    style="display: flex; flex-direction: row;align-items: center; margin: 10px;"
                  >
                    <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                      在该操作过程中有无严重并发症或医疗纠纷
                    </div>
                    <div style="width: 100%;">
                      <el-input
                        v-model="form.applyMessage"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入"
                      ></el-input>
                    </div>
                  </div>
                </div>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

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
              <el-button type="danger" v-print="'#printContent'"
                >打印</el-button
              >
            </div>
          </el-col>
        </el-row>

        <div
          style="padding: 0px 0px 10px 30px; font-size: 18px; font-weight: 900;color: #20a0ff"
        >
          <i class="el-icon-alarm-clock"></i> 当前节点:
          {{ applyForm.currentNode }}
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
                          <div class="table table-value">
                            {{ applyForm.name }}
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="table table-title">性别</div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-value">
                            {{ applyForm.sex == 1 ? "男" : "女" }}
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="table table-title">年龄</div>
                        </el-col>
                        <el-col :span="2">
                          <div class="table table-value">
                            {{ applyForm.age }}
                          </div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-title">申请日期</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">
                            {{ getCurrentDateg(applyForm.applyTime) }}
                          </div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4">
                          <div class="table table-title">任职科室</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">
                            {{ applyForm.deptName }}
                          </div>
                        </el-col>
                        <el-col :span="3">
                          <div class="table table-title">职称</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-value">
                            {{ applyForm.techQualifyCode }}
                          </div>
                        </el-col>
                        <el-col :span="4">
                          <div class="table table-title">聘任年月</div>
                        </el-col>
                        <el-col :span="5">
                          <div class="table table-value">
                            {{ applyForm.entryDate }}
                          </div>
                        </el-col>
                      </el-row>
                    </el-row>
                  </div>
                  <!-- <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">历史操作明细</div>
                  </div>
                  <div
                    class="bgw"
                    style="width: 98%; margin: 10px 30px 10px 30px"
                  >
                    <table class="operation-history-table">
                      <tr>
                        <th>序号</th>
                        <th>已完成高风险诊疗技术项目名称</th>
                        <th>已完成例数</th>
                      </tr>
                      <tr
                        v-for="(item, index) in historyOperationDesList"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.applyName }}</td>
                        <td>{{ item.applyNum }}</td>
                      </tr>
                    </table>

                    <div
                      style="margin-top: 20px; font-size: 16px; font-weight: bold;margin-bottom: 20px;"
                    >
                      其它需要说明:
                    </div>
                    <div>
                      <el-input
                        v-model="applyForm.qtDescribe"
                        :disabled="true"
                        type="textarea"
                        maxlength="2000"
                        show-word-limit
                        :rows="5"
                        placeholder="请输入其它需要说明"
                      ></el-input>
                    </div>
                  </div> -->

                  <div class="information-part-title">
                    <div class="line"></div>
                    <div class="title">本次申请明细</div>
                  </div>
                  <div class="bgw">
                    <div
                      style="display: flex; flex-direction: row;  justify-content: center;align-items: center; padding: 10px;"
                    >
                      <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                        （新增）高风险诊疗技术操作项目名称
                      </div>
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.applyName"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="请输入该项目高风险诊疗技术操作项目名称"
                        ></el-input>
                      </div>
                    </div>
                    <div
                      style="display: flex; flex-direction: row;align-items: center; margin: 10px;"
                    >
                      <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                        作为一助完成该操作例数（要求≥15例）
                      </div>
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.applyNum"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="请输入该项目完成该操作例数"
                        ></el-input>
                      </div>
                    </div>
                    <div
                      style="display: flex; flex-direction: row;align-items: center; margin: 10px;"
                    >
                      <div style="width: 20%;margin: 0 auto;font-size: 16px;">
                        在该操作过程中有无严重并发症或医疗纠纷
                      </div>
                      <div style="width: 100%;">
                        <el-input
                          :disabled="true"
                          v-model="applyForm.applyMessage"
                          type="textarea"
                          maxlength="2000"
                          show-word-limit
                          :rows="5"
                          placeholder="请输入"
                        ></el-input>
                      </div>
                    </div>
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
                      <tr
                        v-for="item in resAuitList"
                        style="font-size: 16px; font-weight: bold;"
                      >
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
                          {{
                            item.status !== "待审核"
                              ? getCurrentDateg(item.updateTime)
                              : "--"
                          }}
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
      title="审核记录"
      :visible.sync="dialogVisible_"
      width="50%"
      :before-close="handleClose_"
    >
      <div style="width: 100%; text-align: right">
        <el-button type="danger" v-print="'#printContentss'">打印</el-button>
      </div>
      <!--      <el-form ref="form" :model="applyHForm" id="printContentss" label-width="auto">-->
      <div id="printContentss" style="margin-left: 20px; ">
        <p>
          申请人：<span
            >{{ applyHForm.applicant }}({{ applyHForm.applicantId }})</span
          >
        </p>
        <p>
          申请手术级别： <span>{{ applyHForm.ratingName }}</span>
        </p>
        <Table
          v-loading="logLoading"
          :table-list="logCustomerList"
          :prop-list="logColumns"
          class="printtablew"
        ></Table>
      </div>
      <!--      </el-form>-->
    </el-dialog>
  </div>
</template>

<script>
import { cancelApplication, list, submitApplication } from "@/api/highrisk";
import {
  employeeDetail,
  ratingEmployee
} from "@/api/system/qualificationReview";
import { parseTime } from "@/utils";
import { getUserInfo } from "@/utils/persistence";
import moment from "moment";
import { auitList, getById } from "../../../../api/highrisk";

export default {
  name: "Manage",
  data() {
    return {
      dalesShowUser: false,
      operationShow: true,
      check: {
        pass: false,
        reapply: false
      },
      operation: {
        name: null,
        num: 0
      },
      resAuitList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      dialogVisible_: false,
      showSearch: true,
      showUser: false,
      showUserX: false,
      showUserY: false,
      chooseReview: false,
      // 总条数
      total: 0,
      // 资质管理表格数据
      manageList: [],
      statusMap: {
        "1": "科室待审批",
        "2": "医务处待审批",
        "3": "医疗技术管理委员会待审批",
        "4": "科室驳回",
        "5": "医务处驳回",
        "6": "医疗技术管理委员会驳回",
        "7": "已取消",
        "8": "已完成"
      },
      manageListOptions: [],
      historyOperationDesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        startTime: null,
        endTime: null,
        name: null,
        applicantId: null
      },
      queryTime: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      typel: false,
      level: "",
      userInfo: getUserInfo(),
      userDetail: {},
      reviewer: [],
      applyForm: {},
      applyHForm: {},
      reviewForm: {},
      reviewUserDetail: {},
      applyUserDetail: {},
      logLoading: false,
      // 历史操作明细
      historyOperationList: [],
      logCustomerList: [],
      logColumns: [
        {
          label: "审批人",
          prop: "operator",
          align: "center",
          formatter: row => {
            return row.deptName + "-" + row.operator;
          }
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
              : "考核录入";
          }
        },
        {
          label: "备注",
          prop: "description",
          align: "center"
        }
      ]
    };
  },
  created() {
    this.getList();
    this.employeeDetailApi();
  },
  methods: {
    getCurrentDateg(y) {
      return moment(y).format("YYYY-MM-DD HH:mm:ss");
    },
    dalesHandleClose() {
      this.dalesShowUser = false;
    },
    getCurrentDate() {
      return moment().format("YYYY-MM-DD HH:mm:ss");
    },
    parseTime,
    handleClose_() {
      this.dialogVisible_ = false;
    },
    // 添加历史操作明细
    addHistoryOperation() {
      this.operationShow = true;
      console.log(this.historyOperationList);
    },
    delOperation() {
      this.operationShow = false;
    },
    addOperation() {
      if (this.operation.applyName == null || this.operation.applyName == "") {
        this.$message.error("名称不能为空");
        return;
      }

      if (this.operation.applyNum == null || this.operation.applyNum == "") {
        this.$message.error("已完成例数不能为空");
        return;
      }

      this.operationShow = false;
      this.operation.id = this.historyOperationList.length + 1;
      this.historyOperationList.push(this.operation);
      this.operation = {};
    },
    // 删除历史操作明细
    deleteHistoryOperation(row) {
      const index = this.historyOperationList.findIndex(
        item => item.id === row.id
      );
      if (index !== -1) {
        this.historyOperationList.splice(index, 1);
      }
    },
    withdraw(e) {
      const than = this;
      cancelApplication(e, "", "").then(res => {
        than.getList();
      });
    },
    tjApplyFrom(e) {
      let than = this;
      this.typel = true;
      getById(e.id).then(res => {
        than.userDetail = res.body;
        than.form = res.body;
        than.showUser = true;
        than.historyOperationList = JSON.parse(res.body.operationDetailsList);
      });
    },
    async getApplyFrom(e) {
      let than = this;
      let cc = await getById(e);
      than.applyForm = cc.body;
      than.dalesShowUser = true;
      than.historyOperationDesList = JSON.parse(cc.body.operationDetailsList);
      await this.chooseUser(e);
    },
    async chooseUser(e) {
      let c = await auitList(e);
      console.log("---------1--->>>>", c);
      this.resAuitList = c.body;
    },
    getEmployeeList() {
      ratingEmployee("S001").then(res => {
        console.log(res);
        this.reviewer = res.data;
      });
    },
    // 根据员工id查询员工详情
    employeeDetailApi() {
      employeeDetail({ key: getUserInfo().acc }).then(res => {
        console.log(res.body);
        this.userDetail.applyTime = this.getCurrentDate();
        this.userDetail = res.body;
      });
    },
    handleClose() {
      this.showUser = false;
      this.showUserX = false;
      this.showUserY = false;
    },
    applyClick(e) {
      console.log(this.check);
      this.typel = false;
      this.showUser = true;
      this.userDetail = {};
      this.form = {};
      this.historyOperationList = [];
      this.employeeDetailApi();
    },
    getList() {
      this.queryParams.applyTimeStart = this.queryTime[0];
      this.queryParams.applyTimeEnd = this.queryTime[1];
      console.log(this.queryParams);
      this.loading = true;
      list(this.queryParams).then(response => {
        this.manageList = response.body;
        this.loading = false;
      });
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
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.queryParams.ratingName = null;
      this.queryTime = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 提交按钮 */
    submitForm() {
      this.form.applicantId = this.userDetail.id;
      this.form.name = this.userDetail.name;
      this.form.sex = this.userDetail.sex;
      this.form.age = this.userDetail.age;
      this.form.applyTime = this.getCurrentDate();
      this.form.deptId = this.userDetail.deptId;
      this.form.deptName = this.userDetail.deptName;
      this.form.techQualifyCode = this.userDetail.techQualifyCode;
      this.form.entryDate = this.userDetail.entryDate;
      this.form.operationDetailsList = JSON.stringify(
        this.historyOperationList
      );
      this.chooseReview = false;
      console.log(this.form);
      submitApplication(this.form).then(response => {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        console.log(response);
        this.getList();
        this.showUser = false;
      });
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

.level_text {
  font-weight: bold;
  font-size: 20px;
  padding: 10px 20px;
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
}

.table-value {
  background-color: rgb(249, 249, 249);
}

.table-empty {
  background-color: white;
}

.bgw {
  background-color: white;
}

.bgw2 {
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

.printtablew {
  width: 680px !important;
  margin: 0 auto;
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

@media print {
  /* 打印时隐藏不需要的元素 */
  button {
    display: none;
  }

  .bgw {
    background-color: white;
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
    size: auto; /* auto is the initial value */
    margin: 3mm; /* this affects the margin in the printer settings */
  }
}
</style>
