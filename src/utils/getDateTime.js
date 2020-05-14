const date = {
    getDate() {
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        var h = myDate.getHours();//获取当前小时数(0-23)
        var m = myDate.getMinutes();//获取当前分钟数(0-59)
        var s = myDate.getSeconds();//获取当前秒
        //var week = myDate.getDay();
        //var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        //console.log(year, mon, date, weeks[week])
        //$("#time").html(year + "年" + mon + "月" + date + "日" + weeks[week]);
        //return year + '-' + mon + '-' + date + ' ' + h + ':' + m + ':' + s;    
        return  h + ':' + m + ':' + s;    
    }
  }
  
  export default date;//暴露出来供其他文件引用