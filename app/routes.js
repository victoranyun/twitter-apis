const axios = require('axios').default;
const getBearer = require('../getBearer.js');
const CircularJSON = require('circular-json');

module.exports = function(app, passport) {
	app.get('/', (req, res) => {
		res.render("home", {
			user: req.user,
		})
	})

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
		function(req, res) {
			res.render("data", {
				user: req.user,
			})
		});

	app.get('/logout', function(req, res) {
		req.session.destroy(function (err) {
			res.redirect('/');
		});
	});

	app.get('/twitter/user/:username', async (req, res) => {
		var username = req.params.username;
		const config = {
			headers: {
				Authorization: `Bearer ${await getBearer.getBearer()}`
			},
			params: {
				screen_name: username
			}
		};

		axios.get("https://api.twitter.com/1.1/users/lookup.json", config)
		.then(response => {
			let json = CircularJSON.stringify(response.data);
			res.send(json);
		})
		.catch(error => {
			console.log('Error');
			res.status(500).send(error.response.data);
		});
	});

	app.get('/twitter/tweets/:username', async (req, res) => {
		var username = req.params.username;
		const config = {
			headers: {
				Authorization: `Bearer ${await getBearer.getBearer()}`
			},
			params: {
				count: 10,
				result_type: "recent",
				include_rts: true,
				tweet_mode: "extended",
				screen_name: username
			}
		};

		axios.get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
		.then(response => {
			let json = CircularJSON.stringify(response.data);
			res.send(json);
		})
		.catch(error => {
			console.log('Error');
			res.status(401).send(error.response.data);
			res.status(500).send(error.response.data);
		});
	});

	app.get('/twitter/topics/:name', async(req, res) => {
		var topicName = req.params.name;
		const config = {
			headers: {
				Authorization: `Bearer ${await getBearer.getBearer()}`
			},
			params: {
				count: 10,
				result_type: "recent",
				tweet_mode: "extended",
				q: topicName
			}
		};
	
		axios.get("https://api.twitter.com/1.1/search/tweets.json", config)
		.then(response => {
			let json = CircularJSON.stringify(response.data);
			res.send(json);
		})
		.catch(error => {
			console.log('Error');
			res.status(401).send(error.response.data);
			res.status(500).send(error.response.data);
			res.status(304).send(error.response.data);
		});
	});

	app.get('/twitter/engagement/:tweetid', async(req, res) => {
		var tweetID = req.params.tweetid;
		const config = {
			headers: {
				Authorization: `Bearer ${await getBearer.getBearer()}`
			},
			params: {
				tweet_ids: ['1254527382490316800'],
				engagement_types: ['favorites', 'retweets', 'replies', 'video_views'],
				groupings: {
                    perTweetMetricsUnowned: {
                        group_by: [
                            "tweet.id",
                            "engagement.type"
                        ]
                    }
                }
			}
		};

		axios.post("https://data-api.twitter.com/insights/engagement/totals", config)
		.then(response => {
			let json = CircularJSON.stringify(response.data);
			res.send(json);
		})
		.catch(error => {
			console.log(error.response.data);
			res.status(401).send(error.response.data);
		});
	})
};

function isLoggedIn(req, res, next) {
 	if (req.isAuthenticated())
   		return next();

	res.redirect('/');
}
