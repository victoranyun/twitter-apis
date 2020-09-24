var express = require('express');
var passport = require('passport');
var port = process.env.PORT || 1337;
var exphbs = require('express-handlebars');

const session = require('express-session');

var app = express();
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'flatlay' 
}));

require('./configuration/passport')(passport);
var config = require('./configuration/config')

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

app.listen(port, () => {
	console.log("Server running on port 1337");
});
