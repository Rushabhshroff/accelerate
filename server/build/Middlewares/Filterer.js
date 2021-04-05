export default function RequestFilter(fields) {
    return function (req, res, next) {
        for (let field of fields) {
            delete req.body[field];
        }
        next();
    };
}
