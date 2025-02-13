#!/bin/bash
echo "ipfs install"
# . "$HOME/.bash_profile"
echo 'sudo apt update'
sudo apt update -y

echo 'sudo apt upgrade'
sudo apt upgrade -y

export SWARM_KEY=$(tr -dc a-f0-9 </dev/urandom | head -c 64; echo '')
echo "Created secret: $SWARM_KEY"

export LIBP2P_FORCE_PNET=1
export IPFS_PATH="$HOME/.ipfs"
ver="v0.31.0" 
echo 'wget https://dist.ipfs.tech/kubo/v0.31.0/kubo_v0.31.0_linux-amd64.tar.gz'
wget https://dist.ipfs.tech/kubo/v0.31.0/kubo_v0.31.0_linux-amd64.tar.gz

echo 'tar -xvzf kubo_v0.31.0_linux-amd64.tar.gz'
tar -xvzf kubo_v0.31.0_linux-amd64.tar.gz

echo './kubo/install.sh'
./kubo/install.sh

#sudo bash $HOME/kubo/install.sh
ipfs --version

mkdir -p $HOME/.ipfs

#CREATE THE SWARM KEY
echo "/key/swarm/psk/1.0.0/
/base16/
$SWARM_KEY" > $HOME/.ipfs/swarm.key

chmod 600 home/.ipfs/test/swarm.key
echo "swarm key created!!"

sudo chown -R test $HOME/.ipfs/

echo 'ipfs init --profile=server'
sudo ipfs init --profile=server

echo 'ipfs bootstrap rm --all'
sudo ipfs bootstrap rm --all

echo 'ipfs pin ls --type recursive | cut -d' ' -f1 | xargs -n1 ipfs pin rm'
sudo ipfs pin ls --type recursive | cut -d' ' -f1 | xargs -n1 ipfs pin rm

echo 'ipfs repo gc'
ipfs repo gc

#SETUP IPFS AS SERVICE
echo "Creating Kubo service"
cat > /etc/systemd/system/ipfs.service <<  EOF
[Unit]
Description=Kubo Service
After=network.target

[Service]
User=test
WorkingDirectory=/home/test/.ipfs
ExecStart=/usr/local/bin/ipfs daemon
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "ipfs sevice created."

sudo systemctl daemon-reload
echo "systemctl daemon reloaded."

sudo systemctl enable ipfs
echo "systemctl enbled ipfs"

sudo systemctl start ipfs
echo "systemctl started ipfs"