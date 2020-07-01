Ext.define('AdminManager.store.Admin', {
    extend : 'Ext.data.Store',
    alias: 'store.Admin',
    id:'adminStore',
    model:'AdminManager.model.Admin',
    autoLoad :true,
    remoteSort:true,
    pageSize: 10,
    proxy: { // Ext.util.ObjectTemplate
        type: 'ajax',
        url: 'admin/index',
        async: true,
        reader: {
            type: 'json',
            rootProperty:'admin',
        }
    },

});