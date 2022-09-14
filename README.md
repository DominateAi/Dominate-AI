![](website_screenshot.png)

![](Dashboard.png)

<h1> Dominate Ai, Open Source / Community Version </h1>

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
