const UserModel = require("../models/UserModel");

class UserService {
  model = (data) => {
    return new UserModel(data);
  };

  register = (model, password, cb) => {
    return UserModel.register(model, password, cb);
  };

  getAll = () => {
    return UserModel.find();
  };

  get = (id) => {
    return UserModel.findOne({ _id: id });
  };

  delete = (id) => {
    return UserModel.findByIdAndDelete(id);
  };

  getUserByEmail = (email) => {
    return UserModel.findOne({ email: email });
  };
}

module.exports = new UserService();
