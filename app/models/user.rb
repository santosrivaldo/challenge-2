
class User < ApplicationRecord
  has_one :wallet, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }

  before_validation :normalize_email

  after_create :create_wallet!

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end

  def create_wallet!
    Wallet.create!(user: self, balance: 0)
  end
end