import passport from "passport";    
import pkg from 'passport-google-oauth2';
const { Strategy: GoogleStrategy } = pkg;

import pkg2 from 'passport-facebook';
const { Strategy: FacebookStrategy } = pkg2;

import pkg3 from 'passport-github2';
const { Strategy: GithubStrategy } = pkg3;

import User from '../models/userModel.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Stratégie d'authentification avec Google
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/google/callback`,
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });    
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    // photo: profile.photos?.[0]?.value
                });
                await user.save();
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
}

// Stratégie d'authentification avec GitHub
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
    passport.use(new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/github/callback`,
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });    
            if (!user) {
                user = new User({
                    githubId: profile.id,
                    displayName: profile.displayName || profile.username,
                    email: profile.emails?.[0]?.value,
                    // photo: profile.photos?.[0]?.value
                });
                await user.save();
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
}

// Stratégie d'authentification avec Facebook
if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name', 'displayName'],
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ facebookId: profile.id });    
            if (!user) {
                user = new User({
                    facebookId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    // photo: profile.photos?.[0]?.value
                });
                await user.save();
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
}

export default passport;