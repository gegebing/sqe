<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="73px"
    >
      <el-form-item label="字典名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入字典编码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

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
      <!-- <el-col :span="1.5">
        <el-button
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- <el-table
      v-loading="loading"
      :data="typeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" align="center" prop="dictId" />
      <el-table-column
        label="字典名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="字典类型"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="'/dict/type/data/' + scope.row.dictId"
            class="link-type"
          >
            <span>{{ scope.row.code }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            class="button-text-delete"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      <div slot="empty" class="empty el-empty">
        <img src="@/assets/images/emtry.png">
        <div>暂无数据</div>
      </div>
    </el-table> -->
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="code">
          <el-input v-model="form.code" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典类型顺序" prop="seqNo">
          <el-input-number
            v-model="form.seqNo"
            :min="0"
            label="字典类型顺序"
          ></el-input-number>
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
  listType,
  //   getType,
  delType,
  addType,
  updateType
} from "@/api/system/dict/index";
// import {apiConfig} from '@/api/api'
import { parseTime } from "@/utils/index";
export default {
  name: "Dict",
  data() {
    return {
      customerList: [],
      columns: [
        {
          prop: "name",
          label: "字典类型名称",
          align: "center"
        },
        {
          prop: "code",
          label: "字典类型代码",
          align: "center"
        },
        {
          prop: "seqNo",
          label: "字典类型传序",
          align: "center"
        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "center",
          formatter: row => {
            return parseTime(row.createTime)
          }
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
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "mini",
                    icon: "el-icon-folder"
                  },
                  style: {
                    padding: "0"
                    // display: inserted(["customer:customer:remove"])
                    //   ? ""
                    //   : "none",
                  },
                  on: {
                    click: () => {
                      this.dictionarySubitems(event, params.row);
                    }
                  }
                },
                "查看字典子项"
              )
            );
            return h("div", arr);
          }
        }
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        code: [{ required: true, message: "字典类型不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
    // this.getDicts('sys_normal_disable').then((response) => {
    //   this.statusOptions = response.data
    // })
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      this.customerList = [];
      $http
        .http({
          type: "post",
          url: "dictionaryList",
          data: this.queryParams
        })
        .then(response => {
          this.customerList = response.body.list;
          this.total = response.body.total;
        })
        .finally(() => {
          this.loading = false;
        });
      //   listType(this.queryParams).then(
      // (response) => {
      //   this.typeList = response.rows
      //   this.total = response.total
      //   this.loading = false
      // }
      //   )
    },
    handleEdit(event, row) {
      this.reset();
      this.open = true;
      this.title = "修改字典类型";
      this.form = {
        id: row.id,
        name: row.name,
        code: row.code,
        seqNo: row.seqNo
      };
    },
    handleDelete(event, row) {
      const dictIds = row.id;
      this.$confirm(
        '是否确认删除字典编号为"' + dictIds + '"的数据项?',
        "操作确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.deleteDictionary({ key: dictIds });
      });
    },
    deleteDictionary(id) {
      $http
        .http({
          type: "post",
          url: "dictionaryDelete",
          data: id
        })
        .then(response => {
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },

    dictionarySubitems(event, row) {
      this.$router.push({ path: "/system/data", query: { id: row.id } });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        name: undefined,
        code: undefined,
        status: "0",
        remark: undefined
      };
      this.$refs['form'].resetFields();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
        this.$refs['queryForm'].resetFields();
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids;
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            $http
              .http({
                type: "post",
                url: "dictionaryUpdate",
                data: this.form
              })
              .then(response => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.open = false;
                this.getList();
              });
            // updateType(this.form).then((response) => {
            //   this.$modal.msgSuccess('修改成功')
            //   this.open = false
            //   this.getList()
            // })
          } else {
            $http
              .http({
                type: "post",
                url: "dictionaryAdd",
                data: this.form
              })
              .then(response => {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.open = false;
                this.getList();
              });
            // addType(this.form).then((response) => {
            //   this.$modal.msgSuccess('新增成功')
            //   this.open = false
            //   this.getList()
            // })
          }
        }
      });
    },
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const dictIds = row.dictId || this.ids
    //   this.$confirm(
    //     '是否确认删除字典编号为"' + dictIds + '"的数据项?',
    //     '操作确认',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   )
    //     .then(function() {
    //       return delType(dictIds)
    //     })
    //     .then(() => {
    //       this.getList()
    //       this.$message({
    //             message: '删除成功',
    //             type: 'success'
    //             });
    //     })
    // },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        code: undefined,
        seqNo: 0
      };
    }
  }
};
</script>
