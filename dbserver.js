var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";



(function() {
	var fs, http, qs, server, url;
	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');
	
	var loginStatus = false, loginUser = "";
	
	server = http.createServer(function(req, res) {
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		console.log(req.url);
		
		
		
	
		

		
		
		
		if (action === "/signup") {
			console.log("=================================================");
			console.log("[Register page]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("[Form Data] = "+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						user.id = "0";
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						var searchDB = "Name : " + splitName[1];
						var searchPW = "Password : " + splitPassword[1];
						
						console.log("[Stringify] mess= "+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("[Search = " + searchDB + " / " + searchPW + "]");
						
						
						
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							var myobj = stringMsg;
							dbo.collection("user").count({"Name" : splitName[1]}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									dbo.collection("user").find({"Name" : splitName[1]}).toArray(function(err,result){
									if(err) throw err;
									console.log(result);
									console.log("[User exist]");
									db.close();
									});
									return res.end("fail");
								}
								else
								{
									dbo.collection("user").insertOne(myobj, function(err, res) {
										if (err) throw err;
										console.log("1 document inserted");
										
										db.close();
										//return res.end(msg);
									});
									return res.end(msg);
								}
							});
						});
					});
				});
				
			} 
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "signup.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/login"){
			console.log("=================================================");
			console.log("[Login page]");
			if (req.method === "POST") {
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						user.id = "0";
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						var searchDB = "Name : " + splitName[1];
						var searchPW = "Password : " + splitPassword[1];
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search = " + searchDB);
						console.log("search = " + searchPW);
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
							dbo.collection("user").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									console.log("Login Successful");
									//var dbfind = dbo.collection("user").find({"Name":"babichoi95"});
									//console.log(dbfind);
									db.close();
									return res.end(msg);
									loginStatus = true;

								}
								else
								{
									if(err) throw err;
									console.log("Login Fail : username and password wrong");
									db.close();
									return res.end("fail");
								}
							});
						});
					});
				});
				
			} 
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "signin.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/search"){
			console.log("=================================================");
			console.log("[Search Recipes]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						var searchDB = "Title : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									dbo.collection("recipes").find({"Title" : {$regex: splitMsg[1]}}).toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Data Successful]");
											console.log(result);
											db.close();
											var array = [];
											
											
											for (var i=result.length-1; i>=0; i--)
											{
											
											
											array.push("</font><div class='col-lg-5 col-md-6'><div class='recipe'><a href='/recipesingle?ID="+result[i].ID+"'><img src='indeximg/recipes/"+result[i].Img+"'><div class='recipe-info-warp'><div class='recipe-info'><h3>"+result[i].Title+"</h3></div></div></a></div></div><font color='white'>");
	
											 
											
											
											}
											
											
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											
										}
																
								
								
							});
						});
					});
				});
				
			}
			
		}
		
		else if (action === "/recipes"){
			
			console.log("=================================================");
			console.log("[Recipes Page]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						var searchDB = "Name : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									dbo.collection("recipes").find().toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Data Successful]");
											console.log(result);
											db.close();
											var array = [];
											
											
											for (var i=0; i<result.length; i++)
											{
											
											
											array.push("</font><div class='col-lg-4 col-md-6'><div class='recipe'><img src='indeximg/recipes/"+result[i].Img+"'><div class='recipe-info-warp'><div class='recipe-info'><h3>"+result[i].Title+"</h3></div></div></div></div><font color='white'>");
	
											 
											
											
											}
											
											
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											
										}
																
								
								
							});
						});
					});
				});
				
			}
				
			
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "recipes.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/about"){
			console.log("=================================================");
			console.log("[About Page]");
			if (req.method === "POST") {
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						user.id = "0";
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						var searchDB = "Name : " + splitName[1];
						var searchPW = "Password : " + splitPassword[1];
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search = " + searchDB);
						console.log("search = " + searchPW);
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
							dbo.collection("user").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									console.log("Login Successful");
									//var dbfind = dbo.collection("user").find({"Name":"babichoi95"});
									//console.log(dbfind);
									db.close();
									return res.end(msg);
									loginStatus = true;

								}
								else
								{
									if(err) throw err;
									console.log("Login Fail : username and password wrong");
									db.close();
									return res.end("fail");
								}
							});
						});
					});
				});
				
			} 
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "about.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/contact"){
			console.log("=================================================");
			console.log("[Contact Page]");
			if (req.method === "POST") {
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						user.id = "0";
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						var searchDB = "Name : " + splitName[1];
						var searchPW = "Password : " + splitPassword[1];
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search = " + searchDB);
						console.log("search = " + searchPW);
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": msg.length
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
							dbo.collection("user").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									console.log("Login Successful");
									//var dbfind = dbo.collection("user").find({"Name":"babichoi95"});
									//console.log(dbfind);
									db.close();
									return res.end(msg);
									loginStatus = true;

								}
								else
								{
									if(err) throw err;
									console.log("Login Fail : username and password wrong");
									db.close();
									return res.end("fail");
								}
							});
						});
					});
				});
				
			} 
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "contact.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/indexreadrecipes"){
			console.log("=================================================");
			console.log("[IndexReadRecipes]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						var searchDB = "Name : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									dbo.collection("recipes").find().toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Data Successful]");
											console.log(result);
											db.close();
											var array = [];
											
											
											for (var i=result.length-1; i>=result.length-4; i--)
											{
											
											
											array.push("</font><div class='col-lg-5 col-md-6'><div class='recipe'><a href='/recipesingle?ID="+result[i].ID+"'><img src='indeximg/recipes/"+result[i].Img+"'><div class='recipe-info-warp'><div class='recipe-info'><h3>"+result[i].Title+"</h3></div></div></a></div></div><font color='white'>");
	
											 
											
											
											}
											
											
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											
										}
																
								
								
							});
						});
					});
				});
				
			}
		}
		
		else if (action === "/readRecipes"){
			console.log("=================================================");
			console.log("[readRecipes]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						var searchDB = "Name : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									dbo.collection("recipes").find().toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Data Successful]");
											console.log(result);
											db.close();
											var array = [];
											
											
											for (var i=result.length-1; i>=0; i--)
											{
											
											
											array.push("</font><div class='col-lg-5 col-md-6'><div class='recipe'><a href='/recipesingle?ID="+result[i].ID+"'><img src='indeximg/recipes/"+result[i].Img+"'><div class='recipe-info-warp'><div class='recipe-info'><h3>"+result[i].Title+"</h3></div></div></a></div></div><font color='white'>");
	
											 
											
											
											}
											
											
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											
										}
																
								
								
							});
						});
					});
				});
				
			}
		}
		
		else if (action === "/recipesingle"){
			console.log("=================================================");
			console.log("[Recipes Single Page]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						var searchDB = "ID : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									dbo.collection("recipes").find({"ID" : splitMsg[1]}).toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Data Successful]");
											console.log(result);
											db.close();
											var array = [];
											
											
											for (var i=0; i<result.length; i++)
											{
											
											
											array.push(result[i].ID);
											array.push(result[i].Title);
											array.push(result[i].Img);
											array.push(result[i].DescImg);
											
	
											 
											
											
											}
											
											
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											
										}
																
								
								
							});
						});
					});
				});
				
			}
				
			
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "recipe-single.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/likerecipes"){
			console.log("=================================================");
			console.log("[Add Favorite List]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitID = splitMsg[1];
						var tempSplitTitle = splitMsg[2];
						var tempSplitPrice = splitMsg[3];
						var splitName = tempSplitName.split("=");
						var splitID = tempSplitID.split("=");
						var splitTitle = tempSplitTitle.split("=");
						var splitPrice = tempSplitPrice.split("=");
						
						
						//var searchDB = "ID : " + splitMsg[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						//console.log(searchDB);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									var finalcount;
									dbo.collection("user-favoritelist").count({"Name" : splitName[1], "ID" : splitID[1]}, function(err, count){
								
								finalcount = count;
								if(finalcount > 0)
								{
									
									var myquery = {"Name" : splitName[1],"ID": splitID[1]};
									dbo.collection("user-favoritelist").deleteOne(myquery, function(err, obj) {
										if (err) throw err;
										console.log("[User Favoritelist inserted]");
										
										db.close();
										//return res.end(msg);
									});
									return res.end("fail");
									

								}
								else
								{
									dbo.collection("user-favoritelist").insertOne(myobj, function(err, res) {
										if (err) throw err;
										console.log("[User Favoritelist inserted]");
										
										db.close();
										//return res.end(msg);
									});
									return res.end(msg);
								}
							});
						});
					});
				});
				
			}
				
			
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "favoritelist.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
			
		}
		
		else if (action === "/readUserInfo"){
			console.log("=================================================");
			console.log("[Read User Info Function]");
			if (req.method === "POST") {
				
				console.log("~Action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("[Form Data] = "+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitID = splitMsg[1];
						var splitName = tempSplitName.split("=");
						var splitID = tempSplitID.split("=");
						var searchDB = "Name : " +  splitName[1] + " ID : " + splitID[1];
						
						
						console.log("[Stringify] mess= "+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("["+ searchDB + "]");
						
						
						
						res.writeHead(200, {
							"Content-Type": "application/json"
							
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							
							if (err) throw err;
							var dbo = db.db("database");
							var myobj = stringMsg;
							dbo.collection("user-favoritelist").count({"Name" : splitName[1],"ID": splitID[1]}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									db.close();
									return res.end(msg);
								}
								else
								{
									if(err) throw err;
									db.close();
									return res.end("fail");
								}
							});
							
						});
					});
				});
				
			}
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "recipe-single.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			} 
			
		}
		
		else if (action === "/favoritelist"){
			console.log("=================================================");
			console.log("[Favorite List Page]");
			if (req.method === "POST") {
				
				console.log("~Action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("[Form Data] = "+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						var tempSplitName = splitMsg[1];
						
						
						
						var searchDB = "Name : " +  splitMsg[1];;
						
						
						console.log("[Stringify] mess= "+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("["+ searchDB + "]");
						
						
						
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							
							if (err) throw err;
							var dbo = db.db("database");
							var myobj = stringMsg;
							dbo.collection("user-favoritelist").find({"Name" : splitMsg[1]}).toArray(function(err, result) 
									{
										if(err)
										{
											throw err;
											console.log("[Read Favorite List Data Fail]");
											
											
										}
										else
										{
											console.log("-------------------------------------");
											console.log("[Read Favorite List Data Success]");
											
											db.close();
											var array = [];
											
											console.log(result.length);
											if(result.length != 0)
											{

											for (var i=0; i<result.length; i++)
											
											{
											
											array.push("</div><center><table border='0' width='100%' height='20%'><tr><td width='20%'><a href='/recipesingle?ID="+result[i].ID+"'><img src='indeximg/recipes/"+result[i].Img+"' width='500' height='150'></a></td><td width='3%'></td><td width='70%'><h4>"+result[i].Title+"</h4></td><td width='7%'><a href='/removefavorite?Name="+result[i].Name+"&ID="+result[i].ID+"'><img src='indeximg/bin.png' ></a></td></tr></table></center><hr><div style='display:none'>");
											
											}
											console.log(array);
											
											//return res.end(array[0].toString());
											return res.end(array.toString());
											}
											else
											{
												return res.end(array.toString());
											}
											
										}
																
								
								
							});
						});
					});
				});
				
			} else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "favoritelist.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else if (action === "/removefavorite")
		{
			console.log("=================================================");
			console.log("[Remove Favorite ]");
			if (req.method === "POST") {
				
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						
						var splitName = splitMsg[0].split("=");
						var splitID = splitMsg[1].split("=");
						
						
						var searchDB = "Name : " + splitName[1];
						var searchID = "ID : "+ splitID[1];
						
						
						console.log("[Stringify]mess="+msg);
						//console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log(searchDB + searchID);
						//console.log(searchTitle);
						res.writeHead(200, {
							"Content-Type": "application/json"
							
						});
						MongoClient.connect(dbUrl, function(err, db) {
							
							if (err) throw err;
							var dbo = db.db("database");
							//console.log(dbo);
							var myobj = stringMsg;
									
									var finalcount;
									dbo.collection("user-favoritelist").count({"Name" : splitName[1],"ID" : splitID[1]}, function(err, count){
								
								finalcount = count;
								if(finalcount > 0)
								{
									
									var myquery = {"Name" : splitName[1],"ID":splitID[1]}
									dbo.collection("user-favoritelist").deleteOne(myquery, function(err, obj) {
										if (err) throw err;
										console.log("[User Favoritelist Deleted]");
										
										db.close();
										//return res.end(msg);
									});
									return res.end(msg);
									

								}
								else
								{	db.close();
									return res.end("fail");
								}
							});
						});
					});
				});
				
			}
				
			
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "removefavorite.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true) 
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		
		else 
		{
      //handle redirect
			if(req.url === "/index")
			{
				console.log("=================================================");
				console.log("[Index page]");
				
				if(loginStatus)
				{
					
					sendFileContent(res, "index.html", "text/html");
				}
				else
				{
					sendFileContent(res, "index.html", "text/html");
				}
			}
			else if (req.url === "/Signuppage")
			{
				
				sendFileContent(res, "signup2.html", "text/html");
			}
			else if (req.url === "/loginpage")
			{
				
				sendFileContent(res, "signin.html", "text/html");
			}
			else if (req.url === "/logout")
			{
				console.log("=================================================");
				console.log("[Logout page]");
				loginStatus = false;
				loginUser = "";
				sendFileContent(res, "logout.html", "text/html");
			}
			else if (req.url === "/list")
			{
				console.log("=================================================");
				console.log("[List page]");
				sendFileContent(res, "list.html", "text/html");
			}
			else if (req.url === "/protectdata")
			{
				sendFileContent(res, "text_protectdata.html", "text/html");
			}
			else if (req.url === "/socialnetwork")
			{
				sendFileContent(res, "text_socialnetwork.html", "text/html");
			}
			else if (req.url === "/favlistpage")
			{
				sendFileContent(res, "favouritelistpage.html", "text/html");
			}else if (req.url === "/abuse")
			{
				sendFileContent(res, "article4.html", "text/html");
			}else if (req.url === "/manage")
			{
				sendFileContent(res, "article3.html", "text/html");
			}else if (req.url === "/use")
			{
				sendFileContent(res, "article2.html", "text/html");
			}else if (req.url === "/food")
			{
				sendFileContent(res, "article1.html", "text/html");
			}
			else if(req.url === "/"){
				console.log("Requested URL is url" + req.url);
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				res.write('<b>testpage</b><br /><br />This is the default response.');
			}else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "image/jpg");
			}else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "image/png");
			}
			else{
				console.log("Requested URL is: " + req.url);
				res.end();
			}
		}
	});

	server.listen(1818);

	console.log("Server is running，time is" + new Date());


	function sendFileContent(response, fileName, contentType){
		fs.readFile(fileName, function(err, data){
			if(err){
				response.writeHead(404);
				response.write("Not Found!");
			}else{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
 }).call(this);