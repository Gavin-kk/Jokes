// 当前用户聊天列表的storage缓存key
export const NEWS_LIST = (id: number) => `newsList-${id}`;
// 当前用户聊天和某个用户聊天的数据 currentUserId: 当前登录的用户的id targetUserId:当前用户聊天的目标用户
export const CHAT_LIST = (currentUserId: number, targetUserId: number) => `chatList-${currentUserId}-${targetUserId}`;
// 用户tokne的storage缓存key
export const TOKEN_KEY = '_token';
// 用户的未读关注角标数量
export const USER_NEW_ATTENTION_COUNT = 'userNewAttentionCount';
// 用户未读新点赞角标数量
export const USER_NEW_LIKE_COUNT = 'userNewLikeCount';
// 添加好友页面搜索好友文字的历史记录
export const SEARCH_ADD_FRIEND_HISTORY = 'search_add_friend_history';
