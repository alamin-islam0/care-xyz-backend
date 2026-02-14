import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.googleClientId);

function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
}

export async function register(req, res) {
  try {
    const { nidNo, name, email, contact, password } = req.body;

    if (!name || !email || !contact || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be 6+ chars with uppercase and lowercase letters"
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      nidNo: nidNo || "",
      name,
      email: email.toLowerCase(),
      contact,
      passwordHash,
      authProvider: "local"
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
}

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential || !env.googleClientId) {
      return res.status(400).json({ message: "Google login is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    const name = payload?.name || "Google User";

    if (!email) {
      return res.status(400).json({ message: "Google account email not found" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        contact: "N/A",
        nidNo: "",
        authProvider: "google"
      });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: "Google login failed", error: error.message });
  }
}

export async function me(req, res) {
  return res.status(200).json({ user: sanitizeUser(req.user) });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    nidNo: user.nidNo,
    name: user.name,
    email: user.email,
    contact: user.contact,
    authProvider: user.authProvider,
    role: user.role
  };
}
