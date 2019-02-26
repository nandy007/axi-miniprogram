// axicomponent/view/axi-view.js
Component({
  externalClasses: ['slot-class'],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    'hoverClass': {
      type: String,
      value: 'none',
      // observer: function (newVal, oldVal) {
        
      // }
    },
    'hoverStopPropagation': {
      type: Boolean,
      value: false
    },
    'hoverStartTime': {
      type: Number,
      value: 50
    },
    'hoverStayTime': {
      type: Number,
      value: 400
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      {
        aaa: '标题1'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // toDo: function(){

    // }
  }
})
