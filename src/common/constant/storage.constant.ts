// 当前用户聊天列表的storage缓存key
export const NEWS_LIST = (id: number) => `newsList-${id}`;
// 当前用户聊天和某个用户聊天的数据 currentUserId: 当前登录的用户的id targetUserId:当前用户聊天的目标用户
export const CHAT_LIST = (currentUserId: number, targetUserId: number) => `chatList-${currentUserId}-${targetUserId}`;
// 用户tokne的storage缓存key
export const TOKEN_KEY = '_token';
// 用户的未读关注角标数量
export const USER_NEW_ATTENTION_COUNT = (userId: number) => `userNewAttentionCount-${userId}`;
// 用户未读新点赞角标数量
export const USER_NEW_LIKE_COUNT = (userId: number) => `userNewLikeCount-${userId}`;
// 添加好友页面搜索好友文字的历史记录
export const SEARCH_ADD_FRIEND_HISTORY = (userId: number) => `search_add_friend_history-${userId}`;
// 文章浏览历史
export const BROWSING_HISTORY_ARTICLE = (userId: number) => `browsing_history_article-${userId}`;
// 动态浏览历史
export const BROWSING_HISTORY_TOPIC = (userId: number) => `browsing_history_topic-${userId}`;
// 缓存的文章分类
export const ARTICLE_CLASSIFICATION = 'article_classification';
// 缓存的搜索文章历史记录
export const ARTICLE_SEARCH_HISTORY = (userId: number) => `article_search_history-${userId}`;
