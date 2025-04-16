//var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userid:"",
      useList:[
        
      ],
      foodKind:"",
      foodWeight:"",
      time:""
    },
  
    /**
     * 生命周期函数--监听页面加载  
     * 也就是作为一个新用户登录时的操作，不能获取到删一个用户残留的数据
     */
  //   注意在加载中应该清除上一次操作时的用户个人信息
    onLoad(options) {

        this.setData({
            userid:wx.getStorageSync('myid')
        })
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
  
      //console.log('onready called back')
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     * 当前用户每次点击相应事件切换到这个页面时就会执行
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
  
  
    checkInfo(){

        this.setData({
            useList:[]
        });
        
        console.log("用户正在进行查询历史操作行为")
        //获取到缓存中的用户个人信息，便于从数据库查询提交过程
        const child=wx.getStorageSync('infoCur')
        const that=this  

        //通过一个if判断，如果此时用户为空，则不能进行查询操作，强制退回个人页面进行注册或者登录操作
        if(!child){
            setTimeout(function(){wx.showToast({
                title:"请登录后查询",
                icon:"none", 
                           
            })},200)
            wx.switchTab({
              url: '../homepage/homepage',
            })
        }else{
          wx.cloud.database().collection('foodList').where({
              _openid:wx.getStorageSync('myid'),
              childName:child
            }).get({
              success(res) {
                console.log("获取数据成功", res)
              const arrTar=res.data

            that.setData({
                useList: that.data.useList.concat(arrTar)
            });
  
              if(that.data.useList.concat(arrTar).length==0){
                  wx.showToast({
                    title: '未查询到您的历史提交记录',
                    icon:"none"
                  })
              }
         },
              fail(res) {
                console.log("获取数据失败", res)
              }
            })
        
  
        }
    },

    timeChange(res){//更改时间
        this.setData({
            time:res.detail.value
        })
        const that=this;
    //获取当前表示框中的位置编号，并且更新数据 

        wx.cloud.database().collection('foodList').where({
            _id:res.target.id
          }).update({
              data:{
                time:that.data.time
              }
          })
    },

    kindChange(res){//更改餐次
        this.setData({
            foodKind:res.detail.value
        })
        const that=this;
        //获取当前表示框中的位置编号，并且更新数据 
    
            wx.cloud.database().collection('foodList').where({
                _id:res.target.id
              }).update({
                  data:{
                    foodKind:that.data.foodKind
                  }
              })
        
    },

    descChange(res){//更改食物描述
        this.setData({
            foodWeight:res.detail.value
        })
        const that=this;
        //获取当前表示框中的位置编号，并且更新数据 
    
            wx.cloud.database().collection('foodList').where({
                _id:res.target.id
              }).update({
                  data:{
                    foodWeight:that.data.foodWeight
                  }
              })
    },


    //餐前上面
    changePrevSh(res){
      var id=res.currentTarget.id

        const that=this;
        wx.chooseMedia({
          count: 1,
          sizeType:['original','compressed'],
          sourcetype:['album','camera'],
          success: res=> {
            var filePath=res.tempFiles[0].tempFilePath

            
            wx.cloud.uploadFile({
                cloudPath:Date.now()+".jpg",
                filePath:filePath,
                name: 'file',
                }).then(res=>{
                    wx.cloud.getTempFileURL({
                        fileList:[res.fileID],
                        success(res){
                            wx.setStorageSync('pic1sh_gai', res.fileList[0].tempFileURL)
                            wx.cloud.database().collection('foodList').where({
                                _id:id
                            }).update({
                              data:{
                                picPrevSh:wx.getStorageSync('pic1sh_gai')
                              },
                              success(){
                                wx.showToast({
                                    title: '更改图片成功',
                                    mask: "true"
                                  })   
                                wx.removeStorage({
                                  key: 'pic1sh_gai',
                                })
                              }
                          })
                        },
                      })
            })
    }

          })
        },

        //餐前侧面
         changePrevCe(res){
            var id=res.currentTarget.id
      
              const that=this;
              wx.chooseMedia({
                count: 1,
                sizeType:['original','compressed'],
                sourcetype:['album','camera'],
                success: res=> {
                  var filePath=res.tempFiles[0].tempFilePath
      
                  
                  wx.cloud.uploadFile({
                      cloudPath:Date.now()+".jpg",
                      filePath:filePath,
                      name: 'file',
                      }).then(res=>{
                          wx.cloud.getTempFileURL({
                              fileList:[res.fileID],
                              success(res){
                                  wx.setStorageSync('pic1ce_gai', res.fileList[0].tempFileURL)
                                  wx.cloud.database().collection('foodList').where({
                                      _id:id
                                  }).update({
                                    data:{
                                      picPrevCe:wx.getStorageSync('pic1ce_gai')
                                    },
                                    success(){
                                      wx.showToast({
                                          title: '更改图片成功',
                                          mask: "true"
                                        })   
                                      wx.removeStorage({
                                        key: 'pic1ce_gai',
                                      })
                                    }
                                })
                              },
                            })
                  })
          }
      
                })
              },

              //餐后上面
               changeNextSh(res){
                var id=res.currentTarget.id
          
                  const that=this;
                  wx.chooseMedia({
                    count: 1,
                    sizeType:['original','compressed'],
                    sourcetype:['album','camera'],
                    success: res=> {
                      var filePath=res.tempFiles[0].tempFilePath
          
                      
                      wx.cloud.uploadFile({
                          cloudPath:Date.now()+".jpg",
                          filePath:filePath,
                          name: 'file',
                          }).then(res=>{
                              wx.cloud.getTempFileURL({
                                  fileList:[res.fileID],
                                  success(res){
                                      wx.setStorageSync('pic2sh_gai', res.fileList[0].tempFileURL)
                                      wx.cloud.database().collection('foodList').where({
                                          _id:id
                                      }).update({
                                        data:{
                                          picNextSh:wx.getStorageSync('pic2sh_gai')
                                        },
                                        success(){
                                          wx.showToast({
                                              title: '更改图片成功',
                                              mask: "true"
                                            })   
                                          wx.removeStorage({
                                            key: 'pic2sh_gai',
                                          })
                                        }
                                    })
                                  },
                                })
                      })
              }
          
                    })
                  },


                  //餐后侧面
                  changeNextCe(res){
                    var id=res.currentTarget.id
              
                      const that=this;
                      wx.chooseMedia({
                        count: 1,
                        sizeType:['original','compressed'],
                        sourcetype:['album','camera'],
                        success: res=> {
                          var filePath=res.tempFiles[0].tempFilePath
              
                          
                          wx.cloud.uploadFile({
                              cloudPath:Date.now()+".jpg",
                              filePath:filePath,
                              name: 'file',
                              }).then(res=>{
                                  wx.cloud.getTempFileURL({
                                      fileList:[res.fileID],
                                      success(res){
                                          wx.setStorageSync('pic2ce_gai', res.fileList[0].tempFileURL)
                                          wx.cloud.database().collection('foodList').where({
                                              _id:id
                                          }).update({
                                            data:{
                                              picNextCe:wx.getStorageSync('pic2ce_gai')
                                            },
                                            success(){
                                              wx.showToast({
                                                  title: '更改图片成功',
                                                  mask: "true"
                                                })   
                                              wx.removeStorage({
                                                key: 'pic2ce_gai',
                                              })
                                            }
                                        })
                                      },
                                    })
                          })
                  }
              
                        })
                      }

  })