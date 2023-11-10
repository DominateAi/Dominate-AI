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
#        BY:   Gaurav Sharma (gaurav6421@gmail.com )
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

docker image prune -a -f

# for backend
# pull the code....
echo "i am in " `pwd`

git clone git@gitlab.com:dominate_react_frontend/dominate_react_frontend.git

if [ $? -eq 0 ]
then
    echo "Clone Successfullly."
    
else
    echo "Not able clone the code"
    exit 1
fi

cd dominate_react_frontend
ls
cd build
# clean up code..

# cd build/
cd /var/dominate/dist/dominate-frontend/
sudo rm -rvf *
cd -
#sudo mkdir -p /var/dominate/dist/dominate-frontend/
sudo cp -rvf * /var/dominate/dist/dominate-frontend/

cd ../..
rm -rvf dominate_react_frontend
if [ $? -eq 0 ]
then
    echo "Cleanup Successfullly."
else
    echo "Not able clean the code."
fi
