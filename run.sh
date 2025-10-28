#!/bin/bash

# Load the .env file and run the Node.js application with the specified argument
export $(grep -v '^#' .env | xargs)
node "$@"