
require "test_helper"

class ApiV1UsersTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(name: "Alpha", email: "alpha@example.com")
    @other = User.create!(name: "Beta", email: "beta@example.com")
  end

  test "index returns users with balance" do
    get api_v1_users_path
    assert_response :success
    list = JSON.parse(response.body)
    assert_kind_of Array, list
    assert list.any? { |u| u["id"] == @user.id && u["balance"] == "0.00" }
    assert list.any? { |u| u["email"] == "beta@example.com" }
  end

  test "show returns user" do
    get api_v1_user_path(@user)
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @user.id, body["id"]
    assert_equal "Alpha", body["name"]
    assert_equal "alpha@example.com", body["email"]
    assert_equal "0.00", body["balance"]
  end

  test "show 404 for missing user" do
    get api_v1_user_path(999_999)
    assert_response :not_found
    assert_equal "utilizador não encontrado", JSON.parse(response.body)["error"]
  end

  test "create user" do
    assert_difference -> { User.count }, +1 do
      post api_v1_users_path,
           params: { name: "Novo", email: "novo@example.com" },
           as: :json
    end
    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "Novo", body["name"]
    assert_equal "novo@example.com", body["email"]
    assert_equal "0.00", body["balance"]
  end

  test "create validation error" do
    post api_v1_users_path,
         params: { name: "", email: "bad" },
         as: :json
    assert_response :unprocessable_entity
    assert JSON.parse(response.body)["error"].present?
  end

  test "update user" do
    patch api_v1_user_path(@user),
          params: { name: "Alpha2", email: "alpha2@example.com" },
          as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "Alpha2", body["name"]
    assert_equal "alpha2@example.com", body["email"]
    @user.reload
    assert_equal "alpha2@example.com", @user.email
  end

  test "update duplicate email" do
    patch api_v1_user_path(@user),
          params: { name: "Alpha", email: @other.email },
          as: :json
    assert_response :unprocessable_entity
  end

  test "update 404" do
    patch api_v1_user_path(999_999),
          params: { name: "X", email: "x@example.com" },
          as: :json
    assert_response :not_found
  end
end
