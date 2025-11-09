# Custom MySQL image with schema initialization
FROM mysql:8

# Default database and root password (for dev/testing)
ENV MYSQL_DATABASE=devops
ENV MYSQL_ROOT_PASSWORD=1234

# Copy initialization scripts (runs on first container start when data dir is empty)
COPY init/ /docker-entrypoint-initdb.d/
