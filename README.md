This is a work in progress. Don't expect everything to work.

# Setting up a user

If you're setting the bionet up to be used in production you will want to run it as its own user. E.g:

```
adduser bionet
```

Then do everything below as the bionet user.

# Downloading

```
sudo aptitude install git # if you don't already have git installed
git clone https://github.com/biobricks/bionet-new
```

# Installing pre-requisites

Note: you might want to use your system's built in method for installing the latest version of nodejs rather than using nvm.

## nodejs using nvm method (recommended for development)

```
# install nvm
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# install node
nvm install --lts
```

## nodejs using package manager

The following is for Debian/Ubuntu based distros only. Instructions for many popular distros available [here](https://nodejs.org/en/download/package-manager/). 

```
curl -sL https://deb.nodesource.com/setup_6.x > /tmp/node_setup
# look at /tmp/node_setup and ensure that the script does what's expected
sudo -E bash /tmp/node_setup
sudo apt install nodejs
```

## npm packages

```
# install node packages
cd bionet-new/
npm install
```

## ElasticSearch

ElasticSearch is required if you want human language search (fuzzy matching). If ElasticSearch is not present on your system then only search results exactly matching your query will work (though case and whitespace is ignored).

Follow [this guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html) to install from the official repository so you'll get security updates.

## BLAST+

BLAST+ is required if you want to be able to run BLAST queries on DNA, RNA or Amino Acid sequences. As with ElasticSearch only exact matching is possible if BLAST is not installed.

You will have to compile the latest version, since the version bundled with most distros is not new enough to work with the bionet.

First install build essentials:

```
sudo apt install build-essential
```

Download the latest version from the NCBI ftp server ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ .  It's probably ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ncbi-blast-2.6.0+-x64-linux.tar.gz .

Extract, compile and install:

```
cd ncbi-blast-2.6.0+-src/c++
./configure
make
sudo make install
cd ..
```

# Configuring

```
cd bionet-new/
mkdir -p static/build
mkdir -p pandadoc
cp settings.js.example settings.js 
cp settings.client.js.example settings.client.js 
```

Then edit each of the settings.js files to suit your needs.

# Generate key pair for labdevice (printer/scanner) server

```
mkdir -p labdevice/client_keys
cd labdevice/
ssh-keygen -t rsa -f hostkey -N ""
cd ../
```

and copy the ssh public key for each labdevice client to the `labdevice/client_keys/` directory to authorize the client.

# Email

If you're running in production mode you will probably want to have a local SMTP server so the bionet can send outgoing emails. Install postfix and accept default options for everything but the system mail name. Ensure that the system mail name is the full domain name used by users to access the website, e.g. `my.domain.org`.

```
sudo apt install postfix
```

Another option is to change the mail server settings in `settings.js`.

# Building and development

The very first time you build you have to do:

```
gulp build:css
```

To begin developing simply run:

```
npm run dev
```

This will start the server, watch for changes to js and css files and enable hot module reloading.

The hot module reloading can be a bit buggy. You can run development mode without it like so:

```
./bin/dev.js --cold
```

Also available are these `npm run` commands:

* start: start server
* build: build js and css once
* watch: watch js and css and build when changed
* hot: same as watch but with hot module reloading
* build-js: build js once
* watch-js: watch js and build when changed
* hot-js: same as watch-js but with hot module reloading
* build-css: build css once
* watch-css: watch js and build when changed

# The bionet commands

## ./bin/server.js

```
Usage: ./bin/server.js
```

Arguments:

* --debug: Enable debug output
* --port <port_number>: Specify port number
* --settings <filepath.js>: Specify settings.js file

## ./bin/db.js

```
Usage: ./bin/db.js <sub_command> [sub_command arguments]
```

Sub-commands:

* dump: Dump the entire database as JSON to stdout
* import file.json: Import database from JSON
* user list: List all users
* user test: Create a test user for unit testing purposes

This command is described more in the backup section.

# Production 

Here are some notes for setting up the bionet for production use.

## Web app

## label-printer client

You should install the label-printer client on a computer with internet access which is hooked up via USB to the physical label printer (e.g. Brother QL-570). We recommend using a small single-board computer like the Beagle Bone Black, which you can then physicalle attach to the label-printer (hot glue works) to ensure they take up minimal space and stay together.

For instructions see the README.md for [bionet-labelprinter](https://github.com/biobricks/bionet-labelprinter)

## SSH reverse tunnel

Since it is likely that the printer client will be running on a network where it will not have its own IP or port that's accessible from the outside it's useful to set up an auto-establishing ssh reverse tunnel. You will need a server that is world-accessible via ssh and on which you have root access. 

On the server you will need to add the following to /etc/ssh/sshd_config

```
Match User bionet-tunnel
   AllowTcpForwarding yes
   X11Forwarding no
   PermitTunnel no
   GatewayPorts yes # Allow users to bind tunnels on non-local interfaces
   AllowAgentForwarding no
   PermitOpen localhost:2222 myserver.example.com:2222 # Change this line!
   ForceCommand echo 'This account is restricted for ssh reverse tunnel use'
```

Where you replace myserver.example.com with the public hostname or public IP of the server on which you are editing this file.

Then run:

```
sudo /etc/init.d/ssh restart
```

Create a user for the tunnel on the server:

```
adduser \
  --disabled-password \
  --shell /bin/false \
  --gecos "user for bionet printer client ssh tunnel" \
  bionet-tunnel
```

On the computer running the bionet label-printer client, log in as the user running the printer client app and generate an ssh key:

```
ssh-keygen -t rsa
```

Hit enter to accept the default when it asks you for the key location. Now open the public key file:

```
less ~/.ssh/id_rsa.pub
```

and copy the contents into your copy-paste buffer.

On the server, create the .ssh directory and authorized keys file. Set permissions and open the file in an editor. Then paste the public key into the file and close and save.

```
cd /home/bionet-tunnel
mkdir .ssh
touch .ssh/authorized_keys
chmod 700 .ssh
chmod 600 .ssh/authorized_keys
chown -R bionet-tunnel.bionet-tunnel .ssh
nano .ssh/authorized_keys
# paste in the public key, hit ctrl+x then y, then enter to save
```

Now from the computer running the bionet label-printer client, as the user running the label-printer client software, try to ssh to the server:

```
ssh -N bionet-tunnel@myserver.example.com
```

If it asks for a password something went wrong. If it just sits there forever, apparently doing nothing, then everything is working as expected.

Now try to create a tunnel:

```
ssh bionet-tunnel@myserver.example.com -N -R myserver.example.com:2222:localhost:22 
```

while that is running, from e.g. your laptop try to connect to the label-printer client computer via the reverse tunnel:

```
ssh -p 2222 bionet@myserver.example.com
```

You should get a password prompt (or a shell if you have pubkey authentication set up).

If this works you can set up autossh to make the label-printer client auto-establish the tunnel on boot and auto-re-establish this tunnel every time it fails.

Assuming you're root on the label-printer client computer, first install autossh:

```
apt-get install autossh
```

Then copy production/autossh_loop from this directory to /usr/local/bin/autossh_loop on the label-printer client computer and make it executable with:

```
chmod 755 /usr/local/bin/autossh_loop
```

Copy production/autossh.service to /etc/systemd/system/autossh.service and edit the file changing all occurrences of `myserver.example.com` to the hostname of your server and changing the `User=bionet` line to the user that you granted access to the server. 

Save the file and run:

```
systemctl daemon-reload
service autossh start
```

Your tunnel should now be establish and will re-establish on reboot or failure.

# Backups

You can dump the entire database of the running bionet app to a JSON file using:

```
./bin/db.js dump > ./myfile.json
```

It is recommended to run this e.g. every hour using a cron job such that other backup systems that image the entire filesystem won't end up with a copy of the database that is in an inconsistant state (if for example the filesystem was copied during a large batch write to the database). 

A database backup script suitable for calling from cron is included here:

```
production/db_backup.sh
```

You will need to tweak the `MAX_BACKUP_SIZE`, `BIONET_PATH` and `DB_BACKUP_PATH` at the beginning of the script.

You can restore from a backup by first deleting the old database (obviously be careful) using `rm -rf bionet-new/db` and then running:

```
./bin/db.js import ./myfile.json
```

# API

There are two versions of the API. A javascript-only API requiring specific libraries and a JSON-RPC 2.0 standards-compatible API. Both APIs expose the same functionality, but with some limitations and modifications in the features of the JSON-RPC 2.0 API works due to its request-response nature. The JSON-RPC 2.0 API can be easily used from any programming language capable of HTTP requests.

## Javascript API

The javascript API is the must full-featured, with support for streams, persistent connections and multiplexing multiple RPC calls and streams over a single websocket. This API relies on the [rpc-multistream](https://www.npmjs.com/package/rpc-multistream) and [rpc-multiauth](https://www.npmjs.com/package/rpc-multiauth) libraries. The simplest way to use it is with the [bionet-client](https://www.npmjs.com/package/bionet-client) library.

## JSON-RPC 2.0

The JSON-RPC 2.0 API exposes the same functions as the javascript API but whenever an API function would have returned a readable stream (either directly or through a callback) the readable stream is converted to a string, buffer or array depending on the type of data output by the stream. Functionality where a writable stream is returned by the javascript API is not available through this API. Duplex streams are converted to readable streams so only the readable endpoint is available.

The authentication for this API is handled using cookies.

Documentation and python examples for the JSON-RPC 2.0 API are in the `examples/python_json_rpc_client` directory.

# Unit testing

## Backend

The backend currently has no unit tests but many of the individual modules that make up the backend have a set of unit tests written using [tape](https://github.com/substack/tape). The plan is to have unit tests for the entire RPC system and public API. 

## Frontend

We're using [nightwatch](https://nightwatchjs.org) for end-to-end testing. 

You need Java 8 installed (unclear if Oracle Java is required or not) and latest stable Crhome or Chromium. To install via PPAs on Ubuntu:

```
# Oracle Java 8
sudo add-apt-repository ppa:webupd8team/java
sudo apt update
sudo apt install oracle-java8-installer
sudo apt install oracle-java8-set-default
```

```
# Chromium latest stable:
sudo add-apt-repository ppa:chromium-daily/stable 
sudo apt-get update
sudo apt-get install chromium-browser
```

Then you need to download Selenium and the Chrome Selenium plugin:

```
cd selenium/
./fetch.sh
cd ..
```

Copy our default nightwatch config file to get started:

```
cp nightwatch.conf.js.example nightwatch.conf.js
```

Now you should be able to run the frontend unit tests using:

```
npm run ftest
```

The frontend tests are located in the `frontend_tests/` directory.

# ToDo

## Build system

* Add font inlining
* Switch to gulp?

# Gotchas and known issues

## Peer disovery

Right now DHT-based peer discovery won't work if your bionet node is _not_ hosted at the root URL of your hostname. E.g. if your `settings.baseUrl` is `https://mynode.org` then you're fine, but if it's `https://mynode.org/bionet` then it won't work.

The peer connector also currently assumes that a node on port 443 is using SSL and a node on any other port is not.

# Notes

Username restrictions:

* No @ symbols
=======
# bionet-private
>>>>>>> e1b2796755d4c0ef184c33c643dc192fdb31eeb0
