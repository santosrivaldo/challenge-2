
require "test_helper"

module Wallets
  class CreditDebitServiceTest < ActiveSupport::TestCase
    setup do
      @user = User.create!(name: "S", email: "s@example.com")
      @wallet = @user.wallet
    end

    test "credit increases balance" do
      Wallets::CreditDebitService.new(wallet: @wallet, kind: :credit, amount: "10").call
      assert_equal BigDecimal("10"), @wallet.reload.balance
    end

    test "debit decreases balance" do
      Wallets::CreditDebitService.new(wallet: @wallet, kind: :credit, amount: "10").call
      Wallets::CreditDebitService.new(wallet: @wallet, kind: :debit, amount: "4").call
      assert_equal BigDecimal("6"), @wallet.reload.balance
    end
  end
end