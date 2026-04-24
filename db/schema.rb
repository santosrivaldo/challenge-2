ActiveRecord::Schema[7.0].define(version: 20_250_424_100_003) do
  enable_extension "plpgsql"

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "wallet_entries", force: :cascade do |t|
    t.bigint "wallet_id", null: false
    t.integer "kind", default: 0, null: false
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.datetime "occurred_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["wallet_id", "occurred_at"], name: "index_wallet_entries_on_wallet_id_and_occurred_at"
    t.index ["wallet_id"], name: "index_wallet_entries_on_wallet_id"
  end

  create_table "wallets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.decimal "balance", precision: 15, scale: 2, default: "0.0", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_wallets_on_user_id", unique: true
  end

  add_foreign_key "wallet_entries", "wallets"
  add_foreign_key "wallets", "users"
end