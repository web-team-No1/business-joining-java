import {
  /*新增查询接口*/
  backVisitRemainingToday,
  shapeRemainingToday,
  tryOnRemainingToday
} from "../../api/javaApi";
/**
 * 合并列表序号
 * @param {*} that 
 */
function rowspan(that) {
  that.clientData.forEach((item, index) => {
    if (index === 0) {
      that.spanArr.push(1);
      that.position = 0;
      that.spanArr2.push(1);
      that.position2 = 0;
    } else {
      if (
        that.clientData[index].memberId ===
        that.clientData[index - 1].memberId
      ) {
        that.spanArr[that.position] += 1;
        that.spanArr.push(0);
      } else {
        that.spanArr.push(1);
        that.position = index;
      }
      if (
        that.clientData[index].orderNum ===
        that.clientData[index - 1].orderNum &&
        !!that.clientData[index - 1].orderNum &&
        !!that.clientData[index].orderNum
      ) {
        that.spanArr2[that.position2] += 1;
        that.spanArr2.push(0);
      } else {
        that.spanArr2.push(1);
        that.position2 = index;
      }
    }

  });
  console.log(that.spanArr)
}
/**
 * 合并详情列表序号
 * @param {*} that 
 */
function rowspan_a(that) {
  that.orders.forEach((item, index) => {
    if (index === 0) {
      that.spanArr_a.push(1);
      that.position_a = 0;
    } else {
      if (
        that.orders[index].orderNum ===
        that.orders[index - 1].orderNum
      ) {
        that.spanArr_a[that.position_a] += 1;
        that.spanArr_a.push(0);
      } else {
        that.spanArr_a.push(1);
        that.position_a = index;
      }
    }
  });
}
function rowspan_left(that,myData) {
      that.spanArr_left=[];
      that.position_left=0
      myData.forEach((item, index) => {
    if (index === 0) {
      that.spanArr_left.push(1);
      that.position_left = 0;
    } else {
      if (
        myData[index].memberId ===
        myData[index - 1].memberId && myData[index].cycleTimes===myData[index - 1].cycleTimes

      ) {
        that.spanArr_left[that.position_left] += 1;
        that.spanArr_left.push(0);
      } else {
        that.spanArr_left.push(1);
        that.position_left = index;
      }
    }
  });
}
function topItem_func(that, index) {
  that.topActive = index;
  that.spanArr = [];
  that.position = 0;
  that.spanArr2 = [];
  that.position2 = 0;
  let data = {
    pageNum: that.pages.currentPage,
    pageSize: that.pages.pageSize,
    memberName: that.seach.name || null,
    phone: that.seach.phone || null,
    birthday: that.seach.birthday || null,
    isBlack:
      that.seach.heimingdanValue == "0" ? 0 : that.seach.heimingdanValue,
    provinceId: that.seach.provinceId,
    cityId: that.seach.cityId,
    siteId: that.seach.siteValue
  };
  that.loading = true;
  that.isSearch = true;
  if (index == 0) {
    that.pageList(that.pages.currentPage, that.pages.pageSize);
  } else if (index == 1) {
    backVisitRemainingToday(data)
      .then(res => {
        if (res.data.returnCode != 0) {
          that.$message({
            type: "warning",
            message: res.data.returnMsg,
            center: true
          });
        } else {
          let dataList = res.data.data;
          that.clientData = dataList.data.todayDTOS;
          that.box_top_data = dataList.data;
          that.pages.total = dataList.total;
          that.rowspan();
          that.loading = false;
          that.isSearch = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else if (index == 2) {
    shapeRemainingToday(data)
      .then(res => {
        if (res.data.returnCode != 0) {
          that.$message({
            type: "warning",
            message: res.data.returnMsg,
            center: true
          });
        } else {
          let dataList = res.data.data;
          that.clientData = dataList.data.todayDTOS;
          that.box_top_data = dataList.data;
          that.pages.total = dataList.total;
          that.rowspan();
          that.loading = false;
          that.isSearch = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else if (index == 3) {
    tryOnRemainingToday(data)
      .then(res => {
        if (res.data.returnCode != 0) {
          that.$message({
            type: "warning",
            message: res.data.returnMsg,
            center: true
          });
        } else {
          let dataList = res.data.data;
          that.clientData = dataList.data.todayDTOS;
          that.box_top_data = dataList.data;
          that.pages.total = dataList.total;
          that.rowspan();
          that.loading = false;
          that.isSearch = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    that.clientData = [];
    that.pages.total = 0;
    that.loading = false;
    that.isSearch = false;
  }
}
export default {
  rowspan,
  rowspan_a,
  topItem_func,
  rowspan_left
}