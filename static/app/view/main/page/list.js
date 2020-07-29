Ext.define('AdminManager.view.main.page.list', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlistgrid',
    id:'listgrid',
    requires: [
        'AdminManager.store.Admin',
        'Ext.Base'
    ],

    store: {
        type: 'Admin'
    },
    controller:'adminController',
    // 多选框
    selModel: {
        selType: 'checkboxmodel', 
        mode: 'MULTI'
    },
    //加载等待遮罩层
    loadMask: true,

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 2,
    },
        // {
        //     ptype: 'exporter',
        // },
    ],
    plugin:{
        // //导出
        // rowediting: {
        //     clicksToEdit: 2,
        //     autoCancel: false
        // },
        exporter: true,
        // //点击会下滑有详细信息
        rowexpander:{
            rowBodyTpl: new Ext.XTemplate(
                '<p><b>Name:</b> {name}</p>',
                '<p><b>Birthday:</b> {birthday:this.formatChange}</p>',
                {
                    formatChange: function(v) {
                        var color = v >= new Date() ? 'green' : 'red';
                        return '<span style="color: ' + color + ';">' +
                            Ext.util.Format.dateRenderer(v) + '</span>';
                    }
                })
        }
    },

    // 是否允许通过标题中的上下文菜单隐藏列，默认为true 
    enableColumnHide:true,
    // 如果为false，则通过单击标题和排序菜单项禁用列排序。
    sortableColumns:true,
    // 垂直线
    columnLines:true,
    // 水平线
    rowLines: true,
    listeners: {
        // this event notifies us when the document was saved
        documentsave: 'onDocumentSave',
        beforedocumentsave: 'onBeforeDocumentSave',
        dataready: 'onDataReady'
    },
    features: [{
        ftype: 'summary',
        dock: 'bottom',
    }],
    // 表单信息
    columns: [
        {text: '序号',xtype: 'rownumberer', sortable: false,width: 80,align:'center',
            summaryType: 'count',
            summaryRenderer: function (value, summaryData, dataIndex) {
                return '汇总：';
            }
            },
        { text: 'ID',  dataIndex: 'id',hidden:false,align:'center',ignoreExport: true,
            // 关闭菜单排序
        menuDisabled:true,sortable:false,
            summaryType: 'sum',
            summaryRenderer: function (value, summaryData, dataIndex) {
                return value.toLocaleString();
            }
            },
        { text: '名称',  dataIndex: 'name' , align:'center',width: 100,locked:true,
        editor:{
                allowBlank:false
            },
            summaryType: 'count',
            summaryRenderer: function (value, summaryData, dataIndex) {
                return value.toLocaleString();
            }
            },
        { text: '密码', dataIndex: 'passwd',align:'center', width: 150,
        // editor:{
        //         allowBlank:false,
        //         regex:/(^[a-zA-Z]\w{7,}$)/,
        //     }
            },
        { text: '性别', dataIndex: 'sex', align:'center',width: 80,
        editor:{  
                xtype:'combo',
                allowBlank:false,
                store: Ext.create('Ext.data.Store', {
                fields: ['name', 'val'],
                data: [
                    {name: '男',val: '男'},
                    {name: '女',val: '女'}
                ]
            }),  
                displayField: 'name',
                valueField: 'val',
                triggerAction: 'all',
            }},
             { text: '生日日期',  dataIndex: 'birthday',align:'center',
                 //日期格式化
                 renderer:Ext.util.Format.dateRenderer('Y-m-d'), editor:{
                xtype: 'datefield',  
                allowBlank:false,  
                maxValue: new Date(),  format: 'Y-m-d',
            }},
        { text: '联系方式',  dataIndex: 'phone' ,align:'center', width: 150,
        editor:{  
                allowBlank:false,
                regex:/(^0?(13|14|15|17|18|19)[0-9]{9}$)/,  
            } },
            { text: '邮箱地址',  dataIndex: 'email' , width: 150,
        editor:{  
                allowBlank:false,
                regex:/(^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$)/,          
                }},
        { text: '学历', dataIndex: 'education', width: 80,align:'center',
        editor:{  
                allowBlank:false,
                xtype:'combo',
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
            displayField: 'name',
            valueField: 'val',
            triggerAction: 'all',  
            }},
        { text: '地址', dataIndex: 'addr', width: 180,align:'center',
        editor:{  
                allowBlank:true,  
            }},
        //套接表
        {text: '时间',columns:[
                { text: '创建时间',  dataIndex: 'create_time',width: 150,align:'center',},
                { text: '最后修改时间',  dataIndex: 'last_time',width: 150,align:'center',},
            ]},



    ],

    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        //不要再加入store了，不然会重复加载
        displayInfo: true,
        displayMsg: '当前显示第 {0} - {1} 条，总共 {2}条',
        emptyMsg: "没有数据",
    }],
    tbar:{
        xtype:"container",
        border:false,
        items:[{
             //tbar第一行工具栏
             xtype:"toolbar",
             items : ['-',{
                 text:'查询所有',
                 iconCls:'icon-search',
                 handler:'searchAdmins',
             },'-',{
                text:'添加一行',  
                iconCls:'icon-plus',
                handler:'addAdmins',
                },'-',{  
                text:'修改用户',  
                iconCls:'icon-edit',
                handler:'editAdmin',
                },'-',{  
                    text:'保存修改',
                    iconCls:'icon-save',
                    handler:'saveAdmin',
            },'-',{  
                    text:'删除用户',
                    iconCls:'icon-remove',
                    handler:'deleteAdmin',
            },'-',{
                 text:'导出数据',
                 iconCls:'icon-download-alt',
                 menu: {
                     defaults: {
                         handler: 'exportTo'
                     },
                     items: [{
                         text: 'Excel xlsx',
                         cfg: {
                             type: 'excel07',
                             ext: 'xlsx'
                         },
                     }, {
                         text: 'Excel xlsx (include groups)',
                         cfg: {
                             type: 'excel07',
                             ext: 'xlsx',
                             includeGroups: true,
                             includeSummary: true
                         }
                     }, {
                         text: 'Excel xml',
                         cfg: {
                             type: 'excel03',
                             ext: 'xml'
                         }
                     }, {
                         text: 'Excel xml (include groups)',
                         cfg: {
                             includeGroups: true,
                             includeSummary: true
                         }
                     }, {
                         text: 'CSV',
                         cfg: {
                             type: 'csv'
                         }
                     }, {
                         text: 'TSV',
                         cfg: {
                             type: 'tsv',
                             ext: 'csv'
                         }
                     }, {
                         text: 'HTML',
                         cfg: {
                             type: 'html'
                         }
                     }, {
                         text: 'HTML (include groups)',
                         cfg: {
                             type: 'html',
                             includeGroups: true,
                             includeSummary: true
                         }
                     }]
                 }
             }]
            },{
             //tbar第二行工具栏
                 xtype:"toolbar",
                 items : ['-',{  
                    xtype:'textfield',
                    fieldLabel:' 名称查询:',
                    labelWidth:'20px',
                    id:'searchname',
                    emptyText:'模糊名称查询'
                    
                    // iconCls:'icon-search',
                    // handler:'addAdmins'
            },{  
                    text:'查询',
                    iconCls:'icon-search',
                    handler:'searchAdminsByName'
            },'-',{  
                    xtype:'datefield',
                    fieldLabel:' 生日查询:起',
                    format:'Y-m-d',
                    id:'searchdateup',
                    labelWidth:'20px',
                    value:new Date(),
                    // vtype : 'daterange',
                    endDateField : 'searchdatedown',//最晚的日期
                    // style:'width:160px',
                    // iconCls:'icon-search',
                    // handler:'addAdmins'
            },{  
                    xtype:'datefield',
                    fieldLabel:'止',
                    id:'searchdatedown',
                    format:'Y-m-d',
                    labelWidth:'20px',
                    value:new Date(),
                    // vtype : 'daterange',
                    startDateField : 'searchdateup',
                    // style:'width:160px',
                    // iconCls:'icon-search',
                    // handler:'addAdmins'
            },{  
                    text:'查询',
                    iconCls:'icon-search',
                    handler:'searchAdminsByBirthday'
            },'-',{  
                    xtype:'combo',
                    fieldLabel:' 性别查询:',
                    id:'searchsex',
                    labelWidth:'80px',
                    emptyText: "请选择",
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'val'],
                        data: [
                            {name: '男',val: '男'},
                            {name: '女',val: '女'}
                        ]
                    }),
                    // queryMode: 'local',
                    // 显示
                    displayField: 'name',
                    // 传递的值
                    valueField: 'val',
                    triggerAction: 'all',
                    style:'width:130px',
                    // iconCls:'icon-search',
                    // handler:'addAdmins'
            },{  
                    text:'查询',
                    iconCls:'icon-search',
                    handler:'searchAdminsBySex'
            },]
        }]
        
       }
    
});
