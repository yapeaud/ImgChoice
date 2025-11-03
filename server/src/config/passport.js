import passport from "passport";    
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import {FacebookStrategy} from 'passport-facebook';
import { githubStrategy } from 'passport-github2';

import User from '../models/User.js';

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

// Stratégies d'authentification de l'utilisateur avec Google
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
                email: profile.email
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));    

// Stratégies d'authentification de l'utilisateur avec GitHub
passport.use(new githubStrategy({
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
                displayName: profile.displayName,
                email: profile.email
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Stratégies d'authentification de l'utilisateur avec Facebook
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });    
        if (!user) {
            user = new User({
                facebookId: profile.id,
                displayName: profile.displayName,
                email: profile.email
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));