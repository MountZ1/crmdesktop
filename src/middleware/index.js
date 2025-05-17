<<<<<<< HEAD
export const authMiddleware = async (req, res, next)=> {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

// Middleware function that takes a dynamic redirect target
export const onlyAdmin = (redirectTo) => {
    return async (req, res, next) => {
        // console.log(req.session.user);
        if (req.session.user.role !== 'Admin') {
            return res.redirect(redirectTo).json({ message: 'Unauthorized' });
=======
const authMiddleware = async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.locals.user = req.session.user;
    next();
};

// Middleware function that takes a dynamic redirect target
const onlyAdmin = (redirectTo) => {
    return async (req, res, next) => {
        if (req.session.user.role !== 'Admin') {
            return res.status(403).redirect(redirectTo).json({ message: 'Unauthorized' });
>>>>>>> 7e5e88e (web only)
        }
        next();
    };
};
<<<<<<< HEAD
=======

module.exports = {
    authMiddleware,
    onlyAdmin
};
>>>>>>> 7e5e88e (web only)
