# Puff Smith

Who wants try this application, here is the place where to do it in a simple way.

### Startup

Just run `$ docker compose up` to test it in a terminal or `$ docker compose up -d` to keep it running (until manual stop or docker restart).

### Build

If you want fresh build of the current version, you have to run `$ docker build -t marekhanzal/puff-smith:latest .` (in the root folder where
Dockerfile lives), wait a lot of time and then run the previous command.

When building by yourself, pray to your favourite gods as this thing will take a lot of time.

### Important note

This setup does not use volumes, so it will not be persistent - if you want to run production version of the app, you have to
tweak the file by yourself :).

### Usage

Access http://localhost:42000/

- login by the `root` user with `1234` password
- or login by the `test` user with `1234` password
- if you want to cleanup the installation, use `$ docker compose rm` in this folder (where this README.md lies)

### Last notes

- when started (for the first time), wait a few minutes to startup and prepare the application
