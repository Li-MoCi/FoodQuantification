//var app=getApp();
// 删除数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childList:[],
    studentChose:false,
    mystudent:"",
    myschool:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      //在加载页面时就显示一下各条信息
    console.log("用户正在进行查询历史操作行为")
    const that=this

      wx.cloud.database().collection('idcheck').where({
          //userid: wx.getStorageSync('myid')
          _openid:wx.getStorageSync('myid')
        }).get({
          success(res){
          console.log("获取数据成功", res)

          const arrTar=res.data[0].children;
        
        that.setData({
            childList: that.data.childList.concat(arrTar),
        });
          if(that.data.useList.concat(arrTar).length==0){
              wx.showToast({
                title: '未查询到您之前的注册信息',
                icon:"none"
              })
          }

          
        },
          fail(res) {
            console.log("获取数据失败", res)
          }
        })


  },


  chooseStudent:function(e){

    console.log(e)
//获取当前点击处的学生和学校
const arr=e.currentTarget.id.substring(4,e.currentTarget.id.length)
console.log(arr)
//学校-姓名
    const index=arr.indexOf('-')
    //获取-分隔符在字符串中的位置
    const thisName=arr.substring(index+1,arr.length);
    const thisSchool=arr.substring(0,index);

      this.setData({
           mystudent:thisName,
           myschool:thisSchool,
          studentChose:true
      })
},





choseEnd:function(e){
    //update()，不仅可以修改记录里已有的值，还能添加记录里没有的键值对，完成了add()的工作
    //当用户点击去拍照时就可以在当前条目中加上用户专属的身份

    wx.setStorageSync('infoCur', this.data.myschool+"/"+this.data.mystudent)
    wx.switchTab({
      url: '../upload/upload',
    }) 
},



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },


  
})