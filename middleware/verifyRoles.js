const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);//this line checks if the request (req) has a 'roles' property.
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);//For each role, it checks if that role is included in the rolesArray. This operation creates a new array of boolean values, indicating whether each role matches an allowed role..find(val => val === true): It searches through the array of boolean values to find the first true value. If any role in the user's roles array matches an allowed role, it will find a true value.this code essentially checks if at least one of the user's roles matches one of the allowed roles for the route. If it finds a match, result will be true. If no match is found, result will be false
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles