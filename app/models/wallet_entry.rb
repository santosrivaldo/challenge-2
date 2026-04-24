
class WalletEntry < ApplicationRecord
  belongs_to :wallet

  enum kind: { credit: 0, debit: 1 }

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :occurred_at, presence: true
end