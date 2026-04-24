
User.transaction do
  u = User.find_or_initialize_by(email: "demo@example.com")
  u.name = "Usuário demo" if u.new_record? || u.name.blank?
  u.save!
  Wallet.find_or_create_by!(user: u) { |w| w.balance = 0 }
end