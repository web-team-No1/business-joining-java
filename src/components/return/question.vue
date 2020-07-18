//已流失
<template>
  <div>
    <!-- seach -->
    <el-form :inline="true" size="small" id="search" class="padding-LR-p10">
      <el-form-item label="客户姓名">
        <el-input v-model="seach.memberName" class="w-150" placeholder="请输入姓名"></el-input>
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
      <el-form-item label="回访人员">
        <el-input clearable class="w-150" v-model="seach.visitUserName" placeholder="请输入回访人"></el-input>
      </el-form-item>
      <el-form-item label="流失时间">
        <el-date-picker
          class="w-250"
          v-model="seach.outflowTime"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
      <el-form-item label="产品昵称">
        <el-input class="w-150" v-model="seach.saleProductName" placeholder="请输入产品昵称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="回访类型">
        <el-select class="w-150" clearable v-model="seach.visitTypeInt" placeholder="请选择">
          <el-option
            v-for="item in seach.visitTypeIntList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          @click="pageList(pages.currentPage,pages.pageSize)"
          icon="el-icon-search"
          type="primary"
        >查询</el-button>
        <el-button type="danger" @click="exportExcels()">导出excel</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="data_assignment_func()" icon="el-icon-thumb" type="warning">数据指派</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
    <el-table
      border
      :data="clientData"
      max-height="650"
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :header-row-class-name="'headerClass'"
    >
      <el-table-column width="60" align="center" type="index" label="序号"></el-table-column>
      <el-table-column align="center" prop="memberName" label="客户姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别"></el-table-column>
      <el-table-column align="center" prop="vip" label="是否会员"></el-table-column>
      <el-table-column align="center" prop="saleProductNickname" label="产品昵称"></el-table-column>
      <el-table-column align="center" prop="backVisitUserName" label="回访人员"></el-table-column>
      <el-table-column align="center" prop="visitTypeString" label="回访类型"></el-table-column>
      <el-table-column align="center"  prop="outflowStatus" label="流失状态"></el-table-column>
      <el-table-column align="center" prop="outflowTime" label="流失时间"></el-table-column>
      <el-table-column align="center" prop="outflowReason" label="流失原因"></el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope" v-if="scope.row.outflowStatus =='待确认'">
          <el-button
            @click="churn_cancel_func(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-circle-close"
          >取消流失</el-button>
          <el-button
            @click="churn_save_func(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-circle-check"
          >确认流失</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- dialog 数据指派-->
    <el-dialog
      title="数据指派"
      :visible.sync="data_assignment.data_assignment_Dialg"
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
        <el-table-column align="center" prop="reflect" label="取型家长反应"></el-table-column>
        <el-table-column align="center" prop="tryOnBeginTime" label="试穿时间"></el-table-column>
        <el-table-column align="center" prop="tryOnUserName" label="试穿人员"></el-table-column>
        <el-table-column align="center" prop="visitWaitTime" label="应回访时间"></el-table-column>
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
    <el-dialog
      title="产品体验回访数据指派"
      :visible.sync="data_assignment.experience_details_dialog_two"
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
  </div>
</template>

<script>
import {
  selectBackVisitOutflowList,
  cancelOutflow,
  confirmOutflow
} from "../../api/javaApi";
import javaApi from "../../api/javaApi";
import {
  exportMethod,
  personnel,
  province,
  city,
  allSite,
  site,
  hospital,
  tips
} from "../../utils/public";
import { Promise, all, async } from "q";
import session from "../../utils/session";
import return_variable from "./return_variable";
export default {
  name: "App",
  data() {
    return {
      data_assignment: return_variable.data_assignment,
      clientData: [],
      //分页
      pages: {
        total: 10,
        pageSize: 10,
        currentPage: 1
      },
      seach: {
        outflowTime: null,
        vip: null,
        vipList: [
          { name: "否", id: "0" },
          { name: "是", id: 1 }
        ],
        visitUserName: null,
        visitUserList: [],
        saleProductName: null,
        visitTypeInt: null,
        visitTypeIntList: [
          { name: "产品体验回访", id: 1 },
          { name: "产品使用回访", id: 2 },
          { name: "复查邀约回访", id: 3 },
          { name: "复查确认回访", id: 4 }
        ],
        memberName: null,
        siteLists: [],
        siteValue: null,
        provinceId: null,
        cityId: null,
        provinceIdList: [],
        cityIdList: [],
        hospitalLists: [],
        hospitalId: null
      },
      loading: true
    };
  },
  mounted() {
    this.pageList();
    this.userList();
    this.provinceList();
  },
  methods: {
    data_assignment_close() {
      this.data_assignment.data_assignment_Dialg = false;
      this.data_assignment.multipleSelection = [];
    },
    data_assignment_close_two() {
      this.data_assignment.experience_details_dialog_two = false;
      this.data_assignment.zpUser = null;
    },
    data_assignment_save() {
      this.data_assignment.experience_details_dialog_two = true;
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
            : data_assignment.search.time[0],
        waitTimeEnd:
          this.data_assignment.search.time == null
            ? null
            : data_assignment.search.time[1],
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
      this.data_assignment.data_assignment_Dialg = true;
    },
    churn_cancel_func(obj) {
      let deleteData = {
        visitId: obj.visitId,
        outflowId: obj.outflowId
      };
      this.$confirm("是否取消流失客户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          cancelOutflow(deleteData)
            .then(res => {
              if (res.data.returnCode != 0) {
                this.$message({
                  type: "warning",
                  message: res.data.returnMsg,
                  center: true
                });
              } else {
                tips(this, "成功!", "success");
                this.pageList(this.pages.currentPage, this.pages.pageSize);
              }
            })
            .catch(err => {
              console.log(err);
            });

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    churn_save_func(obj) {
      let deleteData = {
        visitId: obj.visitId,
        outflowId: obj.outflowId
      };
      this.$confirm("是否确认流失客户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          confirmOutflow(deleteData)
            .then(res => {
              if (res.data.returnCode != 0) {
                this.$message({
                  type: "warning",
                  message: res.data.returnMsg,
                  center: true
                });
              } else {
                tips(this, "成功!", "success");
                this.pageList(this.pages.currentPage, this.pages.pageSize);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    //统计列表 //查询
    async pageList(pageIndex = 1, pageSize = 10) {
      let data = {
        pageNum: pageIndex,
        pageSize: pageSize,
        outflowTimeBegin:
          this.seach.outflowTime == null ? null : this.seach.outflowTime[0],
        outflowTimeEnd:
          this.seach.outflowTime == null ? null : this.seach.outflowTime[1],
        vip: this.seach.vip == "0" ? 0 : this.seach.vip || null,
        visitUserName: this.seach.visitUserName || null,
        saleProductName: this.seach.saleProductName || null,
        // visitTypeInt: this.seach.visitTypeInt || null,
        memberName: this.seach.memberName || null,
        provinceId: this.seach.provinceId,
        cityId: this.seach.cityId,
        siteId: this.seach.siteValue,
        hospitalId: this.seach.hospitalId
      };
      this.loading = true;
      selectBackVisitOutflowList(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            let dataList = res.data.data;
            this.clientData = dataList.data;
            this.pages.total = dataList.total;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //导出excel
    exportExcels() {
      let data = {
        outflowTimeBegin:
          this.seach.outflowTime == null ? null : this.seach.outflowTime[0],
        outflowTimeEnd:
          this.seach.outflowTime == null ? null : this.seach.outflowTime[1],
        vip: this.seach.vip == "0" ? 0 : this.seach.vip || null,
        visitUserName: this.seach.visitUserName || null,
        saleProductName: this.seach.saleProductName || null,
        // visitTypeInt: this.seach.visitTypeInt || null,
        memberName: this.seach.memberName || null,
        provinceId: this.seach.provinceId,
        cityId: this.seach.cityId,
        siteId: this.seach.siteValue,
        hospitalId: this.seach.hospitalId
      };
      const lsyObj = {
        method: "post",
        fileName: "已流失客户信息",
        url: javaApi.exportBackVisitOutflowExcel,
        data: data
      };
      exportMethod(this, lsyObj);
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
    //人员
    async userList() {
      this.seach.visitUserList = await personnel(6);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
