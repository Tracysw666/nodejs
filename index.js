//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require("fs");
var mysql      = require('mysql');

var url = require("url");
var queryString  = require("querystring");

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//cookie
var cookie = require('cookie-parser');





var connection = mysql.createConnection({
    host     : '60.205.218.42',
    user     : 'root',
    password : '123456',
    database : 'ysw'
});

connection.connect();


//加双引号的方法  (员数组,需要加的键名)
function addQuotes(list,needaddQuotesList){
    for(li in list){
        for(var i = 0;i<needaddQuotesList.length;i++){
            if(li == needaddQuotesList[i]){
                list[li] = '"'+list[li]+'"';
            }
        }

    }
    return list;

}


/**登录**/
app.post('/login', function (req, res) {
    console.log(req.body);
    var loginList = req.body;
    if(!loginList.username||!loginList.password){
        return res.json({message:"请填写完整信息",code:-1});
    }else {
        loginList = addQuotes(loginList,['username']);
        var  login = 'SELECT * FROM user where username='+loginList.username;
        console.log(login);
        connection.query(login,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log(result[0]);

            //var result = result[0];
            var re = result[0];
            console.log("密码是2"+loginList.password);

            if(re.password == loginList.password) {
                //设置cookie
                res.cookie('login', new Date(Date.now() + 9000000), { expires: new Date(Date.now() + 900000000), httpOnly: false });
                delete result.password;
                res.json({code: 0,data:result[0], message: "登录成功"});
            }else {
                res.json({code: -1, message: "密码错误,请检查账户或密码是否填写正确"});

            }
        });

    }
});

/**注销**/
app.post('/logout', function (req, res) {
    console.log(req.body);
    res.clearCookie("login");
    res.json({code: 0, message: "注销成功"});
});



/**注册**/
app.post('/register', function (req, res) {
    console.log(req.body);
    var userList = req.body;

    var isReapt = false;

    if(!userList.username||!userList.email||!userList.password||!userList.phone||!userList.address||!userList.getGoodsName){
        return res.json({message:"请填写完整信息",code:-1});
    }else {

        //首先根据username查重
        var  repeat = 'SELECT * FROM user where username='+userList.username;
        connection.query(repeat,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log(result);
            if(result.length>0){
                console.log("的确是重复了");
                isReapt = true;
                return res.json({code:-1,message:"用户名已注册,请登录或更换其他用户名"});
            }
        });

         if(isReapt===true) return false;



       userList = addQuotes(userList,['username','email','password','address','getGoodsName'])



        var  register = 'insert into user(username,email,password,phone,address,getGoodsName) values'+"("+userList.username+","+userList.email+","+userList.password+","+userList.phone+","+userList.address+","+userList.getGoodsName+")";
    console.log(register)
        connection.query(register,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            res.json({code:0,message:"注册成功"});
        });

    }
});


/**获取化妆品列表**/
app.get('/getCosmeticsList', function (req, res) {
    //化妆品的table
    var  cosmeticsListTable = 'SELECT * FROM cosmetics';
    connection.query(cosmeticsTable,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        res.json(result);
    });
});

/**获取化妆品详情 根据id**/
app.get('/getCosmeticsDetail', function (req, res) {
    var proId = url.parse(req.url, true).query.proid;
    if(!proId){
        res.json({message:"请输入id"});

        return false;
    }
    var  cosmeticsDetailTable = 'SELECT * FROM cosmetics where proid='+proId;
    connection.query(cosmeticsDetailTable,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
    });
});

/**获取化妆品详情 根据名字**/
app.get('/searchCosmeticsDetail', function (req, res) {
    var proname = url.parse(req.url, true).query.proname;
    if(!proname){
        res.json({message:"请输入筛选内容"});
        return false;
    }
    var  searchCosmeticsDetailTable = 'SELECT * FROM [cosmetics] WHERE proname LIKE'+"'"+"%"+proname+"%"+"'";
    console.log(searchCosmeticsDetailTable);
    connection.query(searchCosmeticsDetailTable,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        res.json({code:0,data:result,message:"查询成功"});

    });
});


var server = app.listen(8721, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})