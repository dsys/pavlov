# migrations

This directory uses [mattes/migrate](https://github.com/mattes/migrate) to manage migrations for PostgreSQL.

## Install

    $ make install

## Create a migration

    $ make create NAME=<NAME>

## Upgrade/downgrade local development/test PostgreSQL databases

    $ make up             # upgrade cleargraph-development to latest migration
    $ make down           # downgrade one migration
    $ make up ENV=test    # upgrade cleargraph-test to latest migration
    $ make down ENV=test  # downgrade one migration

## Upgrade/downgrade staging/production Google Cloud Spanner databases

    $ make up   ENV=staging ADAPTER=spanner # upgrade cleargraph-staging to latest migration
    $ make down ENV=staging ADAPTER=spanner # downgrade one migration

## Force a version

In the event of a failed migration, the database may be left in a dirty state. First, fix any uncommitted changes. Then, force the version:

    $ make force VERSION=XXXX
