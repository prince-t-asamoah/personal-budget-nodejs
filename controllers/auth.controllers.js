const db = require("../config/db.config");
const { SignupDto, LoginDto } = require("../dtos/auth.dtos");
const { UserDto } = require("../dtos/users.dto");
const { hashPassword, verifyPassword } = require("../util/password.util");

/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 */

/**
 * Signup a new user
 *
 * @type {Controller}
 */
const signup = async (req, res, next) => {
  const userData = new SignupDto(req.body);

  try {
    const hashedPassword = await hashPassword(userData.password);

    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES($1, $2, $3)
       RETURNING id, full_name, email, created_at, updated_at`,
      [userData.fullname, userData.email, hashedPassword],
    );

    /** @type {UserDto} */
    const newData = result.rows[0];

    res.json({
      success: true,
      message: "User signup successful",
      data: new UserDto(newData),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
  next();
};

/**
 * Login a user
 *
 * @type {Controller}
 */
const login = async (req, res, next) => {
  if (req.session.user) {
    return res
      .status(400)
      .json({ success: false, message: "Already logged in", data: null });
  }
  const loginData = new LoginDto(req.body);

  try {
    const findUser = await db.query("SELECT * FROM users WHERE email = $1", [
      loginData.email,
    ]);

    if (findUser.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist." });
    }

    const userData = new UserDto(findUser.rows[0]);

    const isPasswordValid = await verifyPassword(
      loginData.password,
      userData.passwordHash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "User email or password is not valid.",
      });
    }

    if (!req.session.user) {
      req.session.user = userData;
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        addressDetails: userData.addressDetails,
        profileImageUrl: userData.profileImageUrl,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
      data: null,
    });
  }
  next();
};

module.exports = {
  signup,
  login,
};
