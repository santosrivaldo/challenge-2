FROM ruby:3.2-slim-bookworm

RUN apt-get update -qq \
  && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    postgresql-client \
  && rm -rf /var/lib/apt/lists/*

RUN adduser --system --group --uid 1000 --home /home/rails rails

WORKDIR /app

COPY Gemfile ./
ENV BUNDLE_WITHOUT="development:test"
RUN bundle install --jobs 4 --retry 3 \
  && chown -R rails:rails /usr/local/bundle

COPY . .
RUN chmod +x docker/web/entrypoint.sh \
  && chown -R rails:rails /app

USER rails

RUN SECRET_KEY_BASE=dummy_for_assets_only RAILS_ENV=production bundle exec rails assets:precompile

EXPOSE 3000

ENTRYPOINT ["/app/docker/web/entrypoint.sh"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
