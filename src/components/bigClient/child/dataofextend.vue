<template>
  <div class="container">
    <el-row class="search">
        <el-col :span="2" style="width: 5.5%;line-height: 30px">
          <span>区县</span>
        </el-col>
        <el-col :span="2">
          <el-select size="small" v-model="isMember">
            <el-option value="[1, 2, 3]">

            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="width: 5.5%;line-height: 30px">
          <span>社区</span>
        </el-col>
        <el-col :span="2">
          <el-select size="small" v-model="isMember">
            <el-option value="[1, 2, 3]">

            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="width: 5.5%;line-height: 30px">
          <span>体检类型</span>
        </el-col>
        <el-col :span="2">
          <el-select size="small" v-model="isMember">
            <el-option value="[1, 2, 3]">

            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="width: 8.5%;line-height: 30px">
          <span>体检开始时间</span>
      </el-col>
      <el-col :span="5">
          <el-date-picker
            style="width: 100%"
            size="small"
            v-model="clientChoseDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
      </el-col>
      <el-col :span="2" style="width: 5.5%;line-height: 30px">
          <span>负责人</span>
        </el-col>
        <el-col :span="2">
          <el-select size="small" v-model="isMember">
            <el-option value="[1, 2, 3]">

            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1" style="width: 4.8%">
          <el-button size="small" type="warning" class="btns">查询</el-button>
        </el-col>
    </el-row>
    <el-row class="client_table">
        <el-col :span="24">
          <el-table :border="true" :data="clientData" style="width: 100%">
            <el-table-column width="60" align="center" type="index" label="序号">

            </el-table-column>
            <el-table-column align="center" prop="name" label="省份" min-width="60"></el-table-column>
            <el-table-column align="center" prop="phone" label="城市" min-width="60"></el-table-column>
            <el-table-column align="center" prop="sex" label="区县" min-width="60"></el-table-column>
            <el-table-column align="center" prop="takePeople" label="社区" min-width="80"></el-table-column>
            <el-table-column align="center" prop="productName" label="体检类型" min-width="60"></el-table-column>
            <el-table-column align="center" prop="time" label="体检开始时间" min-width="100"></el-table-column>
            <el-table-column align="center" prop="moduleState" label="体检总人数" min-width="60"></el-table-column>
            <el-table-column align="center" prop="moduleState" label="问题总人数" min-width="80"></el-table-column>
            <el-table-column align="center" prop="moduleState" label="到访人数" min-width="80"></el-table-column>
            <el-table-column align="center" prop="moduleState" label="体检设备" min-width="80"></el-table-column>
            <el-table-column align="center" prop="moduleState" label="体检项目" min-width="80"></el-table-column>            
          </el-table>
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
      return {
        clientName: '',
        clientPhone: '',
        isMember: '',
        clientData: [{
          name: '张三',
          sex: '男',
          phone: '1829416233',
          takePeople: '王麻子',
          productName: '拉升期',
          moduleState: '完成',
          time: String(new Date().toLocaleDateString()),
          isMember: '是',
        }],
        clientChoseDate: '',
      }
  }
};
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  .search{
    text-align: center; 
  }
  .another_row{
    text-align: center;
    margin-top: 20px;
    span{
      line-height: 30px;
    }
  }
  .client_table{
    margin-top: 20px;
  }
}
</style>
