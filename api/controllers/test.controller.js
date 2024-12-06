import jwt from 'jsonwebtoken';

export const shouldBeLoggedIn = async (req, res) => {
   

      // If the token is valid, proceed to send the authorized response
      res.status(200).json({ message: "You are authenticated" });
  
  };

export const shouldBeAdmin = async (req,res) => {

    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ message: "You are not an admin" });
      }
  
      // If the token is valid, proceed to send the authorized response
      res.status(200).json({ message: "Authorized Admin", user });
    });
}