FROM registry.cn-hangzhou.aliyuncs.com/geeme/nginx:stable

MAINTAINER GuizhongChen

ADD ./dist /usr/share/nginx/html

#OOPSD
RUN cd /etc/apt/ && rm -rf apt.conf.d  preferences.d  sources.list.d  trusted.gpg  trusted.gpg.d && \
    sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list &&\
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --allow-unauthenticated -y curl

RUN /bin/bash -c 'echo init hairdressing frontend ok!!!'