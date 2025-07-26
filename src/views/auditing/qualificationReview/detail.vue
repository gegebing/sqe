<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>资质详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回</el-button>
      </div>
      <div class="title-part">
        <div class="title-part-left"><span style="margin-right: 15px;">申请资质:<span
          class="title-part-text">{{ formDetail.catalogName }}</span></span><span>申请时间:<span
          class="title-part-text">{{ formDetail.applyTime }}</span></span></div>
        <div class="title-part-right"><span>当前处理人:<span class="title-part-text">{{
            formDetail.applicant
          }}</span></span></div>
      </div>
      <div class="information-part">
        <div class="information-part-title">
          <div class="line"></div>
          <div class="title">申请人基本信息</div>
        </div>
        <div class="title">
          <el-form
            ref="form"
            label-position="left"
            :model="form"
            label-width="110px"
          >
            <el-row>
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
              <el-col :span="6">
                <el-form-item label="工号">
                  <span>{{ form.id }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证号">
                  <span>{{ form.idCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="政治面貌">
                  <span>{{ form.politicalCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最高学历">
                  <span>{{ form.eduLevel }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="科室">
                  <span>{{ form.deptName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="医师资格证">
                  <!-- <span>{{ form.name }}</span> -->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="医师执业证">
                  <!-- <span>{{ form.name }}</span> -->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来院时间">
                  <span>{{ form.entryDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="参加工作年月">
                  <span>{{ form.workDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学位">
                  <span>{{ form.eduDegree }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="聘用职称">
                  <span>{{ form.techQualifyCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系方式">
                  <span>{{ form.mobile }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="医师资格证照片">
                  <!-- <span>{{ form.name }}</span> -->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="医师执业证照片">
                  <!-- <span>{{ form.name }}</span> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="information-part">
        <div class="information-part-title">
          <div class="line"></div>
          <div class="title">审核记录</div>
        </div>
          <Table
            v-loading="loading"
            :table-list="customerList"
            :prop-list="columns"
          ></Table>
      </div>
      <div class="information-part">
        <div class="information-part-title">
          <div class="line"></div>
          <div class="title">审核结果</div>
        </div>
        <div class="result-part">
          <div v-for="(item, index) in resultsList" :key="index">
            <div class="information-title">
              {{ item.deptName }} {{ item.operator }} {{ formatState(item.state) }}
            </div>
          </div>
        </div>
      </div>
      <div class="information-part">
        <div class="information-part-title">
          <div class="line"></div>
          <div class="title">{{ formDetail.flowDeptName }}</div>
        </div>
        <div class="date" v-if="formDetail.flowDeptName=='医务处'">
          <el-row>
            <el-col :span="4">
              <div style="padding: 14px 0px ">
                <el-radio-group
                  v-model="authLimitPer"
                  @change="changeExp"
                >
                  <el-radio label="1">长期</el-radio>
                  <el-radio label="2">短期</el-radio>
                </el-radio-group>
              </div>

              <!--                <el-select
                                v-model="authLimitPer"
                                placeholder="请选择有效期"
                                size="large"
                                style="width: 240px"
                                @change="changeExp"
                                clearable
                              >
                                <el-option  label="长期" value="1"/>
                                <el-option  label="短期" value="2"/>
                              </el-select>-->
            </el-col>
            <el-col :span="6">
              <div class="block" v-if="!showPicker">
                <el-date-picker
                  v-model="authEndTime"
                  type="date"
                  placeholder="请选择授权截止日期"
                  format="yyyy-MM-dd"
                />
              </div>
            </el-col>
          </el-row>
        </div>
        <p>提示：</p>
        <p>
          审核说明（若审核不通过，请在下面审核说明中写明不通过的具体原因，以供申请人查看。）:
        </p>
        <el-input
          disabled
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </div>
      <div class="btn-part">
        <el-button type="primary" @click="goBack">确定</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  applyResult,
  employeeDetail,
  auditLogList,
  applyDetail,
  applyAuth
} from "@/api/system/qualificationReview/index";
import {parseTime} from "@/utils/index";
import {qualifyConfigDetail} from "@/api/system/qualificationConfiguration/index";

export default {
  data() {
    return {
      showPicker: true,
      authLimitPer: '',//有效期
      authEndTime: '',//截止日期
      textarea: "",
      loading: false,
      customerList: [],
      columns: [
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
            let obj = this.stateOptions.find(element => element.value == row.operType);
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
      form: {},
      resultsList: [],
      formDetail: {
        applicant: undefined,
        applicantId: undefined,
        applyTime: undefined,
        catalogId: undefined,
        catalogName: undefined,
        flowDeptId: undefined,
        flowDeptName: undefined,
        id: undefined,
        qualifyId: undefined,
        qualifyName: undefined,
        state: undefined
      },
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
      ]
    };
  },
  created() {
    if (this.$route.query.id) {
      applyDetail({key: this.$route.query.id}).then(res => {
        this.formDetail = res.body;
        console.log(res.body)
        this.formDetail.applyTime = parseTime(this.formDetail.applyTime)
        this.employeeDetailApi();
        this.applyResultApi();
        this.applyListApi();
      });

    }
  },
  methods: {
    formatState(val) {
      let obj = this.stateOptions.find(element => element.value == val);
      return obj ? obj.label : "";
    },
    // 审核记录
    applyListApi() {
      auditLogList({
        moduleType: "qualify",
        applyId: this.$route.query.id
      }).then(res => {
        this.customerList = res.body
      });
    },
    // 资质审核结果查询
    applyResultApi() {
      applyResult({applyId: this.formDetail.id}).then(res => {
        this.resultsList = res.body;
      });
    },
    // 根据员工id查询员工详情
    employeeDetailApi() {
      employeeDetail({key: this.formDetail.applicantId}).then(res => {
        this.form = Object.assign(this.form, res.body)
      });
    },
    changeExp(e) {
      if (e == 2) {
        this.showPicker = false
      } else {
        this.showPicker = true
      }
    },
    applyAuthBtn(val) {
      let data = {
        applyId: this.formDetail.id,
        description: this.textarea,
        state: val,
        authEndTime: this.authEndTime,
        authLimitPer: this.authLimitPer
      }
      if (this.formDetail.flowDeptName == '医务处') {
        switch (val) {
          case "1":
            if (data.authLimitPer == "") {
              this.$message.error("请选择授权有效期");
              console.log("请选择授权有效期")
              return;
            } else if (data.authLimitPer == "2" && data.authEndTime == "") {
              this.$message.error("请选择截止日期");
              console.log("请选择截止日期")
              return;
            }
            break;
          case "4":
            if (data.description == "") {
              // this.$message.error("请选填写审核说明");
              console.log("请选填写审核说明")
              // return;
            }
            break;
        }
      }
      console.log(data)
      applyAuth(data).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.$router.go(-1)
        }
      })
    },
    goBack() {
      this.$router.go(-1)
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
  margin-bottom: 20px;

  .information-part-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #F5F7FA;
    padding: 10px 0px;
    margin-bottom: 20px;

    .line {
      width: 5px;
      height: 16px;
      background: #4171FE;
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
