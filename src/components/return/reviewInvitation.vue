// 复查邀约待回访
<template>
  <div>
    <!-- 头部筛选box -->
    <div class="box">
      <div class="item item1" :class="{active:topActive==1}" @click="topItem_func(1)">
        <div>今日待回访</div>
        <div>{{box_top_data.todayNum || 0}}</div>
      </div>
      <div class="item item2" :class="{active:topActive==2}" @click="topItem_func(2)">
        <div>逾期未回访总数</div>
        <div>{{box_top_data.overdueNum|| 0}}</div>
      </div>
      <div class="item item3" :class="{active:topActive==0}" @click="topItem_func(0)">
        <div>全部待回访</div>
        <div>{{box_top_data.allNum|| 0}}</div>
      </div>
    </div>
    <!-- seach -->
    <el-form :inline="true" size="small" id="search" class="padding-LR-p10">
      <el-form-item v-if="topActive != 1"  label="应回访日期">
        <el-date-picker
          class="w-250"
          v-model="seach.delivery"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="测评人员">
        <el-select class="w-150" clearable v-model="seach.repairUserId" placeholder="请选择">
          <el-option
            v-for="item in seach.scUserNameList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接通状态">
        <el-select class="w-150" clearable v-model="seach.phoneStatus" placeholder="请选择">
          <el-option
            v-for="item in seach.phoneStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省份">
        <el-select
          class="w-150"
          clearable
          v-model="seach.provinceId"
          placeholder="请选择"
          @change="cityList(seach.provinceId)"
        >
          <el-option
            v-for="item in seach.provinceIdList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <el-select
          class="w-150"
          clearable
          v-model="seach.cityId"
          placeholder="请先选择省份"
          @change="siteList(seach.cityId)"
        >
          <el-option
            v-for="item in seach.cityIdList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测评中心">
        <el-select
          clearable
          class="w-150"
          v-model="seach.siteValue"
          placeholder="请先选择城市"
          @change="hospitalList(seach.siteValue)"
        >
          <el-option
            v-for="item in seach.siteLists"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院">
        <el-select clearable class="w-150" v-model="seach.hospitalId" placeholder="请先选择测评中心">
          <el-option
            v-for="item in seach.hospitalLists"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="seach.phone" placeholder="请输入客户电话" class="w-150"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="topItem_func(topActive)" icon="el-icon-search" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="data_assignment_func()" icon="el-icon-thumb" type="warning">数据指派</el-button>
      </el-form-item>
    </el-form>
    <!-- pageList(pages.currentPage,pages.pageSize) -->
    <!-- table -->
    <el-table
      border
      :data="clientData"
      max-height="650"
      :span-method="objectSpanMethod"
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :header-row-class-name="'headerClass'"
    >
      <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
      <el-table-column align="center" prop="memberName" label="客户姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="birthday" label="出生日期"></el-table-column>
      <el-table-column align="center" prop="vip" label="是否会员"></el-table-column>
      <el-table-column align="center" prop="saleProductNickname" label="产品昵称"></el-table-column>
      <el-table-column align="center" prop="phoneStatus" label="接通状态"></el-table-column>
      <el-table-column align="center" prop="tryOnBeginTime" label="试穿时间"></el-table-column>
      <el-table-column align="center" prop="examinationTime" label="上次测评时间"></el-table-column>
      <el-table-column align="center" prop="tryOnUserName" label="试穿人员"></el-table-column>
      <el-table-column align="center" prop="examinationUserName" label="测评人员"></el-table-column>
      <el-table-column align="center" prop="memberAttitude" label="客户分析"></el-table-column>
      <el-table-column align="center" prop="memberMode" label="客户类型"></el-table-column>
      <el-table-column align="center" prop="visitWaitTime" label="应回访时间">
        <template slot-scope="scope">
          <div :class="scope.row.red === 1 ?'color-red':''">{{scope.row.visitWaitTime}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="details(scope.row)" :loading="xqBut" type="primary" size="small" icon="el-icon-help">回访</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages.total"
      class="pagination"
    ></el-pagination>
    <!-- 详情弹框 -->
    <el-dialog
      title="复查邀约回访详情"
      :visible.sync="productUsageDetailsDialog"
      :close-on-click-modal="false"
      :before-close="cancel"
      width="95%"
      top="5vh"
    >
      <div class="clearfix">
        <div
          class="left pct-w50 padding-10 box-sizing-box"
          style="max-height: 700px;overflow-x: hidden;"
        >
          <h3 class="new-title">客户信息</h3>
          <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass-two'">
            <el-table-column prop="memberName" label="客户姓名" min-width="100"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="birthday" label="出生日期"></el-table-column>
            <!-- <el-table-column prop="vip" label="是否会员"></el-table-column> -->
            <el-table-column prop="memberModeCN" label="客户当前类型"></el-table-column>
            <el-table-column prop="cognition" label="客户初始认知"></el-table-column>
            <el-table-column prop="cognition" label="换产品次数"></el-table-column>
          </el-table>
          <h3 class="new-title">会员信息</h3>
          <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass-two'">
            <el-table-column prop="memberName" label="是否会员" min-width="100"></el-table-column>
            <el-table-column prop="sex" label="是否续会员"></el-table-column>
            <el-table-column prop="phone" label="会员到期时间"></el-table-column>
            <el-table-column prop="birthday" label="部位剩余次数"></el-table-column>
            <el-table-column prop="vip" label="全身剩余次数"></el-table-column>
          </el-table>
          <h3 class="new-title">病单信息</h3>
          <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass'">
            <el-table-column prop="memberName" label="医院" min-width="100"></el-table-column>
            <el-table-column prop="sex" label="科室"></el-table-column>
            <el-table-column prop="phone" label="医生"></el-table-column>
            <el-table-column prop="birthday" label="病单类型"></el-table-column>
            <el-table-column prop="vip" label="处方病情"></el-table-column>
            <el-table-column prop="vip" label="新增病情"></el-table-column>
            <el-table-column prop="vip" label="创建时间"></el-table-column>
          </el-table>
          <h3 class="new-title">产品体验回访</h3>
          <el-table
            :data="pickupServiceInformation"
            border
            max-height="220"
            :header-row-class-name="'headerClass-two'"
          >
            <el-table-column prop="orderNum" label="订单编号"></el-table-column>
            <el-table-column prop="saleProductNickname" label="产品昵称"></el-table-column>
            <!-- <el-table-column prop="reflect" label="取型家长反应"></el-table-column> -->
            <el-table-column prop="tryOnUserName" label="试穿人员"></el-table-column>
            <el-table-column prop="tryOnBeginTime" label="试穿时间"></el-table-column>
            <el-table-column prop="tryOnRemark" label="试穿备注"></el-table-column>
            <el-table-column prop="experienceTime" label="体验回访时间"></el-table-column>
            <!-- <el-table-column prop="experiencePhone" label="体验回访电话"></el-table-column> -->
            <el-table-column prop="experiencePhoneStatus" label="接通状态"></el-table-column>
            <el-table-column prop="experienceUserName" label="产品体验回访人"></el-table-column>
            <el-table-column prop="experienceSatisfaction" label="客户态度"></el-table-column>
            <el-table-column prop="experienceSatisfaction" label="穿戴时长"></el-table-column>
            <!-- <el-table-column prop="visitType" label="回访类型"></el-table-column> -->
            <el-table-column label="产品体验问题">
              <template slot-scope="scope">
                <el-link @click="visitIdDtails(scope.row)" type="primary">
                  查看详情
                  <i class="el-icon-view el-icon--right"></i>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <h3 class="new-title">产品使用回访</h3>
          <el-table
            :data="pickupServiceInformation_use"
            border
            max-height="220"
            class="margin-t-20"
            :header-row-class-name="'headerClass-two'"
          >
            <el-table-column prop="orderNum" label="订单编号"></el-table-column>
            <el-table-column prop="saleProductNickname" label="产品昵称"></el-table-column>
            <el-table-column prop="saleProductNickname" label="试穿备注"></el-table-column>
            <el-table-column prop="useTime" label="使用回访时间"></el-table-column>
            <!-- <el-table-column prop="usePhone" label="回访电话"></el-table-column> -->
            <el-table-column prop="usePhoneStatus" label="接通状态"></el-table-column>
            <el-table-column prop="useUserName" label="产品使用回访人"></el-table-column>
            <el-table-column prop="useSatisfaction" label="产品满意度"></el-table-column>
            <el-table-column prop="useSatisfaction" label="穿戴时长"></el-table-column>
            <el-table-column prop="useHeightWeight" label="体格是否变化"></el-table-column>
            <el-table-column prop="useHeightWeight" label="客户态度"></el-table-column>
            <el-table-column prop="visitType" label="回访类型"></el-table-column>
            <el-table-column label="产品使用问题">
              <template slot-scope="scope">
                <el-link @click="visitIdDtails_2(scope.row)" type="primary">
                  查看详情
                  <i class="el-icon-view el-icon--right"></i>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <h3 class="new-title">测评记录</h3>
          <el-table
            :border="true"
            :data="new_details_data.examinationInfo"
            :header-row-class-name="'headerClass'"
          >
            <el-table-column align="center" prop="remark" label="结果备注"></el-table-column>
            <el-table-column align="center" prop="repeatTime" label="复查日期"></el-table-column>
            <el-table-column align="center" prop="cycle" label="治疗周期"></el-table-column>
            <el-table-column align="center" prop="createTime" label="测评日期"></el-table-column>
            <el-table-column align="center" prop="evaluateUserName" label="测评人员"></el-table-column>
            <el-table-column align="center" prop="memberAnalysisCN" label="客户分析"></el-table-column>
            <el-table-column align="center" prop="recoveryCN" label="恢复情况"></el-table-column>
          </el-table>
          <div v-for="(item,index) in new_details_data.detailList" :key="index" class="margin-t-10">
            <div class="clearfix" style="border:1px solid #E6E6E6">
              <div
                class="left"
                style="width:15%;height:81px;line-height:81px;background:#E6E6E6;text-align:center;"
              >
                <div>{{item.examinationName}}</div>
              </div>
              <div class="left" style="width:85%">
                <div class="margin-l-5" style="height:40px;border-bottom:1px solid #E6E6E6">
                  <span>测评数据:</span>
                  <span
                    class="margin-r-20"
                    v-for="(element,index) in item.detail"
                    :key="index"
                  >{{element.name}}:{{element.value}}</span>
                  <!-- <el-button
                    class="right"
                    style="margin-left:10px"
                    v-if="item.examinationName == '足部3D扫描测评' || item.examinationName == '3D全身扫描' || item.examinationName == '足底压力分析'"
                    type="warning"
                    icon="el-icon-download"
                    @click="baogao_func(item.examinationName)"
                    size="mini"
                  >下载报告文件</el-button>-->
                  <el-button
                    class="right"
                    v-if="item.examinationName=='足部3D扫描测评'"
                    type="primary"
                    icon="el-icon-edit"
                    @click="threeD_show(item.detail)"
                    size="mini"
                  >修改</el-button>
                </div>
                <div class="margin-l-5" style="height:40px;line-height:30px;">
                  <span>测评结果:</span>
                  <span class="margin-r-20">{{item.result}}</span>
                </div>
              </div>
            </div>
            <div class="clearfix">
              <div class="left" v-for="(imgUrlList,index) in item.url" :key="index">
                <el-image :src="imgUrlList" style="height:400px" fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </div>
          <!-- <el-table :data="evaluates" border max-height="500">
        <el-table-column prop="evaluateUserName" label="测评人" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="测评时间"></el-table-column>
        <el-table-column prop="recoveryCN" label="恢复情况"></el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              @click="evaluationDetails(scope.row.evaluateId)"
              size="mini"
              type="primary"
            >测评详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button
              @click="evaluationReport(scope.row.evaluateId)"
              size="mini"
              type="primary"
            >测评报告</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="height" label="身高"></el-table-column>
        <el-table-column prop="weight" label="体重"></el-table-column>
        <el-table-column prop="zgfy" label="足弓发育"></el-table-column>
        <el-table-column prop="zdyl" label="足底压力"></el-table-column>
        <el-table-column prop="ggfy" label="跟骨发育"></el-table-column>
        <el-table-column prop="xzfy" label="下肢发育"></el-table-column>
        <el-table-column prop="xgjgzm" label="膝关节冠状面"></el-table-column>
        <el-table-column prop="xgjszm" label="膝关节矢状面"></el-table-column>
        <el-table-column prop="jzfy" label="脊柱发育"></el-table-column>
        <el-table-column prop="jzhdqs" label="脊柱活动趋势"></el-table-column>
        <el-table-column prop="jjg" label="肩胛骨"></el-table-column>
        <el-table-column prop="jbhdd" label="颈部活动度"></el-table-column>
        <el-table-column prop="gp" label="骨盆"></el-table-column>
        <el-table-column prop="xb" label="胸部"></el-table-column>
        <el-table-column prop="sm3d" label="3d扫描 "></el-table-column>
        <el-table-column prop="zb3d" label="足部3d"></el-table-column>
        <el-table-column prop="gmd" label="骨密度"></el-table-column>
          </el-table>-->
        </div>
        <div
          class="left pct-w50 padding-10 box-sizing-box"
          style="max-height: 700px;overflow-x: hidden;"
        >
          <div class="clearfix">
            <div class="left">
              <h3 class="new-title">填写复查邀约回访信息</h3>
            </div>
            <div class="right">
              <el-button @click="cancel()" size="mini" type="primary" icon="el-icon-circle-close">取消</el-button>
              <el-button @click="td_addVisit()" size="mini" type="success" icon="el-icon-circle-check">确认提交</el-button>
              <el-button @click="addPhone()" size="mini" type="success" icon="el-icon-circle-plus-outline">添加联系电话</el-button>
              <el-button @click="morePrduct_function()" size="mini" type="success" icon="el-icon-tickets">更多产品信息</el-button>
              <el-button @click="ls_save()" size="mini" type="danger">客户流失</el-button>
            </div>
          </div>
          
          <el-form :inline="true" size="small" id="search">
            <el-form-item label="回访电话：">
              <el-select style="width:100%" clearable v-model="usePhone" placeholder="请选择">
                <el-option v-for="item in phoneList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form :inline="true" size="small" id="search">
            <el-form-item label="接通状态：">
              <el-radio-group v-model="usePhoneStatus" @change="onState_func">
                <el-radio label="接通">接通</el-radio>
                <el-radio label="接通挂断">接通挂断</el-radio>
                <el-radio label="多次未接通">多次未接通</el-radio>
                <el-radio label="联系方式错误">联系方式错误</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-steps :active="4" align-center>
            <el-step title="表明身份"></el-step>
            <el-step title="确认身份"></el-step>
            <el-step title="表明目的"></el-step>
            <el-step title="确定时间"></el-step>
          </el-steps>
          <div v-if="isShow">
            <el-form :inline="true" size="small" id="search">
              <el-form-item label="复查邀约结果：">
                <el-radio-group v-model="backInviteResult" @change="backInviteResult_func">
                  <el-radio v-for="(item,index) in ls_fcyyjg" :key="index" :label="item"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <!-- <el-form :inline="true" size="small" id="search">
              <el-form-item label="沟通结果：">
                <el-radio-group v-model="backTalkResult">
                  <el-radio v-for="(item,index) in ls_gtjg" :key="index" :label="item"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>-->
            <!-- <el-form :inline="true" size="small" id="search">
              <el-form-item label="确认时间回访：">
                <el-date-picker
                  size="mini"
                  v-model="visitWaitTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-form>-->
            <div v-show="backInviteResultIsShow">
              <el-form :inline="true" size="small" id="search">
                <el-form-item label="复查到访约定时间：">
                  <el-date-picker
                    readonly
                    v-model="useWaitTime"
                    size="mini"
                    type="datetime"
                    value-format="yyyy-MM-dd h:m"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
              <el-calendar id="el-step" v-model="timeValue"></el-calendar>
              <!-- <el-row :gutter="20"> -->
              <!-- <el-col :span="2">
          <div class="line-h-30 text-r">接通状态：</div>
            </el-col>
            <el-col :span="8">
              <div class="line-h-30">
                <el-radio-group v-model="usePhoneStatus">
                  <el-radio label="接通">接通</el-radio>
                  <el-radio label="接通挂断">接通挂断</el-radio>
                  <el-radio label="多次未接通">多次未接通</el-radio>
                  <el-radio label="联系方式错误">联系方式错误</el-radio>
                </el-radio-group>
              </div>
              </el-col>-->
              <!-- <el-col :span="2">
              <div class="line-h-30 text-r">回访电话：</div>
            </el-col>
            <el-col :span="3">
              <div>
                <el-select
                  style="width:100%"
                  size="mini"
                  clearable
                  v-model="usePhone"
                  placeholder="请选择"
                >
                  <el-option v-for="item in phoneList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </div>
              </el-col>-->
              <!-- <el-col :span="3">
              <div class="line-h-30 text-r">确认时间回访：</div>
            </el-col>
            <el-col :span="3">
              <div>
                <el-date-picker
                  style="width:100%"
                  v-model="useWaitTime"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-col>
              </el-row>-->

              <!-- <el-row class="margin-t-20" style="background:#ecf5ff"> -->
              <!-- <el-col :span="3">
              <div class="line-h-30 center margin-b-10">邀约流程提示：</div>
              <div class="line-h-30 center margin-b-10">1.表明身份</div>
              <div class="line-h-30 center margin-b-10">2.确认身份</div>
              <div class="line-h-30 center margin-b-10">3.表明目的</div>
              <div class="line-h-30 center margin-b-10">4.确定时间</div>
              </el-col>-->
              <!-- <el-col :span="12"> -->
              <!-- <el-row class="padding-tb-20">
                <el-col :span="8">
                <div class="text-r">沟通结果：</div>
                </el-col>
                <el-col :span="16">
                <div>
                    
                </div>
                </el-col>
              </el-row>-->
              <!-- <el-row class="padding-tb-20">
                <el-col :span="8">
                <div class="text-r">复查邀约结果：</div>
                </el-col>
                <el-col :span="16">
                <div>
                    <el-radio-group v-model="backInviteResult">
                    <el-radio v-for="(item,index) in ls_fcyyjg" :key="index" :label="item"></el-radio>
                    </el-radio-group>
                </div>
                </el-col>
              </el-row>-->
              <!-- <el-row class="padding-tb-20">
                <el-col :span="8">
                <div class="text-r line-h-30">复查到访约定时间：</div>
                </el-col>
                <el-col :span="16">
                <el-date-picker
                    size="mini"
                    v-model="visitWaitTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间">
                </el-date-picker>
                </el-col>
            </el-row>
            </el-col>
            <el-col :span="9">
              <div class="line-h-30 margin-b-10">流失原因：</div>
              <div class="margin-b-10">
                <el-input
                style="width:80%"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="causeOfLoss"
                ></el-input>
              </div>
              <div class="line-h-30">
                
              </div>
            </el-col>
              </el-row>-->
              <el-form :inline="true" size="small" id="search">
                <el-form-item>
                  <el-select
                    class="w-150"
                    clearable
                    v-model="fayy_data.dayValue"
                    placeholder="请选择上下午"
                  >
                    <el-option
                      v-for="item in fayy_data.dayList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    class="w-150"
                    clearable
                    v-model="fayy_data.timeValue"
                    placeholder="请选择时"
                  >
                    <el-option
                      v-for="item in fayy_data.timeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    class="w-150"
                    clearable
                    v-model="fayy_data.minuteValue"
                    placeholder="请选择分"
                  >
                    <el-option
                      v-for="item in fayy_data.minuteList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button @click="seveTime()" type="primary" icon="el-icon-circle-check">确认</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <h3 class="new-title">备注</h3>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入回访备注内容，必填"
              v-model="causeOfLoss"
            ></el-input>
          </div>
        </div>
      </div>
      <!-- <span slot="footer">
        <el-button @click="cancel()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="td_addVisit()" type="success" icon="el-icon-circle-check">确认提交</el-button>
        <el-button @click="addPhone()" type="success" icon="el-icon-circle-plus-outline">添加联系电话</el-button>
        <el-button @click="morePrduct_function()" type="success" icon="el-icon-tickets">更多产品信息</el-button>
        <el-button @click="ls_save()" type="danger">客户流失</el-button>
      </span> -->
    </el-dialog>
    <!-- dialog 测评详情-->
    <el-dialog
      title="测评信息详情"
      :visible.sync="dialogEvaluationDetails"
      center
      :close-on-click-modal="false"
      width="80%"
    >
      <h3 class="new-title">客户信息</h3>
      <div>
        <span>客户姓名:</span>
        <span class="margin-r-20">{{memberDetailDto[0].memberName}}</span>
        <span>出生日期:</span>
        <span class="margin-r-20">{{memberDetailDto[0].birthday}}</span>
        <span>联系方式:</span>
        <span class="margin-r-20">{{memberDetailDto[0].phone}}</span>
        <span>家庭住址:</span>
        <span class="margin-r-20">{{memberDetailDto[0].address}}</span>
      </div>
      <el-row>
        <el-col :span="4">
          <h3 class="new-title">结果备注</h3>
          <div>{{examinationInfo.remark || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">复查日期</h3>
          <div>{{examinationInfo.repeatTime || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">孩子配合程度</h3>
          <div>{{examinationInfo.cooperate || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">治疗周期</h3>
          <div>{{examinationInfo.cycle || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">老带新</h3>
          <div>{{examinationInfo.recommendCN || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">驼背</h3>
          <div>{{examinationInfo.tuobeiCN || "暂无数据"}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <h3 class="new-title">客户分析</h3>
          <div>{{examinationInfo.memberAnalysisCN || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">客户类型</h3>
          <div>{{examinationInfo.memberModeCN || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">是否全身测评</h3>
          <div>{{examinationInfo.completeCN || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">未进行全身测评的原因</h3>
          <div>{{examinationInfo.incompleteReason || "暂无数据"}}</div>
        </el-col>
        <el-col :span="4">
          <h3 class="new-title">恢复情况</h3>
          <div>{{examinationInfo.recoveryCN || "暂无数据"}}</div>
        </el-col>
      </el-row>
      <h3 class="new-title">测评详情</h3>
      <div v-for="(item,index) in detailList" :key="index" class="margin-t-20">
        <div>
          <span>测评项目:</span>
          <span class="margin-r-20">{{item.examinationName}}</span>
          <el-button
            class="right"
            v-if="item.examinationName=='足部3D扫描测评'"
            type="primary"
            icon="el-icon-edit"
            @click="threeD_show(item.detail)"
            size="mini"
          >修改</el-button>
        </div>
        <div class="margin-t-5">
          <span>测评数据:</span>
          <span
            class="margin-r-20"
            v-for="(element,index) in item.detail"
            :key="index"
          >{{element.name}}:{{element.value}}</span>
        </div>
        <div class="margin-t-5">
          <span>新增病情:</span>
          <span class="margin-r-20">{{item.normal}}</span>
        </div>
        <div class="margin-t-5">
          <span>测评结果:</span>
          <span class="margin-r-20">{{item.result}}</span>
        </div>
        <div class="clearfix">
          <div
            class="margin-t-5 left margin-r-5"
            v-for="(imgUrlList,index) in item.url"
            :key="index"
          >
            <el-image :src="imgUrlList">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
        <hr class="border-dashed" />
      </div>
    </el-dialog>
    <!-- 更多产品 -->
    <el-dialog
      title="更多产品"
      :visible.sync="dialogMoreProducts"
      :close-on-click-modal="false"
      width="80%"
    >
      <el-table :data="moreProducts" border>
        <el-table-column prop="orderNum" label="订单号" min-width="100"></el-table-column>
        <el-table-column prop="saleProductName" label="产品名称"></el-table-column>
        <el-table-column prop="saleProductNickname" label="产品昵称"></el-table-column>
        <el-table-column prop="source" label="产品分类"></el-table-column>
        <el-table-column prop="hospitalName" label="医院名称"></el-table-column>
        <el-table-column prop="departmentName" label="科室"></el-table-column>
        <el-table-column prop="doctorName" label="医生"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="orderUserName" label="下单人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="tag-read"
              @click="copy(scope.$index)"
              size="mini"
              icon="el-icon-copy-document"
              type="primary"
            >复制单号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加电话 -->
    <el-dialog
      title="添加电话信息"
      :visible.sync="addPhoneDialog"
      :close-on-click-modal="false"
      width="30%"
      :before-close="cancelAddPhone"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- <div class="line-h-30 text-r">电话号码：</div> -->
          <el-input
            type="text"
            size="mini"
            placeholder="请输入关系"
            v-model="new_details_data.relationship"
          ></el-input>
        </el-col>
        <el-col :span="18">
          <div>
            <el-input type="text" size="mini" placeholder="请输入电话号码" v-model="backupPhone"></el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="cancelAddPhone" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="addSparePhone" type="success" icon="el-icon-circle-check">确认</el-button>
      </span>
    </el-dialog>
    <!-- 产品待体验回访详情 -->
    <el-dialog
      title="产品体验待回访详情"
      :visible.sync="productDetailsForReturnVisitDialog"
      :close-on-click-modal="false"
      width="1042px"
    >
    <div
            class="product_box"
            v-show="productItem_box"
            style="max-height: 475px;overflow-x: hidden;"
          >
            <div v-show="productItemUse.item_1" class="item">
              <div v-for="(item,index) in data_box_use[0].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">足弓垫</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">C系列足弓有无塌陷</h5>
                    <h5 class="center border-b-1">C系列表层有无开胶</h5>
                    <h5 class="center border-b-1">z系列足弓有无塌陷</h5>
                    <h5 class="center border-b-1">z系列表层有无开胶</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceCTaxian">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceCKaijiao">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZKaijiao">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZDuanceng">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_2" class="item">
              <div v-for="(item,index) in data_box_use[1].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">长腿类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>

                    <div style="height:130px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">子母扣翘起</h5>
                    <h5 class="center border-b-1">关节灵活度</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZimukouqiaoqi">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceGuanjielinghuodu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_3" class="item">
              <div v-for="(item,index) in data_box_use[2].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">膝外翻</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>

                    <div style="height:130px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">支具下滑</h5>
                    <h5 class="center border-b-1">子母扣翘起</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_3"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZhijuxiahua">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZimukouqiaoqi">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_4" class="item">
              <div v-for="(item,index) in data_box_use[3].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">踝足类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>

                    <div style="height:130px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">螺丝松动</h5>
                    <h5 class="center border-b-1">子母扣翘起</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceLuosisongdong">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZimukouqiaoqi">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_5" class="item">
              <div v-for="(item,index) in data_box_use[4].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">脊柱类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>

                    <div style="height:130px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">支具下滑</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">子母扣翘起</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZhijuxiahua">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZimukouqiaoqi">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_6" class="item">
              <div v-for="(item,index) in data_box_use[5].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">丹尼类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">角度松动</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceJiaodusongdong">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    
                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_7" class="item">
              <div v-for="(item,index) in data_box_use[6].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">扭转类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">角度变化</h5>
                    <h5 class="center border-b-1">步态</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceJiaodubianhua">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceButai">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItemUse.item_8" class="item">
              <div v-for="(item,index) in data_box_use[7].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">其他产品</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>

                    <div style="height:130px">
                      <el-radio-group v-model="item.experienceUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">子母扣翘起</h5>
                    <h5 class="center border-b-1">磨皮肤</h5>
                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.experienceProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.experienceNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.experienceUseEffect">
                        <el-radio v-for="(item,index) in isXG" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceZimukouqiaoqi">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.experienceMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.experienceProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.experienceSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>

              </div>
            </div>
          </div>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="回访备注"
              v-model="remark"
            ></el-input>
          </div>
    </el-dialog>
    <!-- 产品待使用回访详情 -->
    <el-dialog
      title="产品使用待回访详情"
      :visible.sync="productVisitDialog_2"
      :close-on-click-modal="false"
      width="1042px"
    >
    <div
            class="product_box"
            v-show="productItem_box"
            style="max-height: 475px;overflow-x: hidden;"
          >
            <div v-show="productItem.item_1" class="item">
              <div v-for="(item,index) in data_box[0].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">足弓垫</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>

                    <h5 class="center border-b-1">身高体重有无变化</h5>
                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">C系列足弓有无塌陷</h5>
                    <h5 class="center border-b-1">底层开裂</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>


                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useCTaxian">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useDicengkailie">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5> 
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>


                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_2" class="item">
              <div v-for="(item,index) in data_box[1].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">长腿类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:130px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>

                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">支具形变</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useZhijubianxing">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_3" class="item">
              <div v-for="(item,index) in data_box[2].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">膝外翻</h4>
                 <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:130px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>

                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">支具形变</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useZhijubianxing">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_4" class="item">
              <div v-for="(item,index) in data_box[3].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">踝足类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:130px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>

                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">螺丝松动</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useLuosisongdong">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_5" class="item">
              <div v-for="(item,index) in data_box[4].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">脊柱类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:130px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>

                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">支具形变</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useZhijubianxing">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_6" class="item">
              <div v-for="(item,index) in data_box[5].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">丹尼类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>

                    <h5 class="center border-b-1">支具干净程度</h5>
                    <h5 class="center border-b-1">角度松动</h5>
                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_1"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useJiaodusongdong">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5> 
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>


                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_7" class="item">
              <div v-for="(item,index) in data_box[6].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">扭转类</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:90px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>
                    <h5 class="center border-b-1">支具干净程度</h5>

                    <h5 class="center border-b-1">连接处脱开</h5>
                    <h5 class="center border-b-1">步态有无变化</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:90px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_3"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useLianjiechutuokai">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useButai">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5> 
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>


                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="productItem.item_8" class="item">
              <div v-for="(item,index) in data_box[7].list" :key="index" class="margin-b-10">
                <h4 class="center border-b-1 product_title">其他产品</h4>
                <el-row>
                  <el-col :span="8" class="border-r-1">
                    <h5 class="center border-b-1">每天使用时间</h5>
                    <div style="height:130px">
                      <el-radio-group v-model="item.useUseTime" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isSYSJ_L"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1">使用效果</h5>
                    <h5 class="center border-b-1">身高体重有无变化</h5>
                    <h5 class="center border-b-1">支具干净程度</h5>

                    <h5 class="center border-b-1">尼龙带</h5>
                    <h5 class="center border-b-1">子母扣有无生锈</h5>
                    <h5 class="center border-b-1">皮肤有无磨损</h5>

                    <h5 class="center border-b-1">有无问题</h5>
                    <div style="height:52px">
                      <el-radio-group v-model="item.useProblemHave" style="width:100%;">
                        <el-radio
                          style="display:block;padding: 5px 30% ;"
                          v-for="(item,index) in isYW"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </div>
                    <h5 class="center border-tb-1 bgColor-red">产品满意度</h5>
                  </el-col>
                  <el-col :span="16">
                    <h5 class="center border-b-1">注意事项</h5>
                    <div style="height:130px">
                      <el-checkbox-group v-model="item.useNotice" style="width:100%;">
                        <el-checkbox
                          style="display:block;padding: 5px 30% ;"
                          v-for="item in zysx_2"
                          :label="item"
                          :key="item"
                        >{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <h5 class="center border-tb-1">
                      <el-radio-group v-model="item.useUseEffect">
                        <el-radio v-for="(item,index) in isQK" :key="index" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useHeightWeight">
                        <el-radio v-for="item in isST" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useClean">
                        <el-radio v-for="item in isGJ" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useNilongdai">
                        <el-radio v-for="item in isNLD" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useZimukoushengxiu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>
                    <h5 class="center border-b-1">
                      <el-radio-group v-model="item.useMopifu">
                        <el-radio v-for="item in isYW" :key="item" :label="item"></el-radio>
                      </el-radio-group>
                    </h5>

                    <h5 class="center border-b-1">问题处理</h5>
                    <div style="height:52px;">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.useProblemDo"
                      ></el-input>
                    </div>
                    <h5 class="center border-b-1 bgColor-red">
                      <el-radio-group v-model="item.useSatisfaction">
                        <el-radio
                          class="color-fff"
                          v-for="(item,index) in isMY"
                          :key="index"
                          :label="item"
                        ></el-radio>
                      </el-radio-group>
                    </h5>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="回访备注"
              v-model="remark"
            ></el-input>
          </div>
    </el-dialog>
    <!-- dialog 打印检测报告-->
    <el-dialog
      title="检测报告"
      :visible.sync="dialogTestReport"
      center
      :close-on-click-modal="false"
      width="70%"
    >
      <my-print :testReport="testReport" :isTwo="isTwo" ref="print"></my-print>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close_testReport()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button type="success" icon="el-icon-receiving" @click="printpage()">打印报告</el-button>
        <el-button type="success" icon="el-icon-picture-outline" v-on:click="getPdf()">导出PDF</el-button>
      </div>
    </el-dialog>
    <!-- dialog 足长足宽修改-->
    <el-dialog title="足长足宽修改" :visible.sync="threeDDialg" :close-on-click-modal="false" width="30%">
      <el-form :model="threeD_ObjFrom" :inline="true" size="mini" label-width="80px">
        <el-form-item v-for="(item,index) in threeD_ObjFrom.list" :key="index" :label="item.name">
          <el-input v-model="item.value" size="small" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="threeD_func()" type="success" icon="el-icon-circle-check">提交</el-button>
      </div>
    </el-dialog>
    <!-- dialog 数据指派-->
    <el-dialog
      title="数据指派"
      :visible.sync="data_assignment.data_assignment_yyDialg"
      :close-on-click-modal="false"
      width="90%"
      :before-close="data_assignment_close"
    >
      <!-- seach -->
      <el-form :inline="true" size="small" id="search" class="padding-LR-p10">
        <el-form-item label="省份">
          <el-select
            class="w-150"
            clearable
            v-model="seach.provinceId"
            placeholder="请选择"
            @change="cityList(seach.provinceId)"
          >
            <el-option
              v-for="item in seach.provinceIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select
            class="w-150"
            clearable
            v-model="seach.cityId"
            placeholder="请先选择省份"
            @change="siteList(seach.cityId)"
          >
            <el-option
              v-for="item in seach.cityIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测评中心">
          <el-select
            clearable
            class="w-150"
            v-model="seach.siteValue"
            placeholder="请先选择城市"
            @change="hospitalList(seach.siteValue)"
          >
            <el-option
              v-for="item in seach.siteLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应回访日期">
          <el-date-picker
            v-model="data_assignment.search.time"
            class="w-250"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="试穿人员">
          <el-select
            class="w-150"
            clearable
            v-model="data_assignment.search.user"
            placeholder="请选择"
          >
            <el-option
              v-for="item in data_assignment.userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input
            v-model="data_assignment.search.productName"
            class="w-150"
            placeholder="请输入产品名称或昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="data_assignment_pageList()"
            icon="el-icon-search"
            type="primary"
            :loading="data_assignment.loading"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <!-- table -->
      <el-table
        :data="data_assignment.clientData"
        border
        @selection-change="data_assignment_handleSelectionChange"
        v-loading="data_assignment.loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="memberName" label="客户姓名"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="birthday" label="出生日期"></el-table-column>
        <el-table-column align="center" prop="saleProductNickname" label="产品昵称"></el-table-column>
        <el-table-column align="center" prop="tryOnBeginTime" label="试穿时间"></el-table-column>
        <el-table-column align="center" prop="tryOnUserName" label="试穿人员"></el-table-column>
        <el-table-column align="center" prop="visitWaitTime" label="应回访时间"></el-table-column>
        <el-table-column align="center" prop="isVip" label="是否会员"></el-table-column>
        <el-table-column align="center" prop="examinationTime" label="上次测评时间"></el-table-column>
        <el-table-column align="center" prop="examinationUser" label="测评人员"></el-table-column>
        <el-table-column align="center" prop="phoneStatus" label="产品使用接通状态"></el-table-column>
        <el-table-column type="selection" label="操作"></el-table-column>
      </el-table>
      <!-- Pagination 分页 -->
      <el-pagination
        @size-change="data_assignment_handleSizeChange"
        @current-change="data_assignment_handleCurrentChange"
        :current-page="data_assignment.pages.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="data_assignment.pages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data_assignment.pages.total"
        class="pagination"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="data_assignment_close()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="data_assignment_save()" type="success" icon="el-icon-thumb">数据指派</el-button>
      </div>
    </el-dialog>
    <!--选择指派人-->
    <el-dialog
      title="产品体验回访数据指派"
      :visible.sync="data_assignment.experience_details_dialog_yytwo"
      :close-on-click-modal="false"
      width="30%"
      :before-close="data_assignment_close_two"
    >
      <el-form :inline="true" size="small" id="search" class="padding-LR-p10">
        <el-form-item label="选择被指派人">
          <el-select class="w-150" clearable v-model="data_assignment.zpUser" placeholder="请选择">
            <el-option
              v-for="item in data_assignment.userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>已选中{{data_assignment.multipleSelection.length}}条数据</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="data_assignment_close_two()"
          type="primary"
          icon="el-icon-circle-close"
        >取消</el-button>
        <el-button
          @click="data_assignment_save_two(2)"
          type="success"
          icon="el-icon-circle-check"
        >确认指派</el-button>
      </div>
    </el-dialog>
    <!-- 流失登记-->
    <el-dialog
      title="客户流失登记"
      :visible.sync="new_details_data.khls_dialog"
      width="30%"
      :before-close="ls_cancel"
    >
      <div class="margin-t-20">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入流失原因"
          v-model="new_details_data.churnRegistration"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ls_cancel()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="userChurn(productVisitIds)" type="success" icon="el-icon-circle-check">提交</el-button>
      </div>
    </el-dialog>
    <!-- new_datails-->
    <el-dialog
      title="客户态度分析"
      :visible.sync="new_details_data.td_yydialog"
      width="30%"
      :before-close="td_cancel"
    >
      <div class="clearfix">
        <div class="left" style="height:20px;line-height:20px">客户态度评分：</div>
        <div class="left">
          <el-rate
            v-model="new_details_data.value"
            show-score
            text-color="#ff9900"
            show-text
            allow-half
            score-template="{value}分"
          ></el-rate>
        </div>
      </div>
      <div class="margin-t-20">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="new_details_data.causeOfLoss"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="td_cancel()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="addVisit(productVisitIds)" type="success" icon="el-icon-circle-check">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectBackWaitVisitList,
  selectBackWaitVisitDetail,
  queryExamineDetail,
  selectBackupPhoneByMemberId,
  insertBackVisit,
  insertBackupPhone,
  insertOutflow,
  selectOrderDetailByMemberId,
  selectVisitDetailByVisitIdAndType,
  printMakeParam,
  examinePadZb3d,
  selectPrincipalVisitListWhenBack,
  updatePrincipalUser
} from "../../api/javaApi";
import {
  exportMethod,
  personnel,
  tips,
  arrayDeduplication,
  province,
  city,
  allSite,
  site,
  hospital,
  getBase64Image,
  img_base64,
  date_zh
} from "../../utils/public";
import { Promise, all, async } from "q";
import session from "../../utils/session";
import Clipboard from "clipboard";
import Print from "../commonComponent/PrintTemplate";
import return_variable from "./return_variable";
import returnJs from "./page";
export default {
  name: "App",
  data() {
    return {
      remark:null,
      xqBut:false,
      //新的date
      timeValue: new Date(),
      isShow: false,
      /****数据指派数据 */
      data_assignment: return_variable.data_assignment,
      fayy_data: return_variable.fayy_data,
      /**新的回访弹框数据 */
      new_details_data: return_variable.new_details_data,
      /****top box */
      topActive: 1,
      box_top_data: {},
      //列表数据
      clientData: [],
      loading: true,
      //分页
      pages: {
        total: 10,
        pageSize: 10,
        currentPage: 1
      },
      seach: {
        repairUserId: null,
        delivery: null,
        scUserNameList: [],
        phoneStatus: null,
        phoneStatusList: [
          { name: "接通" },
          { name: "多次未接通" },
          { name: "接通挂断" },
          { name: "联系方式错误" }
        ],
        siteLists: [],
        siteValue: null,
        provinceId: null,
        cityId: null,
        provinceIdList: [],
        cityIdList: [],
        hospitalLists: [],
        hospitalId: null,
        phone:null
      },
      productUsageDetailsDialog: false,
      productDetailsForReturnVisitDialog: false,
      productVisitDialog_2: false,
      userMemberId: null,
      //回访id数组
      multipleSelection: [],
      memberDetailDto: [{}],
      pickupServiceInformation: [],
      pickupServiceInformation_use: [],
      //测评信息
      dialogEvaluationDetails: false, //测评信息详情弹框
      examinationInfo: {}, //测评详情
      detailList: [], //测评详情
      evaluates: [],
      causeOfLoss: null,
      nextVisitDate: null,
      onState: null,
      //
      textarea_1: null,
      //更多产品
      dialogMoreProducts: false,
      moreProducts: [],
      //添加电话
      addPhoneDialog: false,
      //用户电话列表
      phoneList: [],
      //模板表显示
      productItem_box: false,
      productItem: {
        item_1: false,
        item_2: false,
        item_3: false,
        item_4: false,
        item_5: false,
        item_6: false,
        item_7: false,
        item_8: false
      },
      //体验回访详情
      productItemUse: {
        item_1: false,
        item_2: false,
        item_3: false,
        item_4: false,
        item_5: false,
        item_6: false,
        item_7: false,
        item_8: false
      },
      usePhoneStatus: null,
      usePhone: null,
      useWaitTime: null,
      productVisitType: [],
      visitForms: [],
      backupPhone: null,
      //模板数据
      backTalkResult: null,
      backInviteResult: null,
      visitWaitTime: null,
      isYW: ["有", "无"],
      isGJ: ["干净", "脏"],
      isSYSJ: ["未使用", "5小时以下", "5-12小时"],
      isSYSJ_L: ["未使用", "5小时以下", "5-12小时", "5-18小时", "18小时以上"],
      isMY: ["满意", "一般", "不满意"],
      isST: ["有变化", "无变化", "没量"],
      isXG: ["没注意", "没变化", "有点变化"],
      isQK: ["鼓励", "警告"],
      isNLD: ["粘", "不沾"],
      ls_gtjg: ["配合", "不配合"],
      ls_fcyyjg: ["拒绝不来", "时间不定", "时间确定"],
      zysx_1: ["运动", "皮肤护理", "鞋垫保养"],
      zysx_2: ["运动", "皮肤护理", "按摩"],
      zysx_3: ["运动", "皮肤护理", "生活习惯"],
      ls_fcdfydsj: null,
      productVisitIds: [],
      data_box_use: [
        {
          productType: 1,
          list: []
        },
        {
          productType: 2,
          list: []
        },
        {
          productType: 3,
          list: []
        },
        {
          productType: 4,
          list: []
        },
        {
          productType: 5,
          list: []
        },
        {
          productType: 6,
          list: []
        },
        {
          productType: 7,
          list: []
        },
        {
          productType: 8,
          list: []
        }
      ],
      data_box: [
        {
          productType: 1,
          list: []
        },
        {
          productType: 2,
          list: []
        },
        {
          productType: 3,
          list: []
        },
        {
          productType: 4,
          list: []
        },
        {
          productType: 5,
          list: []
        },
        {
          productType: 6,
          list: []
        },
        {
          productType: 7,
          list: []
        },
        {
          productType: 8,
          list: []
        }
      ],
      //检测报告
      dialogTestReport: false,
      testReport: {},
      isTwo: true,
      htmlTitle: "测评报告PDF",
      threeD_ObjFrom: {
        list: []
      },
      threeDDialg: false,
      only_recordId: null,
      backInviteResultIsShow:false
    };
  },
  components: {
    "my-print": Print
  },
  mounted() {
    // this.pageList();
    this.topItem_func(1);
    this.userList();
    this.provinceList();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 3) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 6) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 8) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 10) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 11) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 12) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 13) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 14) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    backInviteResult_func(val) {
      if (val == "拒绝不来") {
        this.ls_save();
        this.new_details_data.churnRegistration = val;
        this.backInviteResultIsShow = false;
      } else if (val == "时间不定") {
        this.backInviteResultIsShow = false;
      } else {
        this.backInviteResultIsShow = true;
      }
    },
    onState_func(e) {
      if (e != "接通") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    td_cancel() {
      this.new_details_data.td_yydialog = false;
      this.new_details_data.value = 0;
      this.new_details_data.causeOfLoss = null;
    },
    td_addVisit() {
      this.new_details_data.td_yydialog = true;
    },
    ls_cancel() {
      this.new_details_data.khls_dialog = false;
      this.new_details_data.churnRegistration = null;
    },
    ls_save() {
      this.new_details_data.khls_dialog = true;
    },
    seveTime() {
      let date = date_zh(this.timeValue);
      let aa= this.fayy_data.timeValue
      let bb= this.fayy_data.minuteValue
      let a
      if(aa){
         a = this.fayy_data.timeValue < 10 ? "0" + this.fayy_data.timeValue : this.fayy_data.timeValue;
      }else{
         a = "00";
      }
      let b
      if(bb){
           b =this.fayy_data.minuteValue < 10? "0" + this.fayy_data.minuteValue  : this.fayy_data.minuteValue;
      }else{
         b="00";
      }
      let time = `${a}:${b}`;
      this.useWaitTime = `${date} ${time}`;
      // console.log(date_zh(this.timeValue))
      // console.log(this.timeValue)
      console.log(this.useWaitTime);
      console.log(this.fayy_data);
      console.log(this.fayy_data.timeValue);
      console.log(this.fayy_data.minuteValue);
    },
    data_assignment_close() {
      this.data_assignment.data_assignment_yyDialg = false;
      this.data_assignment.multipleSelection = [];
    },
    data_assignment_close_two() {
      this.data_assignment.experience_details_dialog_yytwo = false;
      this.data_assignment.zpUser = null;
    },
    data_assignment_save() {
      this.data_assignment.experience_details_dialog_yytwo = true;
    },
    data_assignment_save_two(status) {
      let visitIds = [];
      this.data_assignment.multipleSelection.forEach(obj => {
        visitIds.push(obj.visitId);
      });
      let data = {
        visitIds: visitIds,
        principalUserId: this.data_assignment.zpUser,
        backVisitStatus: status
      };
      updatePrincipalUser(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            tips(this, "指派成功!", "success");
            this.data_assignment.multipleSelection = [];
            this.data_assignment_close_two();
            this.data_assignment_pageList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    data_assignment_handleSelectionChange(val) {
      this.data_assignment.multipleSelection = val;
    },
    //数据指派统计列表 //查询
    async data_assignment_pageList() {
      let data = {
        pageNum: this.data_assignment.pages.currentPage,
        pageSize: this.data_assignment.pages.pageSize,
        provinceId: this.seach.provinceId,
        cityId: this.seach.cityId,
        siteId: this.seach.siteValue,
        principalUserId: this.data_assignment.search.user,
        waitTimeBegin:
          this.data_assignment.search.time == null
            ? null
            : this.data_assignment.search.time[0],
        waitTimeEnd:
          this.data_assignment.search.time == null
            ? null
            : this.data_assignment.search.time[1],
        productName: this.data_assignment.search.productName
      };
      this.data_assignment.loading = true;
      selectPrincipalVisitListWhenBack(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            console.log(res);
            this.data_assignment.loading = false;
            let dataList = res.data.data;
            this.data_assignment.clientData = dataList.data;
            this.data_assignment.pages.total = dataList.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //指派数据当前页面变化时
    data_assignment_handleCurrentChange(num) {
      this.data_assignment.pages.currentPage = num;
      this.data_assignment_pageList();
    },
    //指派数据页面条数发生变化时
    data_assignment_handleSizeChange(val) {
      this.data_assignment.pages.pageSize = val;
      this.data_assignment_pageList();
    },
    data_assignment_func() {
      this.data_assignment_pageList();
      this.data_assignment.data_assignment_yyDialg = true;
    },
    topItem_func(index) {
      this.topActive = index;
      this.pageList(index);
    },
    threeD_func() {
      let data = {
        recordId: this.only_recordId,
        footLength:
          this.threeD_ObjFrom.list[1].name == "足长"
            ? this.threeD_ObjFrom.list[1].value
            : this.threeD_ObjFrom.list[0].value,
        footWidth:
          this.threeD_ObjFrom.list[0].name == "足宽"
            ? this.threeD_ObjFrom.list[0].value
            : this.threeD_ObjFrom.list[1].value
      };
      examinePadZb3d(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.threeDDialg = false;
            this.dialogEvaluationDetails = false;
            this.$message({
              type: "success",
              message: "下单成功！",
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    threeD_show(obj) {
      this.threeD_ObjFrom.list = obj;
      this.threeDDialg = true;
    },
    printpage() {
      this.$print2(this.$refs.print);
    },
    close_testReport() {
      this.dialogTestReport = false;
      this.testReport = {};
    },
    evaluationReport(id) {
      let data = {
        recordId: id
      };
      printMakeParam(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.testReport = res.data.data;
            img_base64(this, res.data.data);
            this.dialogTestReport = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    visitIdDtails_2(obj) {
      for (let key in this.productItem) {
        this.productItem[key] = false;
      }
      let data = {
        visitId: obj.visitId,
        visitTypeInt: obj.visitTypeInt
      };
      selectVisitDetailByVisitIdAndType(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.data_box[obj.visitTypeInt - 1].list[0] = res.data.data;
            this.productItem["item_" + obj.visitTypeInt] = true;
            this.productVisitDialog_2 = true;
            this.remark=res.data.data.remark
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    visitIdDtails(obj) {
      for (let key in this.productItemUse) {
        this.productItemUse[key] = false;
      }
      let data = {
        visitId: obj.visitId,
        visitTypeInt: obj.visitTypeInt
      };
      selectVisitDetailByVisitIdAndType(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.productDetailsForReturnVisitDialog = true;
            this.data_box_use[obj.visitTypeInt - 1].list[0] = res.data.data;
            this.productItemUse["item_" + obj.visitTypeInt] = true;
            this.remark=res.data.data.remark
            console.log(this.productItemUse)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    userChurn(list) {
      let data = {
        outflowPhoneStatus: this.usePhoneStatus,
        outflowPhone: this.usePhone,
        outflowReason: this.new_details_data.churnRegistration,
        visitIds: list //this.multipleSelection
      };
      insertOutflow(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.ls_cancel();
            this.cancel();
            this.pageList(this.pages.currentPage, this.pages.pageSize);
            this.$message({
              type: "success",
              message: "提交成功！",
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addVisit(list) {
      //   this.productVisitType.forEach((item, index) => {
      //     let element = this.data_box[Number(item) - 1];
      //     this.visitForms.push(element);
      //   });
      //   console.log(this.visitForms);
      //   console.log(this.data_box);
      let data = {
        visitWaitTimePeriod: this.fayy_data.dayValue,
        backRemark: this.causeOfLoss,
        remark: this.causeOfLoss,
        memberAttitude:
          this.new_details_data.value == 0 ? null : this.new_details_data.value,
        memberAttitudeRemark: this.new_details_data.causeOfLoss,

        visitIds: list, //this.multipleSelection,
        backPhoneStatus: this.usePhoneStatus,
        backPhone: this.usePhone,
        visitWaitTime: this.useWaitTime,
       // confirmBackWaitTime: this.visitWaitTime,
        backInviteResult: this.backInviteResult,
        backTalkResult: this.backTalkResult
      };
      insertBackVisit(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
            // this.visitForms=[]
          } else {
            this.td_cancel();
            this.cancel();
            this.pageList(this.pages.currentPage, this.pages.pageSize);
            this.$message({
              type: "success",
              message: "提交成功！",
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addSparePhone() {
      let data = {
        memberId: this.userMemberId,
        parent: this.new_details_data.relationship,
        backupPhone: this.backupPhone
      };
      insertBackupPhone(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.cancelAddPhone();
            this.userPhoneList(this.userMemberId);
            this.$message({
              type: "success",
              message: "添加成功！",
              center: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancelAddPhone() {
      this.addPhoneDialog = false;
      this.backupPhone = null;
    },
    addPhone() {
      this.addPhoneDialog = true;
    },
    copy(index) {
      let copyText = this.moreProducts[index].orderNum;
      let clipboard = new Clipboard(".tag-read", {
        text: function() {
          return copyText;
        }
      });
      clipboard.on("success", e => {
        tips(this, "复制成功!", "success");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        tips(this, "该浏览器不支持自动复制!", "warning");
        // 释放内存
        clipboard.destroy();
      });
    },
    morePrduct_function() {
      let data = {
        memberId: this.userMemberId
      };
      selectOrderDetailByMemberId(data)
        .then(res => {
          console.log(res);
          this.moreProducts = res.data.data.data;
          this.dialogMoreProducts = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.productUsageDetailsDialog = false;
      this.multipleSelection = [];
      for (let key in this.productItem) {
        this.productItem[key] = false;
      }
      this.usePhoneStatus = null;
      this.useWaitTime = null;
      this.visitForms = [];
      this.usePhone = null;
      this.causeOfLoss = null;
      this.backInviteResult = null;
      this.backTalkResult = null;
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      console.log(val);
      //   let myType = [];
      //   if (val.length > 0) {
      // for (let key in this.productItem) {
      //   this.productItem[key] = false;
      // }
      val.forEach(element => {
        //   this.productItem["item_" + element.saleProductType] = true;
        //   myType.push(element.saleProductType);
        this.multipleSelection.push(element.visitId);
      });
      // let myArry = arrayDeduplication(myType);
      this.productItem_box = true;
      // this.productVisitType = myArry;
      // console.log(this.productVisitType);
      // this.$refs.my_box.style.width = 1002 * myArry.length + "px";
      //   } else {
      //     this.productItem_box = false;
      //   }
    },
    details(obj) {
      this.xqBut=true
      this.userMemberId = obj.memberId;
      this.userPhoneList(obj.memberId);
      let data = { visitId: obj.visitId };
      selectBackWaitVisitDetail(data)
        .then(res => {
          console.log(res);
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
            this.xqBut=false
          } else {
            let details = res.data.data;
            this.memberDetailDto[0] = details.memberDetailDTO;
            this.new_details_data.prescriptionDTO = details.prescriptionDTO;
            this.pickupServiceInformation = details.experienceRecordDTO;
            this.new_details_data.examinationInfo[0] =
              details.examineDetail.examinationInfo;
            this.new_details_data.detailList = details.examineDetail.detailList;
            // this.evaluates = details.evaluates;
            this.productUsageDetailsDialog = true;
            this.handleSelectionChange(details.useWaitProductDetailDTO);

            this.pickupServiceInformation_use = details.useRecordDTO;
            this.productVisitIds = details.visitIds;
            console.log(this.pickupServiceInformation)
            console.log(this.pickupServiceInformation_use)
            this.xqBut=false
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    evaluationDetails(id) {
      this.only_recordId = id;
      let data = {
        recordId: id
      };
      queryExamineDetail(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.examinationInfo = res.data.data.examinationInfo;
            this.detailList = res.data.data.detailList;
            this.dialogEvaluationDetails = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //统计列表 //查询
    async pageList(pageIndex = 1, pageSize = 10) {
      let data = {
        pageNum: this.pages.currentPage,
        pageSize: this.pages.pageSize,
        waitTimeBegin:
          this.seach.delivery == null ? null : this.seach.delivery[0],
        waitTimeEnd:
          this.seach.delivery == null ? null : this.seach.delivery[1],
        examinationUserId: this.seach.repairUserId,
        phoneStatus: this.seach.phoneStatus,
        provinceId: this.seach.provinceId,
        cityId: this.seach.cityId,
        siteId: this.seach.siteValue,
        hospitalId: this.seach.hospitalId,
        timeType: this.topActive,
        phone:this.seach.phone
      };
      this.loading = true;
      selectBackWaitVisitList(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.loading = false;
            let dataList = res.data.data;
            this.clientData = dataList.data.visitDTOS;
            this.pages.total = dataList.total;
            this.box_top_data = dataList.data;
            returnJs.rowspan_sy(this,this.clientData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //当前页面变化时
    handleCurrentChange(num) {
      this.pages.currentPage = num;
      let pageIndex = this.pages.currentPage;
      let pageSize = this.pages.pageSize;
      this.pageList(pageIndex, pageSize);
    },
    //页面条数发生变化时
    handleSizeChange(val) {
      this.pages.pageSize = val;
      let pageIndex = this.pages.currentPage;
      let pageSize = this.pages.pageSize;
      this.pageList(pageIndex, pageSize);
    },
    //获取试穿人员列表
    async userList() {
      let data = await personnel(6);
      this.seach.scUserNameList = data;
      this.data_assignment.userList = data;
      // this.seach.scUserNameList = await personnel(6);
    },
    //获取省
    async provinceList() {
      this.seach.provinceIdList = await province();
    },
    //获取市
    async cityList(id) {
      this.seach.cityIdList = await city(id);
    },
    //根据市获取测评中心列表
    async siteList(id) {
      this.seach.siteLists = await allSite(null, id);
    },
    //根据测评中心获取医院列表
    async hospitalList(id) {
      this.seach.hospitalLists = await hospital(id);
    },
    //获取试穿人员列表
    async userList() {
      this.seach.scUserNameList = await personnel(9);
    },
    //电话号列表
    userPhoneList(id) {
      let data = {
        memberId: id
      };
      selectBackupPhoneByMemberId(data)
        .then(res => {
          console.log(res);
          this.phoneList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
#el-step .el-step__title {
  font-size: 12px;
}
.color-red {
  color: #fb5b3c;
}
.product_box {
  width: 100%;
  overflow-y: hidden;
  margin-top: 20px;
  // border: 1px solid #CDCDCD;
  .my_box {
    height: 413px;
    width: 0px;
    .item {
      border: 1px solid #cdcdcd;
      width: 1000px;
      height: auto;
      float: left;
    }
  }
}
.product_title {
  background: #3a8ee6;
  color: #ecf5ff;
}
.padding-special {
  padding: 7.5px 0px;
}
.border-b-1 {
  border-bottom: 1px solid #cdcdcd;
  line-height: 30px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.border-r-1 {
  border-right: 1px solid #cdcdcd;
}
/*top */
.box {
  display: flex;
  justify-content: center;
  .item {
    width: 40%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    margin: 0 10px 10px 10px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    div {
      line-height: 30px;
    }
  }
  .active {
    color: #ffffff;
    background: #56a9ff;
  }
  // .item1 {
  //   div {
  //     line-height: 60px;
  //   }
  // }
}

.bgColor-red {
  background: #df5c5c;
  color: #ffffff;
}
.border-tb-1 {
  line-height: 30px;
  border-top: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  margin: 0;
}
</style>
