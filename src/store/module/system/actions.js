const actions = {
    ["get_system_info" /* GET_SYSTEM_INFO */](content) {
        uni.getSystemInfo({
            success(res) {
                content.commit("set_system_info" /* SET_SYSTEM_INFO */, res);
            },
        });
    },
};
export default actions;
//# sourceMappingURL=actions.js.map