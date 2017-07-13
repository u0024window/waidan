#!/bin/sh

#http://43.227.141.63/jenkins_2/job/waidan/
# Building in workspace /data/jenkins/workspace/waidan
output="/data/jenkins/jobs/waidan/builds/$BUILD_NUMBER/archive"
echo "remove node_modules" &&
rm -rf ./node_modules &&
echo "npm install" &&
npm install &&
echo "npm run publish" &&
npm run publish &&
echo "rename dist to waidan" &&
rm -rf ./waidan &&
mv dist waidan &&
rm -rf ./waidan.tar.gz &&
echo "tar waidan to waidan.tar.gz" &&
tar -czf "waidan.tar.gz" ./waidan &&
echo "create output dir: $output" &&
mkdir -p $output &&
echo "copy to output" &&
cp -rf "./waidan.tar.gz" "$output/" &&
echo "http://100.77.2.4:8899/jenkins_2/job/waidan/ws/waidan.tar.gz" &&
echo "done"


