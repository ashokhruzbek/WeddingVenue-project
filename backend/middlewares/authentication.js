const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.split(" ")[1];
		if(!token) {
			return res.status(403).json({message: "Token berilmadi"});
		}
	
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = {
			id: decoded.id,
			role: decoded.role
		};
		
		next();
	} catch (error) {
		res.status(400).json({message: error})
	}
}