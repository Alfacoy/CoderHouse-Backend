export const middlewareAuth = (req, res, next) => {
    const { role } = req.session.user || req.user.payload;
    if (role != 'admin') {
        res.status(403).send({ error: -2, descripcion: `No tiene permisos en la ruta '${req.baseUrl}' con el método [${req.method}].` })
    } else {
        next();
    }
}


