<template>
  <div class="app-container">
    <el-form
      v-if="showSearch"
      :model="queryParams"
      ref="queryForm"
      label-position="left"
      size="small"
      :inline="true"
      label-width="60px"
    >
      <el-form-item label="工号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择部门"
          filterable
        >
          <el-option
            v-for="dict in departmentList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="techQualifyCode">
        <el-select
          v-model="queryParams.techQualifyCode"
          placeholder="请选择职称"
          filterable
        >
          <el-option
            v-for="dict in techQualifyList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
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
      :table-list="tableData"
      :prop-list="columns"
    ></Table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-tabs type="border-card">
        <el-tab-pane v-for="(item, index) in infoData" :key="index">
          <template slot="label">
            <span>{{ item.name }}</span>
            <span>{{ item.total }}</span>
          </template>
          <div class="clearfix" v-if="item.child || item.child.length > 0">
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
                    :prop-list="columnsPerson"
                    @handleSelectionChange="handleSelectionChange"
                    @tableSelect="tableSelect"
                    ></Table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">{{bindFlag? '添 加' : '解 绑'}}</el-button>
        <el-button @click="open = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  employeePage,
  batchQualify
} from "@/api/employeesAualifications/index";
import { deptList } from "@/api/operQualify/index";
import { qualifyManageEmployeeDetail } from "@/api/system/qualityManagement/index";
export default {
  data() {
    return {
      title: "",
      open: false,
      queryParams: {
        deptId: "",
        id: "",
        name: "",
        techQualifyCode: "",
        pageNum: 1,
        pageSize: 10
      },
      departmentList: [],
      tableData: [],
      techQualifyList: [],
      showSearch: true,
      total: 0,
      loading: false,
      columns: [
        {
          prop: "id",
          label: "工号",
          align: "center"
        },
        {
          prop: "name",
          label: "姓名",
          align: "center"
        },
        {
          prop: "deptName",
          label: "科室",
          align: "center"
        },
        {
          prop: "eduDegree",
          label: "学位",
          align: "center"
        },
        {
          prop: "techQualifyCode",
          label: "职称",
          align: "center"
        },
        {
          label: "操作",
          align: "right",
          fixed: "right",
          width: "200",
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
                      this.handleNotSet(event, params.row);
                    }
                  }
                },
                "未绑定资质"
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
                      this.handleAlreadySet(event, params.row);
                    }
                  }
                },
                "已绑定资质"
              )
            );
            return h("div", arr);
          }
        }
      ],
      columnsPerson: [
        {
          type: "selection",
          align: "center"
        },
        {
          prop: "code",
          label: "编码",
          align: "center"
        },
        {
          prop: "name",
          label: "资质名称",
          align: "center"
        }
      ],
      infoData: [],
      qualifyList: [],
      employee: undefined,
      bindFlag: false
    };
  },
  created() {
    this.getEmployeePage();
    deptList().then(res => {
      this.departmentList = res.body;
    });
  },
  methods: {
    handleQuery() {
      this.getEmployeePage();
    },
    async getEmployeePage() {
      this.loading = true;
      this.tableData = [];
      const res = await employeePage(this.queryParams);
      this.tableData = res.body.list;
      this.loading = false;
    },
    getList() {
      this.getEmployeePage();
    },
    handleNotSet(e, row) {
      this.open = true;
      this.title = "未绑定资质";
      this.qualifyList = [];
      this.bindFlag= true
      this.employee= row
      qualifyManageEmployeeDetail({ key: row.id, qualifyBind: false }).then(
        res => {
          this.infoData = res.body;
        }
      );
    },
    handleAlreadySet(e, row) {
      this.open = true;
      this.title = "已绑定资质";
      this.qualifyList = [];
      this.bindFlag= false
      this.employee= row
      qualifyManageEmployeeDetail({ key: row.id, qualifyBind: true }).then(
        res => {
          this.infoData = res.body;
        }
      );
    },
    resetQuery() {
      this.$refs["queryForm"].resetFields();
    },
    handleSelectionChange(val) {
      console.log(val);
    },
    tableSelect(flag, row) {
      if (flag) {
        this.qualifyList.push({
          catalogId: row.catalogId,
          id: row.id,
          name: row.name
        });
        console.log(this.qualifyList);
      } else {
        this.qualifyList = this.qualifyList.filter(item => {
          return item.id !== row.id;
        });
      }
    },
    add() {
      batchQualify({
        bind: this.bindFlag,
        employeeId: this.employee.id,
        employeeName: this.employee.name,
        qualifyList: this.qualifyList
      }).then(res => {
        this.open = false;
        this.getEmployeePage();
        this.$message.success("操作成功");
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.clearfix {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
