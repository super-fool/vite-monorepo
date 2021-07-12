export default {
  install(Vue) {
    Vue.prototype.util = {
      getToken() {
        let userToken = window.localStorage.getItem('hcpToken');
        return userToken || false;
      },
      exportHandel(data, til) {
        const BLOB = data; // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
        const fileReader = new FileReader(); // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
        fileReader.readAsDataURL(BLOB); // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
        fileReader.onload = event => {
          // 处理load事件。该事件在读取操作完成时触发
          // 新建个下载的a标签，完成后移除。
          const timestamp = new Date().getTime();
          let a = document.createElement('a');
          a.download = `${til}报表${timestamp}.xlsx`;
          a.href = event.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      }
    };
  }
};
