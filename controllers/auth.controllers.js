const db = require("../config/db.config");
const { SignupDto, LoginDto } = require("../dtos/auth.dtos");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const { UserDto } = require("../dtos/users.dto");
const { LoginError, SignupError, LogoutError } = require("../errors/AuthError");
const { hashPassword, verifyPassword } = require("../util/password.util");

/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 * @typedef {import('pg').QueryResult} DatabaseQuery
 */

/**
 * Signup a new user
 *
 * @type {Controller}
 */
const signup = async (req, res, next) => {
  const userData = new SignupDto(req.body);
  let hashedPassword = "";
  /**@type {DatabaseQuery} */
  let queryResult;

  try {
    // User password hashing
    try {
      hashedPassword = await hashPassword(userData.password);
    } catch (error) {
      throw new SignupError("Password hashing failed.", 500, { cause: error });
    }

    // Save new user fullname, email and hashed password into database
    try {
      queryResult = await db.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES($1, $2, $3)
         RETURNING id, full_name, email, created_at, updated_at`,
        [userData.fullname, userData.email, hashedPassword],
      );
    } catch (error) {
      throw new SignupError(
        "Saving new user details to database failed.",
        500,
        { cause: error },
      );
    }
    /** @type {UserDto} */
    const newData = result.rows[0];

    res.json(
      new SuccessResponseDto({
        message: "User signup successful",
        data: new UserDto(newData),
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login a user
 *
 * @type {Controller}
 */
const login = async (req, res, next) => {
  if (req.session.user) {
    throw new LoginError("Already logged in", 400);
  }

  const loginData = new LoginDto(req.body);
  /** @type {DatabaseQuery} */
  let findUserByEmail;

  try {
    // Search database for user by email
    try {
      findUserByEmail = await db.query("SELECT * FROM users WHERE email = $1", [
        loginData.email,
      ]);
    } catch (error) {
      throw new LoginError(
        `Retrieving user with email: ${loginData.email} from database failed.`,
        500,
        { cause: error },
      );
    }

    if (findUserByEmail.rows.length === 0) {
      throw new LoginError("User does not exist.", 404);
    }

    const userData = new UserDto(findUserByEmail.rows[0]);

    let isPasswordValid = false;

    try {
      isPasswordValid = await verifyPassword(
        loginData.password,
        userData.passwordHash,
      );
    } catch (error) {
      throw new LoginError("Hashed password verification failed.", 500, {
        cause: error,
      });
    }

    if (!isPasswordValid) {
      throw new LoginError("User email or password is not valid.", 401);
    }

    if (!req.session.user) {
      req.session.user = userData;
    }

    res.status(200).json(
      new SuccessResponseDto({
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
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout a user
 *
 * @type {Controller}
 */
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error", err);
      return next(LogoutError("Error destroying session", 500, { cause: err }));
    }
    res
      .clearCookie("connect.sid")
      .status(200)
      .json(
        new SuccessResponseDto({
          message: "Logout successful",
        }),
      );
  });
};
module.exports = {
  signup,
  login,
  logout,
};
