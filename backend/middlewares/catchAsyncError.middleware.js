// Exporting a higher-order function named catchAsyncError
// This function is designed to wrap async route handlers and controllers
// so that any errors inside them are automatically caught and passed to Express error handling middleware
export const catchAsyncError = (func) => {
    // Returning a new function that Express will use as a middleware or route handler
    // This inner function receives the standard Express parameters: req, res, and next
    return (req, res, next) => {
        // Wrapping the original async function (func) in Promise.resolve()
        // This ensures that even if func returns a rejected promise (an async error),
        // the .catch(next) part will catch that rejection and forward it to Express’s error middleware
        Promise.resolve(func(req, res, next)).catch(next);
    };
};







