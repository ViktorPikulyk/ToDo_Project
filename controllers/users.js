const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const getTokenFrom = req => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

module.exports = {
  register: async (req, res, next) => {
    try {
      const body = req.body;
      const checkEmailExist = await User.findOne({ email: body.email });
      const { errors, isValid } = validateRegisterInput(body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      if (checkEmailExist) {
        errors.email = 'Email вже використовується';
        return res.status(400).json(errors);
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(body.password, saltRounds);

      const user = new User({
        email: body.email,
        name: body.name,
        passwordHash
      });

      const savedUser = await user.save();

      res.json(savedUser);
    } catch (exception) {
      next(exception);
    }
  },
  login: async (req, res) => {
    const body = req.body;
    const { errors, isValid } = validateLoginInput(body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ email: body.email });
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);

    if (!user) {
      errors.email = 'Користувач відсутній';
      return res.status(401).json(errors);
    }

    if (!passwordCorrect) {
      errors.password = 'Неправильний пароль';
      return res.status(401).json(errors);
    }

    const userForToken = {
      name: user.name,
      id: user._id
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 36000
    });

    res.status(200).send({ token, email: user.email, name: user.name });
  },
  getById: async (req, res, next) => {
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const user = await User.findById(id).populate('todos', {
        date: 1,
        title: 1,
        description: 1,
        priority: 1,
        isCompleted: 1
      });

      if (user._id != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      if (user) {
        res.json(user.toJSON());
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const userById = await User.findById(id);

      if (userById._id != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(body.password, saltRounds);

      const user = {
        email: body.email,
        name: body.name,
        passwordHash
      };

      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true
      });
      if (updatedUser) {
        res.json(updatedUser.toJSON());
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const user = await User.findById(id);

      if (user._id != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      await User.findByIdAndRemove(id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
