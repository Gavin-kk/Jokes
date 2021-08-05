export const enum ArticleStoreActionType {
  // 获取个人所有文章
  GET_ALL_PERSONAL_ARTICLES = 'get_all_personal_articles',
  CHANGE_ALL_PERSONAL_ARTICLES = 'change_all_personal_articles',
  // 获取个人所有话题下的文章
  GET_ARTICLES_UNDER_ALL_PERSONAL_TOPICS = 'get_articles_under_all_personal_topics',
  CHANGE__ARTICLES_UNDER_ALL_PERSONAL_TOPICS = 'change_articles_under_all_personal_topics',
  // 获取个人所有的评论的文章
  GET_ALL_PERSONAL_COMMENTED_ARTICLES = 'get_all_personal_commented_articles',
  CHANGE__ALL_PERSONAL_COMMENTED_ARTICLES = 'change_all_personal_commented_articles',
  // 获取个人所有点赞的文章
  GET_ALL_ARTICLES_LIKED_BY_INDIVIDUALS = 'get_all_articles_liked_by_individuals',
  CHANGE__ALL_ARTICLES_LIKED_BY_INDIVIDUALS = 'change_all_articles_liked_by_individuals',
}
