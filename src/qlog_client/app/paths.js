exports.paths = [
 {
  "method" : "GET",
  "path": "/qlog/app/:app_name",
  "handler": [require("./path/getApp")]
 }
 ]