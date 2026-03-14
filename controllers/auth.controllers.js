const db = require("../config/db.config");
const { SignupDto, LoginDto } = require("../dtos/auth.dtos");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const { UserDto } = require("../dtos/users.dto");
const {
  LoginError,
  SignupError,
  LogoutError,
  VerifyEmailError,
} = require("../errors/AuthError");
const { hashPassword, verifyPassword } = require("../util/password.util");
const { sendVerificationEmail } = require("../services/email.service");

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

  const signupClient = await db.connect();

  try {
    // Check if user already exist
    /**@type {DatabaseQuery} */
    const userExistQueryResult = await signupClient.query(
      "SELECT * FROM users WHERE email = $1",
      [userData.email],
    );

    if (userExistQueryResult.rows.length) {
      throw new SignupError("User account already exist", 409);
    }

    // User password hashing
    try {
      hashedPassword = await hashPassword(userData.password);
    } catch (error) {
      throw new SignupError("Password hashing failed.", 500, { cause: error });
    }

    /** @type {UserDto} */
    let user;
    /** @type {string} */
    let verification_token;

    try {
      // Generate verification token using crypto
      verification_token = require("node:crypto")
        .randomBytes(32)
        .toString("hex");

      // Save new user fullname, email and hashed password into database
      /**@type {DatabaseQuery} */
      const newUserQueryResult = await signupClient.query(
        `INSERT INTO users (full_name, email, password_hash, is_verified, verification_token, token_expires_at)
         VALUES($1, $2, $3, $4, $5, NOW() + INTERVAL '1 hour')
         RETURNING id, full_name, email, created_at, updated_at`,
        [
          userData.fullname,
          userData.email,
          hashedPassword,
          false,
          verification_token,
        ],
      );

      /** @type {UserDto} */
      const newUserData = newUserQueryResult.rows[0];

      if (!newUserData)
        throw new SignupError("Saving new user to database failed.", 500);
      user = new UserDto(newUserData);
    } catch (error) {
      throw new SignupError(
        "Saving new user details to database failed.",
        500,
        { cause: error },
      );
    }

    // Send activation email
    try {
      await sendVerificationEmail(
        user.email,
        user.fullName,
        verification_token,
      );
    } catch (error) {
      throw new SignupError("Sending activation email failed.", 500, {
        cause: error,
      });
    }

    return res.json(
      new SuccessResponseDto({
        message: "Check your email to verify your account email.",
        data: user,
      }),
    );
  } catch (error) {
    next(error);
  } finally {
    signupClient.release();
  }
};

/**
 * Verify new users to activate account
 *
 * @type {Controller}
 */
const verifyEmail = async (req, res, next) => {
  const token = req.query.token;
  const verifyEmailClient = await db.connect();

  try {
    await verifyEmailClient.query("BEGIN");

    // Check if user with verification token exist
    const selectQuery = await db.query(
      `SELECT * FROM users WHERE verification_token = $1 AND token_expires_at > NOW() FOR UPDATE`,
      [token],
    );

    if (!selectQuery.rows[0]) {
      throw new VerifyEmailError(
        `User verification token expired or does not exist`,
        404,
      );
    }

    // Update user verification to true to activate acount
    await db.query(
      `UPDATE users 
      SET is_verified=$1, 
      verification_token = NULL, 
      token_expires_at = NULL 
      WHERE verification_token = $2`,
      [true, token],
    );

    await verifyEmailClient.query("COMMIT");

    return res.status(200).json(
      new SuccessResponseDto({
        message:
          "Email verification successful, login with credentials to access account",
      }),
    );
  } catch (error) {
    await verifyEmailClient.query("ROLLBACK");
    next(error);
  } finally {
    verifyEmailClient.release();
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

    req.session.user = userData;

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
          isVerified: userData.isVerified,
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
  verifyEmail,
  login,
  logout,
};
