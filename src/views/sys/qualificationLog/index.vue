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
        <el-form-item label="资质类别" prop="catalogId">
          <el-select v-model="queryParams.catalogId" placeholder="请选择资质类别">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资质名称" prop="resName">
          <el-input
            v-model="queryParams.resName"
            placeholder="请输入资质名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input
            v-model="queryParams.operator"
            placeholder="请输入操作人"
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
  import {
    qualifyFlowPage
  } from "@/api/system/qualificationLog/index";
  import {
  qualifyManageList,
} from "@/api/system/qualityManagement/index";
  import { catalogList } from "@/api/system/catalog/index";
  import { parseTime } from '@/utils/index'
  export default {
    data() {
      return {
        options: [],
        rules: {},
        showSearch: true,
        queryParams: {
            operator: "",
            applicant: "",
            resName: '',
            catalogId: '',
          pageNum: 1,
          pageSize: 10
        },
        statusList: [],
        total: 0,
        loading: false,
        customerList: [],
        columns: [
          {
            prop: "resName",
            label: "资质名称",
            align: "center"
          },
          {
            prop: "applicant",
            label: "申请人",
            align: "center"
          },
          {
            prop: "operType",
            label: "操作类型",
            align: "center",
            formatter: row => {
                let obj = this.stateOptions.find(element => element.value == row.operType);
            return obj ? obj.label : "";
            }
          },
          {
            prop: "operator",
            label: "操作人",
            align: "center"
          },
          {
            prop: "createTime",
            label: "操作时间",
            align: "center",
            formatter: row => {
            return parseTime(row.createTime)
          }
          }
        ],
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
      ],
      };
    },
    created() {
      this.getList();
      catalogList({type: 'qualify'}).then(res => {
        this.options = res.body;
        });
    },
    methods: {
      handleQuery() {
          this.getList()
      },
      resetQuery() {
          this.$refs['queryForm'].resetFields();
      },
      getList() {
        this.loading = true;
        this.customerList = [];
        qualifyFlowPage(this.queryParams)
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
