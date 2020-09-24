const axios = require('axios');
var conf = require('./configuration/config.js')
let bearerToken;

const getBearer = () => {
	if (bearerToken)
		return bearerToken;

	const config = {
		auth: {
			username: conf.consumer_key,
			password: conf.consumer_secret
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		}
	}

	const data = 'grant_type=client_credentials';
	return axios.post("https://api.twitter.com/oauth2/token", data, config)
	.then(response => {
		bearerToken = response.data.access_token;
		console.log(bearerToken);
		return response.data.access_token;
	})
}

module.exports = {
	getBearer
};