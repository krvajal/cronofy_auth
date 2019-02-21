const OAuth2Strategy = require("passport-oauth2");
const util = require("util");
const uri = require("url");

function CronofyStrategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || "https://app.cronofy.com/oauth/authorize";

  options.tokenURL = options.tokenURL || "https://app.cronofy.com/oauth/token";

  OAuth2Strategy.call(this, options, verify);
  this.name = "cronofy";

  this._userProfileURL =
    options.userProfileURL || "https://api.cronofy.com/v1/profiles";
}

util.inherits(CronofyStrategy, OAuth2Strategy);

CronofyStrategy.prototype.authorizationParams = function(options) {
  var params = {};

  if (options.scope) {
    // specify the scope access
    // https://docs.cronofy.com/developers/api/authorization/request-authorization/#scope

    params.scope = options.scope.join(" ");
  }

  return params;
};

CronofyStrategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {
    var json;

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      return done(
        new OAuth2Strategy.InternalOAuthError(
          "Failed to fetch user profile",
          err
        )
      );
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error("Failed to parse user profile"));
    }

    var profile = {};
    // switch (self._userProfileFormat) {
    //   case "openid":
    //     profile = OpenIDProfile.parse(json);
    //     break;
    //   default:
    //     // Google Sign-In
    //     profile = GooglePlusProfile.parse(json);
    //     break;
    // }

    profile.provider = "cronofy";
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

module.exports = CronofyStrategy;
