FROM ruby:3.2-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN set -eux; \
  apt-get update --allow-releaseinfo-change \
    -o Acquire::Retries=5 \
    -o Acquire::http::Timeout=120; \
  apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    libyaml-dev \
    postgresql-client; \
  rm -rf /var/lib/apt/lists/*

RUN adduser --system --group --uid 1000 --home /home/rails rails

WORKDIR /app

ENV BUNDLE_RETRY=10
ENV BUNDLE_TIMEOUT=300

COPY Gemfile Gemfile.lock ./
ENV BUNDLE_WITHOUT=development

ARG RUBYGEMS_MIRROR=
RUN set -eux; \
  if [ -n "${RUBYGEMS_MIRROR}" ]; then \
    bundle config set mirror.https://rubygems.org "${RUBYGEMS_MIRROR}"; \
  fi; \
  bundle install --jobs 4 --retry 10 \
  && chown -R rails:rails /usr/local/bundle

COPY . .
RUN chmod +x docker/ci/entrypoint.sh \
  && chown -R rails:rails /app

USER rails

ENTRYPOINT ["/app/docker/ci/entrypoint.sh"]
CMD ["bundle", "exec", "rails", "test"]
