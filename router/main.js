module.exports = function(app, fs)
{
    // 인덱스페이지.
    app.get('/', function(req, res){
        var sess = req.session;
        
        res.render('index', {
            title:"My Homepage",
            length:5,
            name: sess.name,
            username: sess.username
        }); 
    });
    
    // 유저리스트.
    app.get('/list', function(req, res){
       fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
           res.end(data);
       });
    });
    
    // 유저정보 가져오기.
    app.get('/getUser/:username', function(req, res){
       fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
           var users = JSON.parse(data);
           res.json(users[req.params.username]);
       });
    });
    
    // 유저추가.
    app.post('/addUser/:username', function(req, res){
       var result = { };
       var username = req.params.username;
       
       // 유저정보를 구성하는 패스워드, 이름의 값이 정상적이지않음.
       if(!req.body["password"] || !req.body["name"])
       {
           result["success"] = 0;
           result["error"] = "invalid request";
           res.json(result);
           return;
       }
       
       fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
           var users = JSON.parse(data);
           if(users[username])
           {
               result['success'] = 0;
               result['error'] = "duplicate";
               res.json(result);
               return;
           }
           users[username] = req.body;
           fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), "utf8", function(err, data){
               result = {"success":1};
               res.json(result);
           });
       });
    });
    
    // 유저정보 업데이트.
    app.put('/updateUser/:username', function(req, res){
        var result = {};
        var username = req.params.username;
        
        // 유저정보를 구성하는 패스워드, 이름의 값이 정상적이지않음.
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }
        
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
            var users = JSON.parse(data);
            users[username] = req.body;
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function(err, data){
                result = {"success":1};
                res.json(result);
            });
        });
    });
    
    // 유저삭제.
    app.delete('/deleteUser/:username', function(req, res){
        var result = {};
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
            var users = JSON.parse(data);
            
            // 삭제할 유저가 없음.
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
            
            delete users[req.params.username];
            
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            });
        });
    });
    
    // 로그인.
    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;
        
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            
            if(!users[username]) // 해당유저없음.
            {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
            
            if(users[username]["password"] == password)
            {
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            }
            else
            {
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        });
    });
    
    // 로그아웃.
    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username)
        {
            req.session.destroy(function(err){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.redirect('/');
                }
            });
        }
        else
        {
            res.redirect('/');
        }
    });
    
}