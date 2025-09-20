const adminService = require('./admin.service');

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const { admin, token } = await adminService.authenticateAdmin({ email, password });
    res.json({ token, email: admin.email, roles: admin.roles });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function banUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await adminService.banUser(userId);
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  loginAdmin,
  listUsers,
  banUser,
};
