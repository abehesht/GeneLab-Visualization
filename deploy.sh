# Starting from root
cd

echo "Host bitbucket.org
    StrictHostKeyChecking no" >> .ssh/config

# Check if folder already exists
if [ -d /root/d3_nasa ]
then
    echo "Pulling updates from repo"
    cd /root/d3_nasa
    git pull
else
    echo "Cloning repo"
    mkdir d3_nasa
    git clone git@bitbucket.org:damvaddatateam/d3_nasa.git d3_nasa
    cd /root/d3_nasa
fi

# # Change branch
# git checkout master

# Docker authetication
mkdir /root/.docker
mv /root/d3_nasa/docker-auth.json /root/.docker/config.json

echo "Running docker-compose"
docker-compose down
docker-compose up -d --build