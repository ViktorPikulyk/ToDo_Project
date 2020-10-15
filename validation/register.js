const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.name, { min: 5, max: 30 })) {
    errors.name = "(5-30 символів)";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Пусте поле";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Неправильний Email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Пусте поле";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Пусте поле";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "(6-30 символів)";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
