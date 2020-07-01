package models

//type JsonTime time.Time
// 实现它的json序列化方法
//func (this JsonTime) MarshalJSON() ([]byte, error) {
//	var stamp = fmt.Sprintf("\"%s\"", time.Time(this).Format("2006-01-02"))
//	return []byte(stamp), nil
//}
//定义用户结构体
type Admin struct {
	Id int64 `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
	Passwd string `json:"passwd" db:"passwd"`
	Birthday string `json:"birthday" db:"birthday"`
	Sex string `json:"sex" db:"sex"`
	Phone string `json:"phone" db:"phone"`
	Email string `json:"email" db:"email"`
	Addr string `json:"addr" db:"addr"`
	Education string `json:"education" db:"education"`
	CreateTime string `json:"create_time" db:"create_time"`
	LastTime string `json:"last_time" db:"last_time"`
}
type LoginAdmin struct {
	Name string `json:"name"`
	Passwd string `json:"passwd"`
	Check string `json:"check"`
}