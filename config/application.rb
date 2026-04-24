require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "rails/test_unit/railtie"
require "sprockets/railtie"

Bundler.require(*Rails.groups)

module WalletApp
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = false
    config.autoload_paths << Rails.root.join("app/services")
    config.eager_load_paths << Rails.root.join("app/services")
    config.generators.system_tests = nil
    config.active_job.queue_adapter = :async
  end
end