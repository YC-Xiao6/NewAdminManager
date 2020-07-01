// var flag = false;
var zkzcode; //在全局 定义验证码
function createCode() {
    zkzcode = "";
    var codeLength = 4;//验证码的长度
    var selectChar = new Array(0,1,2, 3, 4, 5, 6, 7, 8, 9);//所有候选组成验证码的字符，当然也可以用中文的
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 10);
        zkzcode += selectChar[charIndex];
    }
    return zkzcode;
}

var uname = new Ext.form.TextField( {
    id :'uname',
    fieldLabel : '用户名',
    name : 'name',//元素名称
    anchor:'80%',//也可用此定义自适应宽度
    cls:'uname1',
    // readOnly:true,
    fieldStyle:'border-radius: 5px; ',
    allowBlank : false,//不允许为空
    emptyText:'请输入用户名',
    blankText:"用户名不能为空",
    // value : "admin",
    // blankText : '用户名不能为空'//错误提示内容
});
var pwd = new Ext.form.TextField( {
    id : 'pwd',
    //xtype: 'textfield',
    inputType : 'password',
    fieldLabel : '密　码',
    anchor:'80%',
    maxLength : 11,//允许的最大长度
    name : 'passwd',
    allowBlank : false,
    // value : "12345",//初始值
    fieldStyle:'border-radius: 5px;',
    emptyText: "请输入密码",
    blankText : '密码不能为空',
    regex:/(^[a-zA-Z]\w{7,}$)/,
    // msgTarget: 'qtip',//错误提示信息
    regexText:'请输入正确的格式',
    // editable: false,                //下面这三行使得文本内容不能修改，边框消失
    // triggerWrapCls:'x-form-trigger-wrap-default_no_border',
    // inputWrapcls:'x-form-text-wrap'
});
var checks = new Ext.form.TextField( {
    id : 'checks',
    baseCls:"check",
    //xtype: 'textfield',
    // inputType : 'password',
    fieldLabel : '验证码',
    anchor:'80%',
    maxLength : 10,
    name : 'check',
    allowBlank : false,
    // height:30,
    // borderRadius:10,
    // 设置文本输入的样式
    fieldStyle:' border-radius: 5px; ',
    regex:/(^\w{4}$)/,
    regexText:'请输入正确的验证码',
    // readOnly:true,
    // hidden:true,//隐藏
    // value : "12345",
    // inputBorders:false,
    emptyText: "请输入验证码",
    blankText : '验证码不能为空',
        vtype: 'check',
    columnWidth: 0.68,
    // listeners:{
    //     click: {
    //         element: 'el', //触发点击事件
    //         fn: function(){
    //             createCode();
    //             Ext.MessageBox.buttonText.yes = "确定";
    //             Ext.MessageBox.buttonText.no = "刷新";
    //             Ext.MessageBox.confirm( '验证码：', zkzcode,goRefresh)
    //             function goRefresh(btn) {
    //                 if (btn==="no"){
    //                     createCode();
    //                     Ext.MessageBox.confirm( '验证码：', zkzcode,goRefresh)
    //                 }
    //                 if (btn==="yes"){
    //                     //通过id获取对象
    //                     Ext.getCmp("checks").reset();
    //                 }
    //             }
    //         }
    //     },
    // }
    // style:'margin:20px'
    // margin:"15 15 0 0",
    // shadow:true,
    
});
var checkImg = new Ext.panel.Panel({
    id : 'checkImg',
    width:'100px',
    html:'<a style="background: #2d6cbb;color: white;font-size: 20px;margin:0;width: 80px;">'+createCode()+'</a>',
    style:'padding: 0px 10px 10px 10px;margin: 0px 10px 10px 10px;padding-left: 100px;',
    listeners:{
        click: {
            element: 'el', //触发点击事件
            fn: function(){
                Ext.getCmp('checkImg').update('<a style="background: #2d6cbb;color: white;font-size: 20px;margin:0;width: 80px;">'+createCode()+'</a>');
            }
        },
    }
})
//扩展验证
Ext.apply(Ext.form.VTypes,{
    'check' : function(_v){
        if(zkzcode===_v){//判断必须是数字
            return true ;
        }
        return false ;
    },
    checkText : '验证码输入错误，请点击重试' , //出错信息后的默认提示信息
    // ageMask:/[0-9]/i  //键盘输入时的校验
})
Ext.onReady(function() {
    //使用表单提示
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    //定义表单
    var simple = new Ext.FormPanel({
        labelWidth: 75,
        defaults: {
            width: 150
        },
        defaultType: 'textfield',//默认字段类型
        // bodyStyle: 'padding:30 0 0 20;',
        // border: false,
        buttonAlign: 'center',
        id: "form",
        //定义表单元素
        items: [uname,pwd,checks,checkImg],
        buttons: [{
            text: '登录',
            type: 'submit',
            id: 'sb',
            //定义表单提交事件
            handler: save
        }, {
            text: '重置',
            handler: function () {
                simple.form.reset();
            }
        },{
            text: '忘记密码',
            handler: function () {
                Ext.MessageBox.alert("联系管理员!","请牢记您的密码！");
            }
        }],
    });
    function save() {
        //验证合法后使用加载进度条isValid判断表单是否符合条件
        if (simple.form.isValid()) {
            //提交到服务器操作
            simple.form.submit({
                waitMsg : '正在进行登陆验证,请稍后...',
                url : 'admin/login',
                method : 'post',
                // params : {
                //     name : userName,
                //     passwd : userPass
                // },
                //提交成功的回调函数
                success : function(form, action) {
                    if (action.result.success) {
                        //action 回调值
                        window.sessionStorage.setItem("LoggedIn", action.result.name);
                        console.log(action.result.tokenString)
                        // window.localStorage.setItem("LoggedIn", action.result.name);\
                        document.location.href='manager.html';
                    }
                },
                //提交失败的回调函数
                failure : function(form, action) {
                    switch (action.failureType) {
                        //客户端验证失败
                        case Ext.form.Action.CLIENT_INVALID:
                            Ext.Msg.alert('错误提示', '表单数据非法请核实后重新输入！');
                            break;
                        //    通讯错误
                        case Ext.form.Action.CONNECT_FAILURE:
                            Ext.Msg.alert('错误提示', '网络连接异常！');
                            break;
                        //    服务端处理失败result的 success 属性被设置为false
                        case Ext.form.Action.SERVER_INVALID:
                            Ext.Msg.alert('错误提示', "您的输入用户信息有误，请核实后重新输入！");
                            simple.form.reset();
                    }
                }
            });
        }
    };
    //定义窗体
    var win = new Ext.Window({
        id : 'win',
        layout : 'fit', //自适应布局
        align : 'center',
        width : 360,
        height : 250,
        resizable : false,//可否拉伸
        draggable : false,//可否移动
        border : true,
        shadow: false,//阴影
        // modal: true,
        // glyph: 'xf007@FontAwesome',
        title:"登录页面",
        bodyStyle : 'padding:0px;',
        maximizable : false,//禁止最大化
        closeAction : 'close',
        closable : false,//禁止关闭,
        items : simple
        //将表单作为窗体元素嵌套布局
    });
    win.show();//显示窗体
    // pwd.focus(false, 100);
});
