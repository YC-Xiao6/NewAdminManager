Ext.define('AdminManager.view.main.region.out',{
	extend:'Ext.panel.Panel',
	xtype:'outpage',
	bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
    // width: 300,
    layout:'fit',
    height: window.innerHeight-50,
    title: '提示信息',
    html:'<h1>敬请期待</h1>'
    // items: [{
    //     xtype: 'panel',
    //     text: '敬请期待'
    // }],
})