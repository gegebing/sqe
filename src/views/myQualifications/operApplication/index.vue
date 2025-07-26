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
      <el-form-item label="手术编码/名称" prop="oper">
        <el-input
          v-model="queryParams.oper"
          placeholder="请输入手术编码/名称"
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
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane name="5">
        <span slot="label">可申请（{{num1}}）</span>
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
      </el-tab-pane>
      <el-tab-pane name="0">
        <span slot="label">申请中（{{num2}}）</span>
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
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label">已授权（{{num3}}）</span>
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
      </el-tab-pane>
      <el-tab-pane name="all">
        <span slot="label">全部（{{num4}}）</span>
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
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="手术权限申请"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="queryForm" size="small" label-width="180px">
        <el-form-item label="当前申请手术：" prop="operName">
          <span>{{ form.operName }}{{ form.operCode }}</span>
        </el-form-item>
        <el-form-item label="当前申请手术等级：" prop="operLevel">
          <span>{{ form.operLevel }}</span>
        </el-form-item>
        <el-form-item label="当前申请手术要求资质：" prop="techLevel">
          <span>{{ form.techLevel }}</span>
        </el-form-item>
        <el-form-item label="您的资质：" prop="applicantTechLevel">
          <span>{{ form.applicantTechLevel }}</span>
        </el-form-item>
        <el-form-item label="您已参与该手术：" prop="applicantOperCnt">
          <span>{{ form.applicantOperCnt }}次</span>
        </el-form-item>
        <el-form-item label="" prop="">
          <img style="width: 400px;" src="@/assets/images/icons.png" alt="" />
        </el-form-item>
      </el-form>
      <span v-if="form.pass" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
      <div
        v-else
        slot="footer"
        class="dialog-footer"
        style="color: brown;font-size: 14px;width: 100%;text-align: center"
      >
        您不符合申请该手术的资质要求，若有疑问，请联系医务处(Te18005)
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  operAuthPage,
  operAuthApply,
  operAuthApplyCheck,
  operAuthStatus
} from "@/api/operAuth";
import { deptList } from "../../../api/operQualify/index.js";
import { parseTime } from "@/utils/index";
import { getUserInfo } from "@/utils/persistence";
export default {
  data() {
    return {
      stateList: [
        {
          id: "5",
          name: "可申请"
        },
        {
          id: "0",
          name: "申请中"
        },
        {
          id: "1",
          name: "已授权"
        },
        {
          id: "",
          name: "全部"
        }
      ],
      dialogVisible: false,
      form: { pass: false },
      columns: [
        {
          prop: "name",
          label: "手术名称",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.name);
          }
        },
        {
          prop: "level",
          label: "手术等级",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.level);
          }
        },
        {
          prop: "riskFlag",
          label: "手术类型",
          align: "center",
          render(h, params) {
            return h("span", params.row.operBaseInfo.riskFlag);
          }
        },
        {
          prop: "directFlag",
          label: "是否需要指导医师",
          align: "center",
          render(h, params) {
            if (params.row.directFlag) {
              return h("span", "是");
            } else {
              return h("span", "否");
            }
          }
        },
        {
          prop: "remark",
          label: "备注",
          align: "center"
        },
        {
          prop: "state",
          label: "状态",
          align: "center",
          formatter: row=> {
            if (row.state) {
                // row.state匹配stateList中id字段返回name
                return this.stateList.find(item => item.id == row.state).name;
            } else{
                 return ''
            }
          }
        },
        {
          prop: "authTime",
          label: "授权时间",
          align: "center",
          formatter: row => {
            if (row.authTime) {
              return parseTime(row.authTime);
            } else {
              return "";
            }
          }
        },
        {
          prop: "applyTime",
          label: "申请时间",
          align: "center",
          formatter: row => {
            if (row.applyTime) {
              return parseTime(row.applyTime);
            } else {
              return "";
            }
          }
        },
        {
          prop: "lastAuditTime",
          label: "最后审批时间",
          align: "center",
          formatter: row => {
            if (row.lastAuditTime) {
              return parseTime(row.lastAuditTime);
            } else {
              return "";
            }
          }
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "100",
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
                    padding: "0",
                    // display: params.row.state == "5" ? "" : "none"
                    display: params.row.state == "2" || params.row.state == "3" || !params.row.state ? "" : "none"
                  },
                  on: {
                    click: () => {
                      this.handleExplain(event, params.row);
                    }
                  }
                },
                "申请"
              )
            );
            return h("div", arr);
          }
        }
      ],
      dataList: [],
      loading: false,
      total: 0,
      showSearch: true,
      queryParams: {
        oper: "",
        state: "5",
        applicantId: getUserInfo().acc,
        pageNum: 1,
        pageSize: 10
      },
      departmentList: [],
      operIds: [],
      activeName: "5",
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0
    };
  },
  created() {
    this.getList();
    deptList().then(res => {
      this.departmentList = res.body;
    });
  },
  methods: {
    operAuthStatusApi() {
        operAuthStatus({state: "5,0,1"}).then(res => {
            if (res.body && res.body.length > 0) {
                this.num1 = res.body.find(item => item.key == "5").value;
                this.num2 = res.body.find(item => item.key == "0").value;
                this.num3 = res.body.find(item => item.key == "1").value;
                this.num4 = res.body.find(item => item.key == "all").value;
            }
        })
    },
    handleClick(tab, event) {
        this.activeName = tab.name
        console.log(this.activeName);
      let state = tab.name == "all" ? "" : tab.name;
      this.queryParams.state = state;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getList() {
        this.operAuthStatusApi()
      this.loading = true;
      this.dataList = [];
      operAuthPage(this.queryParams)
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
    },
    handleExplain(e, row) {
        this.operIds = []
      this.operIds.push(row.operBaseInfo.id);
      this.dialogVisible = true;
      operAuthApplyCheck({ key: row.operBaseInfo.id }).then(res => {
        this.form = Object.assign({}, res.body);
      });
    },
    onSubmit() {
      operAuthApply({ operIds: this.operIds }).then(res => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.dialogVisible = false;
        this.getList();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
