const registerRouter = require('./backend/router')
module.exports = {
    lintOnSave: false,
    css: {
        loaderOptions: {
            sass: {
                // 全局引入变量和 mixin函数
                data: `
                        @import "@/assets/scss/variable.scss";
                        @import "@/assets/scss/mixin.scss";
                      `
            }
        }
    },
    //启动NodeServer
    devServer: {
        before(app) {
            registerRouter(app)
        }
    }
}