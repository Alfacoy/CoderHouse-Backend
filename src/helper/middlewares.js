export const middlewareAuth = (req, res, next) => {
    if (!req.auth) {
        res.status(403).send({ error: -2, descripcion: `No tiene permisos en la ruta '${req.baseUrl}' con el método [${req.method}].`})
    } else {
        next();
    }
}