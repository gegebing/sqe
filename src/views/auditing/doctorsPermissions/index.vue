<template>
  <div class="app-container">
    <el-form
      v-if="showSearch"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="姓名" prop="employeeName">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="employeeId">
        <el-input
          v-model="queryParams.employeeId"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <Table
      v-loading="loading"
      :table-list="customerList"
      :prop-list="columns"
    ></Table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { employeeQualify } from "@/api/qualifyFlow";
export default {
  data() {
    return {
      rules: {},
      showSearch: true,
      queryParams: {
        employeeName: "",
        employeeId: "",
        dictName: "医生",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      customerList: [],
      columns: [
        {
          prop: "deptId",
          label: "部门编码",
          align: "center"
        },
        {
          prop: "deptName",
          label: "部门名称",
          align: "center"
        },
        {
          prop: "employeeId",
          label: "员工工号",
          align: "center"
        },
        {
          prop: "employeeName",
          label: "员工名称",
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          align: "center"
        },
        {
            prop: 'clinic',
            label: '门诊工作权限',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.clinic) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'emergency',
            label: '急诊工作权限',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.emergency) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'useBlood',
            label: '用血申请',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.useBlood) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'hisGeneral',
            label: '院内普通会诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.hisGeneral) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'hisDifficult',
            label: '院内疑难会诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.hisDifficult) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'hisConsult',
            label: '院外会诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.hisConsult) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'antiUnrestrict',
            label: '抗菌药物（非限制类）',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.antiUnrestrict) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'antiRestrict',
            label: '抗菌药物（限制类）',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.antiRestrict) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'antiSpecial',
            label: '抗菌药物（特殊使用级）',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.antiSpecial) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'medicalDrug',
            label: '医疗用毒性药品(包含化疗药）',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.medicalDrug) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'spirit',
            label: '精神药品、麻醉药品(包含化镇静剂）',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.spirit) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'mdSedation',
            label: '中深度镇静',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.mdSedation) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'operDoc',
            label: '手术/有创操作相关文书',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.operDoc) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'inpatientRecord',
            label: '住院病程录书写',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.inpatientRecord) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'inpatientAudit',
            label: '住院病程录查阅',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.inpatientAudit) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'emergency',
            label: '住院病程录审阅',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.emergency) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'leaveDoc',
            label: '出院文书',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.leaveDoc) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'diseaseCert',
            label: '疾病证明',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.diseaseCert) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'leaveCert',
            label: '请假证明',
            align: 'center',
            render(h, params) {
                console.log(params.row.doctorQualify.leaveCert);
                if (params.row.doctorQualify.leaveCert) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'specialDept',
            label: '专病门诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.specialDept) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'specialist',
            label: '专家门诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.specialist) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'specialService',
            label: '特需门诊',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.specialService) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
        {
            prop: 'prescribe',
            label: '处方权限',
            align: 'center',
            render(h, params) {
                if (params.row.doctorQualify.prescribe) {
                    return h('span', '有')
                } else {
                    return h('span', '无')
                }
            },
        },
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
    },
    getList() {
      this.loading = true;
      this.customerList = [];
      employeeQualify(this.queryParams)
        .then(res => {
          this.customerList = res.body.list;
          this.total = res.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
