
require "test_helper"

class WalletEntryTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(name: "João", email: "joao@example.com")
    @wallet = @user.wallet
  end

  test "requires positive amount" do
    entry = @wallet.wallet_entries.build(kind: :credit, amount: 0, occurred_at: Time.current)
    assert_not entry.valid?
  end
end