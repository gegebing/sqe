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
        <el-form-item label="证书编码" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入证书编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="证书名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入证书名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            filterable
          >
            <el-option
              v-for="dict in statusList"
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
          <el-form-item label="证书目录名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入证书目录名称" />
          </el-form-item>
          <el-form-item label="证书目录编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入证书目录编码" />
          </el-form-item>
          <el-form-item label="资质目录分类" prop="dictId">
            <el-select v-model="form.dictId" placeholder="请选择资质目录分类">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资质目录状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择资质目录状态">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
    </div>
  </template>
  <script>
  import {
    catalogAdd,
    catalogDelete,
    catalogPage,
    catalogUpdate
  } from "@/api/system/catalog/index";
  import {
    childListType
} from '@/api/system/dict/index'
  export default {
    data() {
      return {
          open: false,
          title: '',
          loading: false,
          rules: {},
        options: [],
        showSearch: true,
        form: {
          id: undefined,
          dictId: undefined,
          code: undefined,
          name: undefined,
          state: undefined
        },
        stateList: [
          {
            value: '1',
            label: "生效"
          },
          {
            value: '0',
            label: "禁用"
          }
        ],
        queryParams: {
          code: "",
          name: "",
          state: "",
          pageNum: 1,
          pageSize: 10
        },
        statusList: [],
        total: 0,
        loading: false,
        customerList: [],
        columns: [
          {
            type: "index",
            align: "center"
          },
          {
            prop: "code",
            label: "证书编号",
            align: "center"
          },
          {
            prop: "name",
            label: "证书名称",
            align: "center"
          },
          {
            prop: "state",
            label: "状态",
            align: "center",
            formatter: (row, column, value) => {
              return row.state === '1' ? "生效" : "禁用";
            }
          },
          {
            label: "操作",
            align: "right",
            fixed: "right",
            width: "150",
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
                        this.handleDelete(event, params.row);
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
      childListType({ parentId: 2 }).then(res => {
        this.options = res.body;
      });
    },
    methods: {
      handleQuery() {
        this.getList();
      },
      resetQuery() {
        this.$refs["queryForm"].resetFields();
      },
      handleDelete(event, row) {
          this.$confirm(
          '是否确认删除该证书目录的数据项?',
          "操作确认",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          catalogDelete({id:row.id}).then(res => {
          this.$message({
              message: "删除成功",
              type: "success"
            });
          this.getList();
          this.open = false;
        });
        });
        
      },
      handleEdit(event, row) {
        this.form = {
          id: row.id,
          dictId: row.dictId,
          code: row.code,
          name: row.name,
          state: row.state
        };
        this.title = "编辑证书目录";
        this.open = true;
      },
      add() {
        this.title = "添加证书目录";
        this.open = true;
        this.form = {
          id: undefined,
          dictId: undefined,
          code: undefined,
          name: undefined,
          state: undefined
        };
      },
      getList() {
        this.loading = true;
        this.customerList = [];
        catalogPage(Object.assign(this.queryParams, { type: "cert" }))
          .then(res => {
            this.customerList = res.body.list;
            this.total = res.body.total;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      submitForm() {
        if (this.form.id) {
          catalogUpdate(Object.assign(this.form, { type: "cert" })).then(res => {
              this.$message({
              message: "修改成功",
              type: "success"
            });
              this.getList();
            this.open = false;
          });
        } else {
          catalogAdd(Object.assign(this.form, { type: "cert" })).then(res => {
              this.$message({
              message: "新增成功",
              type: "success"
            });
              this.getList();
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
  