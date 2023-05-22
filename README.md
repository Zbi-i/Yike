# Yike

“一刻心情” 网站的后端。

[前端页面](https://github.com/Zbi-i/yike-web)

# 使用

本项目使用nodejs开发，使用前需先安装。

1.拉取 下载或克隆项目至本地。

2.安装依赖 下载至本地之后，在项目根目录输入：npm install  安装项目所需的依赖。

```
npm install
```

3.配置环境变量 在项目根目录创建 .env 文件，复制粘贴以下配置，然后修改。

> APP_HOST=[https://localhost](https://localhost/)
>
> APP_PORT=8000
>
> // 链接地址 端口号 数据库名 用户名 密码
>
> MYSQL_HOST=localhost
>
> MYSQL_PORT=3306
>
> MYSQL_DATABASE=coderhub
>
> MYSQL_USERNAME=root
>
> MYSQL_PASSWORD=root

4.运行

在项目根目录输入 npm satrt 启动项目。

```
npm start
```

 5.--

看到控制台输出

> 服务器在8000端口启动成功~
> 数据库连接成功~

则项目启动成功。
