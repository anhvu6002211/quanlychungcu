/**
 * Wrapper for async express routes to catch errors
 * @param {Function} fn - The asynchronous function to wrap
 * @returns {Function} - The wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
