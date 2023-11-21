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
9. $ /app/scripts/s1_deploy
10. $ systemctl stop cpdifrontend-dev.dev.service
11. $ systemctl status cpdifrontend-dev.dev.service
    Verify service stopped
12. /app/scripts/s2_deploy
13. $ systemctl start cpdifrontend-dev.dev.service
14. exit (exits sudo)
15. exit (exits remote)

Prep and install 2nd server
16. scp cpdifrontend.tar.gz <paccount>@10.203.24.17:cpdifrontend.tar.gz
17. ssh <paccount>@10.203.24.17
18. /app/scripts/s1_deploy
19. /app/scripts/s2_deploy
20. exit (exits sudo)
21. exit (exits remote)
