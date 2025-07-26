<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="ip">
        <el-input v-model="formInline.ip" placeholder="ip" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="formInline.logStatus" placeholder="状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.start"
          value-format="yyyy-mm-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" clearable>
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryData" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="系统" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.sys }}
        </template>
      </el-table-column>
      <el-table-column label="url" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志ID" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.trackId }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="接口耗时" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.takeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="IP" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" align="center"  :formatter="famtLogStatus">
      </el-table-column>
      <el-table-column align="center" label="操作用户" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" width="200">
        <template slot-scope="scope">
          <span>{{ parsePageTimeEx(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right"  width="230"  align="center">>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showJson(scope.row.input, '请求参数')" round>请求参数</el-button>
          <el-button type="primary" size="mini" @click="showJson(scope.row.content, '响应内容')" round>响应内容</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="jsonTitle"
               :visible.sync="jsonShow"
               width="40%">
      <json-viewer :value="jsonData"
                   :expand-depth=5
                   copyable
                   boxed
                   sort></json-viewer>
    </el-dialog>
    <el-pagination style=""
                   background
                   :page-sizes="[1,10, 20, 30, 40, 50, 100]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-size="pageSize"
                   :current-page="pageNo">
    </el-pagination>
  </div>
</template>

<script>
  import {parsePageTime} from '@/utils/index'

  export default {
    data() {
      return {
        jsonTitle:"",
        dialogVisible:false,
        list: [{
        }],
        jsonShow:false,
        pageSize:10,
        pageNo:1,
        total:0,
        jsonData:{name:"tc"},
        listLoading: false,
        formClean:{
          productId:""
        },
        formInline: {
          ip: '',
          logStatus: '',
          start:[],
        }
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      showJson(content, title) {
        this.jsonTitle = title;
        this.jsonData = {};
        if (content) {
          this.jsonData = JSON.parse(content);
        }
        this.jsonShow = true;
      },
      parsePageTimeEx(date) {
        return parsePageTime(date);
      },
      skuList(productId){
        this.$router.push({ path: "/product/sku",query:{"productId":productId}});
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.fetchData();
      },
      famtLogStatus(row, column){
        let logStatus = row.logStatus;
        if (logStatus == 200) {
          return '成功';
        } else {
          return  '失败';
        }
      },
      queryData() {
        this.pageNo = 0;
        this.fetchData();
      },
      fetchData() {
        this.listLoading = true;
        var startTime = null, endTime = null;
        if (this.formInline.start) {
          startTime = this.formInline.start[0];
          endTime = this.formInline.start[1];
        }
        $http.http({
          type: "post",
          url: "system_operlog",
          data: {
            pageNum:this.pageNo,
            pageSize: this.pageSize,
            ip:this.formInline.ip,
            logStatus: this.formInline.logStatus,
            start: startTime,
            end: endTime
          }
        }).then((data) => {
          this.listLoading = false;
          this.list=data.body.list;
          this.total=data.body.total;
          this.pageNo=data.body.paegNum;
          this.pageSize=data.body.pageSize;;
        }).catch(() => {
          this.listLoading = false;
        });
      }
    }
  }
</script>
