<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <!-- <el-row :gutter="24">
        <el-col :span="4"><div class="grid-content bg-purple-light ">
          {{$t('home.totalProduct')}}<br><countTo :startVal='data.startVal' :endVal='data.totalNum' :duration='data.duration'></countTo>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          {{$t("home.upProduct")}}<br><countTo :startVal='data.startVal' :endVal='data.upTotalNum' :duration='data.duration'></countTo>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          {{$t('home.totalOrder')}}<br><countTo :startVal='data.startVal' :endVal='data.warnNum' :duration='data.duration'></countTo>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          {{$t('home.notFinshOrder')}}<br><countTo :startVal='data.startVal' :endVal='data.difNum' :duration='data.duration'></countTo>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          {{$t('home.totalPrice')}}<br><countTo :startVal='data.startVal' :endVal='data.totalPrice' :duration='data.duration'></countTo>KS
        </div></el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <div
            id="user_info"
            style="width: 1200px;height: 500px;margin-top: 30px;"
          ></div>
        </el-col>
        <el-col :span="24">
          <div
            id="order_info"
            style="width: 1200px;height: 500px;margin-top: 30px;"
          ></div>
        </el-col>
        <el-col :span="24">
          <div
            id="pay_info"
            style="width: 1200px;height: 500px;margin-top: 30px;"
          ></div>
        </el-col>
      </el-row>
      <el-row>
        
        <!-- <el-col :span="24" :offset="1">
          <div
            id="price_info"
            style="width: 700px;height: 300px;margin-top: 30px;"
          ></div>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { statistics } from "@/api/index/index.js";
import * as echarts from "echarts";
import countTo from "vue-count-to";
export default {
  components: { countTo },
  data() {
    return {
        eduData: [], 
        personData: [],
        techData: [],
      data: {
        difNum: 1000,
        warnNum: 1000,
        totalNum: 10000,
        upTotalNum: 200,
        // 需要滚动的时间
        duration: 5000,
        // 初始值
        startVal: 0,
        // 最终值
        totalPrice: 53132200000002
      }
    };
  },
  created() {
    
    
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    statistics({ type: "PERSON_TYPE" }).then(res => {
        if (res.body && res.body.length > 0) {
            this.personData = res.body.map(e =>{
                return {name: e.type, value: Number(e.total), percent: e.percent}
            })
            this.init()
        }
    });
    statistics({ type: "TECH_TYPE" }).then(res => {
        if (res.body && res.body.length > 0) {
            this.techData = res.body.map(e =>{
                return {name: e.type, value: Number(e.total), percent: e.percent}
            })
            this.init()
        }
    });
    statistics({ type: "EDU_TYPE" }).then(res => {
        if (res.body && res.body.length > 0) {
            this.eduData = res.body.map(e =>{
                return {name: e.type, value: Number(e.total), percent: e.percent}
            })
            this.init()
        }
    });
    
  },
  methods: {
    init() {
        console.log(this.eduData);
        let myChart = echarts.init(document.getElementById("user_info"));
        // 绘制图表
        myChart.setOption({
        color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea"
        ],
        title: {
            text: '人员学历结构',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
            show: true
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: "10%",
            align: "left",
            top: "middle",
            textStyle: {
            color: "#8C8C8C"
            },
            height: 150
        },
        series: [
        {
            name:'',
            type:'pie',
            radius : [0, 150],
            label: {
                normal: {
                    formatter: function(params) {
                        if (params.value != 0)
                            return params.name + ":"+params.percent + "%" + '-'+ params.value+'人';
                        else
                            return '';
                    },
                    show: true,

                },

            },
            data:this.eduData
        }
        ]
        });
    
        let myChart_two = echarts.init(document.getElementById("order_info"));
        myChart_two.setOption({
        color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea"
        ],
        title: {
            text: '现聘任专业技术职称',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
            show: true
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: "10%",
            align: "left",
            top: "middle",
            textStyle: {
            color: "#8C8C8C"
            },
            height: 150
        },
        series: [
        {
            name:'',
            type:'pie',
            radius : [0, 150],
            label: {
                normal: {
                    formatter: function(params) {
                        if (params.value != 0)
                            return params.name + ":"+params.percent + "%" + '-'+ params.value+'人';
                        else
                            return '';
                    },
                    show: true,

                },

            },
            data:this.techData
        }
        ]
        });
        let myChart_three = echarts.init(document.getElementById("pay_info"));
        myChart_three.setOption({
        color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea"
        ],
        title: {
            text: '人员类型',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
            show: true
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: "10%",
            align: "left",
            top: "middle",
            textStyle: {
            color: "#8C8C8C"
            },
            height: 150
        },
        series: [
        {
            name:'',
            type:'pie',
            radius : [0, 150],
            label: {
                normal: {
                    formatter: function(params) {
                        if (params.value != 0)
                            return params.name + ":"+params.percent + "%" + '-'+ params.value+'人';
                        else
                            return '';
                    },
                    show: true,

                },

            },
            data:this.personData
        }
        ]
        });
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.dashboard-text {
  margin-top: 10px;
  margin-left: 10px;
}
.el-row {
  display: table;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 10px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #7085f2;
}
.grid-content {
  border-radius: 10px;
  height: 100px;
  width: 240px;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
