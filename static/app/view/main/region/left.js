Ext.define('AdminManager.view.main.region.left', {
    extend: 'Ext.tree.Panel',
    xtype:'main-left',

    title:'导航菜单',
    lines: false,
    rootVisible: false,
    // store:Ext.create('AdminManager.store.main.mainLeftStore', {
    //     storeId: "mainLeftStoreId" 
    // }),
   root: {
        expanded: true,
       children: [
           { text: "用户信息", leaf: true,id:'admin',iconCls: 'x-fa fa-user',},
           { text: "buy lottery tickets", leaf: true,id:'out1' },
           { text: "homework", expanded: true,id:'out2', children: [
                   { text: "book report", leaf: true,id:'out3' },
                   { text: "alegrbra", leaf: true,id:'out4'}
               ]},
       ]
    }
});