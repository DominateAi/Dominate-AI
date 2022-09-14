![](website_screenshot.png)

![](Dashboard.png)

<h1> Dominate Ai, Open Source / Community Version </h1>
<h2> [Visit Website](https://www.dominate.ai) </h2>
<p>
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akhilsails/)
	
![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)
	
![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)
	
![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)
	
</p>

<h3> Technologies Used </h3>
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

Dominate: Backend

How to setup:
1. install docker, docker-compose
2. copy dominate frontend dist folder in '/var/dominate/dist/dominate-frontend/'
3. run 'docker-compose build'
3. run 'docker-compose up --scale dominate=2 -d' 


INVITE Flow:!

------------------
1. Call invite Api:
POST /api/users/invite HTTP/1.1
Host: localhost:9010
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjgzOTg3NjIwLTgyMTItMTFlOS05OTMyLTViMWZhNmY4YjdjZSIsImVtYWlsIjoicHJhc2FkQHViZXIuY29tIiwid29ya3NwYWNlSWQiOiJ1YmVyIn0sImlhdCI6MTU2NDI0ODY4MSwiZXhwIjoxNTY0MjUyMjgxfQ.3j85Lrpgl3gbm-_9GNB87KT6pg2U2F6u-Ol_JpUNKEc
User-Agent: PostmanRuntime/7.15.2
Accept: */*
Cache-Control: no-cache
Postman-Token: d8f7c219-079c-4b46-b501-e1dba7d403eb,8a92cc10-e335-486e-ace0-acad5b509843
Host: localhost:9010
Accept-Encoding: gzip, deflate
Content-Length: 106
Connection: keep-alive
cache-control: no-cache

{
	"recipients":["prasad8mhatre@gmail.com", "prasad8mhatre@mailinator.com", "prasad8mhatre@yopmail.com"]
}

2. Receipents will receive the invite mail, Need to click on invite link
3. There needs a invite page, After that page is loaded then call verify authcode api
GET /public/authCode/verify?authCode=5b6ded50-b094-11e9-84ab-770aeb36a40b HTTP/1.1
Host: localhost:9010
User-Agent: PostmanRuntime/7.15.2
Accept: */*
Cache-Control: no-cache
Postman-Token: 1d40d489-1eed-4dd9-a6d2-557cce0216f0,125edbf2-ed22-409d-95e7-70dbab268e17
Host: localhost:9010
Accept-Encoding: gzip, deflate
Connection: keep-alive
cache-control: no-cache

4. This should send to create a new user in workspace by getting header from verify api
POST /public/user HTTP/1.1
Host: localhost:9010
Content-Type: application/json
workspaceId: uber
cache-control: no-cache
Postman-Token: adcf8cf5-ea04-44bb-8987-cd308f24cc4d

{
	"name": "prasad",
	"email" :"prasad1ddddejjjdd@gmail.com",
	"phone":"7507",
	"location":"sds",
	"timezone":"sdsd",
	"firstName":"sd",
	"lastName":"sdsd",
	"status":"ACTIVE",
	"password":"xgEjX5CLQgWFd4YV",
	"role":"83805a40-8212-11e9-9932-5b1fa6f8b7ce"
}



T0 Setup :
------------------

1. Install MongoDB

2. Run ./scripts/init_dominate.js\


- Upload the default image and update the config file for default admin image
