#!/bin/bash

# Installation script of tutorial creator
# 1. Set environment variables for apollo (server and client executable jars)
# 2. Compile tutorial creator server and client
# 3. Chmod the shell script that runs the java program and put that script in /usr/local/bin
# 4. Install chrome native messaging host
# 5. Display usage of how to use client

# Set environment variables for apollo (server and client executable jars)
case $OSTYPE in
  darwin*)
    CONFIG_FILE=.bash_profile
    ;;
  *)
    CONFIG_FILE=.bashrc
    ;;
esac

# path to directory where tutorials are stored
TUTORIAL_HOME="$HOME/.tutorial"
# path to project directory
APOLLO="$( cd "$( dirname "$0" )" && pwd)"

if [[ ! -d "$TUTORIAL_HOME" ]]; then
  echo "Creating home tutorial directory at $TUTORIAL_HOME..."
  echo ""
  mkdir -p "$TUTORIAL_HOME"
fi

echo "Setting Environment Variables..."

# check if these environment variables exist in config file, return status 1 == general error, 0 == executed successfully
if [ "$(grep -q TUTORIAL_HOME "$HOME/$CONFIG_FILE"; echo $?)" -eq 1 ]; then
  echo "export TUTORIAL_HOME=$TUTORIAL_HOME" >> "$HOME/$CONFIG_FILE"
fi

if [ "$(grep -q APOLLO "$HOME/$CONFIG_FILE"; echo $?)" -eq 1 ]; then
  echo "export APOLLO=$APOLLO" >> "$HOME/$CONFIG_FILE"
fi

# Compile tutorial creator server and client
echo "Compiling apollo server and client"
mvn package
echo ""

cp "$APOLLO/target/apollo.jar" "$APOLLO/target/apollod.jar" "$APOLLO/bin"

# Chmod client and server script
chmod +x "$APOLLO/bin/apollo"
# chrome needs to open and execute the server file
chmod 777 "$APOLLO/bin/apollod"
# put cli script in /usr/local/bin
cp "$APOLLO/bin/apollo" /usr/local/bin/


# Install chrome native messaging host
echo "Installing Native Messaging Host..."
. install_chrome_host.sh
echo ""


echo "Apollo installed successfully!"
# TODO: make apollo -h display usage
apollo -h