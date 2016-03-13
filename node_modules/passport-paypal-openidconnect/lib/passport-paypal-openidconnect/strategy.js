/**
 * Module dependencies.
 */
var util = require('util')
  , OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

var endpoints = {
	userInfoURL: "https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/userinfo",
	authorizationURL: "https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize",
	tokenURL: "https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/tokenservice"
};
var sandbox = {
	userInfoURL: "https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/userinfo",
	authorizationURL: "https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize",
	tokenURL: "https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/tokenservice"
};
/**
 * `Strategy` constructor.
 *
 * The PayPal authentication strategy authenticates requests by delegating to
 * PayPal using the OpenID Connect protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your application's App ID
 *   - `clientSecret`  your application's App Secret
 *   - `callbackURL`   URL to which PayPal will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new PayPalStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/paypal/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  // this.profileURL = options.profileURL || 'https://identity.x.com/xidentity/resources/profile/me';
  options = options || {};
  options.sandbox = (options.sandbox !== true) ? false : true;
  var urls = options.sandbox ? sandbox : endpoints;
  options.userInfoURL = options.userInfoURL || urls.userInfoURL;
  options.authorizationURL = options.authorizationURL || urls.authorizationURL;
  options.tokenURL = options.tokenURL || urls.tokenURL;

  OpenIDConnectStrategy.call(this, options, verify);
  this.name = 'paypal';
  
  // this._oauth2.setAccessTokenName("oauth_token");
}

/**
 * Inherit from `OpenIDConnectStrategy`.
 */
util.inherits(Strategy, OpenIDConnectStrategy);

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
