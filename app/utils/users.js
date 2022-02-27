const _ = use("lodash");
const got = use("got");
const util = use("util");
const env = use("Env");
const config = use("Config");
const winston = require("winston");
const logConfiguration = {
  transports: [
    new winston.transports.File({
      filename: "logs/application.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
};
const logger = winston.createLogger(logConfiguration);

const adminToken = env.get("ADMIN_TOKEN");
const canvasBaseUrl = config.get("app.canvas.globalhost");

const User = use("App/Models/User");

const getUserFromCanvas = async (useremailId) => {
  logger.info(
    "The above method is only for user who is faculty and will added to database"
  );

  useremailId.includes("@") ? true : (useremailId += "@nwmissouri.edu");
  try {
    let user = await got(
      util.format(
        "%s/api/v1/accounts/1/users?search_term=%s&access_token=%s",
        canvasBaseUrl,
        useremailId,
        adminToken
      )
    );
    let userId = JSON.parse(user.body)[0].sis_user_id;
    user = _.find(JSON.parse(user.body), {
      sis_user_id: `${userId}`,
    });
    checkUser = await User.find(userId);
    let userIdIsNum = useremailId.split("@");

    userIdIsNum = userIdIsNum[0].substr(1);

    if (isNaN(userIdIsNum)) {
      if (checkUser == null) {
        await User.create({
          id: user.sis_user_id,
          username: user.login_id,
          firstname: user.name.split(" ")[0],
          lastname: user.name.split(" ")[1],
          email: util.format("%s@nwmissouri.edu", user.login_id),
          public: 0,
          isagreement: true,
          role: "faculty",
        });
      } else {
        return checkUser;
      }
    } else {
      return {
        error: {
          status: 401,
          message: `faculty not found id : ${useremailId}`,
        },
      };
    }
    user = await User.find(user.sis_user_id);
    return user;
  } catch (err) {
    logger.error(`utils-users, getUserFromCanvas fucntion has error: ${err}`);
  }
};
const getUserSearch = async (userId) => {
  try {
    let user = await got(
      util.format(
        "%s/api/v1/accounts/1/users?search_term=%s&access_token=%s",
        canvasBaseUrl,
        userId,
        adminToken
      )
    );
    user = _.find(JSON.parse(user.body), {
      sis_user_id: `${userId}`,
    });

    return user;
  } catch (err) {
    logger.error(`utils-users, getUserFromCanvas fucntion has error: ${err}`);
    return {
      error: {
        status: 401,
        message: `user not found with id: ${userId}`,
      },
    };
  }
};
module.exports.getUserFromCanvas = getUserFromCanvas;
module.exports.getUserSearch = getUserSearch;
