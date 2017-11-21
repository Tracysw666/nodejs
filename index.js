//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require("fs");
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '60.205.218.42',
    user     : 'root',
    password : '123456',
    database : 'ysw'
});

connection.connect();

//

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

/**获取化妆品详情**/
app.get('/getCosmeticsDetail', function (req, res) {
    console.log(req);
    var  cosmeticsDetailTable = 'SELECT * FROM cosmetics where id=1';

    connection.query(getCosmeticsDetail,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        res.json(result);
    });
});


var server = app.listen(8721, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})