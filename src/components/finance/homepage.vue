<template>
  <div class="container">
    <el-row class="query_hurdle">
      <el-col :span="2" style="width: 6.33%;text-align: center;">
        快速查看
      </el-col>
      <el-col :span="2" style="width: 6.33%">
        <el-button>今天</el-button>
      </el-col>
      <el-col :span="2" style="width: 6.33%">
        <el-button>昨天</el-button>
      </el-col>
      <el-col :span="2" style="width: 6.33%">
        <el-button>近7天</el-button>
      </el-col>
      <el-col :span="2" style="width: 5.33%;text-align: center">
        下单日期
      </el-col>
      <el-col :span="5">
        <el-date-picker
        style="width: 100%;"
        size="large"
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2" style="width: 5.33%;text-align: center">
        产品名
      </el-col>
      <el-col :span="3">
        <el-input placeholder="输入产品名"></el-input>
      </el-col>
      <el-col :span="2" style="width: 5.53%;text-align: center">
        医院
      </el-col>
      <el-col :span="2">
        <el-select v-model="takeName" placeholder="全部">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2" style="width: 5.33%;text-align: center">
        <el-button type="primary" style="margin-left: 10px">查询</el-button>
      </el-col>
    </el-row>
    <el-row class="statistics">
      <el-col class="module" :span="5">
        <p>总收入金额</p>
        <h2>888888.00</h2>
      </el-col>
      <el-col class="module" :span="5">
        <p>退款金额</p>
        <h2>2000.00</h2>
      </el-col>
      <el-col class="module" :span="5">
        <p>开票金额</p>
        <h2>5000.00</h2>
      </el-col>
    </el-row>
    <el-row class="graph">
      <el-col class="graph_box">
        <chart ref="chart1" :options="orgOptions" :auto-resize="true"></chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
      return {
        date: '',
        takeName: '',
        options: [{
          value: '一',
          label: '张三',
        },{
          value: '二',
          label: '李四'
        }],
        orgOptions: {},
      }
  },
  mounted() {
    this.initChart();
    this.init();
  },
  methods: {
    init ()  {
        const self = this;
        setTimeout(() => {
           window.onresize = function() {
              self.$refs.chart1.resize();
            }
        }, 10);
    },
    initChart() {
      this.orgOptions = {
        dataset: {
        source: [
            ['score', 'amount', 'product'],
            [60, 20, 'POSS机'],
            [31, 30, '拉卡拉金额'],
            [11, 10, '转账金额'],
            [41, 50, '取现金额'],
          ]
        },
        grid: {containLabel: true},
        xAxis: {name: 'amount'},
        yAxis: {type: 'category'},
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 0,        
          inRange: {
            color: ['#D7DA8B', '#E15457']
          }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                }
            }
        ]
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  .query_hurdle{
    font-size: 14px;
    letter-spacing: 1px;
    color: #606266;
    line-height: 40px;
    text-align: left;
    cursor: pointer;
    padding: 10px 0;
    border-bottom: 1px solid #eeeeee;
  }
  .statistics{
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0);
    padding-top: 20px;
    .module{
      text-align: center;
      border: 1px solid rgba(187, 187, 187, .5);
      margin-left: 3%;
    }
  }
  .graph{
    height: 900px;
    .graph_box{
      width: 90%;
      height: 100%;
      background: rgba(244, 244, 244, 1);
      margin-left: 3%;
      margin-top: 20px;
      .echarts{
        width: 100%;
        height: 600px;
        position: relative;
        left: -90px;
      }
    }
  }
}
</style>
