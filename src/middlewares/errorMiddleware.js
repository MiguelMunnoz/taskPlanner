module.exports = (error, req, res, next) => {
    console.error(error.stack);
    res.status(error.status).json({message: `[ERROR] Internal server error. ${error.message}`});
};