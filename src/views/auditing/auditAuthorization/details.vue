<template>
  <!-- 手术权限审核详情 -->
  <div class="app-container" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ pageTitle }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回</el-button>
      </div>

      <el-form ref="form" :model="form" label-width="auto" class="detail-form">
        <el-form-item label="申请人：">
          <span>{{ form.applicantName }}</span>
        </el-form-item>
        <el-form-item label="资质："> </el-form-item>
        <el-form-item label="">
          申请<span style="color: #333;font-weight: bold;">{{
            form.operBaseInfo.level
          }}</span
          >手术<span style="color: #333;font-weight: bold;">{{
            form.operBaseInfo.name
          }}</span
          >的独立完成权限
        </el-form-item>
        <el-form-item label="">
          申请人参与此手术<span style="color: #333;font-weight: bold;">0</span
          >次
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="form.directFlag" disabled>
            <el-radio :label="true">需要指导医师</el-radio>
            <el-radio :label="false">不需要指导医师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" disabled v-model="form.description"></el-input>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="form-actions">
<!--        <el-button type="success" @click="audit(1)">允 许</el-button>-->
<!--        <el-button type="danger" @click="audit(2)">拒 绝</el-button>-->
        <el-button type="primary" @click="openLog">查看审核记录</el-button>
      </div>
    </el-card>

    <!-- 审核记录弹窗 -->
    <el-dialog
      title="审核记录"
      :visible.sync="dialogVisible_"
      width="80%"
      :before-close="handleClose_"
    >
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="申请人：">
          <span>{{ form.applicantName }}({{ form.applicantId }})</span>
        </el-form-item>
        <el-form-item label="申请手术：">
          <span>{{ form.operBaseInfo.name }}{{ form.operBaseInfo.code }}</span>
        </el-form-item>
        <Table
          v-loading="logLoading"
          :table-list="logCustomerList"
          :prop-list="logColumns"
        ></Table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { operAuthPage, operAuthAudit } from "@/api/operAuth";
import { auditLogList } from "@/api/system/qualificationReview";

export default {
  name: "details",
  data() {
    return {
      loading: false,
      logLoading: false,
      dialogVisible_: false,
      form: {
        id: '',
        applicantName: '',
        applicantId: '',
        operBaseInfo: {
          code: '',
          id: '',
          level: '',
          name: '',
          tag: ''
        },
        directFlag: true,
        description: ''
      },
      logCustomerList: [],
      logColumns: [
        {
          label: "审批人",
          prop: "operator",
          align: "center"
        },
        {
          label: "是否通过",
          prop: "operType",
          align: "center",
          formatter: row => {
            return row.operType == "1"
              ? "审批通过"
              : row.operType == "2"
              ? "审批不通过"
              : "";
          }
        },
        {
          label: "备注",
          prop: "description",
          align: "center"
        }
      ],
      pageTitle: '手术权限审核详情',
      applyId: null
    }
  },
  created() {
    // 获取路由参数
    const id = this.$route.params.id || this.$route.query.id;

    if (id) {
      this.applyId = id;
      this.getDetail();
    } else {
      this.$message.error('缺少申请ID参数');
      this.goBack();
    }
  },
  methods: {
    // 获取申请详情
    getDetail() {
      this.loading = true;
      // 使用现有的分页接口，通过ID筛选获取详情
      operAuthPage({
        pageNum: 1,
        pageSize: 1000, // 设置较大的页面大小以获取所有数据
        moduleType: "oper"
      }).then(res => {
        if (res.body && res.body.list && res.body.list.length > 0) {
          // 在返回的数据中查找指定ID的记录
          const targetRecord = res.body.list.find(item => item.id == this.applyId);
          if (targetRecord) {
            this.form = Object.assign({}, targetRecord);
          } else {
            this.$message.error('未找到相关申请记录');
          }
        } else {
          this.$message.error('未找到相关申请记录');
        }
      }).catch(error => {
        this.$message.error('获取详情失败');
        console.error('获取详情失败:', error);
      }).finally(() => {
        this.loading = false;
      });
    },

    // 打开审核记录
    openLog() {
      this.dialogVisible_ = true;
      this.logLoading = true;
      auditLogList({ moduleType: "oper", applyId: this.form.id })
        .then(res => {
          this.logCustomerList = res.body;
        })
        .catch(error => {
          this.$message.error('获取审核记录失败');
          console.error('获取审核记录失败:', error);
        })
        .finally(() => {
          this.logLoading = false;
        });
    },

    // 关闭审核记录弹窗
    handleClose_() {
      this.dialogVisible_ = false;
    },

    // 审核操作
    audit(val) {
      if (!this.form.description.trim()) {
        this.$message.warning('请填写备注');
        return;
      }

      this.$confirm(
        val === 1 ? '确认允许该申请吗？' : '确认拒绝该申请吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const auditData = {
          applys: [
            {
              applyId: this.form.id,
              operCode: this.form.operBaseInfo.code,
              operId: this.form.operBaseInfo.id,
              operName: this.form.operBaseInfo.name
            }
          ],
          state: val,
          description: this.form.description,
          directFlag: this.form.directFlag
        };

        operAuthAudit(auditData).then(res => {
          this.$message({
            message: "审核操作成功",
            type: "success"
          });
          // 返回上一页
          this.goBack();
        }).catch(error => {
          this.$message.error('审核操作失败');
          console.error('审核操作失败:', error);
        });
      }).catch(() => {
        // 用户取消
      });
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.detail-form {
  margin-top: 20px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-actions .el-button {
  margin: 0 10px;
}
</style>
