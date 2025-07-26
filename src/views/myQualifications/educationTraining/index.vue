<script>
import {
  eduTrainPage,
  eduTrainAdd,
  eduTrainDelete,
  eduTrainUpdate,
  eduTrainAudit
} from "@/api/eduTrain/index";
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      activeName: "H",
      loading_h: false,
      hospitalList: [],
      title: "新增培训记录",
      open: false,
      trainForm: {
        date: [],
        name: "",
        org: "",
        location: "",
        cert: "",
        description: "",
        id: undefined
      },
      columns_h: [
        {
          prop: "name",
          label: "培训名称",
          align: "center"
        },
        {
          prop: "cert",
          label: "获得证书",
          align: "center"
        },
        {
          prop: "startDate",
          label: "培训时间",
          align: "center",
          width: 180,
          formatter: row => {
            return row.startDate + " - " + row.endDate;
          }
        },
        {
          prop: "org",
          label: "培训机构",
          align: "center"
        },
        {
          prop: "auditState",
          label: "审核状态",
          align: "center",
          formatter: row => {
            if (row.auditState) {
                let obj = this.stateOptions.find(
                  element => element.value == row.auditState
                );
                return obj ? obj.label : "无";
            } else {
                return ''
            }
          }
        },
        {
          prop: "auditor",
          label: "审核人",
          align: "center"
        },
        {
          prop: "auditTime",
          label: "审核时间",
          align: "center",
          formatter: row => {
            if(row.auditTime){
                return parseTime(row.createTime)
            } else {
                return ''
            }
          }
        },
        {
          prop: "description",
          label: "描述信息",
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
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.auditState && params.row.auditState == '0'
                      ? ""
                      : "none",
                  },
                  on: {
                    click: () => {
                      this.handleCheck_h(event, params.row);
                    }
                  }
                },
                "审核"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.auditState && params.row.auditState == '2'
                      ? ""
                      : "none",
                  },
                  on: {
                    click: () => {
                      this.handleEdit_h(event, params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-delete"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleDelete_h(event, params.row);
                    }
                  }
                },
                "删除"
              )
            );
            return h("div", arr);
          }
        }
      ],
      stateOptions: [
          {
            label: "待审核",
            value: "0"
          },
          {
              label: '审核通过',
              value: '1'
          },
          {
              label: '审核不通过',
              value: '2'
          },
        ],
      total_h: 0,
      queryParams_h: {
        pageNum: 1,
        pageSize: 10
      },
      loading_p: false,
      personalList: [],
      columns_p: [
        {
          prop: "name",
          label: "培训名称",
          align: "center"
        },
        {
          prop: "cert",
          label: "获得证书",
          align: "center"
        },
        {
          prop: "startDate",
          label: "培训时间",
          align: "center",
          width: 180,
          formatter: row => {
            return row.startDate + " - " + row.endDate;
          }
        },
        {
          prop: "org",
          label: "培训机构",
          align: "center"
        },
        {
          prop: "auditState",
          label: "审核状态",
          align: "center",
          formatter: row => {
            if (row.auditState) {
                let obj = this.stateOptions.find(
                  element => element.value == row.auditState
                );
                return obj ? obj.label : "无";
            } else {
                return ''
            }
          }
        },
        {
          prop: "auditor",
          label: "审核人",
          align: "center"
        },
        {
          prop: "auditTime",
          label: "审核时间",
          align: "center",
          formatter: row => {
            if(row.auditTime){
                return parseTime(row.createTime)
            } else {
                return ''
            }
          }
        },
        {
          prop: "description",
          label: "描述信息",
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
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.auditState && params.row.auditState == '0'
                      ? ""
                      : "none",
                  },
                  on: {
                    click: () => {
                      this.handleCheck_p(event, params.row);
                    }
                  }
                },
                "审核"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0",
                    display: params.row.auditState && params.row.auditState == '2'
                      ? ""
                      : "none",
                  },
                  on: {
                    click: () => {
                      this.handleEdit_p(event, params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-delete"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleDelete_p(event, params.row);
                    }
                  }
                },
                "删除"
              )
            );
            return h("div", arr);
          }
        }
      ],
      total_p: 0,
      queryParams_p: {
        pageNum: 1,
        pageSize: 10
      },
      showSearch: true,
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        date: [{ required: true, message: "请选择时间范围", trigger: "change" }],
        org: [{ required: true, message: "请输入培训机构", trigger: "blur" }],
        location: [
          { required: true, message: "请输入培训地点", trigger: "blur" }
        ],
        cert: [{ required: true, message: "请输入获得证书", trigger: "blur" }]
      },
      titleCheck: '',
      openCheck: false,
      trainFormCheck: {
        id: null,
        remark: '',
        auditState: null
      }
    };
  },
  created() {
    this.getList_h(); 
    this.getList_p();
  },
  methods: {
    submitTrainFormCheck(val) {
         this.trainFormCheck.auditState = val
        eduTrainAudit(this.trainFormCheck).then(res => {
            this.$message({
                type: "success",
                message: "操作成功!"
              });
            this.openCheck = false;
            this.getList_h();
            this.getList_p();
        })
    },
    handleAdd() {
      this.open = true;
      this.title = `新增${this.activeName == "H" ? "院级" : "个人"}培训记录`;
        this.trainForm = {
            date: [],
            name: "",
            org: "",
            location: "",
            cert: "",
            description: "",
            id: undefined
        }
    },
    submitTrainForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            this.trainForm.startDate = this.trainForm.date[0];
            this.trainForm.endDate = this.trainForm.date[1];
            this.trainForm.type = this.activeName;
            let obj = Object.assign({}, this.trainForm);
            delete obj.date;
          if (this.trainForm.id) {
            eduTrainUpdate(obj).then(res => {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.open = false;
              this.getList_h();
              this.getList_p();
            });
          } else {
            eduTrainAdd(obj).then(res => {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.open = false;
              this.getList_h();
              this.getList_p();
            });
          }
        } else {
          return false;
        }
      });
    },
    handleEdit_p(event, row) {
      this.open = true;
      this.title = `修改${this.activeName == "H" ? "院级" : "个人"}培训记录`;
      this.trainForm = {
        date: [row.startDate, row.endDate],
        name: row.name,
        org: row.org,
        location: row.location,
        cert: row.cert,
        description: row.description,
        id: row.id
      }
    },
    handleEdit_h(event, row) {
      this.open = true;
      this.title = `修改${this.activeName == "H" ? "院级" : "个人"}培训记录`;
      this.trainForm = {
        date: [row.startDate, row.endDate],
        name: row.name,
        org: row.org,
        location: row.location,
        cert: row.cert,
        description: row.description,
        id: row.id
      }
    },
    handleCheck_p(event, row) {
        this.openCheck = true;
        this.titleCheck = `${this.activeName == "H" ? "院级培训" : "个人教育培训"}审核`;
        this.trainFormCheck = {
            id: row.id,
            remark: '',
            auditState: null
        }
    },
    handleCheck_h(event, row) {
        this.openCheck = true;
        this.titleCheck = `${this.activeName == "H" ? "院级培训" : "个人教育培训"}审核`;
        this.trainFormCheck = {
            id: row.id,
            remark: '',
            auditState: null
        }
    },  
    handleDelete_p(event, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          eduTrainDelete({ key: row.id }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList_p();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDelete_h(event, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          eduTrainDelete({ key: row.id }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList_h();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getList_p() {
      this.loading_p = true;
      this.personalList = [];
      eduTrainPage(
        Object.assign(
          {
            type: "P"
          },
          this.queryParams_p
        )
      )
        .then(res => {
          this.personalList = res.body.list;
        })
        .finally(() => {
          this.loading_p = false;
        });
    },
    getList_h() {
      this.loading_h = true;
      this.hospitalList = [];
      eduTrainPage(
        Object.assign(
          {
            type: "H"
          },
          this.queryParams_h
        )
      )
        .then(res => {
          this.hospitalList = res.body.list;
        })
        .finally(() => {
          this.loading_h = false;
        });
    },
    getList() {
      this.getList_h();
      this.getList_p();
    },
    cancel() {
      this.open = false;
    }
  }
};
</script>
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="院级培训" name="H">
        <Table
          v-loading="loading_h"
          :table-list="hospitalList"
          :prop-list="columns_h"
        ></Table>
        <pagination
          v-show="total_h > 0"
          :total="total_h"
          :page.sync="queryParams_h.pageNum"
          :limit.sync="queryParams_h.pageSize"
          @pagination="getList_h"
        />
      </el-tab-pane>
      <el-tab-pane label="个人教育培训" name="P">
        <Table
          v-loading="loading_p"
          :table-list="personalList"
          :prop-list="columns_p"
        ></Table>
        <pagination
          v-show="total_p > 0"
          :total="total_p"
          :page.sync="queryParams_p.pageNum"
          :limit.sync="queryParams_p.pageSize"
          @pagination="getList_p"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="trainForm" :rules="rules" label-width="100px">
        <el-form-item label="培训名称" prop="name">
          <el-input v-model="trainForm.name" placeholder="请输入证书目录名称" />
        </el-form-item>
        <el-form-item label="时间范围" prop="date">
          <el-date-picker
            v-model="trainForm.date"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训机构" prop="org">
          <el-input v-model="trainForm.org" placeholder="请输入培训机构" />
        </el-form-item>
        <el-form-item label="培训地点" prop="location">
          <el-input v-model="trainForm.location" placeholder="请输入培训地点" />
        </el-form-item>
        <el-form-item label="获得证书" prop="cert">
          <el-input v-model="trainForm.cert" placeholder="请输入获得证书" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            type="textarea"
            v-model="trainForm.description"
            placeholder="请输入描述信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitTrainForm"
          >确 定</el-button
        >
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleCheck" :visible.sync="openCheck" width="600px" append-to-body>
      <el-form ref="form" :model="trainFormCheck" label-width="100px">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="trainFormCheck.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitTrainFormCheck(1)"
          >通 过</el-button
        >
        <el-button size="small" @click="submitTrainFormCheck(2)">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
