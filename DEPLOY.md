CPDI Frontend Dev Deploy Guide

Build the tarball
1. Open the project in VS Code
2. If you haven't already run npm install
3. Open git bash terminal in VS Code
4. Switch to develop branch, i.e.
   $ git checkout develop
5. $ ./scripts/build_usda_tarball
6. the build will take a while. When it is finished an up-to-date cpdifrontend.tar.gz file will exist in the project root folder.

Prep and install 1st server
7. $ scp cpdifrontend.tar.gz <paccount>@10.203.24.12:cpdifrontend.tar.gz
8. $ ssh <paccount>@10.203.24.12
9. sudo su
10. $ /app/scripts/s1_deploy.sh
    Verify service started

Prep and install 2nd server
Repeat the steps done on the 1st server on the 2nd substituting
.17 for .12 in the IP addresses
