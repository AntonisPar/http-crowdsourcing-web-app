var path = require('path');
module.exports.checkAccess = function checkAccess(app,connection){
        
    app.get('/mainAdmin.html', function(request, response, next){

            var cookie = request.headers.cookie
    
        if(cookie===undefined){
            response.status(403).redirect('login.html')
            return;
        }
        cookie = JSON.parse(cookie);
        if(cookie===null || cookie==='null' || cookie.username===null || cookie.username==='null')
            response.status(403).redirect('login.html')
            
        var username = cookie.username
    
        connection.query('SELECT username, isAdmin FROM User WHERE username=?',[username], function(err,result,fields){
            if(err){
                response.status(403).redirect('login.html')
            }
            else{                    
               if(result.length > 0){
                    if(result[0].isAdmin !== 1 && result[0].isAdmin === 0){
                        response.sendFile(path.resolve('limited_access_html_files/har.html'));
                    }
                    else{
                        response.setHeader('Content-Type', 'text/html');
                        response.sendFile(path.resolve('limited_access_html_files/mainAdmin.html'));
                    }
                }
                else{
                    response.status(403).redirect('login.html')
                }
            }
        })
    })

    app.get('/giveAdmin.html', function(request, response, next){

        var cookie = request.headers.cookie
    
        if(cookie===undefined){
            response.status(403).redirect('login.html')
            return
        }
        cookie = JSON.parse(cookie);
        if(cookie===null || cookie==='null' || cookie.username===null || cookie.username==='null')
            response.status(403).redirect('login.html')
            
        var username = cookie.username
    
        connection.query('SELECT username, isAdmin FROM User WHERE username=?',[username], function(err,result,fields){
            if(err){
                response.status(403).redirect('login.html')
            }
            else{                    
               if(result.length > 0){
                    if(result[0].isAdmin !== 1 && result[0].isAdmin === 0){
                        response.sendFile(path.resolve('limited_access_html_files/har.html'));
                    }
                    else{
                        response.setHeader('Content-Type', 'text/html');
                        response.sendFile(path.resolve('limited_access_html_files/giveAdmin.html'));
                    }
                }
                else{
                    response.status(403).redirect('login.html')
                }
            }
        })
    })

    

    app.get('/har.html', function(request, response){
        var cookie = request.headers.cookie
    
        if(cookie===undefined){
            response.status(403).redirect('login.html')
            return;
        }
        cookie = JSON.parse(cookie);
        if(cookie===null || cookie==='null' || cookie.username===null || cookie.username==='null')
            response.status(403).redirect('login.html')
            
        var username = cookie.username
    
        connection.query('SELECT username, isAdmin FROM User WHERE username=?',[username], function(err,result,fields){
            if(err){
                response.status(403).redirect('login.html')
            }
            else{                    
               if(result.length > 0){
                    if(result[0].isAdmin !== 0 && result[0].isAdmin === 1){
                        response.sendFile(path.resolve('limited_access_html_files/mainAdmin.html'));
                    }
                    else{
                        response.setHeader('Content-Type', 'text/html');
                        response.sendFile(path.resolve('limited_access_html_files/har.html'));
                    }
                }
                else{
                    response.status(403).redirect('login.html')
                }
            }
        })

    })

    app.get('/heatmap.html', function(request, response){
        var cookie = request.headers.cookie
    
        if(cookie===undefined){
            response.status(403).redirect('login.html')
            return
        }
        cookie = JSON.parse(cookie);
        if(cookie===null || cookie==='null' || cookie.username===null || cookie.username==='null')
            response.status(403).redirect('login.html')
            
        var username = cookie.username
    
        connection.query('SELECT username, isAdmin FROM User WHERE username=?',[username], function(err,result,fields){
            if(err){
                response.status(403).redirect('login.html')
            }
            else{                    
               if(result.length > 0){
                    if(result[0].isAdmin !== 0 && result[0].isAdmin === 1){
                        response.sendFile(path.resolve('limited_access_html_files/mainAdmin.html'));
                    }
                    else{
                        response.setHeader('Content-Type', 'text/html');
                        response.sendFile(path.resolve('limited_access_html_files/heatmap.html'));
                    }
                }
                else{
                    response.status(403).redirect('login.html')
                }
            }
        })
    })

    app.get('/profileSettings.html', function(request, response){
        var cookie = request.headers.cookie
    
        if(cookie===undefined){
            response.status(403).redirect('login.html')
            return;
        }
        cookie = JSON.parse(cookie);
        if(cookie===null || cookie==='null' || cookie.username===null || cookie.username==='null')
            response.status(403).redirect('login.html')
            
        var username = cookie.username
    
        connection.query('SELECT username, isAdmin FROM User WHERE username=?',[username], function(err,result,fields){
            if(err){
                response.status(403).redirect('login.html')
            }
            else{                    
               if(result.length > 0){
                    if(result[0].isAdmin !== 0 && result[0].isAdmin === 1){
                        response.sendFile(path.resolve('limited_access_html_files/mainAdmin.html'));
                    }
                    else{
                        response.setHeader('Content-Type', 'text/html');
                        response.sendFile(path.resolve('limited_access_html_files/profileSettings.html'));
                    }
                }
                else{
                    response.status(403).redirect('login.html')
                }
            }
        })
    })
}

// document.cookie = JSON.stringify({'username':''})
