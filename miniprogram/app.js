// app.js
App({
  onLaunch: function () {
    const that=this;
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "demo-swlh-250409-8ffwblw3e2d9917",
        traceUser: true,
      });
    }

    this.globalData=({
        myopenid:""
    })
           // 获取用户的openid
           wx.cloud.callFunction({
            name:'demo',
          }).then(res=>{ 
              wx.removeStorage({
                key: 'myid',
              }) 
            //设置缓存后，实现myid也就是_openid的全局访问
            wx.setStorageSync('myid', res.result.openid) 
            //或者尝试通过globalData实现其他页面的访问
            that.globalData.myopenid=res.result.openid
            console.log(that.globalData.myopenid)
          })    

  },
});
