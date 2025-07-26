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
        <el-form-item label="申请人" prop="applicant">
          <el-input
            v-model="queryParams.applicant"
            placeholder="请输入申请人"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资质类别" prop="catalogld">
          <el-select v-model="queryParams.catalogld" placeholder="请选择资质类别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资质名称" prop="catalogName">
          <el-input
            v-model="queryParams.catalogName"
            placeholder="请输入资质名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资质状态" prop="state">
          <el-select v-model="queryParams.state" placeholder="请选择资质类别">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="allFlag">
          <el-select v-model="queryParams.allFlag" placeholder="请选择资质类别">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
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
      <el-dialog
    title="审核日志"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose">
    <Table
        v-loading="logLoading"
        :table-list="logCustomerList"
        :prop-list="logColumns"
      ></Table>
  </el-dialog>
    </div>
  </template>
  <script>
  import { applyList, auditLogList } from "@/api/system/qualificationReview/index";
  import { catalogList } from "@/api/system/catalog/index";
  import { parseTime } from "@/utils/index";
  export default {
    data() {
      return {
        options: [],
        stateOptions: [
          {
            label: "提交申请",
            value: "0"
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
              label: '过期',
              value: '9'
          },
          {
            label: "待授权",
            value: "8"
          },
          {
              label: '审核不通过',
              value: '4'
          },
          {
              label: '驳回',
              value: '2'
          },
        ],
        stateOptions_: [
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
        departmentOptions: [
          {
            label: "本部门",
            value: false
          },
          {
            label: "所有部门",
            value: true
          }
        ],
        rules: {},
        showSearch: true,
        queryParams: {
          operator: "",
          applicant: "",
          catalogld: "",
          catalogName: "",
          state: "",
          allFlag: false,
          pageNum: 1,
          pageSize: 10
        },
        statusList: [],
        total: 0,
        loading: false,
        customerList: [],
        columns: [
          {
            prop: "qualifyName",
            label: "资质名称",
            align: "center"
          },
          {
            prop: "authLimitPer",
            label: "有效日期",
            align: "center",
            formatter: row => {
              if (row.authLimitPer=='1'){
                return "长期"
              }else if (row.authLimitPer=='2'){
                return parseTime(row.authEndTime, "{y}-{m}-{d}")
              }
            }
          },
          {
            prop: "applicant",
            label: "申请人",
            align: "center"
          },
          {
            prop: "applyTime",
            label: "申请时间",
            align: "center",
            formatter: row => {
              return parseTime(row.applyTime);
            }
          },
          {
            prop: "flowDeptName",
            label: "审核/授权部门",
            align: "center"
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
                      padding: "0",
                      display: params.row.state == 0 || params.row.state == 8
                        ? ""
                        : "none",
                    },
                    on: {
                      click: () => {
                        this.authorize(event, params.row);
                      }
                    }
                  },
                  "审核与授权"
                ),
                  h(
                    "el-button",
                    {
                      props: {
                        type: "text",
                        size: "mini",
                        // icon: "el-icon-delete"
                      },
                      style: {
                        padding: "0"
                        // display: inserted(["customer:customer:remove"])
                        //   ? ""
                        //   : "none",
                      },
                      on: {
                        click: () => {
                          this.inspect(event, params.row);
                        }
                      }
                    },
                    "查看审核日志"
                  )
              );
              return h("div", arr);
            }
          }
          //   {
          //     prop: "createTime",
          //     label: "操作时间",
          //     align: "center",
          //     formatter: row => {
          //     return parseTime(row.createTime)
          //   }
          //   }
        ],
        dialogVisible: false,
        logLoading: false,
        logCustomerList: [],
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
              let obj = this.stateOptions_.find(element => element.value == row.operType);
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
        ]
      };
    },
    created() {
      this.getList();
      catalogList({ type: "qualify" }).then(res => {
        this.options = res.body;
      });
    },
    methods: {
      authorize(e, row) {
        this.$router.push({
          path: "/system/qualificationDetail",
          query: { id: row.id }
        });
      },
      inspect(e, row) {
          this.logCustomerList = []
          this.dialogVisible = true;
          this.logLoading = true
          auditLogList({resId: row.qualifyId, applicantId: row.applicantId,moduleType: "qualify"}).then(res => {
              this.logCustomerList = res.body
          })
          .finally(()=> {
              this.logLoading = false
          })
      },
      handleClose() {
          this.dialogVisible = false;
      },
      handleQuery() {
        this.getList();
      },
      resetQuery() {
        this.$refs["queryForm"].resetFields();
      },
      getList() {
        this.loading = true;
        this.customerList = [];
        applyList(this.queryParams)
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
