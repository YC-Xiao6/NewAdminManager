Ext.define('AdminManager.Application', {
    extend: 'Ext.app.Application',
    name: 'AdminManager',
    views: [
        // 'AdminManager.view.login.login',
        'AdminManager.view.main.Main'
    ],
    
    stores: [
        // TODO: add global / shared stores here
    ],
    
    // launch:function(){
    //     Ext.create()
    // }

    launch: function () {
        // TODO - Launch the application
        var loggedIn,token;
        // Check to see the current value of the localStorage key
        //localStorage本地存储空间永久存在，sessionStorage会话结束销毁
        // loggedIn = window.localStorage.getItem('LoggedIn');
        // loggedIn = window.sessionStorage.getItem('LoggedIn');
        token = window.sessionStorage.getItem('token');
        Ext.Ajax.request({
            url: "/inits",
            method:'POST',
            params:{
                token:token,
            },
            success: function (response) {
                //返回的是一个json对象
                var text = response.responseText;
                //获取传回函数status
                var status =Ext.decode(text).status;
                var username =Ext.decode(text).username;
                if(status===true){
                    window.sessionStorage.setItem("LoggedIn", username);
                    Ext.create({
                            // 三目运算符
                            xtype:  'app-main'
                            // xtype:'login',
                    });
                }else {
                    Ext.MessageBox.alert("失败","验证失败");
                }
            },
            failure: function (response) {
                Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
            }
        })
        // if(loggedIn!=="null"){
        //     Ext.create({
        //         // 三目运算符
        //         xtype:  'app-main'
        //         // xtype:'login',
        //     });
        // }
        // if(loggedIn==="null"||loggedIn===null) {
        //     document.location.href='login.html';
        // }
    },

    // onAppUpdate: function () {
    //     Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
    //         function (choice) {
    //             if (choice === 'yes') {
    //                 window.location.reload();
    //             }
    //         }
    //     );
    // },
});