const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) token = req.cookies['JWT-COOKIE'];
    return token
}

export {
    cookieExtractor
}