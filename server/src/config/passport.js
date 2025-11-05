import passport from "passport";    
import pkg from 'passport-google-oauth2';
const { Strategy: GoogleStrategy } = pkg;
import pkg2 from 'passport-facebook';
const { Strategy: FacebookStrategy } = pkg2;
import pkg3 from 'passport-github2';
const { Strategy: GitHubStrategy } = pkg3;

import User from '../models/userModel.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const BASE_URL = process.env.BASE_URL;

// Vérification des variables d'environnement
console.log('🔧 Configuration Passport:');
console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? '✅ defined' : '❌ undefined');
console.log('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? '✅ defined' : '❌ undefined');
console.log('Facebook App ID:', FACEBOOK_APP_ID ? '✅ defined' : '❌ undefined');
console.log('GitHub Client ID:', GITHUB_CLIENT_ID ? '✅ defined' : '❌ undefined');

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
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
    console.log("Configuring Google Strategy");
    passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/google/callback`,
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            // Rechercher l'utilisateur par provider et providerId
            let user = await User.findOne({ 
                provider: 'google', 
                providerId: profile.id 
            });    
            
            if (!user) {
                user = new User({
                    provider: 'google', // CHAMP REQUIS
                    providerId: profile.id, // CHAMP REQUIS
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value,
                });
                await user.save();
                console.log('✅ Nouvel utilisateur Google créé');
            } else {
                console.log('✅ Utilisateur Google existant');
            }
            done(null, user);
        } catch (error) {
            console.error('❌ Erreur Google:', error);
            done(error, null);
        }
    }));
} else {
    console.log("Google Strategy not configured due to missing credentials");
}

// Stratégie d'authentification avec Facebook
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
    passport.use('facebook', new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log('🔐 Profile Facebook reçu:', profile);
            
            // Rechercher l'utilisateur par provider et providerId
            let user = await User.findOne({ 
                provider: 'facebook', 
                providerId: profile.id 
            });    
            
            if (!user) {
                user = new User({
                    provider: 'facebook', // CHAMP REQUIS
                    providerId: profile.id, // CHAMP REQUIS
                    displayName: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
                    email: profile.emails?.[0]?.value,
                });
                await user.save();
                console.log('✅ Nouvel utilisateur Facebook créé');
            } else {
                console.log('✅ Utilisateur Facebook existant');
            }
            done(null, user);
        } catch (error) {
            console.error('❌ Erreur Facebook:', error);
            done(error, null);
        }
    }));
    console.log('✅ Stratégie Facebook configurée');
} else {
    console.warn('⚠️ Stratégie Facebook non configurée - variables manquantes');
}

// Stratégie d'authentification avec GitHub
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
    passport.use('github', new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/github/callback`,
        scope: ['user:email'],
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log('🔐 Profile GitHub reçu:', profile);
            
            // Rechercher l'utilisateur par provider et providerId
            let user = await User.findOne({ 
                provider: 'github', 
                providerId: profile.id 
            });    
            
            if (!user) {
                user = new User({
                    provider: 'github', // CHAMP REQUIS
                    providerId: profile.id, // CHAMP REQUIS
                    displayName: profile.displayName || profile.username,
                    email: profile.emails?.[0]?.value,
                });
                await user.save();
                console.log('✅ Nouvel utilisateur GitHub créé');
            } else {
                console.log('✅ Utilisateur GitHub existant');
            }
            done(null, user);
        } catch (error) {
            console.error('❌ Erreur GitHub:', error);
            done(error, null);
        }
    }));
    console.log('✅ Stratégie GitHub configurée');
} else {
    console.warn('⚠️ Stratégie GitHub non configurée - variables manquantes');
}

export default passport;