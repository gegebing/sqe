<template>
  <div
    class="app-container"
  >
    <div style="display: flex;align-items: flex-start;justify-content: flex-start;width: 100%;">
        <div class="tree-container">
          <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <el-card style="flex: 1;">
            <div class="form-container">
              <el-form ref="form" :model="form" label-width="auto" label-position="left">
                <el-form-item label="资质名称:" prop="qualificationName">
                  <span>{{ form.qualificationName }}</span>
                </el-form-item>
                <el-form-item label="是否需要考试:" prop="exameFlag">
                  <el-radio-group v-model="form.exameFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否需要上传附件:" prop="uploadFlag">
                  <el-radio-group v-model="form.uploadFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="是否需要全部部门审批通过后才可进行授权:"
                  prop="auditFlag"
                >
                  <el-radio-group v-model="form.auditFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="miniLevel">
                  <div slot="label">
                    最低申请资质
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="系统自动拦载"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-select v-model="form.miniLevel" placeholder="请选择最低申请资质">
                    <el-option
              v-for="item in miniLevelOptions"
              :key="item.id"
              :label="item.value"
              :value="item.key"
            ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="qualiRejectMsg">
                  <div slot="label">
                    资质驳回消息
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="资质不满足最低中请资质，系统自动提示信息。"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-input
                    v-model="form.qualiRejectMsg"
                    placeholder="请输入资质驳回消息"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="joinExame">
                  <div slot="label">
                    参加考试
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="系统自动拦载"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-select v-model="form.joinExame" placeholder="请选择参加考试">
                    <el-option label="无" value=""></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="score">
                  <div slot="label">
                    考试需要到达分数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="系统自动拦截"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-input
                    v-model="form.score"
                    placeholder="请输入考试需要到达分数"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="exameRejectMsg">
                  <div slot="label">
                    考试驳回消息
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="考试分数不满足，系统自动提示信息。"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-input
                    v-model="form.exameRejectMsg"
                    placeholder="请输入考试驳回消息"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="certFlag">
                  <div slot="label">
                    是否需要上传两证
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="系统自动拦截"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-radio-group v-model="form.certFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="preQualifyId">
                  <div slot="label">
                    前置权限
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="系统自动拦载"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-select v-model="form.preQualifyId" placeholder="请选择前置权限">
                    <el-option
              v-for="item in catalogOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="preRejectMsg">
                  <div slot="label">
                    前置权限驳回消息
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="前置权限不满足，系统自动提示信息。"
                      placement="right-start"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                    :
                  </div>
                  <el-input
                    v-model="form.preRejectMsg"
                    placeholder="请输入前置权限驳回消息"
                  ></el-input>
                </el-form-item>
                <el-form-item label="提示信息:" prop="alertMsg">
                  <el-input
                    v-model="form.alertMsg"
                    placeholder="请输入提示信息"
                  ></el-input>
                </el-form-item>
                <el-form-item label="申清说明:" prop="applyDesc">
                  <vue-editor v-model="form.applyDesc"></vue-editor>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
              <div
                style="width: 100%;display: flex;align-items: center;justify-content: space-between;margin: 20px 0;"
              >
                <p style="color: #f6646b;font-size: 14px;font-weight: 400;">序号从小到大即为审批顺序</p>
                <el-button-group>
                  <!-- <el-button type="primary">同步申请</el-button> -->
                  <el-button type="primary" @click="addAuditDepartment"
                    >添加审核部门</el-button
                  >
                  <!-- <el-button type="primary">添加科主任审批</el-button> -->
                </el-button-group>
              </div>
              <Table
                v-loading="loading"
                :table-list="customerList"
                :prop-list="columns"
              ></Table>
            </div>
        </el-card>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="auditForm" :rules="rules" label-width="auto">
        <el-form-item label="科室:" prop="deptId">
          <el-select
            v-model="auditForm.deptId"
            placeholder="请选择科室"
            @change="changeDepartment"
          >
            <el-option
              v-for="(item, index) in deptList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- auditorId：[审核人多选 id] -->
        <el-form-item label="审核人:" prop="auditorId">
          <el-select v-model="auditForm.auditorId" multiple placeholder="请选择审核人">
            <el-option
              v-for="(item, index) in auditorOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通过条件:" prop="passMsg">
          <el-input
            type="textarea"
            v-model="auditForm.passMsg"
            placeholder="请输入通过条件"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNo">
            <el-input-number v-model="auditForm.seqNo" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="是否可授权:" prop="auditFlag">
          <el-radio-group v-model="auditForm.auditFlag">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可撤销授权:" prop="cancelFlag">
          <el-radio-group v-model="auditForm.cancelFlag">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否自动审核:" prop="autoFlag">
          <el-radio-group v-model="auditForm.autoFlag">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.autoFlag" label="自动审核条件:" prop="autoCondition">
          <el-select
            v-model="auditForm.autoCondition"
            placeholder="请选择自动审核条件"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.value"
              :value="item.key"
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
  qualifyManageLevels,
  qualifyConfigDetail,
  qualifyConfigBaseDetail,
  deptList,
  employeeList,
  qualifyConfigBaseAdd,
  qualifyConfigBaseUpdate,
  qualifyConfigDelete,
  qualifyConfigAdd,
  qualifyConfigEdit,
  sysDictList
} from "@/api/system/qualificationConfiguration/index";
import { catalogList } from "@/api/system/catalog/index";
import {
  qualifyManageList,
} from "@/api/system/qualityManagement/index";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },

  data() {
    return {
        qualifyId: undefined,
      auditForm: {
        id: undefined,
        qualifyId: undefined,
        deptId: '',
        auditorId: [],
        passMsg: '',
        seqNo: 1,
        auditFlag: false,
        cancelFlag: false,
        autoFlag: false,
        autoCondition: undefined,
      },
      open: false,
      title: "",
      loading: false,
      rules: {},
      catalogOptions: [],
      customerList: [],
      deptList: [],
      auditorOptions: [],
      columns: [
        {
          prop: "seqNo",
          label: "序号",
          align: "center"
        },
        {
          prop: "deptName",
          label: "部门",
          align: "center"
        },
        {
          prop: "auditors",
          label: "审核人",
          align: "center",
          formatter: row => {
            let arr = row.auditors.map(e=> {
              return e.name;
            })
            return arr.join(",");
          }
        },
        {
          prop: "passMsg",
          label: "通过条件",
          align: "center"
        },
        {
          prop: "cancelFlag",
          label: "是否可授权",
          align: "center",
          formatter: row => {
              return row.cancelFlag ? '是' : '否';
          }
        },
        {
          prop: "autoFlag",
          label: "是否自动审核",
          align: "center",
          formatter: row => {
              return row.autoFlag ? '是' : '否';
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
      ],
      form: {
        qualificationName: "",
        exameFlag: false,
        uploadFlag: false,
        auditFlag: false,
        miniLevel: "",
        qualiRejectMsg: "",
        joinExame: "",
        score: "",
        exameRejectMsg: "",
        certFlag: false,
        preQualifyId: "",
        preRejectMsg: "",
        alertMsg: "",
        applyDesc: null,
        id: undefined,
        qualifyId: undefined
      },
      data: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      addFlag: true,
      miniLevelOptions: [],
      options: []
    };
  },
  created() {
    this.qualifyManageLevelsApi();
    deptList().then(res => {
      this.deptList = res.body;
    });
    qualifyManageList().then(res => {
        this.catalogOptions = res.body;
        this.catalogOptions.unshift({
          id: null,
          name: '无'
        });
    });
    sysDictList({code:'QUALI_AUTO_CONFIG'}).then(res => {
        this.options = res.body
    })
    sysDictList({code:'FULL_TIME_JOB'}).then(res => {
        this.miniLevelOptions = res.body
    })
    
  },
  methods: {
    qualifyManageLevelsApi() {
      qualifyManageLevels().then(res => {
        this.data = res.body;
      });
    },
    handleNodeClick(data) {
      if (!data.child) {
        this.qualifyId = data.id
        this.form = {
            qualificationName: data.name,
            exameFlag: false,
            uploadFlag: false,
            auditFlag: false,
            miniLevel: "",
            qualiRejectMsg: "",
            joinExame: "",
            score: "",
            exameRejectMsg: "",
            certFlag: false,
            preQualifyId: "",
            preRejectMsg: "",
            alertMsg: "",
            applyDesc: null,
            id: undefined,
            qualifyId: data.id
        }
        this.getConfigList()
        this.getqualifyConfigBaseDetail()
      }
    },
    getqualifyConfigBaseDetail() {
        qualifyConfigBaseDetail({ key: this.form.qualifyId }).then(res => {
            if (res.body.id) {
                this.from = Object.assign(this.form, res.body)
                this.addFlag = false
            } else {
                this.addFlag = true
            }
        });
    },
    getConfigList(){
        qualifyConfigDetail({ key: this.form.qualifyId }).then(res => {
            this.customerList = res.body
        });
    },
    onSubmit() {
      // qualifyId tree选中id字段
      if (this.addFlag) {
        console.log('add');
        qualifyConfigBaseAdd(this.form).then(res=> {
            if (res.code == 200){
              this.$message.success('新增成功')
              this.getqualifyConfigBaseDetail()
            }
        })
      } else {
        console.log('edit');
        qualifyConfigBaseUpdate(this.form).then(res=> {
            if (res.code == 200){
              this.$message.success('更新成功')
              this.getqualifyConfigBaseDetail()
            }
        })
      }
    },
    handleEdit(e, row) {
        this.title = this.form.qualificationName + '编辑'
        employeeList({key: row.deptId}).then(res => {
            this.auditorOptions = res.body
        })
        .finally(() => {
            this.auditForm = {
              id: row.id,
              deptId: row.deptId,
              auditorId: row.auditorId.split(','),
              passMsg: row.passMsg,
              seqNo: row.seqNo,
              auditFlag: row.auditFlag,
              cancelFlag: row.cancelFlag,
              autoFlag: row.autoFlag,
              autoCondition: row.autoCondition,
              qualifyId: this.form.qualifyId
            }
            this.open = true
        })
    },
    handleDelete(e, row) {
        qualifyConfigDelete({key:row.id}).then(res => {
            if (res.code == 200){
              this.$message.success('删除成功')
                this.getConfigList()
            }
        })
    },
    addAuditDepartment() {
        this.auditForm = {
        id: undefined,
        qualifyId: this.qualifyId,
        deptId: '',
        auditorId: [],
        passMsg: '',
        seqNo: 1,
        auditFlag: false,
        cancelFlag: false,
        autoFlag: false,
        autoCondition: undefined,
      }
        if (this.form.qualifyId) {
            this.title = this.form.qualificationName + '新增'
            this.open = true;
        }
    },
    submitForm() {
      this.open = false;
      // qualifyId tree选中id
        if (this.auditForm.id) {
            // 更新
            qualifyConfigEdit(this.auditForm).then(res => {
                if (res.code == 200){
                    this.$message.success('更新成功')
                    this.getConfigList()
                    this.open = false
                }
            })
        } else {
            // 新增
            qualifyConfigAdd(this.auditForm).then(res => {
                if (res.code == 200){
                    this.$message.success('新增成功')
                    this.getConfigList()
                    this.open = false
                }
            })
        }
    },
    cancel() {
      this.open = false;
    },
    changeDepartment(val) {
        this.auditForm.auditorId = []
        employeeList({key: val}).then(res => {
            this.auditorOptions = res.body
        }) 
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-container {
  width: 20%;
  overflow-y: auto;
}
.form-container {
  flex: 1;
}
.custom-label {
  padding: 0;
}
</style>
