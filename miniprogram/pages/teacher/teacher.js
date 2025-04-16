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
            identity:"teacher"
        }
    });
    wx.switchTab({
      url: '../upload/upload',
    })
  }
})


