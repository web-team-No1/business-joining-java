//1、日期参数格式：yyyy-mm-dd
// a: 日期a, b: 日期b, flag: 返回的结果
export function duibi(a, b, flag) {
    var arr = a.split("-");
    var starttime = new Date(arr[0], arr[1], arr[2]);
    var starttimes = starttime.getTime();
    var arrs = b.split("-");
    var endTime = new Date(arrs[0], arrs[1], arrs[2]);
    var endTimes = endTime.getTime();
    // 进行日期比较
    if (endTimes >= starttimes) {
        flag = "true";
        return flag;
    } else {
        flag = "false";
        return flag;
    }
}
// var arr = ['2018-10-18'];
//使用数组日期比较返回最大值
function compareFN2(arr) {
    var i = 0;
    var j = 0;
    let t;
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            let oDate1 = new Date(arr[i]);
            let oDate2 = new Date(arr[j]);
            if (oDate1.getTime() < oDate2.getTime()) {
                t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }
    }
    let maxDate = dateChange(29, arr[arr.length - 1])
    return maxDate
}
// console.log(compareFN2(arr))
/**
 * 
 * @param {*} num 后延天数 
 * @param {*} date 日期
 */
function dateChange(num = 1, date = false) {
    if (!date) {
        date = new Date();//没有传入值时,默认是当前日期
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
    date += " 00:00:00";//设置为当天凌晨12点
    date = Date.parse(new Date(date)) / 1000;//转换为时间戳
    date += (86400) * num;//修改后的时间戳
    var newDate = new Date(parseInt(date) * 1000);//转换为时间

    return newDate.getFullYear() + '-' + ((newDate.getMonth() + 1) > 10 ? (newDate.getMonth() + 1) : "0" + (newDate.getMonth() + 1)) + '-' + newDate.getDate();
}

/**
* 合并列表序号
* @param {*} that 
*/
function rowspan(that) {
    that.clientData.forEach((item, index) => {
        if (index === 0) {
            that.spanArr.push(1);
            that.position = 0;
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
            // if (
            //   that.clientData[index].orderNum ===
            //   that.clientData[index - 1].orderNum &&
            //   !!that.clientData[index - 1].orderNum &&
            //   !!that.clientData[index].orderNum
            // ) {
            //   that.spanArr2[that.position2] += 1;
            //   that.spanArr2.push(0);
            // } else {
            //   that.spanArr2.push(1);
            //   that.position2 = index;
            // }
        }
    });
}
export default {
    compareFN2,
    rowspan
}