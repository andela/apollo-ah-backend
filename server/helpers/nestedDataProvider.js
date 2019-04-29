import models from '../models';


const userModelObj = {
  model: models.User,
  attributes: {
    exclude: ['email', 'password', 'updatedAt', 'isConfirmed', 'createdAt', 'deletedAt'],
  },
  include: [{
    model: models.Profile,
    attributes: ['firstname', 'lastname', 'username', 'bio', 'image'],
    required: true,
  }],
};

const tagsModelObj = {
  model: models.Tag,
  as: 'tagList',
  attributes: {
    exclude: [''],
  },
};

const articleCategoryModelObj = {
  model: models.ArticleCategory,
  as: 'articleCategory',
  attributes: { exclude: ['id'] },
  required: true,
};

const ratingsModelObj = {
  model: models.ratings,
  attributes: ['stars', 'userId']
};

const clapsModelObj = {
  model: models.ArticleClap,
  as: 'claps',
  attributes: ['userId', 'claps'],
};

const commentsModelObj = {
  model: models.Comment,
  as: 'comments',
};

/**
 *
 *
 * @param {*} categoryQuery - category Id needed to query the database
 * @param {*} authorQuery - author name needed to query the DB
 * @param {*} tagQuery - tag name needed to query the DB
 * @param {*} clapsQuery - clap name needed to query the DB
 * @returns {Array} - An array of the user model, tags model, and ratings model
 */
const dataProvider = (categoryQuery, authorQuery, tagQuery) => {
  if (authorQuery) userModelObj.include[0].where = { ...authorQuery };
  if (tagQuery) {
    tagsModelObj.required = tagQuery.tagName !== undefined;
    tagsModelObj.where = { ...tagQuery };
  }
  if (categoryQuery) articleCategoryModelObj.where = { ...categoryQuery };
  return ([userModelObj, tagsModelObj, articleCategoryModelObj,
    ratingsModelObj, clapsModelObj, commentsModelObj]);
};

export default dataProvider;
