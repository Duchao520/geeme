var app = getApp();
Page({
  onLoad(){
  },
  onShow(){
    this.createContact();
  },
  createContact(){
    // # 开始接收指令
    my.ix.startMonitorTinyCommand({
      success: (r) => {
        my.showToast({
          content: "are you ok",
          duration: 1500
        });
        console.log("are you ok?");
        my.ix.tinyCommand({
          target: 'ix',
          content: {data:'are you ok?'},
          success: (r) => {
            // console.log("success");
          },
          fail: (r) => {
            my.showToast({
              type: "fail",
              content: "fail, errorCode:" + r.error,
              duration: 1500
            });
          }
        });
      },
      fail: (r) => {
        my.showToast({
          type: "fail",
          content: "fail, errorCode:" + r.error,
          duration: 1500
        });
        console.log("fail, errorCode:" + r.error);
      }
    });
    
    // # 等待指令的接收
    my.ix.onMonitorTinyCommand((res) => {
      my.showToast({
          content: JSON.stringify(res),
          duration: 1500
      });
      console.log(res);
       my.ix.startMonitorTinyCommand({
      success: () => {
        console.log("收到指令");
        my.ix.tinyCommand({
          target: 'ix',
          content: {msg: "YOUR RESULT",data:res},
          success: (r) => {
            // console.log("success");
          },
          fail: (r) => {
            console.log("fail, errorCode:" + r.error);
          }
        });
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
    });
 

  },
  onHide(){
    // # 结束接收指令
    my.ix.offMonitorTinyCommand({
      success: (r) => {
        console.log("success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
  }
});
