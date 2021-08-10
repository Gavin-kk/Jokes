export const enum MomentStoreActionType {
  // 获取所有话题分类
  GET_ALL_TOPIC_CATEGORIES = 'get_all_topic_categories',
  CHANGE_ALL_TOPIC_CATEGORIES = 'change_all_topic_categories',
  // 获取所有话题
  GET_ALL_TOPICS = 'get_all_topics',
  CHANGE_ALL_TOPICS = 'change_all_topics',
  //  TODO 获取所有用户关注的用户发布的文章 按时间排序
  GET_USER_ARTICLES_FOLLOWED_BY_USERS = 'get_user_articles_followed_by_users',
  CHANGE_USER_ARTICLES_FOLLOWED_BY_USERS = 'change_user_articles_followed_by_users',
}
