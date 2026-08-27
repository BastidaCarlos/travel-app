
export const isAdmin = (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
       return next() 
    }

    if (!req.user) {
       return res.status(401).json({ error: 'User not found' }) 
    }

    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admin role required'})
        
    }
} 