#!/bin/bash
# remove local build
rm -rf .next/ &&
# build for production
npm run build &&

# Source and destination paths
remote_username="mrkuzcmm"
remote_server="mrkuz.com"
remote_path="/home/mrkuzcmm/planify.mrkuz.com"

# compress with .deployignore files and folders
# echo "compressing files ..."
tar -czvf web.tar.gz --exclude-from=.deployignore --wildcards .[^.]* * &&
# copy to remote server
echo "copying compressed file to the server ..."
scp web.tar.gz "$remote_username@$remote_server:$remote_path" &&
# extract compressed file
echo "extracting the file on remote server ..."
ssh "$remote_username@$remote_server" "cd $remote_path && rm -r .next/ && tar -xzf web.tar.gz && rm web.tar.gz" &&
# remove compressed file from the local
rm web.tar.gz &&

echo """
        **********************************************
        *** Conguragulation Successfully Deployed! ***
        **********************************************
    """
