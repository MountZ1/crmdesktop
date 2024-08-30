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
        }
        next();
    };
};
