const crypto = require("node:crypto");

const db = require("../config/db.config");
const { SignupDto, LoginDto } = require("../dtos/auth.dtos");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const { UserDto } = require("../dtos/users.dto");
const {
  LoginError,
  SignupError,
  LogoutError,
  VerifyEmailError,
  UnAuthorizedError,
} = require("../errors/AuthError");
const { buildAuthUserResponse } = require("../util/buildAuthUserResponse.util");
const { hashPassword, verifyPassword } = require("../util/password.util");
const { sendVerificationEmail } = require("../services/email.service");
const { getGoogleUser } = require("../services/oauth/google.oauth.service");
const { AUTH_ACCOUNTS_TYPE } = require("../types/auth_accounts.types");

/**
 *
 * @typedef {import('../types/controller.types').Controller}  Controller
 * @typedef {import('../types/auth_accounts.types').AuthAccount} AuthAccount
 * @typedef {import('../types/users.types').User} User
 * @typedef {import('pg').QueryResult<AuthAccount>} AuthAccountQuery
 * @typedef {import('pg').QueryResult<User>} UserQuery
 *
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
    /**@type {UserQuery} */
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
    return res.status(200).json(
      new SuccessResponseDto({
        message: "Already logged in",
        data: buildAuthUserResponse(req.session.user),
      }),
    );
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
        data: buildAuthUserResponse(userData),
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

/**
 * Google OAuth to signup and signin
 *
 * @type {Controller}
 */
const googleOAuth = (req, res, _next) => {
  const state = crypto.randomBytes(16).toString("hex");

  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    state,
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

/**
 * Resolve user data for an existing Google auth account.
 *
 * @param {import('pg').PoolClient} dbClient
 * @param {AuthAccount} userAuthAccount
 * @returns {Promise<UserDto>}
 */
const getExistingGoogleAuthUser = async (dbClient, userAuthAccount) => {
  /** @type {UserQuery} */
  const selectUsersByIdQuery = await dbClient.query(`SELECT * FROM users WHERE id = $1`, [
    userAuthAccount.user_id,
  ]);

  if (!selectUsersByIdQuery.rows[0]) {
    throw new Error("User account linked to Google auth account was not found.");
  }

  return new UserDto(selectUsersByIdQuery.rows[0]);
};

/**
 * Resolve user data by existing email or create and link a new Google OAuth user.
 *
 * @param {import('pg').PoolClient} dbClient
 * @param {import('../services/oauth/google.oauth.service').GoogleUser} googleUserData
 * @returns {Promise<UserDto>}
 */
const createOrLinkGoogleOAuthUser = async (dbClient, googleUserData) => {
  /** @type {UserQuery} */
  const selectUsersByEmailQuery = await dbClient.query(
    `SELECT * FROM users WHERE email = $1`,
    [googleUserData.email],
  );

  /** @type {User} */
  let userDataByEmail = selectUsersByEmailQuery.rows[0];

  if (!userDataByEmail) {
    /** @type {UserQuery} */
    const usersInsertQuery = await dbClient.query(
      `INSERT INTO users (full_name, email, is_verified, verification_token, token_expires_at) 
       VALUES($1, $2, $3, NULL, NULL) RETURNING *`,
      [
        googleUserData.name,
        googleUserData.email,
        googleUserData.verified_email,
      ],
    );

    userDataByEmail = usersInsertQuery.rows[0];
    if (!userDataByEmail) {
      throw new Error("Saving new user data into database failed.");
    }
  }

  await dbClient.query(
    `INSERT INTO auth_accounts (user_id, provider, provider_user_id) VALUES($1, $2, $3)
     ON CONFLICT(provider, provider_user_id) DO NOTHING;`,
    [userDataByEmail.id, AUTH_ACCOUNTS_TYPE.GOOGLE, googleUserData.id],
  );

  return new UserDto(userDataByEmail);
};

/**
 * Google OAuth Callback
 *
 * @type {Controller}
 */
const googleoAuthCallback = async (req, res, next) => {
  const { code, state } = req.query;

  if (!code) {
    return next(new UnAuthorizedError("Missing OAuth authorization code.", 400));
  }

  if (state !== req.session.oauthState) {
    return next(new UnAuthorizedError("Invalid OAuth state.", 401));
  }

  // State is single-use to prevent replay attempts.
  delete req.session.oauthState;

  const dbClient = await db.connect();
  let transactionStarted = false;

  try {
    const googleUserData = await getGoogleUser(code);
    await dbClient.query("BEGIN");
    transactionStarted = true;

    if (!googleUserData?.id || !googleUserData?.email) {
      throw new Error("Google OAuth user data fetching failed");
    }

    // Check if user has authentication account
    const selectAuthAccountsQuery = await dbClient.query(
      "SELECT * FROM auth_accounts WHERE provider = $1 AND provider_user_id = $2 FOR UPDATE;",
      [AUTH_ACCOUNTS_TYPE.GOOGLE, googleUserData.id],
    );
    /** @type {AuthAccountQuery} */
    const userAuthAccount = selectAuthAccountsQuery.rows[0];

    if (userAuthAccount) {
      req.session.user = await getExistingGoogleAuthUser(dbClient, userAuthAccount);
    } else {
      req.session.user = await createOrLinkGoogleOAuthUser(dbClient, googleUserData);
    }

    await dbClient.query("COMMIT");
    return res.redirect(`${process.env.APP_FRONTEND_BASE_URL}/app`);
  } catch (error) {
    if (transactionStarted) {
      await dbClient.query("ROLLBACK");
    }
    next(error);
  } finally {
    dbClient.release();
  }
};

/**
 * Current authenticated user session
 *
 * @type {Controller}
 */
const currentUser = async (req, res, next) => {
  try {
    if (!req.session.user)
      throw new UnAuthorizedError("No session data for user");
    const user = req.session.user;

    res.status(200).json(
      new SuccessResponseDto({
        message: "User session data retrieved successfully",
        data: user,
      }),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  googleOAuth,
  googleoAuthCallback,
  currentUser,
};
