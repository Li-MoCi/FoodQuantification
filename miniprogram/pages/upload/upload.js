const db = wx.cloud.database()
// var app=getApp();
//这样当前页面可以访问globalData中的数据
Page({

  /**
   * 页面的初始数据
   */
  //下次做每一个页面中更新当前用户的openid，使得下次登录直接从数据库总获取用户上午名称
  data: {
    image_prev_sh: "/images/picture_prev_sh.jpg", //餐前上面  
    image_prev_ce: "/images/picture_prev_ce.jpg", //餐前侧面
    image_next_sh: "/images/picture_next_sh.jpg", //餐后上面
    image_next_ce: "/images/picture_next_ce.jpg", //餐后侧面
    name: "", //孩子名称，
    userid: "", //当前微信用户的openid
    msg_weight: "", //进餐描述
    flag: false,
    array: ["早", "中", "晚", "加餐"],
    value: "餐次", //清零

    //array value的值从这些列表中选择
    nowTime: "", //当前时间
    array_time: [],
    value_time: "日期", //清零

    nutritionInfo: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      vitamins: '',
      minerals: ''
    },
    showNutrition: false
  },

  /**
   * 生命周期函数--监听页面加载   
   * 
   * onshow代表每次点击该页面
   * onLoad代表首次加载该页面
   * onready代表渲染该页面，大多是在首次加载该页面实现
   * 图片只有在首次加载该页面清空，登录后再次加载就不会清空
   */
  onLoad: function () { //在用户首次打开小程序时先清除用户缓存信息
    // this.setData({
    //     name:wx.getStorageSync('infoCur')
    // })     
    // 不应该在页面加载的时候就获取用户缓存，应该是页面每次show出来，也就是每次用户点击的时候，再获取缓存，因为用户不可能一上来就上传图片，因此应该在onLoad中清理缓存，在onshow中再进行操作
    //remove清除单个缓存  clear清除所有缓存


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },


  /**
   * 生命周期函数--监听页面显示
   */

  //应该在这个函数中判断是否用户提交完成
  onShow() {
    console.log("upload onshow called")
    this.setData({
      userid: wx.getStorageSync('myid'),
      name: wx.getStorageSync('infoCur'),
      nowTime: this.getNowDate()
    })
  },


  // 对孩子身份进行更改
  chooseChild: function (e) {
    wx.navigateTo({
      url: '../signin/signin',
    })

    setTimeout(function () {
      wx.showToast({
        title: "更改当前孩子身份",
        icon: "none",
      })
    }, 400)
  },



  getNowDate: function () {
    var array_time = [];
    var date = new Date();
    var year = date.getFullYear() //年
    var month = date.getMonth() + 1 //月
    var day = date.getDate() //日
    var cnt = 0;
    while (cnt != 30) { //提供过去7天工选择
      if (day == 1) {
        array_time[cnt] = year + '-' + month + '-' + day;
        cnt++;
        //位于月初时，不能简单地对月份加减操作
        month--;
        //获取上个月
        if (month == 1 | month == 3 | month == 5 | month == 7 | month == 8 | month == 10 | month == 12) {
          day = 31;
        } else if (month == 4 | month == 6 | month == 9 | month == 10) {
          day = 30;
        } else {
          if (year % 4 == 0 && year % 100 != 0) {
            day = 29; //闰年的二月
          } else { //平年的二月
            day = 28;
          }
        }
      } else {
        array_time[cnt] = year + '-' + month + '-' + day;
        day--;
        cnt++;
      }

    }
    //wx.setStorageSync('time', year + '-' + month + '-' + day )

    this.setData({
      array_time: array_time
    }) //成功实现展示在页面上

  },


  //选择餐次
  bindchange: function (e) {
    var value = this.data.array[e.detail.value];
    this.setData({
      value: value
    })
  },

  //选择时间
  timechange: function (e) {
    var value = this.data.array_time[e.detail.value];
    this.setData({
      value_time: value
    })
  },


  fromSubmit: function () {
    console.log('form发生了submit事件')
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },


  inputHandler_msg: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  inputHandler_msg_weight: function (e) {
    this.setData({
      msg_weight: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { // 页面加载时触发，初始化数据

    //console.log("页面正在初始化")

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
    return {
      title: '分享',
      path: '/pages/homePage/homePage',
      imageUrl: '图片',
    };
  },
  onShareTimeline() {
    return {
      title: '分享',
      path: '/pages/homePage/homePage',
      imageUrl: '图片',
    };
  },

  // 食物餐前上面照片
  chooseImage_prevsh() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourcetype: ['album', 'camera'],
      success: res => {
        var filePath = res.tempFiles[0].tempFilePath
        this.cloudFile_prevsh(filePath)
      },
    });
  },

  cloudFile_prevsh(path) {
    wx.cloud.uploadFile({
      cloudPath: Date.now() + ".jpg",
      filePath: path,
      name: 'file',
    }).then(res => {
      this.setData({
        image_prev_sh: res.fileID
      })
      wx.cloud.getTempFileURL({
        fileList: [res.fileID],
        success(res) {
          wx.setStorageSync('pic1sh', res.fileList[0].tempFileURL)
        },

      })
    })
  },



  // 食物餐前侧面照片
  chooseImage_prevce() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourcetype: ['album', 'camera'],
      success: res => {
        var filePath = res.tempFiles[0].tempFilePath
        this.cloudFile_prevce(filePath)
      },
    });
  },

  cloudFile_prevce(path) {
    wx.cloud.uploadFile({
      cloudPath: Date.now() + ".jpg",
      filePath: path,
      name: 'file',
    }).then(res => {
      this.setData({
        image_prev_ce: res.fileID
      })


      wx.cloud.getTempFileURL({
        fileList: [res.fileID],
        success(res) {
          wx.setStorageSync('pic1ce', res.fileList[0].tempFileURL)
        },

      })
      console.log(res)
    })
  },



  // 食物餐后上面照片
  chooseImage_nextsh() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourcetype: ['album', 'camera'],
      success: res => {
        var filePath = res.tempFiles[0].tempFilePath
        this.cloudFile_nextsh(filePath)
      },
    });
  },

  cloudFile_nextsh(path) {
    wx.cloud.uploadFile({
      cloudPath: Date.now() + ".jpg",
      filePath: path,
      name: 'file',
    }).then(res => {
      this.setData({
        image_next_sh: res.fileID
      })


      wx.cloud.getTempFileURL({
        fileList: [res.fileID],
        success(res) {
          wx.setStorageSync('pic2sh', res.fileList[0].tempFileURL)
        },

      })
    })
  },



  // 食物餐后侧面照片
  chooseImage_nextce() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      sourcetype: ['album', 'camera'],
      success: res => {
        console.log(res)
        var filePath = res.tempFiles[0].tempFilePath
        this.cloudFile_nextce(filePath)
      },
    });
  },

  cloudFile_nextce(path) {
    wx.cloud.uploadFile({
      cloudPath: Date.now() + ".jpg", //cloudPath是在云存储中的位置
      filePath: path,
      name: 'file',
    }).then(res => {
      this.setData({
        image_next_ce: res.fileID
      })
      wx.cloud.getTempFileURL({
        fileList: [res.fileID],
        success(res) {
          wx.setStorageSync('pic2ce', res.fileList[0].tempFileURL)
        },

      })
    })
  },

  bindSubmit: function (res) {
    //查信息
    //if elseif       
    const that = this
    if (that.data.name == "") {
      //切换页面
      wx.switchTab({
        url: '../homepage/homepage',
      })
      //设置提示信息
      setTimeout(function () {
        wx.showToast({
          title: "请选择孩子身份后提交",
          icon: "none",
        })
      }, 400)
    } else if (that.data.value == "餐次") {
      wx.showToast({
        title: '未选择餐次',
        icon: "none"
      })
    } else if (that.data.value_time == "日期") {
      wx.showToast({
        title: '未选择日期',
        icon: "none"
      })
    } else if (that.data.image_prev_sh == "/images/picture_prev_sh.jpg" &&
      that.data.image_prev_ce == "/images/picture_prev_ce.jpg" &&
      that.data.image_next_sh == "/images/picture_next_sh.jpg" &&
      that.data.image_next_ce == "/images/picture_next_ce.jpg" &&
      that.data.msg_weight == "") {
      wx.showToast({
        title: '图片和食物描述至少提交一个',
        icon: "none"
      })
    }
    //只有餐前提交照片
    else if (((that.data.image_prev_sh != "/images/picture_prev_sh.jpg" || that.data.image_prev_ce != "/images/picture_prev_ce.jpg") &&
        (that.data.image_next_sh == "/images/picture_next_sh.jpg" && that.data.image_next_ce == "/images/picture_next_ce.jpg")) && that.data.msg_weight == "") {
      wx.showToast({
        title: '请提交一张餐后照片',
        icon: "none"
      })
    } else if (((that.data.image_prev_sh == "/images/picture_prev_sh.jpg" || that.data.image_prev_ce == "/images/picture_prev_ce.jpg") &&
        (that.data.image_next_sh != "/images/picture_next_sh.jpg" && that.data.image_next_ce != "/images/picture_next_ce.jpg")) && that.data.msg_weight == "") {
      wx.showToast({
        title: '请提交一张餐前照片',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '提交数据中',
        mask: "true"
      })
      // 先上传到云数据库
      wx.cloud.database().collection('foodList').add({
        data: {

          // opeartor:user.id,
          //通过缓存拿到照片和孩子姓名
          //图片只有缓存可以拿到
          //姓名并不在本页面中，因此也要通过缓存
          picPrevSh: wx.getStorageSync('pic1sh'),
          picPrevCe: wx.getStorageSync('pic1ce'),
          picNextSh: wx.getStorageSync('pic2sh'),
          picNextCe: wx.getStorageSync('pic2ce'),
          childName: that.data.name,

          //这些属性在res中可以得到
          foodName: res.detail.value.name,
          foodWeight: res.detail.value.zhong,

          //这些属性在page中定义的变量中找到
          foodKind: that.data.value, //不必要
          time: that.data.value_time //必填


        },
        success(res) { //提交数据成功后再清除pic1 pic2的缓存
          console.log('提交数据成功', res)

          // 调用大模型 API 分析图片
          that.analyzeNutrition()

          wx.showToast({
            title: '提交数据成功',
            mask: "true"
          })

          setTimeout(function () {
            wx.showToast({
              title: "可继续添加食物",
              icon: "none",

            })
          }, 1000)

          that.setData({
            msg_weight: '',
            image_prev_sh: "/images/picture_prev_sh.jpg", //餐前上面  
            image_prev_ce: "/images/picture_prev_ce.jpg", //餐前侧面
            image_next_sh: "/images/picture_next_sh.jpg", //餐后上面
            image_next_ce: "/images/picture_next_ce.jpg", //餐后侧面
            value: "餐次",
            value_time: "日期"
          })

          wx.removeStorage({
            key: 'pic1sh'
          })

          wx.removeStorage({
            key: 'pic1ce'
          })

          wx.removeStorage({
            key: 'pic2sh'
          })
          wx.removeStorage({
            key: 'pic2ce'
          })



        }
      })
    }
  },




  // 新增分析营养成分的函数
  // 修改后的 analyzeNutrition 函数
  analyzeNutrition: function() {
      const that = this
      console.log("调用大模型分析营养成分")
      
      // 获取图片临时链接（仅使用第一张图片）
      const images = [
          wx.getStorageSync('pic1sh'),
          wx.getStorageSync('pic1ce'),
          wx.getStorageSync('pic2sh'),
          wx.getStorageSync('pic2ce')
      ].filter(Boolean)
      
      if(images.length === 0) return
  
      wx.showLoading({ title: '分析中...', mask: true })
  

      wx.request({
          url: 'https://api.deepseek.com',
          method: 'POST',
          header: {
              'Content-Type': 'application/json',
              'Authorization': '替换成自己的api key'
          },
          data: {
              model: "deepseek-vision",
              messages: [{
                  role: "user",
                  content: [
                      { 
                          type: "text",
                          text: "分析食物图片的营养成分，返回JSON格式数据，包含：calories,protein,fat,carbohydrates,vitamins,minerals"
                      },
                      {
                          type: "image_url",
                          image_url: { url: images[0] }
                      }
                  ]
              }],
              max_tokens: 1000
          },
          success(res) {
              try {
                  console.log('API响应:', res.data)
                  const content = res.data.choices[0].message.content
                  const nutritionData = JSON.parse(content)
                  
                  that.setData({
                      nutritionInfo: nutritionData,
                      showNutrition: true
                  })
                  
                  wx.showToast({ title: '分析成功', icon: 'success' })
              } catch(e) {
                  console.error('解析失败', e)
                  that.setData({
                      nutritionInfo: {
                          calories: 0,
                          protein: 0,
                          fat: 0,
                          carbohydrates: 0,
                          vitamins: '分析失败',
                          minerals: '分析失败'
                      }
                  })
                  wx.showToast({ title: '分析成功', icon: 'none' })
              }
          },
          fail(err) {
              console.error('API调用失败', err)
              wx.showToast({ title: '请求失败', icon: 'none' })
          },
          complete() {
              wx.hideLoading()
          }
      })
  }
})