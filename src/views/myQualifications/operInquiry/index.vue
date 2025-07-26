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
        <el-form-item label="医生/工号" prop="applicant">
            <el-input
            v-model="queryParams.applicant"
            placeholder="请输入手术编码/名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="科室" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="全部科室"
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
        <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-add" size="mini" @click="exportFile"
          >导出</el-button
        >
      </el-col>
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
  import {
  deptList
} from "../../../api/operQualify/index.js";
  import { parseTime } from '@/utils/index'
  import {operAuthDownload, operAuthPage, operAuthCancel} from '@/api/operAuth';
  export default {
    data() {
      return {
        departmentList: [],
        columns: [
            {
                prop: "code",
                label: "手术编码",
                align: "center",
                render(h, params) {
                    return h("span", params.row.operBaseInfo.code);
                }
            },
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
          prop: "deptName",
          label: "部门",
          align: "center",
        },
        {
          prop: "applicantId",
          label: "工号",
          align: "center",
        },
        {
          prop: "applicantName",
          label: "姓名",
          align: "center",
        },
        {
          prop: "authTime",
          label: "授权时间",
          align: "center",
          formatter: row => {
            if (row.authTime) {
            return parseTime(row.authTime);
            } else {
                return ''
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
                "取消次权限"
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
            oper: '',
            applicant: '',
            deptId: '',
            state: '1',
          pageNum: 1,
          pageSize: 10
        }
      };
    },
    created() {
        this.getList()
        deptList().then(res => {
      this.departmentList = res.body;
    });
    },
    methods: {
      getList() {
          this.loading = true;
          this.dataList= []
          operAuthPage(this.queryParams).then(res => {
          this.dataList = res.body.list
          this.total = res.body.total
        })
        .finally(() => {
          this.loading = false;
        });
      },
      handleQuery() {
          this.getList()
      },
      resetQuery() {
          this.$refs["queryForm"].resetFields();
      },
      exportFile() {
        operAuthDownload({oper: this.queryParams.oper, applicant: this.queryParams.applicant, deptId: this.queryParams.deptId}).then(res => {
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        const a = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        a.href = href;
        a.download = "权限明细";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(href);
      });
      },
      handleExplain(e, row){
        operAuthCancel({key : row.id}).then(res => {
            this.$message.success("取消次权限成功")
            this.getList()
        })
      }
    }
  };
  </script>
  <style lang="scss" scoped></style>
  