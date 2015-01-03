#!/bin/bash
#
# simple deploy script to bring up docker units
# with each service running as much isolated as possible
#
# we can improve the grunt bit later to package a
# stable and/or master checkouts, tags etc so we can
# have separated testing and production enviroments with
# the same deploy script

set -xev

# this way we can just call ./deploy.sh <username> and
# it will be used by docker, otherwise defaults to papito

userinput=${1}
userdefault=artmello
username=${userinput:-${userdefault}}

apiname=backend
appname=frontend
dbname=database

function build() {
	echo "Building project with grunt..."
	grunt build || exit 1
}

function setup() {
	echo "Preparing host environment, installing Docker..."

	[ -e /usr/lib/apt/methods/https ] || {
		apt-get --yes update && apt-get --yes --force-yes install apt-transport-https
	}

	# docker >= 1.4.1
	apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys A88D21E9
	apt-add-repository --yes "deb https://get.docker.com/ubuntu docker main"
	apt-get update --yes && apt-get install --yes --force-yes lxc-docker
}

function deploy_db() {
	echo "Deploying the Mongo container..."
	ln -s -fv ./Dockerfile.db ./Dockerfile

	# for persisting data outside the container
	mkdir -p /opt/mongodb

	docker build -t ${username}/${dbname} .

	# an alternative to mapping the service port (which affects the host in weird
	# and unexpected ways) would be to only use the VMs IP addresses to do the
	# talking between them, and then export variables with ports, IPs etc below
	docker run -itd --name mongodb -p 27017 -v /opt/mongodb:/data/db ${username}/${dbname}
}

function deploy_api() {
	echo "Deploying the API container..."
	ln -s -fv ./Dockerfile.api ./Dockerfile
	docker build -t ${username}/${apiname} .
	docker run -itd --name api -p 8443 --link mongodb:mongo ${username}/${apiname}
}

build
setup

#deploy_db
deploy_api

rm -fv ./Dockerfile
