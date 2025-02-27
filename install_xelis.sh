#!/bin/bash
DIR="/home/.local/share/xelis-blockchain"

PROFILE=$(basename $SHELL)rc

echo "Installing Rust:"
# curl --proto '=https' -sSf https://sh.rustup.rs | sh -s -- --default-toolchain -y
# sudo apt install cargo -y
git clone https://github.com/xelis-project/xelis-blockchain
source ~/.profile
sudo chown -R test /home/test/xelis-blockchain/
cd xelis-blockchain
echo "Building Xelis:"
cargo build --release
mkdir -p /home/.local/share/xelis-blockchain

mv /home/test/xelis-blockchain/target/release/* $DIR
sudo chown -R test $DIR
source ~/.bashrc

echo "Creating Xelis Daemon service"
cat > /etc/systemd/system/xelis_daemon.service <<  EOF
[Unit]
Description=Xelis Daemon Service
After=network.target

[Service]
User=test
Group=www-data
WorkingDirectory=$DIR
Environment="PATH=$DIR"
ExecStart=$DIR/xelis_daemon --allow-fast-sync --auto-prune-keep-n-blocks 1000 --disable-ip-sharing --p2p-bind-address 0.0.0.0:2121
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Starting Xelis Daemon Service..."
sudo systemctl daemon-reload
sudo systemctl enable xelis_daemon.service
sudo systemctl start xelis_daemon.service