# Dockerfile
FROM python:3.7
RUN pip install pipenv
RUN mkdir /code
WORKDIR /code
COPY Pipfile* /code/
RUN pipenv install --system --deploy --ignore-pipfile
ADD core /code/