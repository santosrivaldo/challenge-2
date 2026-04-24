
class Wallet < ApplicationRecord
  belongs_to :user
  has_many :wallet_entries, dependent: :destroy

  validates :balance, numericality: true
end