<template>
  <div class="app-container">
    <el-form
      v-if="showSearch"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="关键字" prop="operKey">
        <el-input
          v-model="queryParams.operKey"
          placeholder="请输入手术编码/名称/医生姓名/医生工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间" prop="dateTime">
        <el-date-picker
          v-model="queryParams.dateTime"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
      :table-list="dataList"
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
import { qualifyFlowPage } from "@/api/system/qualificationLog/index";
import { parseTime } from "@/utils/index";
export default {
  data() {
    const typeFomat = value => {
      let str = "";
      switch (value) {
        case "1":
          str = "审批通过";
          break;
        case "2":
          str = "审批不通过";
          break;
        case "3":
          str = "被取消";
          break;
        case "4":
          str = "待审核";
          break;
        case "5":
          str = "可申请";
          break;
        default:
          break;
      }
      return str;
    };
    return {
      columns: [
        {
          prop: "createTime",
          label: "时间",
          align: "center",
          formatter: row => {
            return parseTime(row.createTime);
          }
        },
        {
          prop: "state",
          label: "内容",
          align: "center",
          width: 600,
          formatter: (row, column, value) => {
            return `审批人：${row.operator}  ${typeFomat(row.operType)}  ${
              row.applicant
            }（${row.applicantId}）的 ${row.resName} ${
              row.resCode
            }手术权限申请`;
          }
        },
        {
          prop: "operator",
          label: "操作者",
          align: "center"
        },
        {
          prop: "description",
          label: "备注",
          align: "center"
        }
      ],
      dataList: [],
      loading: false,
      total: 0,
      showSearch: true,
      queryParams: {
        operKey: "",
        dateTime: [],
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.dataList = [];
      let obj = {};
      if (this.queryParams.dateTime.length > 0) {
        obj = {
          moduleType: "oper",
          startTime: this.queryParams.dateTime[0],
          endTime: this.queryParams.dateTime[1],
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        };
      } else {
        obj = {
          moduleType: "oper",
          startTime: "",
          endTime: "",
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        };
      }
      qualifyFlowPage(obj)
        .then(res => {
          this.dataList = res.body.list;
          this.total = res.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped></style>
