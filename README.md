# axios 
    axios是一个发送AJAX请求的库
* axios的使用方法
    axios(options) 发送AJAX请求
    axios.request(options) 和上面一样
    axios.defaults 设置默认配置
    axios.create(options) 创建实例 当我们给不同的网页发送请求时可以为这个网页创建一个axios实例
* axios.default 
    axios.get(url,options) 发送get请求
    axios.post(url,data,options) 发送post请求
    axios.put(url,options) 发送put请求
    axios.delete(url,options) 发送delete请求
* interceptors(拦截器)
    - 拦截器分为:
        1. 请求拦截器 可以在发送请求之前做些什么,可以对请求错误做些什么
        2. 响应拦截器 对响应数据做些什么,对响应错误做些什么
# axios源码分析
* axios文件结构
    - dist 打包输出目录
    - src源码目录
        - adapeters 定义请求的适配器xhr,http
           - http.js 实现http适配器(包装http包)
           - xhr.js 实现xhr适配器(封装xhr对象)
        - cancel 定义取消请求功能
        - core 一些核心功能
            - Axios.js axios的核心主类
            - dispatchRequest.js 用来调用http请求适配器方法用来发送请求的函数


