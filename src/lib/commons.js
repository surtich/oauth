
module.exports.express	= require('express');    	// basic framework
module.exports.async 	= require('async');    		// asynchronous management
module.exports.mongodb	= require("mongodb");    	// document data store
module.exports.fs		= require('fs');          	// file system
module.exports.mongoose = require('mongoose'); //mongoose
module.exports.http = require('http'); //http
module.exports.util = require('util'); //util
module.exports.passport		= require('passport');		// passport
module.exports.GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy
module.exports.validator = require('validator'); //validator

module.exports.RedisStore = require('connect-redis')(module.exports.express); //redis session storage
module.exports.request	= require('request');    	// nodejs request
module.exports.q 		= require('q');      		// defered & promises management
module.exports.rabbit	= require("rabbit.js");  	// mq
module.exports.redis	= require("redis");      	// key-value data store
module.exports.assert	= require("assert");     	// unit test
module.exports.extend	= require('xtend');			// merge object properties
module.exports.hero		= require('./hero.js');		// hero library
module.exports.io		= require('socket.io');		// socket.io library