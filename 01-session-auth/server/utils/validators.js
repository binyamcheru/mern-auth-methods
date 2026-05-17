/**
 * Validate name — returns error message or null if valid
 * @param {string} name
 * @returns {string|null}
 */
exports.validateName = (name) => {
  if (!name || typeof name !== "string") return "Name is required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 50) return "Name must be at most 50 characters";
  return null;
};

/**
 * Validate email — returns error message or null if valid
 * @param {string} email
 * @returns {string|null}
 */
exports.validateEmail = (email) => {
  if (!email || typeof email !== "string") return "Email is required";
  const trimmed = email.trim();
  if (trimmed.length === 0) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Invalid email format";
  return null;
};

/**
 * Validate password — returns error message or null if valid
 * @param {string} password
 * @returns {string|null}
 */
exports.validatePassword = (password) => {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 128) return "Password must be at most 128 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
};
