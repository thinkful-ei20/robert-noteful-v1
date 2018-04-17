function logger(req, res, next) {
  let date = new Date();
  let method = req.method;
  let url = req.url;
  console.log(date, method, url);
  next();
}

module.exports.logger = logger;