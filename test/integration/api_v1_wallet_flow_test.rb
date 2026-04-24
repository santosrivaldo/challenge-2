
require "test_helper"

class ApiV1WalletFlowTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(name: "API", email: "api@example.com")
  end

  test "balance returns zero" do
    get api_v1_user_wallet_balance_path(user_id: @user.id)
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @user.id, body["user_id"]
    assert_equal "0.00", body["balance"]
  end

  test "transactions credit then balance" do
    post api_v1_user_wallet_transactions_path(user_id: @user.id),
         params: { kind: "credit", amount: "12.50" },
         as: :json
    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "12.50", body["balance"]

    get api_v1_user_wallet_balance_path(user_id: @user.id)
    assert_equal "12.50", JSON.parse(response.body)["balance"]
  end

  test "entries filtered by period" do
    post api_v1_user_wallet_transactions_path(user_id: @user.id),
         params: { kind: "credit", amount: "5" },
         as: :json
    assert_response :created

    from = 1.day.ago.iso8601
    to = 1.day.from_now.iso8601
    get api_v1_user_wallet_entries_path(user_id: @user.id, from: from, to: to)
    assert_response :success
    entries = JSON.parse(response.body)["entries"]
    assert_equal 1, entries.size
    assert_equal "credit", entries.first["kind"]
  end

  test "debit fails when insufficient funds" do
    post api_v1_user_wallet_transactions_path(user_id: @user.id),
         params: { kind: "debit", amount: "1" },
         as: :json
    assert_response :unprocessable_entity
  end
end