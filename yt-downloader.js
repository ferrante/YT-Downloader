(function() {
    var http = require('http');
    var url = require('url');
    var fs = require('fs')
    var request = require('request');
    
    var ytURL = process.argv[2];
    var parsedURL = url.parse(ytURL);


    request({uri: parsedURL.href}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var reg = /;fmt_url_map=(.*?)%7C(.*?)%2C/g;
            var result = reg.exec(body);
            
            if (result && result.length > 2) {
                var videoTitle = /name="title" content="(.*?)">/.exec(body)[1].replace(/\s+/g, "_");
                var videoURL = decodeURIComponent(result[2]);
                
                request({uri : videoURL, headers: { 'set-cookie': response.headers['set-cookie'] },
                'encoding': 'binary' }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var ext;
                        
                        switch (response.headers['content-type']) {
                            case: 'movie/mp4':
                                ext = "mp4";
                                break;
                            case: 'movie/3gpp':
                                ext = '3gp';
                                break;
                            default:
                                ext = 'flv';
                        }
                        
                        fs.writeFile(videoTitle+"."+ext, body, "binary", function(err) {
                            if (!err) {
                                console.log("video downloaded");
                            } else {
                                console.log("error while downloading the video");
                            }
                        });
                    }
                });
            }
        }
    });
})();