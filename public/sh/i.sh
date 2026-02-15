#!/usr/bin/bash

# for ubuntu initial setup
# execute it with
# wget -O - http://gcc3.com/i.sh | bash

# color defination
Color_Off='\033[0m'       # Text Reset
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

# start
echo -e "Hi, this is ${Purple}http://gcc3.com${Color_Off}"

# detect distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    distro=$NAME
elif [ -f /etc/lsb-release ]; then
    . /etc/lsb-release
    distro=$DISTRIB_ID
else
    distro=$(uname -s)
fi

tools="curl vim git mlocate tree tmux ncdu"
toolsBuild="build-essential"
toolsConnct="openssh-server"

# install basic tools
if [ "$distro" == "Ubuntu" ]; then
    echo "Detect Ubuntu, installing..."
    sudo apt install $tools -y
    sudo apt install $toolsBuild -y
    sudo apt install $toolsConnct -y
else
    echo "Unsupported distribution: $distro"
fi

# finish
echo "Finished🍺"
