// axicomponent/textarea/axi-textarea.js
const ComponentWrapper = require('../include.js')('axi-textarea').Component;

ComponentWrapper({
  /**
   * 组件的属性列表
   */
  properties: {
    'value': {
        // memo: '输入框的初始内容',
        type: String
    },
    'placeholder': {
        // memo: '输入框为空时占位符',
        type: String
    },
    'placeholderColor': {
        // memo: '输入框为空时占位符文字颜色，自定义独有',
        type: String
    },
    'disabled': {
        // memo: '是否禁用',
        type: Boolean
    },
    'maxlength': {
        // memo: '最大输入长度，设置为 -1 的时候不限制最大长度',
        type: Number
    },
    'autoHeight': {
        // memo: '是否自动增高，设置auto-height时，style.height不生效',
        type: Boolean
    },
    'focus': {
        // memo: '获取焦点',
        type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    focusFunc: function(e) {
        this.triggerEvent('focus', arguments);
    },
    blurFunc: function(e) {
        this.triggerEvent('blur', arguments);
    },
    linechangeFunc: function(e) {
        this.triggerEvent('linechange', arguments);
    },
    inputFunc: function(e) {
        this.triggerEvent('input', arguments);
    },
    confirmFunc: function(e) {
        this.triggerEvent('confirm', arguments);
    },
    click: function () {
      this.setData({
        focus: true
      });
    }
  }
})
