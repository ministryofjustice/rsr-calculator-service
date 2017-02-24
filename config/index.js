module.exports = function(app, config) {
  require('./environments/' + app.get('env'))(app.locals.config);
}
