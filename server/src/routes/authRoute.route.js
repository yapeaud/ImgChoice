import express from "express";
import passport from "passport";

const authRouter = express.Router();

// Middleware pour vérifier l'authentification
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Non authentifié" });
};

//Route pour l'authentification via Google
authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

//Route pour la redirection après l'authentification via Google
authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL);
    }
);

//Route pour l'authentification via GitHub
authRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

//Route pour la redirection après l'authentification via GitHub
authRouter.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL);
    }
);

//Route pour l'authentification via Facebook
authRouter.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

//Route pour la redirection après l'authentification via Facebook
authRouter.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        res.redirect(process.env.CLIENT_URL);
    }
);

//Route pour obtenir l'utilisateur actuel
authRouter.get("/user", isAuthenticated, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            _id: req.user._id,
            displayName: req.user.displayName,
            email: req.user.email
        }
    });
});

//Route pour la déconnexion
authRouter.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la déconnexion" });
        }
        res.status(200).json({ message: "Déconnexion effectuée avec succès" });
    });
});

export default authRouter;