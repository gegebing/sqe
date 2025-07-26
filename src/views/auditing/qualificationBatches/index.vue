<template>
  <div class="app-container">
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
    <el-dialog title="设置员工" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        label-width="60px"
      >
        <el-form-item label="科室" prop="deptName">
          <el-input
            size="mini"
            v-model="queryParams.deptName"
            placeholder="请输入科室"
            clearable
          />
        </el-form-item>
        <el-form-item label="员工" prop="employeeName">
          <el-input
            size="mini"
            v-model="queryParams.employeeName"
            placeholder="请输入员工"
            clearable
          />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="onSubmit">搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        :data="treeData"
        show-checkbox
        ref="treeRef"
        node-key="id"
        :props="defaultProps"
      >
      </el-tree>
      <span slot="footer">
        <el-button type="primary" @click="certain">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { qualifyManageLevels } from "@/api/system/qualificationConfiguration/index";
import { qualifyManageEmployeeDetail } from "@/api/system/qualityManagement/index";
import {
  deptGroup,
  qualifyBatchEmployee
} from "@/api/system/qualificationBatches/index";
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "employees",
        label: "name"
      },
      queryParams: {
        deptName: "",
        employeeName: ""
      },
      dialogVisible: false,
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
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleSet(event, params.row);
                    }
                  }
                },
                "设置员工"
              )
            );
            return h("div", arr);
          }
        }
      ],
      catalogId: undefined,
      catalogName: undefined,
      qualifyId: undefined
    };
  },
  created() {
    this.qualifyManageLevelsApi();
  },
  methods: {
    certain() {
      const checkedNodes = this.$refs.treeRef.getCheckedNodes();
      let employeeDtos = [];
      checkedNodes.forEach(element => {
        if (!element.employees || element.employees.length == 0) {
          employeeDtos.push(element);
        }
      });
      qualifyBatchEmployee({
        catalogId: this.catalogId,
        catalogName: this.catalogName,
        employeeDtos: employeeDtos,
        qualifyId: this.qualifyId

      }).then(res => {
        if (res.code == 200) {
          this.$message.success("设置成功");
          this.dialogVisible = false;
        }
      });
    },
    qualifyManageLevelsApi() {
      qualifyManageLevels().then(res => {
        this.data = res.body;
      });
    },
    handleSet(e, row) {
      this.catalogId = row.catalogId;
      this.catalogName = row.catalogName;
      this.dialogVisible = true;
      this.qualifyId = row.id;
      deptGroup(Object.assign(this.queryParams, { qualifyId: this.qualifyId })).then(
        res => {
          this.treeData = res.body;
        }
      );
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onSubmit() {
      this.treeData = [];
      deptGroup(Object.assign(this.queryParams, { qualifyId: this.qualifyId })).then(
          res => {
            this.treeData = res.body;
          }
        );
    },
  },
};
</script>
<style lang="scss" scoped></style>
