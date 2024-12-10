module.exports = (asyncFn) => {
    return (req, res, next) => {
        asyncFn(req, res, next).catch((err) => {
            next(err); // give the error to the middleware "next()" that is in the index.jx
        });
    }
}