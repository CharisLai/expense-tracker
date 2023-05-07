module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) { return next() }
        req.flash('warning_msg', 'Please Login first！')
        req.flash('fail_msg', 'All fields are required！')
        res.redirect('/user/login')
    }
}
