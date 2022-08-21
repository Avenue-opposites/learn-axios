window.onload = function () {
  //引入axios
  const axios = require("axios");
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const id = document.getElementById("number");
  //设置默认配置
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.params = {a:100};
  axios.defaults.timeout = 3000;
  //创建点击事件
  document.querySelector(".get").onclick = () => {
    //发送AJAX请求
    axios({
      //请求类型
      method: "GET",
      //网址
      url:`/posts/${id.value}`,
      // baseURL,
    }).then((response) => {
      console.log(response);
    });
  };
  document.querySelector('.post').onclick = () => {
    axios({
        method:'POST',
        url:`/posts`,
        //设置请求体
        data:{
            title:title.value,
            author:author.value
        }
    }).then(response => {
        console.log(response);
    })
  };
  document.querySelector(".put").onclick = () => {
    axios({
        //更新请求
        method:'PUT',
        url:`/posts/${id.value}`,
        // baseURL,
        data:{
            title:title.value,
            author:author.value
        }
    }).then(response => {
        console.log(response);
    })
  };
  document.querySelector(".delete").onclick = () => {
    axios({
        //删除请求
        method:'DELETE',
        url:`/posts/${id.value}`,
        // baseURL,
    }).then(response => {
        console.log(response);
    })
  };
};
