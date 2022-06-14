/**
 * @author deming.su
 * @time 2022-06-08 3 PM
 * @description 对vue脚手架进行配置
 */

module.exports = {
    // 去掉lint检查
    lintOnSave: false,
    // 配置模板和入口
    pages: {
        index: {
            template: './public/index.html',
            entry: './src/index.js'
        }
    },
    // 对开发服务器做一个配置
    devServer: {
        open: true,
        port: 16666
    }
}