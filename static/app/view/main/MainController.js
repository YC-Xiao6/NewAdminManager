/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('AdminManager.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    control: {  
        'main-left': {//组件别名，表示要控制的是该组件  
            selectionchange: 'onTreeNavSelectionChange'  
        }  
    },
    // 加入路由
    routes:{
        ":id":'handleRoute'
    },

    onLoginOutClick: function () {
        // Remove the localStorage key/value
        // window.localStorage.removeItem('LoggedIn');
        window.sessionStorage.removeItem('LoggedIn');
        this.getView().destroy();
        document.location.href='login.html';
    },

    onTreeNavSelectionChange: function(selModel, records) {  
        var record = records[0];  
        if (record) {
            //默认散列
            this.redirectTo(record.getId()); 
        }  
    },
    handleRoute:function(idStr){
        // var id = parseInt(idStr.substr(idStr.length-1,1));
        switch (idStr) {
            case "admin":
                Ext.getCmp('center2').hide();
                Ext.getCmp('center1').show();
                break;
            case "out1":
                Ext.getCmp('center2').show();
                Ext.getCmp('center1').hide();
                break;
            case "out2":
                Ext.getCmp('center2').hide();
                Ext.getCmp('center1').hide();
                break;
            case "out3":
                Ext.getCmp('center2').show();
                Ext.getCmp('center1').hide();
                break;
            case "out4":
                Ext.getCmp('center2').show();
                Ext.getCmp('center1').hide();
                break;
        }
    }
});
