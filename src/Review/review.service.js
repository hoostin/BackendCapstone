const knex = require("../db/connection");
const tableName = "reviews";

function destroy(reviewId) {
  return knex(tableName).where({ review_id: reviewId }).del();
}
function read(reviewId) {
  return knex(tableName).select("*").where({ review_id: reviewId }).first();
}
async function update(updatedReview) {
  await knex(tableName)
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");

  return read(updatedReview.review_id);
}

function listByMovie(movieId) {
  return knex(tableName).select("*").where({ "reviews.movie_id": movieId });
}
function getCritic(id) {
  return knex("critics").select("*").where({ "critics.critic_id": id }).first();
}
module.exports = {
  delete: destroy,
  read,
  update,
  getCritic,
  listByMovie,
};
