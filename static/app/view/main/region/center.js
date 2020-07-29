Ext.define('AdminManager.view.main.region.center', {
    extend: 'Ext.tab.Panel',
    xtype: 'main-center',
    controller:'adminController',
    uses: [
        'AdminManager.view.main.page.list',
        'AdminManager.view.main.page.adminController',
    ],

    referenceHolder: true,
    // layout: 'border',
    height: window.innerHeight-50,

    defaults: {
        collapsible: false,
        split: false,
        // bodyPadding: 20,
    },
    

    items: [
        {
            title: '详情信息',
            reference:'list',
            xtype:'mainlistgrid',
            region :'center',
            glyph: 'f039@FontAwesome',
        },
        {
            title: '标签页2',
            html: 'This is tab 2 content.',
            glyph: 'f02d@FontAwesome',
        },
        {
            title: '标签页2',
            html: 'This is tab 2 content.',
            closable:true,
            glyph: 'f02d@FontAwesome',
        },

    ],
});  