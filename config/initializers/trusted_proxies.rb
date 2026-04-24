require "ipaddr"

Rails.application.config.action_dispatch.trusted_proxies = [
  IPAddr.new("127.0.0.0/8"),
  IPAddr.new("::1/128"),
  IPAddr.new("172.16.0.0/12"),
  IPAddr.new("10.0.0.0/8"),
  IPAddr.new("192.168.0.0/16"),
]