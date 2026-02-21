const db = require("../config/db.config");
const { SignupDto } = require("../dtos/auth.dtos");
const { UserDto } = require("../dtos/users.dto");
const { hashPassword } = require("../util/password.util");

/**
 * Signup users controller
 * @param {Request} req
 * @param {Response} res
 * @param {import("express").NextFunction} next
 *
 * @returns {void}
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

module.exports = {
  signup,
};
