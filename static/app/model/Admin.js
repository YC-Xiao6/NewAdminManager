//创建用户模型
Ext.define('AdminManager.model.Admin', {
    extend: 'Ext.data.Model',
    fields: ['id','name','passwd','birthday','sex','phone','email','addr',
    'education','create_time','last_time']
});