package controller

import (
	"adminManager/models"
	"adminManager/service"
	"encoding/json"
	"fmt"
	"github.com/iris-contrib/middleware/jwt"
	"github.com/kataras/iris"
	_ "github.com/kataras/iris/context"
	"github.com/kataras/iris/mvc"
	"github.com/kataras/iris/sessions"
	"strings"
	"time"
)

/*定义结构体对象*/
type AdminController struct {
	//创建会话
}
//注册session
var (sess = sessions.New(sessions.Config{Cookie: "mysession"}))

//const ADMIN = "admin"
//转发路由
func (a *AdminController) BeforeActivation( b mvc.BeforeActivation)  {
	//创建监听
	b.Handle("GET","/index","QueryAll")
	b.Handle("GET","/getSession","GetSession")
	b.Handle("GET","/deleteSession","DeleteSession")
	b.Handle("POST","/login","Login")
	b.Handle("GET", "/delete", "DelAdminById")
	b.Handle("GET", "/modifyInfo", "ModifyInfoById")
	b.Handle("GET", "/queryByName", "QueryByName")
	b.Handle("GET", "/queryBySex", "QueryBySex")
	b.Handle("GET", "/queryByDate", "QueryByDate")
	b.Handle("POST","/addAdmin","AddAdmin")
	b.Handle("POST","/modifyAdmin","ModifyAdmin")
	b.Handle("POST","/editAdmin","EditAdmin")
}
/*
*path:/admin/getSession
*获取session值
 */
func (a *AdminController) GetSession (ctx iris.Context) mvc.Result{
	name := sess.Start(ctx).Get("ADMINNAME")
	if name != nil{
		return mvc.Response{
			Object: map[string]interface{}{
				"status":true,
				"name":name,
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":false,
			},
		}
	}
}
/*
*path:/admin/getSession
*退出删除session
 */
func (a *AdminController) DeleteSession (ctx iris.Context) mvc.Result{
	flag := sess.Start(ctx).Delete("ADMINNAME")
	fmt.Println(flag)
	if flag{
		return mvc.Response{
			Object: map[string]interface{}{
				"status":true,
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":false,
			},
		}
	}
}
/*
*path:/admin/add
*添加新数据
 */
func (a *AdminController)AddAdmin (ctx iris.Context) mvc.Result{
	data := &models.Admin{}
	//将传入的json数据放入data中
	err := ctx.ReadForm(data)
	if err != nil {
		panic(err.Error())
	}
	flag := service.AddAdmin(data)
	if flag == false {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : false,
				"success": "添加失败",
				"message":"名称重复，请重试！",
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : true,
				"success": "添加成功",
			},
		}
	}
}

/*
* path:/admin/index
* 查询所有
 */
func (a *AdminController)QueryAll(ctx iris.Context)  mvc.Result{
	//	获取路径中的信息
	w := ctx.Request()
	//	获取url的路径信息
	vars := w.URL.Query()
	start := vars["start"][0]
	limit := vars["limit"][0]
	//判断是否有sort
	sortFlag := vars["sort"]
	//是否排序
	flagSort := false
	sortName := ""
	sortMethod := ""
	if sortFlag==nil{
		flagSort = false
		sortName = ""
		sortMethod = ""
	}else {
		//得到一个排序的json数据
		sort := vars["sort"][0]
		flagSort = true
		//创建获取排序时的json数据存放的结构体,注意需要切片
		var sorts []models.Sort
		//对json数据进行序列化
		err :=json.Unmarshal([]byte(sort),&sorts)
		if err != nil {
			fmt.Println("error:", err)
		}
		sortName = sorts[0].Property
		sortMethod = sorts[0].Direction
	}
	admins, total := service.QueryAll(start,limit,sortName,sortMethod,flagSort)
	//设置状态参数
	//fmt.Println(admins)
	ctx.StatusCode(iris.StatusOK)
	//将数据以json格式回传给前端
	return mvc.Response{
		//Name: "login.html",
		Object: map[string]interface{}{
			"status" : true,
			"admin": admins,
			"total": total,
		},
	}
}


/*
* path:/admin/login
* 用户登录
*/
func (a *AdminController)Login(ctx iris.Context) mvc.Result {
	//创建数据类型
	data := &models.LoginAdmin{}
	//获取表单数据******************************************************ReadForm*********
	err := ctx.ReadForm(data)
	if err != nil {
		panic(err.Error())
	}
	flag := service.Login(data)
	if flag == "null" {
		return mvc.Response{
			Object: map[string]interface{}{
				"success": false,
				"message":"用户名或者密码错误,请重新登录",
				"name":"null",
			},
		}
	}else {
		//生成jwt凭证
		token := jwt.NewTokenWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			// 根据需求，可以存一些必要的数据
			"userName": flag,
			"admin":    true,
			// 签发人
			"iss": "iris",
			// 签发时间
			"iat": time.Now().Unix(),
			// 设定过期时间，便于测试，设置1分钟过期
			"exp": time.Now().Add(10 * time.Minute * time.Duration(1)).Unix(),
		})

		// 使用设置的秘钥，签名生成jwt字符串
		tokenString, _ := token.SignedString([]byte("My Secret"))
		sess.Start(ctx).Set("ADMINNAME", data.Name)
		return mvc.Response{
			Object: map[string]interface{}{
				"success" : true,
				"message":"登录成功",
				"name":flag,
				"tokenString":tokenString,
			},
		}
	}
}
/*
*path：/admin/delete
*根据id删除数据
*/
func (a *AdminController)DelAdminById (ctx iris.Context) mvc.Result {
	//获取请求头
	w := ctx.Request()
	//获取请求头中的路径信息
	vars := w.URL.Query()
	//获取id值
	id := vars["id"][0]
	flag := service.DelAdminById(id)
	if(flag){
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : true,
				"message":"删除成功",
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : false,
				"message":"删除失败,请重试！",
			},
		}
	}
}
/*
* path:/admin/editAdmin
* 根据索引找要修改的数据
 */
func (a *AdminController) EditAdmin (ctx iris.Context) mvc.Result {
	data := &models.Admin{}
	//将传入的表单数据放入data中
	if err := ctx.ReadForm(data);err != nil{
		panic(err.Error())
	}
	flag := service.EditAdmin(data)
	if flag == false {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : false,
				"success": "修改失败",
				"message":"名称重复，请重试！",
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : true,
				"success": "修改成功",
			},
		}
	}
}
/*
* path:/admin/modifyAdmin
* 根据索引找要修改的数据
 */
func (a *AdminController) ModifyAdmin (ctx iris.Context) mvc.Result {
	data := &models.Admin{}
	//将传入的表单数据放入data中
	if err := ctx.ReadForm(data);err != nil{
		panic(err.Error())
	}
	flag := service.ModifyAdmin(data)
	if flag == false {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : false,
				"success": "修改失败",
				"message":"名称重复，请重试！",
			},
		}
	}else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status" : true,
				"success": "修改成功",
			},
		}
	}
}
/*
* path:/admin/modifyIndex
* 根据索引找要修改的数据
 */
func (a *AdminController) ModifyInfoById (ctx iris.Context) mvc.Result {
	//获取路径中的信息
	w := ctx.Request()
	//获取请求头中的路径信息
	vars := w.URL.Query()
	//获取id值
	id := vars["id"][0]
	//根据id找相应的数据
	admin := service.ModifyInfoById(id)
	return mvc.Response{
		Object: map[string]interface{}{
			"status":true,
			"admin":admin,
		},

	}
}
/*
* path:/admin/queryByName
* 根据名称进行模糊查询
*/
func (a *AdminController) QueryByName (ctx iris.Context) mvc.Result {
//	获取路径中的信息
	w := ctx.Request()
//	获取url的路径信息
	vars := w.URL.Query()
//	获取想要的值
	name := vars["name"][0]
	start := vars["start"][0]
	limit := vars["limit"][0]
	//判断是否有sort
	sortFlag := vars["sort"]
	//是否排序
	flagSort := false
	sortName := ""
	sortMethod := ""
	if sortFlag==nil{
		flagSort = false
		sortName = ""
		sortMethod = ""
	}else {
		//得到一个排序的json数据
		sort := vars["sort"][0]
		flagSort = true
		//创建获取排序时的json数据存放的结构体,注意需要切片
		var sorts []models.Sort
		//对json数据进行序列化
		err :=json.Unmarshal([]byte(sort),&sorts)
		if err != nil {
			fmt.Println("error:", err)
		}
		sortName = sorts[0].Property
		sortMethod = sorts[0].Direction
	}
	admins,total := service.QueryByName(name,start,limit,sortName,sortMethod,flagSort)
	if admins == nil {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":false,
			},
		}
	} else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":true,
				"admin":admins,
				"total":total,
			},
		}
	}
}
/*
* path:/admin/queryBySex
* 根据名称进行模糊查询
 */
func (a *AdminController) QueryBySex (ctx iris.Context) mvc.Result {
	//	获取路径中的信息
	w := ctx.Request()
	//	获取url的路径信息
	vars := w.URL.Query()
	//	获取想要的值
	sex := vars["sex"][0]
	start := vars["start"][0]
	limit := vars["limit"][0]
	//判断是否有sort
	sortFlag := vars["sort"]
	//是否排序
	flagSort := false
	sortName := ""
	sortMethod := ""
	if sortFlag==nil{
		flagSort = false
		sortName = ""
		sortMethod = ""
	}else {
		//得到一个排序的json数据
		sort := vars["sort"][0]
		flagSort = true
		//创建获取排序时的json数据存放的结构体,注意需要切片
		var sorts []models.Sort
		//对json数据进行序列化
		err :=json.Unmarshal([]byte(sort),&sorts)
		if err != nil {
			fmt.Println("error:", err)
		}
		sortName = sorts[0].Property
		sortMethod = sorts[0].Direction
	}
	admins,total := service.QueryBySex(sex,start,limit,sortName,sortMethod,flagSort)
	if admins == nil {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":false,
			},
		}
	} else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":true,
				"admin":admins,
				"total":total,
			},
		}
	}
}
/*
* path:/admin/queryByBirth
* 根据日期进行模糊查询
 */
func (a *AdminController)QueryByDate(ctx iris.Context) mvc.Result{
//	获取路径中的信息
	w := ctx.Request()
//	获取url的路径信息
	vars := w.URL.Query()
	date := vars["date"][0]
	//根据“and”对日期进行分割，返回一个字符串切片
	upDate := strings.Split(date,"and")[1]
	downDate := strings.Split(date,"and")[0]
	start := vars["start"][0]
	limit := vars["limit"][0]
	//判断是否有sort
	sortFlag := vars["sort"]
	//是否排序
	flagSort := false
	sortName := ""
	sortMethod := ""
	if sortFlag==nil{
		flagSort = false
		sortName = ""
		sortMethod = ""
	}else {
		//得到一个排序的json数据
		sort := vars["sort"][0]
		flagSort = true
		//创建获取排序时的json数据存放的结构体,注意需要切片
		var sorts []models.Sort
		//对json数据进行序列化
		err :=json.Unmarshal([]byte(sort),&sorts)
		if err != nil {
			fmt.Println("error:", err)
		}
		sortName = sorts[0].Property
		sortMethod = sorts[0].Direction
	}
	admins,total := service.QueryByBirth(upDate,downDate,start,limit,sortName,sortMethod,flagSort)
	if admins == nil {
		return mvc.Response{
		Object: map[string]interface{}{
		"status":false},
		}
	} else {
		return mvc.Response{
			Object: map[string]interface{}{
				"status":true,
				"admin":admins,
				"total":total,
			},
		}
	}
}