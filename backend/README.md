Dominate: Backend

Local Setup - 

ALTERNATIVE 1 - 
1. Install NVM, stay with nodejs 16.20.2
2. Install build-essential and node-gyp
3. `npm install concurrently` - this will be required to start multiple js files
4. Start mongodb with docker, on port 27017
5. Start redis with docker, on port 6379
6. Start minio with docker, expose ports 9000 and 9001 both.
7. docker command for minio - `sudo docker run -d --name minio -p 9001:9001 -p 9000:9000 -e "MINIO_ROOT_USER=minioadmin" -e "MINIO_ROOT_PASSWORD=minioadmin" bitnami/minio:latest`
8. Our nodejs server needs to connect to port 9090 and 9001 is wheer we will see the minio console
9. Open up your browser on `localhost:9001` and login using user name and password - minioadmin
10. Go to the root backend folder and run `npm run local`
11. Make sure you get the database connected and redis connected message in the terminal
12. If you get some error regarding S3 or socket hang up - know that it's a minio issue and nothing to do with S3 or socket.

ALTERNATIVE 2 - 
1. Go to the root of the backend project
2. There is now a folder called local_conatainers_start inside the config folder
3. There is a file "start_containers.sh"
4. At the root of the backend project, Run this command - `sudo chmod +x config/local_containers_setup/start_containers.sh` to make this script executable
5. And then run the script `./config/local_containers_setup/start_containers.sh`
6. All the containers will start running as well as the nodejs local server, connecting all.
7. Once you're done, run - `sudo chmod +x config/local_containers_setup/cleanup_containers.sh`
8. And also run - `./config/local_containers_setup/cleanup_containers.sh`

ALTERNATIVE 3 - 
1.  `docker compose -f docker-compose-dev.yml up -d` - runs the dev docker compase file that uses the DockerFile.dev and starts up everything for you - redis, mongo, minio and also the nodejs project itself inside a docker container
2. Takes a while to start up the first time since it copies the entire project and then also installs all the dependencies - but is the most stable way to work because it's all inside docker - including the nodejs server itself
3. To scale the service, you could run - `sudo docker compose -f docker-compose-dev.yml up --scale dominate=3 -d`
4. When you want to stop and remove all the containers, then run this - 
5. `sudo docker compose -f docker-compose-dev.yml down`

How to setup (Production):
1. install docker, docker-compose
2. copy dominate frontend dist folder in '/var/dominate/dist/dominate-frontend/'
3. run 'docker-compose build'
3. run 'docker-compose up --scale dominate=2 -d' 



INVITE Flow:
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