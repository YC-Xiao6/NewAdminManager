package main

import (
	"adminManager/config"
	"adminManager/controller"
	"fmt"
	//"github.com/dgrijalva/jwt-go/request"
	//"github.com/iris-contrib/middleware/jwt"
	"github.com/dgrijalva/jwt-go"
	"github.com/kataras/iris"
	"github.com/kataras/iris/mvc"
)


func main() {
	app := iris.New()
	//解析json配置文件
	if err := config.InitConfig("config.json");err != nil{
		fmt.Printf(err.Error())
	}
	conf := config.ServConfig
	//服务器部署的地址与端口号
	addr := fmt.Sprintf("%s:%d",conf.Ip,conf.Port)
	staticPath := conf.StaticPath
	// 加载服务图标
	app.Favicon(staticPath+"/img/favicon.ico")
	//　从　"./views"　目录下加载扩展名是".html" 　的所有模板，
	//　并使用标准的　`html/template`　 包进行解析。
	app.RegisterView(iris.HTML(staticPath, ".html"))
	//配置资源文件的访问路径，一参：访问的路径，二参：文件的相对路径
	app.StaticWeb("/","static")
	//创建转发路由配置

	app.Post("/inits",ValidateJwtMiddleware,func(ctx iris.Context){

		ctx.JSON(iris.Map{"status":true,"username":username})
	})
	mvc.Configure(app.Party("/"), func(a *mvc.Application) {
		//创建首先访问的路径
		a.Party("/").Handle(new(controller.RouteController))
		a.Party("/admin").Handle(new(controller.AdminController))
	})

	app.Run(iris.Addr(addr))
}

var username interface{}
//中间件
func ValidateJwtMiddleware(ctx iris.Context)   {
	//获取传输过来的token
	tokenSrt:=ctx.FormValues()["token"][0]
	var token *jwt.Token
	var err error
	//解析token值,return的是签发的签名，根据派发token时的签名进行匹配！
	token,err = jwt.Parse(tokenSrt, func(*jwt.Token) (interface{}, error) {
		return []byte("My Secret"), nil
	})
	if(err != nil){
		fmt.Println(err)
	}else {
		//获取token中的参数
		username=token.Claims.(jwt.MapClaims)["userName"]
		//执行中间件下一个函数
		ctx.Next()
	}

}


