# NodeJS-Template ![](https://img.shields.io/badge/Node.JS-6.9.1-3572A5.svg?style=plastic) ![](https://img.shields.io/badge/Status-Completed-008000.svg?style=plastic)

### **Table of Contents**
1. [**Installing and Running**](#1-installing-and-running)

---
### **1. Installing and Running**

To install the project, run these commands:

```bash
sudo yum -y install git
mkdir myapp
cd myapp
git clone https://github.com/TundraFizz/NodeJS-Template.git .
. install.sh
```

Once the template has been installed, you can can run the command ```. server``` to have it automatically manage your server, or you can do it manually by running one of these two commands.

```nodemon server.js``` to run the server in development mode. You can stop the server by either pressing Ctrl+C or closing the terminal.

```nohup node server.js &``` to run the server in production mode. Your server will continue to run even when the terminal is closed.
