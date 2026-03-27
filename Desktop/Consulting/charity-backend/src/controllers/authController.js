const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 12);

    await db.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)",
      [full_name, email, hash]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch {
    res.status(400).json({ message: "Email already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(401).json({ message: "Invalid credentials" });

  const u = user.rows[0];

  if (u.account_locked)
    return res.status(403).json({ message: "Account locked" });

  const valid = await bcrypt.compare(password, u.password_hash);

  await db.query(
    "INSERT INTO login_logs (user_id, ip_address, success) VALUES ($1, $2, $3)",
    [u.id, req.ip, valid]
  );

  if (!valid) {
    await db.query(
      "UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id=$1",
      [u.id]
    );
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: u.id, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};