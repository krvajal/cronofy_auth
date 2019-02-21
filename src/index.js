const express = require("express");
const passport = require("passport");
const CronofyStrategy = require("./cronofy_strategy");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "hello world"
  });
});

const CRONOFY_CLIENT_ID = "OyP6Hhvuln_V3qnUsOU4axc3uIpBVXip";
const CRONOFY_CLIENT_SECRET =
  "XpgtJB5LAx_3YTNC9zVe504sGEC4m8DbuRlAvbS5TSYyjEH4K_qRKO-2DXqL07sKtEecSw4JgTMjAZMzRwhRgQ";

passport.use(
  new CronofyStrategy(
    {
      clientID: CRONOFY_CLIENT_ID,
      clientSecret: CRONOFY_CLIENT_SECRET,
      callbackURL: "https://k14p6p845v.sse.codesandbox.io/auth/cronofy/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log({ accessToken });
      done(null, {
        accessToken,
        refreshToken,
        profile
      });
    }
  )
);

app.get(
  "/auth/cronofy",
  passport.authorize("cronofy", { session: false, scope: ["read_events"] })
);

app.get(
  "/auth/cronofy/callback",
  passport.authorize("cronofy", {
    failureRedirect: "/auth/cronofy/failure",
    session: false
  }),
  (req, res) => {
    res.json({ ok: true, user: req.account });
  }
);

app.get("/auth/cronofy/success", (req, res) => {
  res.json({
    user: req.user
  });
});

app.get("/auth/cronofy/failure", (req, res) => {
  res.json({ failed: true });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
