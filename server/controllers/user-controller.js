const express = require("express");
const userLogic = require("../business-logic/user-logic");
const User = require("../models/user");
const {
  userSignupValidator,
  userSigninValidator,
  userUpdateValidator,
} = require("../validators/user");
const { validateUserToken } = require("../middleware/check-auth");
const { runValidation } = require("../validators");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

router.post(
  "/register",
  userSignupValidator,
  runValidation,
  async (req, res) => {
    try {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        identityNumber: req.body.identityNumber,
        city: req.body.city,
        street: req.body.street,
      };
      const response = await userLogic.signUpNewUser(user);
      if (response.error) {
        return res.status(400).json({ error: "Email already Exists" });
      }
      if (response.user) {
        const payload = {
          user: {
            role: response.user.role,
            _id: response.user._id,
          },
        };

        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: "3d" },
          (err, token) => {
            if (err) {
              throw new Error(err);
            }
            res.json({ token });
          }
        );
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "registration failed,please try again" });
    }
  }
);
router.post("/login", userSigninValidator, runValidation, async (req, res) => {
  try {
    const credentials = { password: req.body.password, email: req.body.email };
    const response = await userLogic.loginUser(credentials);
    if (response.error) {
      return res.status(400).json({ error: response.error });
    }
    if (response.user) {
      const payload = {
        user: {
          role: response.user.role,
          _id: response.user.userId,
        },
      };

      jwt.sign(payload, config.jwtSecret, { expiresIn: "3d" }, (err, token) => {
        if (err) {
          throw new Error(err);
        }
        res.json({ token });
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "login failed, please try again" });
  }
});
router.get("/", validateUserToken, async (req, res) => {
  try {
    const user = await userLogic.getAuthUser(req.user._id);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "failed to get user" });
  }
});
router.get("/checkId/:id", async (req, res) => {
  try {
    const idExists = await userLogic.checkIfIdNumberExists(req.params.id);
    res.json(idExists);
  } catch (error) {
    return res.status(500).json({ error: "failed to get user" });
  } 
});

const client = new OAuth2Client(config.googleClientID);
router.post("/google", (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: config.googleClientID })
    .then((response) => {
      const {
        email_verified,
        given_name,
        family_name,
        email,
        picture,
      } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const { _id, role } = user;
            const payload = {
              user: {
                role,
                _id,
              },
            };

            jwt.sign(
              payload,
              config.jwtSecret,
              { expiresIn: "3d" },
              (err, token) => {
                if (err) {
                  throw new Error(err);
                }
                res.json({ token });
              }
            );
          } else {
            user = new User({
              firstName: given_name,
              lastName: family_name,
              email,
            });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const payload = {
                user: {
                  role: user.role,
                  _id: user._id,
                },
              };

              jwt.sign(
                payload,
                config.jwtSecret,
                { expiresIn: "3d" },
                (err, token) => {
                  if (err) {
                    throw new Error(err);
                  }
                  res.json({ token });
                }
              );
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
});

router.post("/facebook", (req, res) => {
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { id, email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const { _id, role } = user;
          const payload = {
            user: {
              role,
              _id,
            },
          };
          jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: "3d" },
            (err, token) => {
              if (err) {
                throw new Error(err);
              }
              res.json({ token });
            }
          );
        } else {
          user = new User({
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
            email,
          });
          user.save((err, data) => {
            if (err) {
              console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
              return res.status(400).json({
                error: "User signup failed with google",
              });
            }
            const payload = {
              user: {
                role: user.role,
                _id: user._id,
              },
            };

            jwt.sign(
              payload,
              config.jwtSecret,
              { expiresIn: "3d" },
              (err, token) => {
                if (err) {
                  throw new Error(err);
                }
                res.json({ token });
              }
            );
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        error: "Facebook login failed. Try later",
      });
    });
});

router.patch(
  "/update-social-user",
  validateUserToken,
  userUpdateValidator,
  runValidation,
  async (req, res) => {
    try {
      const user = {
        _id: req.user._id,
        identityNumber: req.body.identityNumber,
        city: req.body.city,
        street: req.body.street,
      };
      const response = await userLogic.updateSocialUser(user);
      if (response.error) {
        return res.status(400).json({ error: response.error });
      }
      if (response.message) {
        res.json({ msg: response.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "registration failed,please try again" });
    }
  }
);

module.exports = router;
