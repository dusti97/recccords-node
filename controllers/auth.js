module.exports = function(){

  var CONSUMER_KEY = 'BCvgSeawxoZCPYqThnPV';
  var CONSUMER_SECRET = 'FxEPTHDkhtqGoZGHhrQDojwgyPIEhLGm';
  var USER_AGENT = 'Recccords/0.1 +http://www.recccords.com';
  var CALLBACK_URL = process.env.OAUTH_CALLBACK || "http://10.0.0.15:3000/auth/callback";

  // oauth module  
  var oauth = require('oauth');
  var oauth_consumer = new oauth.OAuth(
    "http://api.discogs.com/oauth/request_token",
    "http://api.discogs.com/oauth/access_token",
    CONSUMER_KEY,
    CONSUMER_SECRET,
    "1.0",
    CALLBACK_URL,
    "HMAC-SHA1"
  );

  // libraries we need
  var util = require('util');
  var fs = require('fs');
  var path = require('path');
  var request = require('request');
  var _ = require('underscore');

  // connect to the app 
  var express = require('express');
  var app = express();

  // response codes
  var CODE_OK = 200; 
  var CODE_ACCEPTED = 202; 
  var CODE_RESET_CONTENT = 205; 

  // aws 
  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./aws.json');
  var s3 = new AWS.S3({params: {Bucket: 'recccords', ACL: 'public-read'}});; 

  app.get('/connect',function(req, res){
    oauth_consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
        res.send("Error getting OAuth request token : " + util.inspect(error), 500);
      } else {  

        req.session.oauth = {};
        req.session.oauth.token = oauthToken;
        req.session.oauth.tokenSecret = oauthTokenSecret;

        // util.puts(">> " + req.session.oauth.token);
        // util.puts(">> " + req.session.oauth.tokenSecret);

        res.redirect("http://www.discogs.com/oauth/authorize?oauth_token=" + req.session.oauth.token );      
      }
    });
  });

  app.get('/callback',function(req, res) {    

    // util.puts("<< " + req.session.oauth.token);
    // util.puts("<< " + req.session.oauth.tokenSecret);
    // util.puts("<< " + req.query.oauth_verifier);

    oauth_consumer.getOAuthAccessToken(req.session.oauth.token, req.session.oauth.tokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.send("Error getting OAuth access token : " + util.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+util.inspect(results)+"]", 500);
      } else {
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        console.log("token  is: " + req.session.oauthAccessToken );
        console.log("secret is: " + req.session.oauthAccessTokenSecret );
        // res.redirect('/');
        res.redirect('/phonogram')
      }
    });
  });

  app.get('/credentials',function(req, res) {
    res.send({ access_token: req.session.oauthAccessToken, access_secret: req.session.oauthAccessTokenSecret });
  });


  function discogs_request_options ( req, url ) {

    var options = {
      oauth: { 
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        token: req.session.oauthAccessToken, 
        token_secret: req.session.oauthAccessTokenSecret
      }, 
      url: url, 
      headers: {
        'User-Agent': USER_AGENT
      }
    };

    return options; 
  };

  app.get('/identity',function(req, res) {

    var options = discogs_request_options(req,'http://api.discogs.com/oauth/identity');

    request.get(options, function (e,r,body) {
      res.send(body);
    }); 

  });

  // save and verify auth info 
  app.post('/verify', function(req, res) {

    // save the needed information     
    req.session.userid = req.body.userid; 
    req.session.oauthAccessToken = req.body.discogsToken;
    req.session.oauthAccessTokenSecret = req.body.discogsSecret;

    // now create an identity query 
    console.log("auth verify testing " + util.inspect(req.session));

    var options = discogs_request_options(req,'http://api.discogs.com/oauth/identity');

    request.get(options, function (e,r,body) {

      var discogs_response = JSON.parse(body);

      console.log("auth verify got " + util.inspect(discogs_response));

      // if we have a username we got the data, else the token doesn't work 
      if ( discogs_response.username ) {
        res.send(true);
      } else {
        // clear the session if it didnt work
        req.session.oauthAccessToken = null;
        req.session.oauthAccessTokenSecret = null;

        res.send(false);
      }
    }); 
  });  

  // images stuff 
  // helper function 

  var localize_image = function ( req, image_url, callback ) {

    var file_name = path.basename(image_url);
    var file_path = 'public/images/' + file_name;
    var url_path  = '/images/' + file_name

    // the oauth request 
    var options = discogs_request_options(req,image_url);

    // check if we need to write it or if it already exists 
    fs.exists(file_path, function(exists) {

      if ( exists ) {
        callback(url_path);
      } else {
        var writeStream = fs.createWriteStream(file_path);
        request.get(options).pipe(writeStream);

        writeStream.on('finish',function(){
          // send back response of file's new location 
          callback(url_path);
        });
      }
    });
  };

  var localize_callback = function ( index, address ) {

    this.completeCount++; 
    this.results[index] = address; 

    // util.puts("localizeImageCallback: " + index + " -> " + address);
    // if ( this.requestsCount === this.completeCount ) {
    //   util.puts("localizeImageResults: Finished: " + util.inspect(this.results));
    // }

  };

  // helper data, keeps track of image_url to localized_url
  var _localizeResults = {};

  // routes 

  // save local images
  app.post('/localize_images',function(req, res) {

    var urls = req.body.image_urls;

    var image_results = {
      completeCount: 0, 
      requestsCount: urls.length, 
      results: [],
    };

    _.each(req.body.image_urls,function(url,index){

      localize_image(req,url,localize_callback.bind(image_results,index));

      // assign this to our database
      var key = req.body.image_urls.join(',')
      _localizeResults[key] = image_results; 

    });

    // send accepted, working on it 
    res.send({status:CODE_ACCEPTED});

  });

  // save local image 
  app.get('/localize_results',function(req, res) {

    var key = req.query.image_urls;

    var thisRequest = _localizeResults[key];

    // by default, accepted but no response  
    var response = { status:CODE_ACCEPTED };

    // process request 
    if ( ! thisRequest ) {
      response['status'] = CODE_RESET_CONTENT; 
    } else if ( thisRequest.completeCount === thisRequest.requestsCount ) {
      response['status'] = CODE_OK; 
      response['results'] = thisRequest.results; 

      // util.puts("before:" + util.inspect(_localizeResults));

      // no longer need this once we respond  
      delete _localizeResults[key]

      // util.puts("after:" + util.inspect(_localizeResults));
    } 

    res.send(response);

  });

  // for aws 
  var _awsResults = {};

  // save image to aws 
  app.post('/aws_image',function(req, res) {

    localize_image(req,req.body.image_url,function(local_url){

      var fileName = path.basename(local_url);
      var fileData = fs.readFileSync('public/'+ local_url);

      s3.putObject({
        Key: 'covers/'+ fileName,
        ContentType: 'image/jpg',
        Body: fileData
      }, function(err, resp) {
        if(err){
          util.puts("aws_image error saving image " + util.inspect(err));
          res.send('error');          
        } else { 
          res.send('https://s3.amazonaws.com/recccords/covers/' + fileName)
        }
      });


    });
  });

  return app; 

}(); 