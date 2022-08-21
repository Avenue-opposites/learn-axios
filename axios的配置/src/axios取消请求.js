window.onload = function () {
    //引入axios
    const axios = require("axios").default;
    const id = document.getElementById("number");
    let cancel;
    //创建请求控制器
    const request = axios.create({
        timeout: 3000,
        baseURL: "http://localhost:3000",
    });
    //创建点击事件
    document.querySelector(".get").onclick = () => {
      request.get(`/posts/${id.value}`,{
        cancelToken:new axios.CancelToken(function(c) {
          cancel = c;
        })
      }).then((response) => {
        console.log(response);
    });
    };
    document.querySelector(".cancel").onclick = () => {
        //取消请求
      cancel();
    };
    
  };