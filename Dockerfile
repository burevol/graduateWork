# Dockerfile
FROM python:3.9
RUN mkdir /code
WORKDIR /code
COPY requirements2.txt /code/
RUN pip install -r requirements2.txt
ADD graduateWork /code/