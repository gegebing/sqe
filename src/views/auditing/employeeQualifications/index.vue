<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="工号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查 询</el-button
        >
      </el-form-item>
    </el-form>
    <div v-if="flag" class="information-part">
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
                <div class="title">基本信息</div>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名">
                    <span>{{ form.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别">
                    <span>{{ form.sex == 1 ? "男" : "女" }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出生日期">
                    <span>{{ form.birthDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="政治面貌">
                    <span>{{ form.politicalCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="参加工作年月">
                    <span>{{ form.workDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="来院时间">
                    <span>{{ form.entryDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="科室">
                    <span>{{ form.deptName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工号">
                    <span>{{ form.id }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="行政职务">
                    <span>{{ form.positionCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="专业技长">
                    <span>{{ form.specialization }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="掌握外语种类及程度">
                    <span>{{ form.languageLevel }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="专业培训进修学习经历">
                    <span>{{ form.trainingExperience }}</span>
                  </el-form-item>
                </el-col>
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">基本资质</div>
                </div>
                <el-col :span="12">
                  <el-form-item label="第一学历学位">
                    <span>{{ form.firstEdu }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="毕业学校及时间">
                    <span>{{ form.firstEduDesc }}</span>
                  </el-form-item>
                </el-col>                
                <el-col :span="12">
                  <el-form-item label="最高学历学位">
                    <span>{{ form.eduLevel }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="毕业学校及时间">
                    <span>{{ form.highestEduDesc }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="聘用职称">
                    <span>{{ form.techQualifyCode }}</span>
                  </el-form-item>
                </el-col>
                
                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">学习及工作简历</div>
                </div>

                <el-table show-header v-loading="loading" :data="form.workExperienceList" >
                  <el-table-column label="起止时间" align="center" prop="form.workExperienceList.startDate"/>
                  <el-table-column label="起止时间" align="center" prop="form.workExperienceList.startDate"/>
                  <el-table-column label="学校/单位" align="center" prop="form.workExperienceList.unitName">
                  </el-table-column>
                  <el-table-column label="专业" align="center" prop="form.workExperienceList.spec">
                  </el-table-column>
                  <el-table-column label="职务" align="center" prop="form.workExperienceList.position"/>
                </el-table>

                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">专业技术能力自诉</div>
                </div>

                <el-col :span="24">
                  <el-form-item >
                    <span>{{ form.specializationDesc }}</span>
                  </el-form-item>
                </el-col>

                <div class="information-part-title">
                  <div class="line"></div>
                  <div class="title">证书</div>
                </div>

                <el-col :span="24">
                  <el-form-item label="医师资格证">
                    <!-- <span>{{ form.name }}</span> -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="医师执业证">
                    <!-- <span>{{ form.name }}</span> -->
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="12">
                    <el-form-item label="身份证号">
                      <span>{{ form.idCode }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系方式">
                      <span>{{ form.mobile }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="医师资格证照片">
                      <span>{{ form.name }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="医师执业证照片">
                      <span>{{ form.name }}</span>
                    </el-form-item>
                  </el-col> -->
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="flag" class="information-part">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(item, index) in data" :key="index">
          <template slot="label">
            <span>{{ item.name }}</span>
            <span>{{ item.total }}</span>
          </template>
          <div v-if="item.child || item.child.length > 0">
            <el-collapse
              v-for="(item_1, index_1) in item.child"
              :key="index_1"
              style="margin-bottom: 8px;"
            >
              <el-collapse-item>
                <template slot="title">
                  <span
                    >{{ item_1.name
                    }}<span
                      style="margin-left: 8px;font-size: 14px;color: #999999;"
                      >{{ item_1.employeeTotal }}/{{ item_1.total }}</span
                    ></span
                  >
                </template>
                <div v-if="item_1.child || item_1.child.length > 0">
                  <Table
                    :table-list="item_1.child"
                    :prop-list="columns"
                  ></Table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div v-html="applyDesc"></div>
      <Table
        v-if="tableFlag"
        v-loading="logLoading"
        :table-list="logCustomerList"
        :prop-list="logColumns"
      ></Table>
      <span slot="footer" v-if="btnFlag">
        <el-button type="primary" @click="applyIntelligence()">申 请</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  qualifyConfigDetail,
  qualifyConfigBaseDetail
} from "@/api/system/qualificationConfiguration/index";
import { qualifyManageLevels } from "@/api/system/qualificationConfiguration/index";
import { getUserInfo } from "@/utils/persistence";
import {
  employeeDetail,
  apply,
  auditLogList
} from "@/api/system/qualificationReview/index";
import { qualifyManageEmployeeDetail } from "@/api/system/qualityManagement/index";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
        queryParams: {
            code: ''
        },
      applyDesc: "",
      dialogVisible: false,
      logLoading: false,
      logCustomerList: [],
      title: "",
      stateOptions: [
            {
                label: "提交申请",
                value: "0"
            },
            {
                label: '审核通过',
                value: '1'
            },
            {
                label: '驳回',
                value: '2'
            },
            {
                label: '重新提交申请',
                value: '3'
            },
            {
                label: '审核不通过',
                value: '4'
            },
            {
                label: '待审核',
                value: '5'
            },
            {
                label: '已授权',
                value: '6'
            },
            {
                label: '撤销授权',
                value: '7'
            },
            {
                label: "待授权",
                value: "8"
            },
            {
                label: '过期',
                value: '9'
            }
        ],
      logColumns: [
        {
          prop: "deptName",
          label: "部门",
          align: "center"
        },
        {
          prop: "operType",
          label: "操作",
          align: "center",
          formatter: row => {
            let obj = this.stateOptions.find(
              element => element.value == row.operType
            );
            return obj ? obj.label : "";
          }
        },
        {
          prop: "operator",
          label: "审核人",
          align: "center"
        },
        {
          prop: "description",
          label: "说明",
          align: "center"
        },
        {
          prop: "createTime",
          label: "时间",
          align: "center",
          formatter: row => {
            return parseTime(row.createTime);
          }
        }
      ],
      form: {
        birthDate: undefined,
        createTime: undefined,
        deptId: undefined,
        deptName: undefined,
        eduDegree: undefined,
        eduLevel: undefined,
        email: undefined,
        entryDate: undefined,
        id: undefined,
        idCode: undefined,
        mobile: undefined,
        name: undefined,
        politicalCode: undefined,
        positionCode: undefined,
        sex: undefined,
        status: undefined,
        techQualifyCode: undefined,
        type: undefined,
        workDate: undefined,
        workPhone: undefined
      },
      data: [],
      columns: [
        {
          prop: "code",
          label: "编号",
          align: "center"
        },
        {
          prop: "name",
          label: "资质名称",
          align: "center"
        },
        {
          prop: "authStartTime",
          label: "有效期",
          align: "center",
          width: '300',
          formatter: row => {
            if (row.authStartTime && row.authEndTime) {
                    return parseTime(row.authStartTime, '{y}-{m}-{d}') + " - " + parseTime(row.authEndTime, '{y}-{m}-{d}')
                } else {
                    return ''
                }
            }
        },
        {
          prop: "state",
          label: "申请状态",
          align: "center",
          formatter: row => {
            if (row.state) {
                let obj = this.stateOptions.find(element => element.value == row.state);
                return obj ? obj.label : "无";
            } else {
                return "无"
            }
          }
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "300",
          render: (h, params) => {
            const arr = [];
            arr.push(
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini"
                    // icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleExplain(event, params.row);
                    }
                  }
                },
                "申请说明"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini"
                    // icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleLog(event, params.row);
                    }
                  }
                },
                "审核日志"
              )
            );
            return h("div", arr);
          }
        }
      ],
      tableFlag: false,
      btnFlag: false,
      catalogId: undefined,
      qualifyId: undefined,
      flag: false
    };
  },
  created() {
  },
  methods: {
    handleQuery() {
        this.employeeDetailApi();
        this.qualifyManageLevelsApi();
    },
    applyIntelligence() {
      // qualifyId => id
      // catalogId => 父级id
      apply({ catalogId: this.catalogId, qualifyId: this.qualifyId }).then(
        res => {
          if (res.code == 200) {
            this.dialogVisible = false;
            this.$message({
              message: "申请成功",
              type: "success"
            });
          }
        }
      );
    },
    // 根据员工id查询员工详情
    employeeDetailApi() {
      employeeDetail({ key: this.queryParams.code }).then(res => {
        this.form = Object.assign(this.form, res.body);
        this.flag = true
      });
    },
    qualifyManageLevelsApi() {
      qualifyManageEmployeeDetail({ key: this.queryParams.code }).then(res => {
        this.data = res.body;
      });
    },
    getConfigList(id) {
      this.logLoading = true;
      this.logCustomerList = [];
      auditLogList({
        resId: id,
        applicantId: this.queryParams.code,
        moduleType: "qualify"
      })
        .then(res => {
          this.logCustomerList = res.body;
        })
        .finally(() => {
          this.logLoading = false;
        });
    },
    getqualifyConfigBaseDetail(id) {
      qualifyConfigBaseDetail({ key: id }).then(res => {
        if (res.body.id) {
          this.applyDesc = res.body.applyDesc;
        }
      });
    },
    handleExplain(e, row) {
      this.btnFlag = false;
      this.tableFlag = false;
      this.applyDesc = "";
      this.title = row.name + "-申请说明";
      this.dialogVisible = true;
      this.getqualifyConfigBaseDetail(row.id);
    },
    handleSubmit(e, row) {
      console.log(e, row);
      this.catalogId = row.catalogId;
      this.qualifyId = row.id;
      this.btnFlag = true;
      this.tableFlag = false;
      this.applyDesc = "";
      this.title = row.name + "-提交申请";
      this.dialogVisible = true;
      this.getqualifyConfigBaseDetail(row.id);
    },
    handleLog(e, row) {
      this.btnFlag = false;
      this.tableFlag = true;
      this.title = row.name + "-审核日志";
      this.dialogVisible = true;
      this.getConfigList(row.id);
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.title-part {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #333;
  font-weight: 400;
  margin-bottom: 20px;
  .title-part-text {
    font-weight: 200;
    margin-left: 5px;
  }
}
.result-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.information-part {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .information-part-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f5f7fa;
    padding: 10px 0px;
    margin-bottom: 20px;
    .line {
      width: 5px;
      height: 16px;
      background: #4171fe;
      margin-right: 10px;
    }
    .title {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
  }
  .information-title {
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }
}
.btn-part {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
