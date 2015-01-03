#!/bin/bash

# ideally we should use some versioning or better
# naming here, and not just dump it to /tmp as well
cd /tmp/build

# install all dependencies listed in package.json
npm install

# nodemon is responsible for starting the app and making
# sure it will be refreshed or respawned in case it exits
# or changes for no apparent reason, so we don't have to
# do this manually (the -g flag install it systemwide)
npm install -g nodemon

nodemon --debug server.js
