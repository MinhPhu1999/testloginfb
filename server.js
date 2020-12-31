// server.js

// set up ======================================================================
// Lấy tất cả các công cụ, thư viện chúng ta cần
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

mongoose.Promise = global.Promise;
const {mongoURL} = require('./app/config/database')
mongoose.connect(mongoURL,{ 		// kết nối tới db
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology:true,
    useCreateIndex: true}).catch(error => console.log(error.reason));


require('./app/config/passport')(passport); // pass passport for configuration

// cài đặt ứng dùng express
app.use(morgan('dev')); // log tất cả request ra console log
app.use(cookieParser()); // đọc cookie (cần cho xác thực)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // lấy thông tin từ html forms

app.set('view engine', 'ejs'); // cài đặt ejs là templating

// các cài đặt cần thiết cho passport
app.use(session({
    secret: 'sonminhphu', // chuỗi bí mật đã mã hóa coookie
    resave: true,
    saveUninitialized: true
}));
//app.use(session({secret: 'ilovescodetheworld'})); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/user.routes.js')(app, passport); // Load routes truyền vào app và passport đã config ở trên

// launch ======================================================================
app.listen(port, () => console.log("server running on port " + port));