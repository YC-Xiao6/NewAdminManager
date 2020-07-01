Ext.define('AdminManager.view.main.page.addAdmin',{
	extend:'Ext.form.FormPanel',
	// alias:'controller.adminController',
	xtype:'addAdmin',
	id:'addAdmin',
	// 布局列表
	layout:'column',
    defaults:{
        style:'float:left;margin:4px;',
        columnWidth: 0.49,
        // 错误信息显示的位置
        msgTarget: 'side'
    },
    // 默认格式
	defaultType:'textfield',
	// 默认信息
	fieldDefaults:{
        labelAlign:'right',
        labelWidth:84                                 
    },
	items:[
		{
			fieldLabel: 'ID',
			name:'id',
			readOnly:true,
			columnWidth: 0.98,
            // emptyText: "无需填写",
		},
		{
			allowBlank: false,
            fieldLabel: '名称',
            name: 'name',
            emptyText: "请输入名称",
            blankText:"用户名不能为空！",
        },
        {
            allowBlank: false,
            type:'combo',
            fieldLabel: '密码',
            name: 'passwd',
            blankText:"密码不能为空！",
            emptyText: "请输入密码",
            regex:/(^[a-zA-Z]\w{7,}$)/,
            regexText:'请输入以英文字符开头的八位密码格式！',
        },
        {
            xtype:'combo',
            fieldLabel:'性别',
            name: 'sex',
            value:'男',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'val'],
                data: [
                    {name: '男',val: '男'},
                    {name: '女',val: '女'}
                ]
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'val',
            triggerAction: 'all',
        },
        {
            xtype:'combo',
            fieldLabel:'学历',
            name: 'education',
            value:'本科',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'val'],
                data: [
                    {name: '高中',val: '高中'},
                    {name: '大专',val: '大专'},
                    {name: '本科',val: '本科'},
                    {name: '硕士',val: '硕士'},
                    {name: '博士',val: '博士'}, 
                ]
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'val',
            triggerAction: 'all',
        },
        {
			xtype: 'datefield',
            fieldLabel:'生日日期',
            name:'birthday',
            value:new Date(),
            maxValue: new Date(),
            submitFormat:"Y-m-d",
		},
		{
			allowBlank: false,
            fieldLabel: '联系方式',
            name: 'phone',
            blankText:"联系方式不能为空！",
            emptyText: "请输入联系方式",
            regex:/(^0?(13|14|15|17|18|19)[0-9]{9}$)/,
            regexText:'请输入正确的手机号格式！',
		},
		
		{
			allowBlank: false,
            fieldLabel: '邮箱地址',
            name: 'email',
            blankText:"邮箱地址不能为空！",
            emptyText: "请输入邮箱地址",
            regex:/(^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$)/,
            regexText:'请输入正确的邮箱格式！',
            columnWidth: 0.68
		},
		{
			fieldLabel: '联系地址',
			name: 'addr',
			emptyText: "请输入地址",
			columnWidth: 0.98
		},
	]
})