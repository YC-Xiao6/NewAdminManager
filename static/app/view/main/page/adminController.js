Ext.define('AdminManager.view.main.page.adminController',{
	extend:'Ext.app.ViewController',
	alias:'controller.adminController',
    requires:[
        'AdminManager.view.main.page.addAdmin',
        'AdminManager.view.main.page.editAdmin',

    ],
	// *********新建**********
    addAdmins: function () {
        var newWin =  Ext.create('AdminManager.view.main.page.addAdmin');          
        newWin.window = new Ext.Window({
            title: '添加新用户',
            id: 'addAdminWin',
            width: 480,
            modal: true,
            resizable: false,
            closeAction: 'destroy',
            plain: true,
            //buttonAlign: 'center',
            constrainHeader:true,
            items: newWin,
        	buttons: [
                {
                    text: '重置',
                    // scope: this,
                    iconCls:'icon-undo',
                    handler:function(){
                        Ext.getCmp('addAdmin').form.reset();  
                    }
                                               
                },
	            {
	                text: '提交',
	                scope: this,
                    iconCls:'icon-save',
	                handler:function () {
                        var fromPanel=Ext.getCmp('addAdmin');
                        if (fromPanel.form.isValid()) {
                            //提交到服务器操作
                            // alert(fromPanel.form.get())
                            fromPanel.form.submit({
                                url : 'admin/addAdmin',
                                method : 'post',
                                //提交成功的回调函数
                                success : function(form, action) {
                                    if (action.result.status) {
                                        Ext.MessageBox.alert("成功", "添加成功");
                                        var grid =  Ext.getCmp('listgrid');
                                        newWin.window.destroy();
                                        grid.getStore().load();
                                    }else {
                                        Ext.MessageBox.alert("失败",action.result.message);
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
                                            Ext.Msg.alert('错误提示', "添加失败！");
                                    }
                                }
                    })}else {
                            Ext.Msg.alert('错误信息','信息不可为空!');
                        }
                    }

	            },
	            {
	            	text:'关闭',
                    iconCls:'icon-remove',
	            	handler:function() {
	                    newWin.window.destroy();
	                }
	            }
            ]
        });
        newWin.window.show();
    },
    deleteAdmin:function(){  
        var grid =  Ext.getCmp('listgrid');  
        if (grid.getSelectionModel().hasSelection()){  
                Ext.Msg.confirm('系统提示','确定要删除？',function(btn){  
                    if(btn==='yes'){
                        // 通过id获取相应对象
                        var selModel = grid.getSelectionModel();//得到选择模型
                        var selection = selModel.getSelection();//得到被选择的记录数组
                        var successId = '用户ID:';
                        for (var i = 0; i < selection.length; i++) {
                            var model = selection[i];//得到model
                            // alert("/admin/delete?id="+model.id)
                            Ext.Ajax.request({
                                url: "admin/delete?id="+model.id,
                                method:'GET',
                                //设置为同步请求，避免数据出错
                                async: false,
                                success: function (response) {
                                    //返回的是一个json对象
                                    var text = response.responseText;
                                    //获取传回函数status
                                    var status =Ext.decode(text).status;
                                    if (status === "false") {
                                        // Ext.MessageBox.hide();
                                        Ext.MessageBox.alert("警告", "用户ID:"+model.id+"不存在,无法删除!");
                                    } else {
                                        // Ext.MessageBox.hide();
                                        // alert(i);
                                        if( i !==selection.length-1){
                                            successId+=model.id+",";
                                            Ext.MessageBox.alert("成功", successId+"删除成功!");
                                        }else {
                                            successId+=model.id;
                                            Ext.MessageBox.alert("成功", successId+"删除成功!");
                                        }
                                    }
                                },
                                failure: function () {
                                    // Ext.MessageBox.hide();
                                    Ext.MessageBox.alert("警告", "删除用户ID:"+model.id+"时请求超时!");
                                }
                            })
                        }
                        grid.getStore().load();
                    }
                    })
            }
        else{
            Ext.Msg.alert('错误信息','请选中要删除的用户!');
        }
    },
    // 直接修改需要保存的用户
    saveAdmin:function(){  
        var grid =  Ext.getCmp('listgrid');  
        if (grid.getSelectionModel().hasSelection()){  
                Ext.Msg.confirm('系统提示','确定要进行修改？',function(btn){  
                    if(btn==='yes'){
                        // 通过id获取相应对象
                        var selModel = grid.getSelectionModel();//得到选择模型
                        var selection = selModel.getSelection();//得到被选择的记录数组
                        for (var i = 0; i < selection.length; i++) {
                            var model = selection[i];//得到model
                            var birthday="";
                            if(Ext.Date.format(model.get("birthday"),"Y-m-d")===""){
                                birthday=model.get("birthday");
                            }else {
                                birthday=Ext.Date.format(model.get("birthday"),"Y-m-d");
                            }
                            Ext.Ajax.request({
                                url: "admin/editAdmin",
                                method:'POST',
                                params:{
                                    id:model.get("id"),
                                    name:model.get("name"),
                                    birthday:birthday,
                                    sex:model.get("sex"),
                                    phone:model.get("phone"),
                                    email:model.get("email"),
                                    education:model.get("education"),
                                    addr:model.get("addr"),
                                },
                                success: function (response) {
                                    //返回的是一个json对象
                                    var text = response.responseText;
                                    //获取传回函数status
                                    var status =Ext.decode(text).status;
                                    var message =Ext.decode(text).message;
                                    if(status===true){
                                        Ext.MessageBox.alert("成功", "修改成功！");
                                        var grid =  Ext.getCmp('listgrid');
                                        grid.getStore().load();
                                    }else {
                                        Ext.MessageBox.alert("失败",message);
                                    }
                                    },
                                failure: function (response) {
                                    Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                }
                        })
                    }
                    }})
            }
        else{
            Ext.Msg.alert('错误信息','请选择需要保存修改的用户!');
        }
    },
    editAdmin: function () {          
        var grid =  Ext.getCmp('listgrid');  
        if (grid.getSelectionModel().hasSelection()){  
                var selModel = grid.getSelectionModel();//得到选择模型
                var selection = selModel.getSelection();//得到被选择的记录数组
                if(selection.length>1){
                    Ext.Msg.alert('错误信息','请选择要修改的一位用户!');
                }else{
                    var selectObj = selection[0];
                    Ext.Ajax.request({
                        url: "admin/modifyInfo?id="+selectObj.id,
                        method:'GET',
                        //设置为同步请求，避免数据出错
                        async: false,
                        success: function (response) {
                            //返回的是一个json对象
                            var text = response.responseText;
                            //获取传回函数status
                            var status =Ext.decode(text).status;
                            var admin =Ext.decode(text).admin;
                            if (status === true) {
                                var newWin =  Ext.create('AdminManager.view.main.page.editAdmin');
                                newWin.form.findField("id").setValue(admin.id);
                                newWin.form.findField("name").setValue(admin.name);
                                newWin.form.findField("passwd").setValue(admin.passwd);
                                newWin.form.findField("sex").setValue(admin.sex);
                                newWin.form.findField("birthday").setValue(admin.birthday);
                                newWin.form.findField("education").setValue(admin.education);
                                newWin.form.findField("phone").setValue(admin.phone);
                                newWin.form.findField("email").setValue(admin.email);
                                newWin.form.findField("addr").setValue(admin.addr);
                                newWin.window = new Ext.Window({
                                    title: '添加新用户',
                                    id: 'addAdminWin',
                                    width: 480,
                                    modal: true,
                                    resizable: false,
                                    closeAction: 'destroy',
                                    plain: true,
                                    //buttonAlign: 'center',
                                    constrainHeader:true,
                                    items: newWin,
                                    buttons: [
                                        {
                                            text: '重置',
                                            // scope: this,
                                            iconCls:'icon-undo',
                                            handler:function(){
                                                Ext.getCmp('editAdmin').form.reset();
                                            }

                                        },
                                        {
                                            text: '提交',
                                            scope: this,
                                            iconCls:'icon-save',
                                            handler:function () {
                                                var fromPanel=Ext.getCmp('editAdmin');
                                                if (fromPanel.form.isValid()) {
                                                    //提交到服务器操作
                                                    // alert(fromPanel.form.get())
                                                    fromPanel.form.submit({
                                                        url : 'admin/modifyAdmin',
                                                        method : 'post',
                                                        //提交成功的回调函数
                                                        success : function(form, action) {
                                                            if (action.result.status) {
                                                                Ext.MessageBox.alert("成功", "修改成功！");
                                                                var grid =  Ext.getCmp('listgrid');
                                                                newWin.window.destroy();
                                                                grid.getStore().load();
                                                            }else {
                                                                Ext.MessageBox.alert("失败",action.result.message);
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
                                                                    Ext.Msg.alert('错误提示', "添加失败！");
                                                            }
                                                        }
                                                    })}else {
                                                    Ext.Msg.alert('错误信息','信息不可为空!');
                                                }
                                            }
                                        },
                                        {
                                            text:'关闭',
                                            iconCls:'icon-remove',
                                            handler:function() {
                                                newWin.window.destroy();
                                            }
                                        }
                                    ]
                                });
                                newWin.window.show();
                            } else {
                                Ext.MessageBox.alert("错误", "用户信息获取失败!")
                            }
                        },
                        failure: function () {
                            // Ext.MessageBox.hide();
                            Ext.MessageBox.alert("警告", "用户信息获取请求超时!");
                        }
                    })

                }
            }
        else{
            Ext.Msg.alert('错误信息','请选中要修改的用户!');
        }
    },
    searchAdmins:function(){
        var grid =  Ext.getCmp('listgrid');
        grid.getStore().proxy.url='admin/index';
        grid.getStore().load();
    },
    searchAdminsByName: function () {          
        var searchname =  Ext.getCmp('searchname').getValue();  
        if (searchname===''||searchname==null){
           Ext.Msg.alert('错误信息','请输入要查询的名称!');
        }else{
            var grid =  Ext.getCmp('listgrid');
            grid.getStore().proxy.url="/admin/queryByName?name=" + searchname;
            grid.getStore().load();
        }
    },
    searchAdminsByBirthday: function () {          
        var searchdateup = Ext.Date.format(new Date(Ext.getCmp('searchdateup').getValue()),'Y-m-d'); 
        var searchdatedown = Ext.Date.format(new Date(Ext.getCmp('searchdatedown').getValue()),'Y-m-d'); 
        if(searchdateup>searchdatedown){
            Ext.Msg.alert('错误信息','请选择要正确的日期范围!');
        }else{
            var searchdate=Ext.Date.format(new Date(searchdateup),'Y-m-d')+'and'+Ext.Date.format(new Date(searchdatedown),'Y-m-d');
            if (searchdate===''||searchdate===null){
               Ext.Msg.alert('错误信息','请选择要查询的日期范围!');
            }else{
                var grid =  Ext.getCmp('listgrid');
                grid.getStore().proxy.url="admin/queryByDate?date=" + searchdate;
                grid.getStore().load();
            }
        }
        
    },
    searchAdminsBySex: function () {          
        var  searchsex=  Ext.getCmp('searchsex').getValue();  
        if (searchsex==''||searchsex==null){  
           Ext.Msg.alert('错误信息','请输入要查询的名称!');
        }else{
            var grid =  Ext.getCmp('listgrid');
            grid.getStore().proxy.url="admin/queryBySex?sex=" + searchsex;
            grid.getStore().load();
        }
    },
    exportTo: function(btn) {
        var cfg = Ext.merge({
            title: 'Grid export',
            fileName: 'GridExport' + '.' + (btn.cfg.ext || btn.cfg.type)
        }, btn.cfg);
        // var grid =  Ext.getCmp('listgrid');
        Ext.getCmp('listgrid').saveDocumentAs(cfg);
    },
    onBeforeDocumentSave: function(view) {
        this.timeStarted = Date.now();
        view.mask('Document is prepared for export. Please wait ...');
        Ext.log('export started');
    },

    onDocumentSave: function(view) {
        view.unmask();
        Ext.log('export finished; time passed = ' + (Date.now() - this.timeStarted));
    },

    onDataReady: function() {
        Ext.log('data ready; time passed = ' + (Date.now() - this.timeStarted));
    }
})