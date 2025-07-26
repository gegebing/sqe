<template>
  <div class="app-container">
    <div class="information-part" id="printContent">
      <div class="print-part">
        <div class="title1">
          <el-row>
            <el-col :span="24">
              <el-form
                  ref="form"
                  label-position="left"
                  :model="form"
                  label-width="110px"
              >
                <div class="information-part-title1">
                  <div class="line"></div>
                  <div class="title1">基本信息</div>
                  <div style="margin-left: auto;">
                    <el-button type="primary" size="small" v-show="editshow" @click="cancel">取消</el-button>
                    <el-button type="primary" size="small" v-show="!editshow" @click="editshow = true">编辑</el-button>
                    <el-button type="success" size="small" v-show="editshow" @click="saveedit">保存</el-button>
                    <el-button type="danger" size="small" v-show="!editshow" v-print="'#printContent'">打印</el-button>
                  </div>
                </div>
                <el-row>
                  <div style="margin-left: 30px;">
                    <el-col :span="6">
                      <el-form-item label="姓名">
                        <span>{{ form.name }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="性别">
                        <span>{{ form.sex == 1 ? "男" : "女" }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="年龄">
                        <span>{{ calculateAge(form.birthDate) }}</span>
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
                      <el-form-item label="专业技长: " label-width="200">
                        <span v-show="!editshow">{{ form.specialization }}</span>
                        <el-input v-show="editshow" maxlength="2000" type="textarea" show-word-limit rows="3"
                                  style="width: 20%; margin-left: 10px;"
                                  v-model="form.specialization"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="掌握 外语种类 及 程度: " label-width="200">
                        <span v-show="!editshow">{{ form.languageLevel }}</span>
                        <el-input v-show="editshow" maxlength="2000" type="textarea" show-word-limit rows="3"
                                  style="width: 20%; margin-top: 5px;"
                                  v-model="form.languageLevel"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="专业培训进修学习经历:" label-width="200">
                        <span v-show="!editshow">{{ form.trainingExperience }}</span>
                        <el-input v-show="editshow" maxlength="2000" type="textarea" show-word-limit rows="3"
                                  style="width: 20%; margin-top: 5px;"
                                  v-model="form.trainingExperience"></el-input>
                      </el-form-item>

                    </el-col>
                  </div>
                  <div class="information-part-title1">
                    <div class="line"></div>
                    <div class="title">基本资质</div>
                  </div>
                  <div style="margin-left: 30px;">
                    <el-col :span="12">
                      <el-form-item label="第一学历学位">
                        <span v-show="!editshow">{{ form.firstEdu }}</span>
                        <el-input v-show="editshow" style="width: 20%;" v-model="form.firstEdu"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="毕业学校及时间">
                        <span v-show="!editshow">{{ form.firstEduDesc }}</span>
                        <el-input v-show="editshow" style="width: 20%; " v-model="form.firstEduDesc"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="最高学历学位">
                        <span v-show="!editshow">{{ form.eduLevel }}</span>
                        <el-input v-show="editshow" style="width: 20%;" v-model="form.eduLevel"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="毕业学校及时间">
                        <span v-show="!editshow">{{ form.highestEduDesc }}</span>
                        <el-input v-show="editshow" style="width: 20%;" v-model="form.highestEduDesc"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="聘用职称">
                        <span>{{ form.techQualifyCode }}</span>
                      </el-form-item>
                    </el-col>
                  </div>

                  <div class="information-part-title1">
                    <div class="line"></div>
                    <div class="title">学习及工作简历</div>
                    <div style="margin-left: auto;margin-right: 20px;">
                      <el-button v-show="editshow" type="success" size="small" @click="AddTab">新增</el-button>
                    </div>
                  </div>
                  <div>
                    <table class="table-cell-y">
                      <tr>
                        <th>开始时间</th>
                        <th>结束时间</th>
                        <th>学校/单位</th>
                        <th>专业</th>
                        <th>职务</th>
                        <th v-show="editshow" style="width: 200px;">操作</th>
                      </tr>
                      <tr v-for="(item,index) in form.workExperienceList" :key="index">
                        <td style="width: 160px;">
                          <div v-show="!editshow">{{ item.startDate }}</div>
                          <el-date-picker style="width: 120px;" v-show="editshow" format="yyyy-MM"
                                          value-format="yyyy-MM"
                                          v-model="item.startDate"
                                          type="month"
                                          placeholder="请输入开始时间">
                          </el-date-picker>
                        </td>
                        <td style="width: 160px;">
                          <div v-show="!editshow">{{ item.endDate }}</div>
                          <el-date-picker style="width: 120px;" v-show="editshow" format="yyyy-MM"
                                          value-format="yyyy-MM"
                                          v-model="item.endDate"
                                          type="month"
                                          placeholder="请输入结束时间">
                          </el-date-picker>
                        </td>
                        <td>
                          <div v-show="!editshow"> {{ item.unitName }}</div>
                          <el-input v-show="editshow" style="width: 200px" v-model="item.unitName"
                                    placeholder="请输入学校/单位"></el-input>
                        </td>

                        <td>
                          <div v-show="!editshow"> {{ item.spec }}</div>
                          <el-input v-show="editshow" style="width: 300px" v-model="item.spec"
                                    placeholder="请输入专业"></el-input>
                        </td>

                        <td>
                          <div v-show="!editshow"> {{ item.position }}</div>
                          <el-input v-show="editshow" v-model="item.position" placeholder="请输入职务"></el-input>
                        </td>
                        <td v-show="editshow">
                          <el-button v-show="editshow" type="danger" size="small" @click="DelTab(item)">
                            <el-icon>
                              <Delete/>
                            </el-icon>
                            删除
                          </el-button>
                        </td>
                      </tr>


                    </table>

                  </div>
                  <div class="information-part-title1">
                    <div class="line"></div>
                    <div class="title">专业技术能力自述</div>
                  </div>
                  <div style="margin: 10px 0px 10px 30px;">
                    <el-col :span="24">
                      <!--                  <el-form-item>-->
                      <div class="wordWrap" v-show="!editshow">{{ form.specializationDesc }}</div>
                      <el-input v-show="editshow" type="textarea" show-word-limit maxlength="2000" rows="5"
                                style="width: 80%;"
                                v-model="form.specializationDesc"></el-input>
                      <!--                  </el-form-item>-->
                    </el-col>
                  </div>
                  <div class="information-part-title1-special">
                    <div
                        style="display: flex;align-items: center;justify-content: flex-start;"
                    >
                      <div class="line"></div>
                      <div class="title">证书</div>
                    </div>
                    <div>
                      <el-button size="mini" type="primary"
                      >两证模版查看
                      </el-button
                      >
                      <el-button size="mini" type="primary"
                      >证书添加流程
                      </el-button
                      >
                      <el-button size="mini" type="primary">添加证书</el-button>
                      <el-button size="mini" type="primary">查看两证</el-button>
                      <el-button size="mini" type="primary">上传处方章</el-button>
                    </div>
                  </div>
                  <div style="margin-left: 30px;">
                    <!--                  <el-col :span="24">-->
                    <el-form-item label="医师资格证">
                      <span>{{ form.practiceCertNo }}</span>
                    </el-form-item>
                    <!--                  </el-col>-->
                    <el-col :span="24">
                      <el-form-item label="医师执业证">
                        <span>{{ form.qualiCertNo }}</span>
                      </el-form-item>
                    </el-col>
                  </div>
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

        <div class="information-part" style="padding: 10px">
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
                  >{{
                      item_1.name
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
      </div>
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
        <el-button type="primary" @click="applyIntelligence">申 请</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {qualifyConfigBaseDetail, employeeSave} from "@/api/system/qualificationConfiguration/index";
import {
  employeeDetail,
  apply,
  auditLogList
} from "@/api/system/qualificationReview/index";
import {qualifyManageEmployeeDetail} from "@/api/system/qualityManagement/index";
import {parseTime} from "@/utils/index";
import {getUserInfo} from "@/utils/persistence";

export default {
  data() {
    return {
      editshow: false,
      activeNames: 1,
      applyDesc: "",
      dialogVisible: false,
      logLoading: false,
      logCustomerList: [],
      title: "",
      addform: {
        tableData: [],
      },
      rules: {
        productName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        productType: [{required: true, message: '请选择商品类型', trigger: 'change'}],
        productPrice: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
      },
      stateOptions: [
        {
          label: "提交申请",
          value: "0"
        },
        {
          label: "审核通过",
          value: "1"
        },
        {
          label: "驳回",
          value: "2"
        },
        {
          label: "重新提交申请",
          value: "3"
        },
        {
          label: "审核不通过",
          value: "4"
        },
        {
          label: "待审核",
          value: "5"
        },
        {
          label: "已授权",
          value: "6"
        },
        {
          label: "撤销授权",
          value: "7"
        },
        {
          label: "待授权",
          value: "8"
        },
        {
          label: "过期",
          value: "9"
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
        age: null,
        deptName: undefined,
        eduDegree: undefined,
        eduLevel: null,
        email: undefined,
        entryDate: undefined,
        specialization: null,
        languageLevel: null,
        trainingExperience: null,
        firstEdu: null,
        firstEduDesc: null,
        highestEduDesc: null,
        specializationDesc: null,
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
        workPhone: undefined,
        workExperienceList: []
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
          prop: "authLimitPer",
          label: "有效期",
          align: "center",
          width: "300",
          formatter: row => {
            if (row.authLimitPer == '1') {
              return "长期"
            } else if (row.authLimitPer == '2') {
              return (
                  parseTime(row.authStartTime, "{y}-{m}-{d}") +
                  " - " +
                  parseTime(row.authEndTime, "{y}-{m}-{d}")
              );
            }
          }

          /*      formatter: row => {
                  if (row.authStartTime && row.authEndTime) {
                    return (
                      parseTime(row.authStartTime, "{y}-{m}-{d}") +
                      " - " +
                      parseTime(row.authEndTime, "{y}-{m}-{d}")
                    );
                  } else {
                    return "";
                  }
                }*/
        },
        {
          prop: "state",
          label: "申请状态",
          align: "center",
          formatter: row => {
            let obj = this.stateOptions.find(
                element => element.value == row.state
            );
            return obj ? obj.label : "无";
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
                        padding: "0",
                        display:
                            params.row.state == 6 ||
                            params.row.state == 0 ||
                            params.row.state == 8
                                ? "none"
                                : ""
                        // display: inserted(["customer:customer:remove"])
                        //   ? ""
                        //   : "none",
                      },
                      on: {
                        click: () => {
                          this.handleSubmit(event, params.row);
                        }
                      }
                    },
                    "提交申请"
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
      qualifyId: undefined
    };
  },
  created() {
    this.employeeDetailApi();
    this.qualifyManageLevelsApi();
  },
  methods: {
    cancel() {
      this.employeeDetailApi();
      this.editshow = false;
    },
    saveedit() {
      console.log(this.form)
      employeeSave(this.form).then(res => {
        this.employeeDetailApi();
        this.$message.success("保存成功!")
        this.editshow = false;
        console.log(res)
      })
    },
    async AddTab() {
      //获取表格最后一行的id
      var pid = this.form.workExperienceList.length == 0 ? 0 : this.form.workExperienceList[this.form.workExperienceList.length - 1]?.id;
      //添加行数据
      var model = {
        id: pid + 1, employeeId: this.form.id, startDate: '', endDate: '', unitName: null
        , spec: null, position: null,
      }
      this.form.workExperienceList.push(model)
    },
    //删除行
    async DelTab(row) {
      console.log(row)
      //filter过滤数据
      this.form.workExperienceList = this.form.workExperienceList.filter(o => {
        return o.id != row.id
      })
    },
    calculateAge(birthDateString) {
      if (!birthDateString) return '未知';
      const birthDate = new Date(birthDateString); // 转为日期对象
      const today = new Date(); // 当前日期

      // 基础年龄 = 当前年 - 出生年
      let age = today.getFullYear() - birthDate.getFullYear();

      // 关键修正：检查今年生日是否已过
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
          monthDiff < 0 || // 当前月份 < 出生月份
          (monthDiff === 0 && today.getDate() < birthDate.getDate()) // 同月但当前日 < 出生日
      ) {
        age--; // 生日未到，年龄减1
      }
      return age;
    },
    applyIntelligence() {
      // qualifyId => id
      // catalogId => 父级id
      apply({catalogId: this.catalogId, qualifyId: this.qualifyId}).then(
          res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.$message({
                message: "申请成功",
                type: "success"
              });
              this.qualifyManageLevelsApi();
            }
          }
      );
    }
    ,
// 根据员工id查询员工详情
    employeeDetailApi() {
      employeeDetail({key: getUserInfo().acc}).then(res => {
        this.form = Object.assign(this.form, res.body);
      });
    }
    ,
    qualifyManageLevelsApi() {
      qualifyManageEmployeeDetail({key: getUserInfo().acc}).then(res => {
        this.data = res.body;
      });
    }
    ,
    getConfigList(id) {
      this.logLoading = true;
      this.logCustomerList = [];
      auditLogList({
        resId: id,
        applicantId: getUserInfo().acc,
        moduleType: "qualify"
      })
          .then(res => {
            this.logCustomerList = res.body;
          })
          .finally(() => {
            this.logLoading = false;
          });
    }
    ,
    getqualifyConfigBaseDetail(id) {
      qualifyConfigBaseDetail({key: id}).then(res => {
        if (res.body.id) {
          this.applyDesc = res.body.applyDesc;
        }
      });
    }
    ,
    handleExplain(e, row) {
      this.btnFlag = false;
      this.tableFlag = false;
      this.applyDesc = "";
      this.title = row.name + "-资质说明";
      this.dialogVisible = true;
      this.getqualifyConfigBaseDetail(row.id);
    }
    ,
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
    }
    ,
    handleLog(e, row) {
      this.btnFlag = false;
      this.tableFlag = true;
      this.title = row.name + "-审核日志";
      this.dialogVisible = true;
      this.getConfigList(row.id);
    }
    ,
    handleClose() {
      this.dialogVisible = false;
    }
  }
}
;
</script>
<style lang="scss" scoped>
.title-part {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #333;
  -webkit-print-color-adjust: exact;
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

  .information-part-title1-special {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(234, 243, 249);
    -webkit-print-color-adjust: exact;
    padding: 10px 10px;
    margin-bottom: 20px;

    .line {
      width: 5px;
      height: 16px;
      background: #4171fe;
      -webkit-print-color-adjust: exact;
      margin-right: 10px;
    }

    .title1 {
      font-size: 16px;
      color: #333;
      -webkit-print-color-adjust: exact;
      font-weight: 500;
    }
  }

  .information-part-title1 {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: rgb(234, 243, 249);
    -webkit-print-color-adjust: exact;
    padding: 10px 0px !important;
    //margin-bottom: 20px;

    .line {
      width: 5px;
      height: 16px;
      background: #4171fe;
      -webkit-print-color-adjust: exact;
      margin-right: 10px;
    }

    .title1 {
      font-size: 16px;
      color: #333;
      -webkit-print-color-adjust: exact;
      font-weight: 500;
    }
  }

  .information-title {
    font-size: 14px;
    color: #333;
    -webkit-print-color-adjust: exact;
    font-weight: 400;
  }
}

.btn-part {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wordWrap {
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  margin-bottom: 20px;
}

.table-cell-y {
  font-size: 14px;
  width: 99%;
  text-align: center;
  border-collapse: collapse;
  margin-top: 1px;
  margin-bottom: 20px;
}

.table-cell-y th {
  height: 30px;
  line-height: 30px;
  background-color: #eceef1;
  -webkit-print-color-adjust: exact;
  border-bottom: 1px solid #399cf4;
}

.table-cell-y tr td {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #399cf4;
}


@media print {
  /* 打印时隐藏不需要的元素 */
  button {
    display: none;
  }

  .noprint {
    display: none;
  }
  .table-cell-print {
    position: relative;
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
