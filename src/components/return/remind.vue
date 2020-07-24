//待复查
<template>
  <div>
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
      <el-form-item label="回访人员">
        <!-- <el-input clearable class="w-150" v-model="seach.visitUserName" placeholder="请输入回访人"></el-input> -->
        <el-select
          class="w-150"
          clearable
          v-model="seach.visitUserId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in seach.visitUserList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="复查应到访日期">
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
      <el-form-item label="邀约次数">
        <el-select class="w-150" clearable v-model="seach.yycsId" placeholder="请选择">
          <el-option
            v-for="item in seach.yycs"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input clearable class="w-150" v-model="seach.saleProductName" placeholder="请输入产品昵称"></el-input>
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input clearable class="w-150" v-model="seach.memberName" placeholder="请输入产品昵称"></el-input>
      </el-form-item>
      <el-form-item label="是否会员">
        <el-select class="w-150" clearable v-model="seach.vip" placeholder="请选择">
          <el-option
            v-for="item in seach.vipList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否逾期">
        <el-select
         class="w-150"
          clearable
          v-model="seach.overdue"
          placeholder="请选择"
        >
          <el-option
            v-for="item in seach.overdueList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <!-- <el-form-item label="医院">
        <el-select clearable class="w-150" v-model="seach.hospitalId" placeholder="请先选择测评中心">
          <el-option
            v-for="item in seach.hospitalLists"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button
          @click="pageList(pages.currentPage,pages.pageSize)"
          icon="el-icon-search"
          type="primary"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table
      border
      :data="clientData"
      max-height="650"
      v-loading="loading"
      :span-method="objectSpanMethod"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :header-row-class-name="'headerClass'"
    >
      <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
      <el-table-column align="center" prop="memberName" label="客户姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别"></el-table-column>
      <el-table-column align="center" prop="birthday" label="出生日期"></el-table-column>
      <el-table-column align="center" prop="vip" label="是否会员"></el-table-column>
      <el-table-column align="center" prop="saleProductNickname" label="产品昵称"></el-table-column>
      <!-- <el-table-column align="center" prop="tryOnUserName" label="试穿人员"></el-table-column> -->
      <el-table-column align="center" prop="visitTime" label="回访时间"></el-table-column>
      <el-table-column align="center" prop="visitPromiseTime" label="复查到访约定时间">
        <template slot-scope="scope">
          <div :class="scope.row.red === 1 ?'color-red':''">{{scope.row.visitPromiseTime}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="confirmBackWaitTime" label="确定时间回访"></el-table-column> -->
      <el-table-column align="center" prop="backTimes" label="回访次数"></el-table-column>
      <el-table-column align="center" prop="backUser" label="回访人员"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="details_hf(scope.row)"
            type="primary"
            size="small"
            icon="el-icon-help"
          >回访详情</el-button>
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
          <h3 class="new-title">基本信息</h3>
          <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass-two'">
            <el-table-column prop="memberName" label="客户姓名" min-width="100"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="birthday" label="出生日期"></el-table-column>
            <!-- <el-table-column prop="vip" label="是否会员"></el-table-column> -->
            <el-table-column prop="memberModeCN" label="客户当前类型"></el-table-column>
            <el-table-column prop="cognition" label="客户初始认知"></el-table-column>
            <el-table-column prop="updateProductTimes" label="换产品次数"></el-table-column>
          </el-table>
          <h3 class="new-title">会员信息</h3>
          <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass-two'">
            <el-table-column prop="vip" label="是否会员" min-width="100"></el-table-column>
            <el-table-column prop="vipType" label="是否续会员"></el-table-column>
            <el-table-column prop="expireDate" label="会员到期时间"></el-table-column>
            <el-table-column prop="partsNum" label="部位剩余次数"></el-table-column>
            <el-table-column prop="wholeNum" label="全身剩余次数"></el-table-column>
          </el-table>
          <h3 class="new-title">病单信息</h3>
          <el-table
            :data="new_details_data.prescriptionDTO"
            border
            :header-row-class-name="'headerClass'"
          >
            <el-table-column prop="hospitalName" label="医院" min-width="100"></el-table-column>
            <el-table-column prop="departmentName" label="科室"></el-table-column>
            <el-table-column prop="doctorName" label="医生"></el-table-column>
            <el-table-column prop="prescriptionType" label="病单类型"></el-table-column>
            <el-table-column prop="condition" label="处方病情"></el-table-column>
            <el-table-column prop="illness" label="新增病情"></el-table-column>
            <el-table-column prop="updateTime" label="创建时间"></el-table-column>
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
            <el-table-column prop="experienceUseTime" label="穿戴时长"></el-table-column>
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
            <el-table-column prop="tryOnRemark" label="试穿备注"></el-table-column>
            <el-table-column prop="useTime" label="使用回访时间"></el-table-column>
            <!-- <el-table-column prop="usePhone" label="回访电话"></el-table-column> -->
            <el-table-column prop="usePhoneStatus" label="接通状态"></el-table-column>
            <el-table-column prop="useUserName" label="产品使用回访人"></el-table-column>
            <el-table-column prop="useSatisfaction" label="产品满意度"></el-table-column>
            <el-table-column prop="useUseTime" label="穿戴时长"></el-table-column>
            <el-table-column prop="useHeightWeight" label="体格是否变化"></el-table-column>
            <el-table-column prop="useSatisfaction" label="客户态度"></el-table-column>
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
            <el-table-column align="center" prop="cycle" label="治疗周期"></el-table-column>
            <el-table-column align="center" prop="createTime" label="测评日期"></el-table-column>
            <el-table-column align="center" prop="evaluateUserName" label="测评人员"></el-table-column>
            <el-table-column align="center" prop="repeatTime" label="复查日期"></el-table-column>
            <el-table-column align="center" prop="memberAnalysisCN" label="客户分析"></el-table-column>
            <el-table-column align="center" prop="recoveryCN" label="恢复情况"></el-table-column>
            <el-table-column align="center" prop="remark" label="结果备注"></el-table-column>
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
              <el-button
                @click="td_addVisit()"
                size="mini"
                type="success"
                icon="el-icon-circle-check"
              >确认提交</el-button>
              <el-button
                @click="addPhone()"
                size="mini"
                type="success"
                icon="el-icon-circle-plus-outline"
              >添加联系电话</el-button>
              <el-button
                @click="morePrduct_function()"
                size="mini"
                type="success"
                icon="el-icon-tickets"
              >更多产品信息</el-button>
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
              <el-radio-group v-model="usePhoneStatus" @change="onState_func(usePhoneStatus)">
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
                <el-radio-group
                  v-model="backInviteResult"
                  @change="backInviteResult_func(backInviteResult)"
                >
                  <el-radio v-for="(item,index) in ls_fcyyjg" :key="index" :label="item"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

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
      <div class="product_box" style="max-height: 475px;overflow-x: hidden;">
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.experienceProblemDo"></el-input>
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
      <div class="product_box" style="max-height: 475px;overflow-x: hidden;">
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
                  <el-input type="textarea" placeholder="请输入内容" v-model="item.useProblemDo"></el-input>
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
    <!-- 待复查详情弹框 -->
    <el-dialog
      title="待复查详情"
      :visible.sync="dfc_Dialog"
      :close-on-click-modal="false"
      :before-close="cancel_dfc"
      width="80%"
    >
      <h3 class="new-title">基本信息</h3>
      <el-table :data="memberDetailDto" border :header-row-class-name="'headerClass-two'">
        <el-table-column prop="memberName" label="客户姓名" min-width="100"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="birthday" label="出生日期"></el-table-column>
        <el-table-column prop="vip" label="是否会员"></el-table-column>
        <el-table-column prop="condition" label="处方病情"></el-table-column>
        <el-table-column prop="illness" label="新增病情"></el-table-column>
      </el-table>
      <h3 class="new-title">病单信息</h3>
      <el-table :data="fcprescriptionDTO" border :header-row-class-name="'headerClass'">
        <el-table-column prop="hospitalName" label="医院" min-width="100"></el-table-column>
        <el-table-column prop="departmentName" label="科室"></el-table-column>
        <el-table-column prop="doctorName" label="医生"></el-table-column>
        <el-table-column prop="prescriptionType" label="病单类型"></el-table-column>
        <el-table-column prop="condition" label="处方病情"></el-table-column>
        <el-table-column prop="illness" label="新增病情"></el-table-column>
        <el-table-column prop="updateTime" label="创建时间"></el-table-column>
      </el-table>
      <h3 class="new-title">回访信息</h3>
      <el-table
        :data="pickupServiceInformation_back"
        border
        max-height="220"
        :header-row-class-name="'headerClass-two'"
      >
        <el-table-column prop="productNickname" label="产品昵称"></el-table-column>
        <el-table-column prop="backTime" label="邀约回访时间"></el-table-column>
        <el-table-column prop="backPhone" label="回访电话"></el-table-column>
        <el-table-column prop="backPhoneStatus" label="接通状态"></el-table-column>
        <el-table-column prop="backUserName" label="回访人员"></el-table-column>
        <el-table-column prop="visitWaitTime" label="复查预约到访时间"></el-table-column>
        <!-- <el-table-column prop="confirmBackWaitTime" label="确认预约回访时间"></el-table-column> -->
        <el-table-column prop="backTalkResult" label="沟通结果"></el-table-column>
        <el-table-column prop="backInviteResult" label="复查邀约结果"></el-table-column>
        <el-table-column prop="remark" label="邀约备注"></el-table-column>

        <!-- <el-table-column prop="orderNum" label="订单编号"></el-table-column>
        <el-table-column prop="productNickname" label="产品昵称"></el-table-column>
        <el-table-column prop="backTime" label="邀约回访时间"></el-table-column>
        <el-table-column prop="backPhone" label="回访电话"></el-table-column>
        <el-table-column prop="backPhoneStatus" label="接通状态"></el-table-column>
        <el-table-column prop="backUserName" label="回访人"></el-table-column>
        <el-table-column prop="visitWaitTime" label="复查预约到访时间"></el-table-column>
        <el-table-column prop="confirmBackWaitTime" label="确认预约应回访时间"></el-table-column>
        <el-table-column label="邀约回访详情">
          <template slot-scope="scope">
            <el-link @click="visitIdDtails_3(scope.row)" type="primary">
              查看详情
              <i class="el-icon-view el-icon--right"></i>
            </el-link>
          </template>
        </el-table-column>-->
      </el-table>
      <h3 class="new-title">流失信息</h3>
      <el-table :data="fcOutflowDTOs" border :header-row-class-name="'headerClass-two'">
        <el-table-column prop="outflowTime" label="流失时间" min-width="100"></el-table-column>
        <el-table-column prop="visitTypeString" label="回访类型"></el-table-column>
        <el-table-column prop="backVisitUserName" label="回访人"></el-table-column>
        <el-table-column prop="phoneStatus" label="接通状态"></el-table-column>
        <el-table-column prop="phone" label="回访电话"></el-table-column>
        <el-table-column prop="outflowReason" label="流失原因"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="cancel_dfc()" type="primary" icon="el-icon-circle-close">取消</el-button>
        <el-button @click="details(rowObj)" type="success" icon="el-icon-circle-check">修改/确认到访时间</el-button>
      </span>
    </el-dialog>
    <!-- 流失登记-->
    <el-dialog
      title="客户流失登记"
      :visible.sync="new_details_data.dfc_khls_dialog"
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
      :visible.sync="new_details_data.td_dfcdialog"
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
  selectWaitReviewByPage,
  selectUpdateBackWaitVisitDetail,
  queryExamineDetail,
  selectBackupPhoneByMemberId,
  insertBackVisit,
  insertBackupPhone,
  insertOutflow,
  selectOrderDetailByMemberId,
  selectVisitDetailByVisitIdAndType,
  selectWaitReviewDetail,
  printMakeParam,
  examinePadZb3d,
  queryWaitReviewDetail,
  userListByDepts
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
      fcOutflowDTOs:[],
      fcprescriptionDTO:[],
      /**新的回访弹框数据 */
      new_details_data: return_variable.new_details_data,
      isShow: false,
      backInviteResultIsShow: false,
      fayy_data: return_variable.fayy_data,
      timeValue: new Date(),
      ls_fcyyjg: ["拒绝不来", "时间不定", "时间确定"],
      remark: null,
      /** */
      spanArr: [],
      position: 0,
      //列表数据
      clientData: [],
      loading: true,
      //分页
      pages: {
        total: 10,
        pageSize: 10,
        currentPage: 1,
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
          { name: "联系方式错误" },
        ],
        saleProductName: null,
        memberName: null,
        visitUserName: null,
        overdue: null,
        overdueList: [
          { name: "是", id: 1 },
          { name: "否", id: "0" },
        ],
        vip: null,
        vipList: [
          { name: "是", id: 1 },
          { name: "否", id: "0" },
        ],
        siteLists: [],
        siteValue: null,
        provinceId: null,
        cityId: null,
        provinceIdList: [],
        cityIdList: [],
        hospitalLists: [],
        hospitalId: null,
        visitUserList:[],
        yycs:[
          {name:1},
          {name:2},
          {name:3}
        ],
        yycsId:null,
        visitUserId:null
      },
      productUsageDetailsDialog: false,
      productDetailsForReturnVisitDialog: false,
      productVisitDialog_2: false,
      productVisitDialog_3: false,
      dfc_Dialog: false,
      userMemberId: null,
      rowObj: null,
      //回访id数组
      multipleSelection: [],
      memberDetailDto: [{}],
      pickupServiceInformation: [],
      pickupServiceInformation_use: [],
      pickupServiceInformation_back: [],
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
        item_8: false,
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
        item_8: false,
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

      zysx_1: ["运动", "皮肤护理", "鞋垫保养"],
      zysx_2: ["运动", "皮肤护理", "按摩"],
      zysx_3: ["运动", "皮肤护理", "生活习惯"],
      ls_fcdfydsj: null,
      productVisitIds: [],
      ls_back: {},
      data_box_use: [
        {
          productType: 1,
          list: [],
        },
        {
          productType: 2,
          list: [],
        },
        {
          productType: 3,
          list: [],
        },
        {
          productType: 4,
          list: [],
        },
        {
          productType: 5,
          list: [],
        },
        {
          productType: 6,
          list: [],
        },
        {
          productType: 7,
          list: [],
        },
        {
          productType: 8,
          list: [],
        },
      ],
      data_box: [
        {
          productType: 1,
          list: [],
        },
        {
          productType: 2,
          list: [],
        },
        {
          productType: 3,
          list: [],
        },
        {
          productType: 4,
          list: [],
        },
        {
          productType: 5,
          list: [],
        },
        {
          productType: 6,
          list: [],
        },
        {
          productType: 7,
          list: [],
        },
        {
          productType: 8,
          list: [],
        },
      ],
      //检测报告
      dialogTestReport: false,
      testReport: {},
      isTwo: true,
      htmlTitle: "测评报告PDF",
      threeD_ObjFrom: {
        list: [],
      },
      threeDDialg: false,
      only_recordId: null,
    };
  },
  components: {
    "my-print": Print,
  },
  mounted() {
    this.pageList();
    this.userList();
    this.provinceList();
    this.init_two();
    
  },
  methods: {
    td_cancel() {
      this.new_details_data.td_dfcdialog = false;
      this.new_details_data.value = 0;
      this.new_details_data.causeOfLoss = null;
    },
    td_addVisit() {
      this.new_details_data.td_dfcdialog = true;
    },
    ls_cancel() {
      this.new_details_data.dfc_khls_dialog = false;
      this.new_details_data.churnRegistration = null;
    },
    ls_save() {
      if(!this.usePhone){
          tips(this, "请选择手机号!", "warning");
      }else{
      this.new_details_data.dfc_khls_dialog = true;
      }
    },
    seveTime() {
      let date = date_zh(this.timeValue);
      let aa = this.fayy_data.timeValue;
      let bb = this.fayy_data.minuteValue;
      let a;
      if (aa) {
        a =
          this.fayy_data.timeValue < 10
            ? "0" + this.fayy_data.timeValue
            : this.fayy_data.timeValue;
      } else {
        a = "00";
      }
      let b;
      if (bb) {
        b =
          this.fayy_data.minuteValue < 10
            ? "0" + this.fayy_data.minuteValue
            : this.fayy_data.minuteValue;
      } else {
        b = "00";
      }
      let time = `${a}:${b}`;
      this.useWaitTime = `${date} ${time}`;
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },

    cancel_dfc() {
      this.dfc_Dialog = false;
    },
    // visitIdDtails_3(obj) {
    //   let data = {
    //     visitId: obj.visitId,
    //     visitTypeInt: obj.visitTypeInt
    //   };
    //   selectVisitDetailByVisitIdAndType(data)
    //     .then(res => {
    //       if (res.data.returnCode != 0) {
    //         this.$message({
    //           type: "warning",
    //           message: res.data.returnMsg,
    //           center: true
    //         });
    //       } else {
    //         this.ls_back = res.data.data;
    //         this.productVisitDialog_3 = true;
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    visitIdDtails_2(obj) {
      for (let key in this.productItem) {
        this.productItem[key] = false;
      }
      let data = {
        visitId: obj.visitId,
        visitTypeInt: obj.visitTypeInt,
      };
      selectVisitDetailByVisitIdAndType(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            this.data_box[obj.saleProductType - 1].list[0] = res.data.data;
            this.productItem["item_" + obj.saleProductType] = true;
            this.productVisitDialog_2 = true;
            this.remark = res.data.data.remark;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    visitIdDtails(obj) {
      for (let key in this.productItemUse) {
        this.productItemUse[key] = false;
      }
      let data = {
        visitId: obj.visitId,
        visitTypeInt: obj.visitTypeInt,
      };
      selectVisitDetailByVisitIdAndType(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            this.data_box_use[obj.saleProductType - 1].list[0] = res.data.data;
            this.productItemUse["item_" + obj.saleProductType] = true;
            this.productDetailsForReturnVisitDialog = true;
            this.remark = res.data.data.remark;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    userChurn(list) {
      let data = {
        outflowPhoneStatus: this.usePhoneStatus,
        outflowPhone: this.usePhone,
        outflowReason: this.new_details_data.churnRegistration, //this.causeOfLoss,
        visitIds: list, //this.multipleSelection
      };
      insertOutflow(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            this.ls_cancel();
            this.cancel();
            this.cancel_dfc();
            this.pageList(this.pages.currentPage, this.pages.pageSize);
            this.$message({
              type: "success",
              message: "提交成功！",
              center: true,
            });
          }
        })
        .catch((err) => {
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
        backTalkResult: this.backTalkResult,
      };
      insertBackVisit(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
            // this.visitForms=[]
          } else {
            this.td_cancel();
            this.cancel();
            this.cancel_dfc();
            this.pageList(this.pages.currentPage, this.pages.pageSize);
            this.$message({
              type: "success",
              message: "提交成功！",
              center: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // let data = {
      //   visitIds: list,//this.multipleSelection,
      //   backPhoneStatus: this.usePhoneStatus,
      //   backPhone: this.usePhone,
      //   visitWaitTime: this.visitWaitTime,
      //   confirmBackWaitTime: this.useWaitTime,
      //   backInviteResult: this.backInviteResult,
      //   backTalkResult: this.backTalkResult
      // };
      // insertBackVisit(data)
      //   .then(res => {
      //     if (res.data.returnCode != 0) {
      //       this.$message({
      //         type: "warning",
      //         message: res.data.returnMsg,
      //         center: true
      //       });
      //       // this.visitForms=[]
      //     } else {
      //       this.cancel();
      //       this.pageList(this.pages.currentPage, this.pages.pageSize);
      //       this.$message({
      //         type: "success",
      //         message: "提交成功！",
      //         center: true
      //       });
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    addSparePhone() {
      let data = {
        memberId: this.userMemberId,
        parent: this.new_details_data.relationship,
        backupPhone: this.backupPhone,
      };
      insertBackupPhone(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            this.cancelAddPhone();
            this.userPhoneList(this.userMemberId);
            this.$message({
              type: "success",
              message: "添加成功！",
              center: true,
            });
          }
        })
        .catch((err) => {
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
        text: function () {
          return copyText;
        },
      });
      clipboard.on("success", (e) => {
        tips(this, "复制成功!", "success");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        tips(this, "该浏览器不支持自动复制!", "warning");
        // 释放内存
        clipboard.destroy();
      });
    },
    morePrduct_function() {
      let data = {
        memberId: this.userMemberId,
      };
      selectOrderDetailByMemberId(data)
        .then((res) => {
          console.log(res);
          this.moreProducts = res.data.data.data;
          this.dialogMoreProducts = true;
        })
        .catch((err) => {
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
      val.forEach((element) => {
        //   this.productItem["item_" + element.saleProductType] = true;
        //   myType.push(element.saleProductType);
        this.multipleSelection.push(element.visitId);
      });
      // let myArry = arrayDeduplication(myType);
      this.productItem_box = true;
      // this.productItem_box = true;
      // this.productVisitType = myArry;
      // console.log(this.productVisitType);
      // this.$refs.my_box.style.width = 1002 * myArry.length + "px";
      //   } else {
      //     this.productItem_box = false;
      //   }
    },
    details_hf(obj) {
      this.userMemberId = obj.memberId;
      this.rowObj = obj;
      // this.userPhoneList(obj.memberId);
      let data = { backVisitId: obj.backVisitId };
      queryWaitReviewDetail(data)
        .then((res) => {
          console.log(res);
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            let details = res.data.data;
            this.memberDetailDto[0] = details.memberDetail; // details.memberDetailDTO;
            this.pickupServiceInformation_back = details.reviewDetailList; // details.visitFinishProductDetailDTO;
            this.fcOutflowDTOs[0]= details.outflowDTOs
            this.fcprescriptionDTO= details.prescriptionDTO
           

            this.dfc_Dialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    details(obj) {
      this.userMemberId = obj.memberId;
      this.userPhoneList(obj.memberId);
      let data = { visitId: obj.backVisitId };
      selectUpdateBackWaitVisitDetail(data)
        .then((res) => {
          console.log(res);
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
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

            this.backInviteResult = details.backVisitDetailDTO.backInviteResult;
            this.backTalkResult = details.backVisitDetailDTO.backTalkResult;
            this.useWaitTime = details.backVisitDetailDTO.visitWaitTime;
            // this.visitWaitTime = details.backVisitDetailDTO.visitWaitTime;
            // this.useWaitTime=new Date(2018, 9, 10);
            // this.visitWaitTime=new Date(2000, 10, 10, 10, 10);
            console.log(this.useWaitTime);
            this.usePhone = details.backVisitDetailDTO.backPhone;
            this.usePhoneStatus = details.backVisitDetailDTO.backPhoneStatus;
            this.causeOfLoss = details.backVisitDetailDTO.remark;
            this.new_details_data.value =
              details.backVisitDetailDTO.memberAttitude;
            this.new_details_data.causeOfLoss =
              details.backVisitDetailDTO.memberAttitudeRemark;
            console.log(this.usePhoneStatus);
            this.$nextTick(() => {
              this.onState_func(this.usePhoneStatus);
              this.backInviteResult_func(this.backInviteResult);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // evaluationDetails(id) {
    //   this.only_recordId = id;
    //   let data = {
    //     recordId: id
    //   };
    //   queryExamineDetail(data)
    //     .then(res => {
    //       if (res.data.returnCode != 0) {
    //         this.$message({
    //           type: "warning",
    //           message: res.data.returnMsg,
    //           center: true
    //         });
    //       } else {
    //         this.examinationInfo = res.data.data.examinationInfo;
    //         this.detailList = res.data.data.detailList;
    //         this.dialogEvaluationDetails = true;
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    //统计列表 //查询
    async pageList(pageIndex = 1, pageSize = 10) {
      let data = {
        pageNum: pageIndex,
        pageSize: pageSize,
        visitPromiseTimeBegin:
          this.seach.delivery == null ? null : this.seach.delivery[0],
        visitPromiseTimeEnd:
          this.seach.delivery == null ? null : this.seach.delivery[1],
        visitUserName: this.seach.visitUserName,
        saleProductName: this.seach.saleProductName,
        memberName: this.seach.memberName,
        overdue: this.seach.overdue == "0" ? 0 : this.seach.overdue,
        vip: this.seach.vip == "0" ? 0 : this.seach.vip,
        phoneStatus: this.seach.phoneStatus,
        provinceId: this.seach.provinceId,
        cityId: this.seach.cityId,
        siteId: this.seach.siteValue,
        hospitalId: this.seach.hospitalId,
        visitUserId: this.seach.visitUserId,
        backTimes: this.seach.yycsId,
      };
      this.loading = true;
      selectWaitReviewByPage(data)
        .then((res) => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true,
            });
          } else {
            this.loading = false;
            let dataList = res.data.data;
            this.clientData = dataList.data;
            this.pages.total = dataList.total;
            returnJs.rowspan_fc(this, this.clientData);
          }
        })
        .catch((err) => {
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
    // async userList() {
    //   this.seach.scUserNameList = await personnel(9);
    // },
    //获取试穿人员列表
    async userList() {
      this.seach.scUserNameList = await personnel(6);
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
    init_two() {
      let data = {
        depts: [6, 9]
      };
      userListByDepts(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.seach.visitUserList = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //电话号列表
    userPhoneList(id) {
      let data = {
        memberId: id,
      };
      selectBackupPhoneByMemberId(data)
        .then((res) => {
          console.log(res);
          this.phoneList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
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
/******* */
.color-red {
  color: #fb5b3c;
}
.product_box {
  width: 100%;
  // overflow-y: hidden;
  // margin-top: 20px;
  // background: #ecf5ff;
  // border: 1px solid #CDCDCD;
  // .my_box {
  // height: 413px;
  // width: 0px;
  // display: -webkit-flex; /* Safari */
  // display: flex;
  // justify-content:center;
  margin-bottom: 20px;
  .item {
    margin-top: 10px;
    border: 1px solid #cdcdcd;
    // width: 1000px;
    // height: auto;
    // float: left;
  }
  // }
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
</style>
