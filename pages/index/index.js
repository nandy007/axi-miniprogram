//index.js
//获取应用实例

const PageWrapper = require('../../axicomponent/include.js')('index').Page;
PageWrapper({
  data: {
    inputText: '输入框的内容',
    rd: 'cn',
    cks: ['2'],
    slt: '2',
    switchChecked: true,
    aa: '222',
    isShow: true,
    content: ['111', '恭喜你，学会了小程序组件'],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scroll: true,
    cks: ['1'],
    options: [{ text: '选项1', value: '1' }, { text: '选项2', value: '2' }],
    items: [
              {
                    "url": "http://127.0.0.1/1.flv",
                    "title": "这是标题一"
              },
              {
                    "url": "http://127.0.0.1/2.flv",
                    "title": "这是标题二"
              }
        ],
    list: [
      {
        title: '标题二'
      }
    ],
    node: '<span >1111</span>',
    tabIndex: 1,
    tablist: [{ text: '组件', iconPath: '/resources/imgs/icon_component.png', selectedIconPath: '/resources/imgs/icon_component_HL.png' }, { text: '接口', iconPath: '/resources/imgs/icon_API.png', selectedIconPath: '/resources/imgs/icon_API_HL.png' }]
  },
  onLoad: function () {
    // console.log(222)
    // this.setData({
    //   isShow: true
    // })
    // this.data.isShow = true;
    setTimeout(()=>{
      // console.log(this.data.slt)
      this.setData({
        isShow: false,
        switchChecked: false,
        inputText: '新输入内容'
      });

      // this.data.inputText = '33333'

      setTimeout(() => {
        this.setData({
          isShow: true
        })
      }, 3000);
      console.log(this.getValueByName('rd'))
    }, 3000);

    
  },
  defaultTap: function(e){
    console.log(e.currentTarget)
  },
  scrollTop: function(e){
    console.log(e);
  },
  scroll: function (e) {
    console.log(e);
  },
  actived: function(e){
    console.log(e)
  },
  change : function(e){
    // console.log(e.detail)
  },
  cancel: function(e){
    console.log(e)
  }
})
