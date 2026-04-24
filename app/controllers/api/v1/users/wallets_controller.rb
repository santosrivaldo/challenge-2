
module Api
  module V1
    module Users
      class WalletsController < Api::V1::ApplicationController
        before_action :set_user
        before_action :set_wallet

        def balance
          render json: { user_id: @user.id, balance: format_decimal(@wallet.balance) }
        end

        def entries
          scope = @wallet.wallet_entries.order(occurred_at: :desc, id: :desc)
          scope = apply_period(scope)
          render json: {
            user_id: @user.id,
            entries: scope.map { |e| entry_json(e) },
          }
        end

        def transactions
          kind = transaction_params[:kind]
          amount = transaction_params[:amount]
          Wallets::CreditDebitService.new(wallet: @wallet, kind: kind, amount: amount).call
          render json: { user_id: @user.id, balance: format_decimal(@wallet.reload.balance) }, status: :created
        rescue Wallets::CreditDebitService::Error => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        private

        def set_user
          @user = User.find(params[:user_id])
        end

        def set_wallet
          @wallet = @user.wallet
          return if @wallet

          render json: { error: "carteira não encontrada" }, status: :not_found
          return
        end

        def transaction_params
          params.permit(:kind, :amount)
        end

        def apply_period(scope)
          from = parse_time(params[:from])
          to = parse_time(params[:to])
          scope = scope.where("occurred_at >= ?", from) if from
          scope = scope.where("occurred_at <= ?", to) if to
          scope
        end

        def parse_time(value)
          return if value.blank?

          Time.zone.parse(value)
        end

        def entry_json(entry)
          {
            id: entry.id,
            kind: entry.kind,
            amount: format_decimal(entry.amount),
            occurred_at: entry.occurred_at.iso8601,
          }
        end

        def format_decimal(value)
          format("%.2f", value)
        end
      end
    end
  end
end