const User = require("../models/user");
const bcrypt = require("bcryptjs");
async function signUpNewUser(user) {
  try {
    let newUser;
    user.identityNumber = await bcrypt.hash(user.identityNumber, config.idSalt);
    newUser = await User.findOne({ identityNumber: user.identityNumber });
    if (newUser) {
      return { error: "user already exists" };
    }
    newUser = await User.findOne({ email: user.email });
    if (newUser) {
      return { error: "user already exists" };
    }

    newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      city: user.city,
      street: user.street,
      identityNumber: user.identityNumber,
      email: user.email,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(user.password, salt);

    await newUser.save();

    return { user: newUser };
  } catch (error) {
    console.log(error);
    return { error: "server error" };
  }
}

async function loginUser(credentials) {
  try {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      return { error: "Invalid credentials" };
    }
    if (user.password) {
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch) {
        return { error: "Invalid credentials" };
      }
      return { user: { userId: user._id, role: user.role } };
    } else {
      return { error: "Invalid credentials" };
    }
  } catch (error) {
    console.log(error);
    return { error: "server error" };
  }
}
async function getAuthUser(userId) {
  try {
    const user = await User.findById(userId).select(
      "-password -_id -identityNumber"
    );
    return user;
  } catch (error) {
    console.log(error);
    return { error: "server error" };
  }
}
async function updateSocialUser(user) {
  try {
    user.identityNumber = await bcrypt.hash(user.identityNumber, config.idSalt);
    const result = await User.updateOne({ _id: user._id }, user);

    if (result.nModified > 0) {
      return { message: "Update successful!" };
    } else {
      return { error: "Update Failed!" };
    }
  } catch (error) {
    return { error: "Update Failed!" };
  }
}

async function checkIfIdNumberExists(identityNumber) {
  try {
    let hashIdentityNumber = await bcrypt.hash(identityNumber, config.idSalt);
    let idExists = await User.findOne({ identityNumber: hashIdentityNumber });
    if (idExists) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return { error: "server error" };
  }
}

module.exports = {
  signUpNewUser,
  loginUser,
  getAuthUser,
  updateSocialUser,
  checkIfIdNumberExists
};
