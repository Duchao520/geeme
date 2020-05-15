/**
       * 时间对象的格式化;  为系统JS 增加format 函数
       */
      Date.prototype.format = function(format) {
        /*
        * eg:format="yyyy-MM-dd hh:mm:ss";
        */
        var o = {
            "M+" : this.getMonth() + 1, // month
            "d+" : this.getDate(), // day
            "h+" : this.getHours(), // hour
            "m+" : this.getMinutes(), // minute
            "s+" : this.getSeconds(), // second
            "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
            "S+" : this.getMilliseconds()
            // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                var formatStr="";
                for(var i=1;i<=RegExp.$1.length;i++){
                    formatStr+="0";
                }

                var replaceStr="";
                if(RegExp.$1.length == 1){
                    replaceStr=o[k];
                }else{
                    formatStr=formatStr+o[k];
                    var index=("" + o[k]).length;
                    formatStr=formatStr.substr(index);
                    replaceStr=formatStr;
                }
                format = format.replace(RegExp.$1, replaceStr);
            }
        }
        return format;
    }

    // 规避银行家算法 重写toFixed方法
    // Number.prototype.toFixed = function(length){
    //       var carry = 0; //存放进位标志
    //       var num,multiple; //num为原浮点数放大multiple倍后的数，multiple为10的length次方
    //       var str = this + ''; //将调用该方法的数字转为字符串
    //       var dot = str.indexOf("."); //找到小数点的位置
    //       if(str.substr(dot+length+1,1)>=5) carry=1; //找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1
    //       multiple = Math.pow(10,length); //设置浮点数要扩大的倍数
    //       num = Math.floor(this * multiple) + carry; //去掉舍入位后的所有数，然后加上我们的手动进位数
    //       var result = num/multiple + ''; //将进位后的整数再缩小为原浮点数
    //       /*
    //       * 处理进位后无小数
    //       */
    //       dot = result.indexOf(".");
    //       if(dot < 0){
    //         result += '.';
    //         dot = result.indexOf(".");
    //       }
    //       /*
    //       * 处理多次进位
    //       */
    //       var len = result.length - (dot+1);
    //       if(len < length){
    //         for(var i = 0; i < length - len; i++){
    //           result += 0;
    //         }
    //       }
    //       return result;
    // }
