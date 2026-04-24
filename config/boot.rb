ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup"
require "bootsnap/setup" if ENV["BOOTSNAP_CACHE_DIR"] || ENV["RAILS_ENV"] == "development"