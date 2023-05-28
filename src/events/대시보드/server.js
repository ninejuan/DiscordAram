const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const config = require('../../setting/config')
const logger = require('log4js').getLogger(`${config.logname} Dashboard`);
const setting = require('../../../setting')
let mode;
if (setting.setup.mode == true) {
    mode = {
        URL: setting.dashboard.domain.main
    }
} else if (setting.setup.mode == false) {
    mode = {
        URL: setting.dashboard.domain.test
    }
}

module.exports.load = async (client) => {
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.engine('html', ejs.renderFile);
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '/views'));
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(session({
		secret: 'BotDashboardExample101',
		resave: false,
		saveUninitialized: false,
	}));

	app.use(async function(req, res, next) {
		req.client = client;
		next();
	});

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});
	passport.use(new Strategy({
		clientID: config.bot.clientId,
		clientSecret: config.dashboard.CLIENT_SECRET,
		callbackURL: config.dashboard.CALLBACK_URL,
		scope: [ 'identify', 'guilds', 'guilds.join' ],
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}));
	// Google Authorization
	passport.use(new GoogleStrategy({
		clientID: setting.Auth.Google.ClientId,
		clientSecret: setting.Auth.Google.ClientSecret,
		callbackURL: setting.Auth.Google.RedirectUrl,
		scope: [ 'email' ]
	}, function(accessToken, refreshToken, profile, cb) {
		process.nextTick(async function() {
		  return cb(null, profile);
		})
	}));
	
	// Kakao Authorization
	passport.use(new KakaoStrategy({
		clientID : setting.Auth.Kakao.RestKey,
		clientSecret: setting.Auth.Kakao.ClientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
		callbackURL : setting.Auth.Kakao.RedirectUrl,
	}, function (accessToken, refreshToken, profile, done) {
		process.nextTick(async function() {
			return done(null, profile)
		})
	}))

	app.use('/', require('./routes/index'));
	app.use('/dashboard', require('./routes/dashboard'));
	// app.use('/auth', require('./routes/auth'));

	app.get('*', (req, res) => {
		res.render('../views/404', {
			bot: req.client,
			user: req.user,
		});
	});

	app.listen(config.dashboard.PORT, () => {
		logger.info(`✅ | 대시보드 정상 로드 : ${mode.URL}:${config.dashboard.PORT}`);
	});
};