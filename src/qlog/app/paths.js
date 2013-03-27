exports.paths = [
	{
		"method" : "POST",
		"path": "/api/user",
		"handler": require("./path/post_user")
	},
 {
		"method" : "GET",
		"path": "/api/user",
		"handler": require("./path/get_user")
	},
 {
		"method" : "POST",
   "path": "/qlog/app/add/:appName",
		"handler": [require("./path/appAdd")]
	},
 {
		"method" : "GET",
   "path": "/qlog/app",
		"handler": [require("./path/appGetAll")]
	},
 {
		"method" : "GET",
   "path": "/qlog/app/id/:app_id",
		"handler": [require("./path/appById")]
	},
 {
		"method" : "GET",
   "path": "/qlog/app/name/:app_name",
		"handler": [require("./path/appByName")]
	},
 {
		"method" : "DELETE",
   "path": "/qlog/app/remove/:app_id",
		"handler": [require("./path/appDel")]
	},
 {
		"method" : "PUT",
   "path": "/qlog/app/config",
		"handler": [require("./path/appConfig")]
	},
 {
		"method" : "GET",
   "path": "/oauth2callback",
		"handler": [require("./path/authGetCode"), require("./path/authGetToken")]
	},
 {
		"method" : "GET",
   "path": "/oauth2login",
		"handler": [require("./path/authLogin")]
	}
]