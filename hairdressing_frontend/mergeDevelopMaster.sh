#!/bin/bash

git checkout develop

git pull


git checkout test

git pull

git merge origin/develop

git push

git checkout master

git pull

git merge origin/test

git push