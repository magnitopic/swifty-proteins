FROM postgres:16-alpine

# Copy init database scripts
COPY init-db.sql /docker-entrypoint-initdb.d/
COPY init-db.sh /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_DB=swifty_proteins
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Expose port
EXPOSE 5432
