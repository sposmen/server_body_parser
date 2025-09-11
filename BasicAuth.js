export const basicAuth = (req, res, next) => {

  const auth = {login: process.env.AUTH_LOGIN, password: process.env.AUTH_PASSWORD} // change this
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  res.status(401).send('Authentication required.') // custom message
};
