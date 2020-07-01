/**
 * http://usejsdoc.org/
 */
Ext.define('AdminManager.store.Students', {
	extend : 'Ext.data.Store',
	alias: 'store.Students',
	// fields: [
 //        'id','name', 'age', 'sex'
 //    ],
 	id:'adminStore',
    model:'AdminManager.model.Students',
	data : [{
		id : 1,
		name : '张三',
		age : 30,
		sex : '男'
	}, {
		id : 2,
		name : '李四',
		age : 20,
		sex : '女'
	} ]
});