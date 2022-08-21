function InterceptorManager() {
    this.handlers = [];
};
InterceptorManager.prototype.use = function(fulfilled,rejected) {
    console.log("保存use回调");
    //保存回调函数到实例对象的handlers中
    this.handlers.push({
        //方法名和值同名的话可以直接写(ES6)
        fulfilled,
        rejected,
    });
};
//创建取消请求的构造函数
function CancelToken(executor) {
    //如果执行器不是函数就直接返回
    if(typeof executor !== 'function') {
        console.error("executor must be function!");
        return;
    };
    //声明一个变量接收成功的回调
    let resolvePromise;
    //为实例对象添加promise属性
    this.promise = new Promise(resolve => {
        //为变量赋值为promise成功的函数
        resolvePromise = resolve;
    });
    //调用执行器,并传入取消请求的函数
    executor(function cancel(message) {
        //把promise属性修改为成功的Promise
        resolvePromise(message);
    });
}
//创建构造函数Axios
function Axios(config) {
    //初始化默认配置
    this.defaults = config;
    //添加拦截器
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
    }
};
//创建请求方法
Axios.prototype.resquest = function(config) {
    console.log(`发送 AJAX 请求,类型为${config.method}.`);
    config.url = `${config.baseURL}${config.url}`;
    //创建一个成功的Promise对象
    let promise = Promise.resolve(config);
    //创建数组
    let chains = [dispatchResquest,void 0];
    //遍历请求拦截器数组
    this.interceptors.request.handlers.forEach(obj => {
        //并将成功和失败的回调压入到数组的第一位
       chains.unshift(obj.fulfilled,obj.rejected);
    });
    //遍历响应拦截器数组
    this.interceptors.response.handlers.forEach(obj => {
        //并将成功和失败的回调压入到数组的最后
        chains.push(obj.fulfilled,obj.rejected);
    });
    while(chains.length) {
        promise = promise.then(chains.shift(),chains.shift());
    }
    //调用then指定回调,并且返回
    return promise;
};
Axios.prototype.get = function(config) {
    return this.resquest({method:"GET",url:config.url});
};
Axios.prototype.post = function(config) {
    return this.resquest({method:"POST",url:config.url});
};
//创建axios实例方法
Axios.prototype.create = function(config) {
    return createInstance(config);
};
//绑定属性为取消请求构造函数
Axios.prototype.CancelToken = CancelToken;
//创建拦截器构造函数


//创建axios函数对象实例
function createInstance(config) {
    //实例化对象
    let context = new Axios(config);
    //绑定实例化对象的请求函数
    let instance = Axios.prototype.resquest.bind(context);
    //为这个请求函数原型添加方法
    Object.keys(Axios.prototype).forEach(key => {
        //并且绑定this为context默认实例对象
        instance[key] = Axios.prototype[key].bind(context);
    });
    //为这个请求函数原型添加属性
    Object.keys(context).forEach(key => {
        instance[key] = context[key];
    })
    //返回请求函数
    return instance;
};
//创建发送请求函数
function dispatchResquest(config) {
    console.log("dispatchResquest执行");
    //调用then方法,并返回Promise对象
    return xhrAdapter(config).then(response => {
        //请求成功响应处理
        //响应json数据转成js对象
        response.data = JSON.parse(response.data);
        return response;
    },error => {
        //请求失败错误处理
        throw error;
    })
};
//xhr适配器函数
function xhrAdapter(config) {
    console.log("xhrAdapter执行");
    //返回Promise对象
    return new Promise((resolve,reject) => {
        //创建变量接收发送数据
        let sendData;
        //创建请求对象
        let xhr = new XMLHttpRequest();
        //配置请求对象
        xhr.open(config.method,config.url,true);
        //设置请求头
        xhr.setRequestHeader("content-type","application/json");
        //如果有超时属性
        if(config.timeout)  {
            //设置超时
            xhr.timeout = config.timeout;
        }
        //把发送的数据转为json格式
        sendData = JSON.stringify(config.data);
        //发送请求
        xhr.send(sendData);
        //等待请求结果回调
        xhr.onreadystatechange = function() {
            if(this.readyState === 4) {
                if(this.status >= 200 && this.status < 300) {
                    //成功
                    resolve({
                        config:config,
                        data:this.response,
                        headers:this.getAllResponseHeaders(),
                        resquest:this,
                        status:this.status,
                        statusText:this.statusText,
                    });
                }else {
                    //失败
                    reject(`请求失败响应状态码为:${this.status}.`);
                }
            }
        };
        //如果配置对象有CancelToken属性就进入判断
        if(config.CancelToken) {
            //当Promise对象成功时取消请求
            config.CancelToken.promise.then(message => {
                console.log(message);
                //取消请求
                xhr.abort();
                //取消完请求之后释放内存
                xhr = null;
                reject("请求已取消");
            })
        };
    });
}




const axios = createInstance({method:"GET",url:"http://localhost:3000"});





