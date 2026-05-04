-- Roda como superusuário (postgres):
--   psql -U postgres -h localhost -f scripts/setup-db.sql
--
-- Cria usuário e banco que casam com .env (DATABASE_URL=eitacraque/eitacraque)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'eitacraque') THEN
    CREATE ROLE eitacraque LOGIN PASSWORD 'eitacraque';
  END IF;
END
$$;

SELECT 'CREATE DATABASE eitacraque OWNER eitacraque'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eitacraque')\gexec

\connect eitacraque

GRANT ALL ON SCHEMA public TO eitacraque;
ALTER SCHEMA public OWNER TO eitacraque;
