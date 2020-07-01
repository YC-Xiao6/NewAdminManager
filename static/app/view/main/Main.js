Ext.define('AdminManager.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    requires: [
        'AdminManager.view.main.MainController',
        'AdminManager.view.main.MainModel',
        'AdminManager.view.main.region.top',
        'AdminManager.view.main.region.left',
        'AdminManager.view.main.region.center',
        'AdminManager.view.main.region.out'
    ],
    id:'main',
    controller: 'main',
    viewModel: 'main',
    // 
    referenceHolder: true,

    layout : 'border', 
    defaults:{
        collapsible: true,
        split: true
    },

    items : [
        {
            reference:'mainTop',
            xtype : 'main-top',
            region : 'north',
            collapsible: false,
            split: false,
            height:50
        },
        {
            reference:'mainLeft',
            xtype : 'main-left',
            region : 'west', 
            width : 220,

        }, 
        {
            
            reference:'mainCenter',
            autoDestroy:false,
            region : 'center', 
            collapsible: false,
            split: false,
            items:[{
                id:'center1',
                xtype:'main-center',
                visible:'true',
            },{
                id:'center2',
                xtype:'outpage',
                visible:'false',
            }
            ]
            
          
        }
    ]
});