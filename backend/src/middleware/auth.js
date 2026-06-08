import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email },
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

function decodeFromHeader(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    return { id: payload.sub, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}



export function requireAuth(req, res, next) {
  const user = decodeFromHeader(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  req.user = user;
  next();
}
