class CreateWalletEntries < ActiveRecord::Migration[7.0]
  def change
    create_table :wallet_entries do |t|
      t.references :wallet, null: false, foreign_key: true
      t.integer :kind, null: false, default: 0
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.datetime :occurred_at, null: false

      t.timestamps
    end

    add_index :wallet_entries, %i[wallet_id occurred_at]
  end
end