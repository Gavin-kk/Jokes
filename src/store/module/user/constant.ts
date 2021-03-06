export const enum UserStoreActionType {
  // 改变全局登录状态
  CHANGE_LOGIN_STATUS = 'change_login_status',
  // 发送邮箱密码登录
  SEND_ACCOUNT_PASSWORD_TO_LOG_IN = 'send_email_password_to_log_in',
  // 发送邮箱验证码登录
  SEND_EMAIL_VERIFICATION_CODE_TO_LOG_IN = 'send_email_verification_code_to_log_in',
  // 发送第三方登录
  SEND_THIRD_PARTY_LOGIN = 'send_third_party_login',
  // 改变用户详情
  CHANGE_USER_INFO = 'change_user_info',
  // 获取用户详情
  GET_USER_INFO = 'get_user_info',
  // 修改用户密码
  MODIFY_USER_PASSWORD = 'modify_user_password',
  // 获取当前用户的所有文章,话题文章,评论的文章,点赞的文章 的数量
  GET_COUNT = 'get_count',
  CHANGE_COUNT = 'change_count',
  CHANGE_BG = 'change_bg',
  // 获取个人关注列表
  GET_FOLLOW_LIST = 'get_follow_list',
  CHANGE_FOLLOW_LIST = 'change_follow_list',
  // 第三方账号绑定邮箱
  BIND_EMAIL = 'bind_email',
  //  初始化数据
  INIT = 'init',
}
