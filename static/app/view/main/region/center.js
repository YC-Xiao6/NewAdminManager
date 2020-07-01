Ext.define('AdminManager.view.main.region.center', {  
    extend: 'Ext.panel.Panel',  
    xtype: 'main-center',
    controller:'adminController',
    uses: [
        'AdminManager.view.main.page.list',
        'AdminManager.view.main.page.adminController'
    ],

    referenceHolder: true,
    layout: 'border',
    height: window.innerHeight-50,

    defaults:{
        collapsible: false,
        split: false
    },
    

    items: [
        // {
        //     reference:'listTop',
        //     xtype:'list-top',
        //     region:'north',
        // },
        // {
        //     reference:'oneForm',
        //     xtype:'one-form',
        //     region :'north',
        //     split: true

        // },
        {
            reference:'list',
            xtype:'mainlist',
            region :'center'
        },
        // {
        //     reference:'oneBottom',
        //     xtype:'one-bottom',
        //     region :'south',
        //     height:180,
        //     split: true
        // }
    ],
});  