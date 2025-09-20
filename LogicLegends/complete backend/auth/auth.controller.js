const authService = require('./auth.service');

async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await authService.registerUser({ email, password });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await authService.loginUser({ email, password });
    const token = authService.generateJWT(user);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = {
  register,
  login,
};
