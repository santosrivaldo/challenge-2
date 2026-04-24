
require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.require_master_key = false
  config.secret_key_base = ENV.fetch("SECRET_KEY_BASE")

  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.assets.compile = false
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info").to_sym
  config.log_tags = [:request_id]
  config.action_controller.perform_caching = true
  config.cache_store = :memory_store
  config.active_support.report_deprecations = false
  config.active_record.dump_schema_after_migration = false
  config.force_ssl = ENV.fetch("FORCE_SSL", "false") == "true"
  config.assume_ssl = ENV.fetch("ASSUME_SSL", "false") == "true"
  config.hosts << /.*/
end