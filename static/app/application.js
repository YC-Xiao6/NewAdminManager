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
        var loggedIn;
        // Check to see the current value of the localStorage key
        //localStorage本地存储空间永久存在，sessionStorage会话结束销毁
        // loggedIn = window.localStorage.getItem('LoggedIn');
        loggedIn = window.sessionStorage.getItem('LoggedIn');
        if(loggedIn!=="null"){
            Ext.create({
                // 三目运算符
                xtype:  'app-main'
                // xtype:'login',
            });
        }
        if(loggedIn==="null"||loggedIn===null) {
            document.location.href='login.html';
        }
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