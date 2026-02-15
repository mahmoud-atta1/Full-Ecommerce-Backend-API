const express = require("express");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator,
} = require("../validators/user.validator");

const {
  uploadUserImage,
  resizeImage,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getloggedUser,
  updateMe,
  changeMyPassword,
  deleteMe,
} = require("../services/user.service");

const auth = require("../services/auth.service");

const router = express.Router();

router.use(auth.protect);
router.get("/getMe", getloggedUser, getUser);
router.put(
  "/updateMe",
  uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateMe,
);
router.put("/changeMyPassword", changePasswordValidator, changeMyPassword);
router.delete("/deleteMe", deleteMe);



router.use(auth.allowedTo("admin", "manager"));
router
  .route("/")
  .get(getUsers)
  .post(
    auth.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser,
  );
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    auth.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser,
  )
  .delete(auth.allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
