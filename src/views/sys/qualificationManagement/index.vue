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
      <el-form-item label="资质编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入资质编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资质名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入资质名称"
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
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-add" size="mini" @click="add"
          >新增</el-button
        >
      </el-col>
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资质名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资质名称" />
        </el-form-item>
        <el-form-item label="资质代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入资质代码" />
        </el-form-item>
        <el-form-item label="资质目录" prop="catalogId">
          <el-select v-model="form.catalogId" placeholder="请选择资质目录">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm"
          >确 定</el-button
        >
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="openDel"
      title="删除资质"
      width="400px"
      :before-close="handleClose"
    >
      <span>是否删除资质{{delObject.code}}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleDel">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  qualifyManageAdd, qualifyManageDelete,
  qualifyManagePage,
  qualifyManageUpdate
} from "@/api/system/qualityManagement/index";
import { catalogList } from "@/api/system/catalog/index";
export default {
  data() {
    return {
      options: [],
      title: "",
      delObject: {
        code: ''
      },
      openDel: false,
      open: false,
      form: {
        catalogId: undefined,
        code: undefined,
        name: undefined,
        id: undefined
      },
      rules: {},
      showSearch: true,
      queryParams: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 10
      },
      statusList: [],
      total: 0,
      loading: false,
      customerList: [],
      columns: [
        {
          prop: "code",
          label: "资质代码",
          align: "center"
        },
        {
          prop: "name",
          label: "资质名称",
          align: "center"
        },
        {
          prop: "catalogName",
          label: "资质目录",
          align: "center"
        },
        {
          label: "操作",
          align: "center",
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
                    size: "mini",
                    icon: "el-icon-edit"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.handleEdit(event, params.row);
                    }
                  }
                },
                "编辑"
              ),h(
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
                      this.openDeleteMsg(params.row);
                    }
                  }
                },
                "删除"
              )
            );
            return h("div", arr);
          }
        }
      ]
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
      qualifyManagePage(this.queryParams)
        .then(res => {
          this.customerList = res.body.list;
          this.total = res.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(event, row) {
      this.form = {
        catalogId: row.catalogId,
        code: row.code,
        name: row.name,
        id: row.id
      };
      this.title = "编辑资质";
      this.open = true;
    },

    openDeleteMsg(e){
      console.log(e)
      this.delObject= e
      this.openDel = true
    },
    handleClose () {
      this.delObject = {
        code: ''
      }
      this.openDel = false
    },

    handleDel() {
      console.log("删除")
      qualifyManageDelete(this.delObject).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.delObject = {
          code: ''
        }
        this.openDel=false
        this.getList()
      });
    },
    add() {
      this.title = "添加资质";
      this.open = true;
      this.form = {
        catalogId: undefined,
        code: undefined,
        name: undefined,
        id: undefined
      };
    },
    submitForm() {
      if (this.form.id) {
        qualifyManageUpdate(this.form).then(res => {
            this.$message({
            message: "修改成功",
            type: "success"
          });
            this.getList()
            this.open = false;
        });
      } else {
        qualifyManageAdd(this.form).then(res => {
            this.$message({
            message: "新增成功",
            type: "success"
          });
            this.getList()
            this.open = false;
        });
      }
    },
    cancel() {
      this.open = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
