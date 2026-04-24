Rails.application.routes.draw do
  root "users#index"

  resources :users do
    member do
      post :wallet_transaction
    end
  end

  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index show create update]
      get "/users/:user_id/wallet/balance", to: "users/wallets#balance", as: :user_wallet_balance
      get "/users/:user_id/wallet/entries", to: "users/wallets#entries", as: :user_wallet_entries
      post "/users/:user_id/wallet/transactions", to: "users/wallets#transactions", as: :user_wallet_transactions
    end
  end
end
