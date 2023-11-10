#/!bin/bash

#
# SCRIPT: script.sh
# AUTHOR: Gaurav Sharma (gaurav6421@gmail.com)
# DATE:   14-nov-2020
# REV:    1.1
#
#
# PLATFORM: (SPECIFY:  Ubuntu)
#
# PURPOSE: Will Deploy the code on dominate production servers.
#
#
# REV LIST:
#        DATE: 14-nov-2020
#        BY:   Gaurav Sharma (gauravs@gmail.com)
#        MODIFICATION: 
#
#
# set -n   #
#          #
#          #
# set -x   #
#          
##########################################################
########### DEFINE FILES AND VARIABLES HERE ##############
##########################################################

#prune images

docker image prune -a -f

# for backend
# pull the code....
git clone git@gitlab.com:dominate-ang/dominate-backend.git

if [ $? -eq 0 ]
then
    echo "Clone Successfullly."
    
else
    echo "Not able clone the code"
    exit 1
fi

mv dominate-backend dominate

if [ $? -eq 0 ]
then
    echo "Move Successfully."
else
    echo "Not able move the code"
    exit 2
fi

#build the image 
cd dominate
if [ $? -eq 0 ]
then
    echo "Now you are in $PWD."
else
    echo "dominate directory not found."
    exit 3
fi
mv DockerFileQA DockerFile 
docker-compose build 
if [ $? -eq 0 ]
then
    echo "Image build Successfully."
else
    echo "Something went wrong... Not able to build Docker Image."
    exit 4
fi

#run docker-compose.
docker-compose down
if [ $? -eq 0 ]
then
    echo "Success..! Docker Compose Down... ! "
else
    echo "Not able clone the code"
fi
docker-compose up --scale dominate=2  -d
if [ $? -eq 0 ]
then
    echo "Your Stack is Up now"
else
    echo "Something went wrong please check your Server Manually."
    exit 5
fi

# clean up code..
cd ..
rm -rvf dominate
if [ $? -eq 0 ]
then
    echo "Cleanup Successfullly."
else
    echo "Not able clean the code."
fi
ub
