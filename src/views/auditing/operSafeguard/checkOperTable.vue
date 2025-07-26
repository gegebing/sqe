<template>
  <el-dialog
    title="添加手术"
    :visible.sync="openOper"
    width="80%"
    append-to-body
    :show-close="false"
  >
    <div
      style="width: 100%;display: flex;align-items: center;justify-content: space-between;"
    >
      <div>
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="手术名称/编码" prop="oper">
            <el-input
              v-model="queryParams.oper"
              placeholder="请输入手术名称/编码"
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
        <Table
          :table-list="unCheckdataList"
          :prop-list="un_columns"
          :maxHeight="400"
          @handleSelectionChange="handleSelectionChangeUnCheck"
        ></Table>
        <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      </div>
      <div
        style="display: flex;align-items: center;justify-content: center;flex-direction: column;"
      >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-right"
          @click="addOper"
        ></el-button>
        <el-button
          style="margin: 10px 0 0 0;"
          type="primary"
          size="small"
          icon="el-icon-back"
          @click="delectOper"
        ></el-button>
      </div>
      <Table
        :table-list="checkdataList"
        :prop-list="check_columns"
        :maxHeight="400"
        style="height: 400px;"
        @handleSelectionChange="handleSelectionChangeCheck"
      ></Table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitDialog">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
import { operBaseList, operBasePage } from "@/api/operQualify/index.js";
export default {
  props: {
    openOper: {
      type: Boolean,
      default: false
    },
    dataList: {
        type: Array,
        default: () => []
    }
  },
  data() {
    return {
        total: 0,
        unCheckdataList: [],
        checkdataList: [],
      un_columns: [
        {
          type: "selection",
          align: "center"
        },
        {
          prop: "code",
          label: "手术编码",
          align: "center",
          width: "150"
        },
        {
          prop: "name",
          label: "手术名称",
          align: "center",
          width: "150"
        },
        {
          prop: "level",
          label: "手术等级",
          align: "center",
          width: "150"
        }
      ],
      check_columns: [
        {
          type: "selection",
          align: "center"
        },
        {
          prop: "code",
          label: "手术编码",
          align: "center",
          width: "150"
        },
        {
          prop: "name",
          label: "手术名称",
          align: "center",
          width: "150"
        },
        {
          prop: "level",
          label: "手术等级",
          align: "center",
          width: "150"
        }
      ],
      queryParams: {
        oper: "",
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  watch: {
    openOper(val) {
      if (val) {
        console.log(val);
        console.log(this.dataList);
        this.checkdataList = this.dataList
        this.$emit("update:openOper", val);
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
        operBasePage(this.queryParams).then(res => {
          this.unCheckdataList = res.body.list;
          this.total = res.body.total;
        });
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        oper: ""
      };
      this.getList()
    },
    handleSelectionChangeUnCheck(val) {
      this.unCheckSelection = val;
    },
    handleSelectionChangeCheck(val) {
      this.checkSelection = val;
    },
    closeDialog() {
        this.$emit("update:openOper", false);
    },
    submitDialog() {
        this.$emit("postCheckdataList", this.checkdataList);
        this.$emit("update:openOper", false);
    },
    addOper() {
        // unCheckSelection push 到checkdataList 如果unCheckSelection id
      // 存在checkdataList中，则不添加
      if (this.unCheckSelection.length) {
        this.unCheckSelection.forEach(item => {
          let index = this.checkdataList.findIndex(
            ele => ele.id === item.id
          );
          if (index === -1) {
            this.checkdataList.push(item);
          }
        });
      }
    },
    delectOper() {
      // 删除
      if (this.checkSelection.length) {
        this.checkSelection.forEach(item => {
          let index = this.checkdataList.findIndex(
            ele => ele.id === item.id
          );
          this.checkdataList.splice(index, 1);
        });
      }
    }
  }
};
</script>
