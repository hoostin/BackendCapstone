const service = require("./review.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}
async function destroy(req, res) {
  service.delete(res.locals.review.review_id).then(() => res.sendStatus(204));
}
async function update(req, res, next) {
  if (req.body.data) {
    const updatedReview = { ...res.locals.review, ...req.body.data };
    const data = await service.update(updatedReview);
    data.critic = await service.getCritic(updatedReview.critic_id);
    return res.json({ data });
  }
  next({ status: 400, message: `Missing update data` });
}

async function list(req, res) {
  const movieId = res.locals.movie.movie_id;
  const reviews = await service.listByMovie(movieId);
  for (let review of reviews) {
    review.critic = await service.getCritic(review.critic_id);
  }
  return res.json({ data: reviews });
}
module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  list: asyncErrorBoundary(list),
};
