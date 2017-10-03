module.exports = {
  notFound,
  unexpected,
  validation
};

function errorResponse(res, status, code, details, more = {}) {
  const response = Object.assign(
    {error: code, details},
    more
  );

  res.status(status);
  res.json(response);
};

function notFound(res, details, more = {}) {
  errorResponse(res, 404, 'not-found', details, more);
}

function unexpected(res, err) {
  errorResponse(res, err.status || 500, 'unexpected', err.message);
}

function validation(res, details, more = {}) {
  errorResponse(res, 400, 'validation', details, more);
}
