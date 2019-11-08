#!/bin/bash

echo $CLASPRC_JSON
echo $CLASPRC_JSON > ~/.clasprc.json
yarn deploy
