const _=wx.cloud.database().command;
Page({
    data: {
      myschool:"",
      schoolList:[],
      mystudent:"",
      schoolChose:false,
      flag:0
    },
   
    schoolCheck:function(e){
        //每次在输入框中有输入行为（如单个的英文字符和一次性键入的值）就会触发
        const that=this;
        that.setData({
            myschool:e.detail.value
        })
  
        wx.cloud.database().collection('school').where({
          schoolName:{
              $regex:that.data.myschool+'+'  ,
          }
      }).get({
          success(res){
              console.log("获取数据成功", res)
  
              const arrTar=res.data
            that.setData({
                schoolList:[]
            })
            const demo=res.data.map(function(item){
              return item.schoolName
          })
  
            that.setData({
                schoolList:[... new Set(demo)]
            })
  
  
          }})
    },
  
    chooseSchool:function(e){
  
          this.setData({
              myschool:e.currentTarget.id.substring(4,e.currentTarget.id.length),
              schoolChose:true
          })
  
  
    },
    studentCheck:function(e){
      const that=this;
      that.setData({
          mystudent:e.detail.value
      })
  },
  
  
  choseEnd:function(e){
      // 获取当前微信号和身份 孩子信息的数据加入数据库中 idcheck
      const that=this;
      wx.setStorageSync('infoCur', this.data.myschool+"/"+this.data.mystudent)
      wx.cloud.database().collection("idcheck").where({
          _openid:wx.getStorageSync('myid')
      }).update({
          data:{
              children:_.push([{school:that.data.myschool,name:that.data.mystudent}]),
              identity:"parent"
          }
      });
      wx.switchTab({
        url: '../upload/upload',
      })
  }
  })
  
  

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     mystudent:""
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad(options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage() {

//   },

//   studentCheck(e){
//       this.setData({
//           mystudent:e.detail.value
//       })   
//   },

// choseEnd:function(e){
//     //用户点击这个按钮表示为目标孩子，自动
//     //update()，不仅可以修改记录里已有的值，还能添加记录里没有的键值对，完成了add()的工作
//     //当用户点击去拍照时就可以在当前条目中加上用户专属的身份
//     //但如果是初次登录时，数据库中并没有该微信号的存在，因此需要穿件一条新的数据
//     const that=this;
//     wx.setStorageSync('infoCur', "/"+this.data.mystudent)
//     wx.cloud.database().collection("idcheck").where({
//         userid:wx.getStorageSync('myid')
//     }).update({
//         data:{
//             children:_.push([{school:"",name:that.data.mystudent}])
//         }
//     })

//     wx.switchTab({
//       url: '../upload/upload',
//     }) 
//  }
// })