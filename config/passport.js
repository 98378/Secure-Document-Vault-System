const passport =
require('passport');

const GoogleStrategy =
require('passport-google-oauth20').Strategy;

const User =
require('../models/User');

// =====================================
// GOOGLE STRATEGY
// =====================================

passport.use(

    new GoogleStrategy(

        {

            clientID:
            process.env.GOOGLE_CLIENT_ID,

            clientSecret:
            process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
            '/api/auth/google/callback'

        },

        async (

            accessToken,

            refreshToken,

            profile,

            done

        ) => {

            try {

                let user =
                await User.findOne({

                    email:
                    profile.emails[0].value

                });

                // =====================================
                // CREATE USER IF NOT EXISTS
                // =====================================

                if (!user) {

                    user =
                    await User.create({

                        username:
                        profile.displayName,

                        email:
                        profile.emails[0].value,

                        password:
                        'googlelogin'

                    });
                }

                done(
                    null,
                    user
                );

            } catch (error) {

                done(
                    error,
                    null
                );
            }
        }

    )

);

// =====================================
// SERIALIZE
// =====================================

passport.serializeUser(

    (user, done) => {

        done(
            null,
            user.id
        );
    }

);

// =====================================
// DESERIALIZE
// =====================================

passport.deserializeUser(

    async (id, done) => {

        try {

            const user =
            await User.findById(id);

            done(
                null,
                user
            );

        } catch (error) {

            done(
                error,
                null
            );
        }
    }

);

module.exports =
passport;