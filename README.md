# mydoctool-front

Ce repo contient l'ensemble du Front-End de MyDocTool.
Technologies utilisées :
- React 0.14.3
- React-Router 1.0.0-rc4
- Flux 2.1.1

### Serveur pré-prod:
- Adresse : `51.255.39.42`
- User : `root`
- Clé d'identification : `mydoctool-api/server/mydoctool_rsa`

### How to deploy:

Se connecter au serveur `ssh -i server/mydoctool_rsa root@51.255.39.42`

```
    $> cd /var/www/mydoctool-front
    $> ssh-agent bash -c 'ssh-add /root/.ssh/id_rsa_front; git pull'
    $> npm install
    $> npm run deploy
    $> exit
```
