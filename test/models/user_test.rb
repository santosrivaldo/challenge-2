
require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "creates wallet on create" do
    user = User.create!(name: "Maria", email: "maria@example.com")
    assert user.wallet
    assert_equal 0, user.wallet.balance
  end

  test "rejects duplicate email" do
    User.create!(name: "A", email: "dup@example.com")
    user = User.new(name: "B", email: "dup@example.com")
    assert_not user.valid?
  end
end