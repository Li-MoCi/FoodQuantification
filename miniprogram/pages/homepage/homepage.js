//更改：对于本微信号登陆过的数据进行查询，每次注册项数据库中存放
// 曾经注册选中过的身份
const _=wx.cloud.database().command;
const app=getApp();
Page({
    data: {
      isnewid:true,//添加身份记录
      myname:"",
      userid:"",
      isteacher:false,
      childList:[],
      flag:0
    },
      /**
   * 生命周期函数--监听页面加载
   */
  //用户第一次进入homepage的页面的行为
  onLoad(options) {
      const that=this
    //再次调用云函数尝试
    // 获取用户的openid
       wx.cloud.callFunction({
        name:'demo',
      }).then(res=>{ 
            wx.removeStorage({
               key: 'myid',
             })
          wx.setStorageSync('myid', res.result.openid) 
      }) 


      this.setData({
        userid:wx.getStorageSync('myid'),
        myname:wx.getStorageSync('infoCur')
      })
      this.setData({
          userid:app.globalData.myopenid
      })
      //双重设置保证用户的myid缓存不为空



      wx.cloud.database().collection("idcheck").where({
          _openid:that.data.userid
      }).get({
          success(res){
              //res.data数组中存储有数据时，说明当前微信号曾在该小程序上使用过
              if(res.data.length!=0){
                  that.setData({
                      isnewid:false
                  })
                  //在老师用户并且身份是老师的情况下选择
                  if(res.data[0].identity=="teacher"){
                      that.setData({
                        isteacher:true
                      })
                  }


              //在页面显示孩子信息列表    
            const arrTar=res.data[0].children;
            console.log(arrTar)
            
      
            that.setData({
                childList: that.data.childList.concat(arrTar),
            });
          if(that.data.useList.concat(arrTar).length==0){
              wx.showToast({
                title: '未查询到您之前的注册信息',
                icon:"none"
              })
          }

              }//实现对isnewid变量的赋值


              if(that.data.isnewid==true){//新用户 要对用户数据库更改
                wx.cloud.database().collection('idcheck').add({
                    data: {
                        //userid:wx.getStorageSync('myid'),
                        children:[]
                    },
                    success(res) {
                      console.log('提交数据成功', res)
                      //提交数据成功之后就不再需要注册页面

                    }
                })
              }
            }
      })
      that.data.flag++;


  },
    //身份是老师
    teacher() {
      wx.navigateTo({
        url: '../teacher/teacher',
      })
      this.setData({
          isteacher:true,
          isnewid:false
      })
    },
    //身份是家长
    parent() {
      wx.navigateTo({
        url: '../parent/parent',
      })
      this.setData({
        isnewid:false
    })
    },

    onShow() {
        const that=this;
        if(this.data.flag!=0){
        wx.cloud.database().collection("idcheck").where({
            _openid:that.data.userid
        }).get({
            success(res){
                //res.data数组中存储有数据时，说明当前微信号曾在该小程序上使用过
                if(res.data.length!=0){
                //在页面显示孩子信息列表    
              const arrTar=res.data[0].children;
              that.setData({
                  childList: arrTar,
              });
                }//实现对isnewid变量的赋值
              }
        })
        
        //每次跳转到该页面要重新匹配
        this.setData({
            myname:wx.getStorageSync('infoCur')
        })}
    },

  
    //退出登陆
    change() {
        wx.switchTab({
          url: '../upload/upload',
        })
    },
    
    

    //这里删除孩子的选项 添加一个弹框进行选择
    deleteStudent:function(e){

    //获取叉号点击处的学生和学校
    const arr=e.currentTarget.id.substring(4,e.currentTarget.id.length)
    const that=this;
        wx.showModal({
            title: '是否删除',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')

                  //学校-姓名
        const index=arr.indexOf('-')
        //获取-分隔符在字符串中的位置
        const thisName=arr.substring(index+1,arr.length);
        const thisSchool=arr.substring(0,index);
        wx.cloud.database().collection("idcheck").where({
            _openid:that.data.userid,
            children:{
                name:thisName,
                school:thisSchool
            }

        }).update({
            data:{
                children:_.pull({name:thisName,school:thisSchool})
            },
            success(res){

                var list=that.data.childList;

                let index = list.findIndex((item) =>( item.name == thisName && item.school==thisSchool));
                if (index !== -1) {
                  list.splice(index, 1);
                }
                console.log(list)
                that.setData({
                    childList:list
                })
         
            }
        })

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

  
    },
  })