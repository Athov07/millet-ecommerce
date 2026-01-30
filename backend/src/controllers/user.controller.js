exports.getProfile = (req, res) => {
  res.json({
    success: true,
    message: "User profile accessed",
    user: req.user
  });
};
