
module Api
  module V1
    class UsersController < Api::V1::ApplicationController
      def index
        users = User.includes(:wallet).order(:name)
        render json: users.map { |u| user_json(u) }
      end

      def show
        user = User.includes(:wallet).find(params[:id])
        render json: user_json(user)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "utilizador não encontrado" }, status: :not_found
      end

      def create
        user = User.new(user_params)
        if user.save
          render json: user_json(user.reload), status: :created
        else
          render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      def update
        user = User.find(params[:id])
        if user.update(user_params)
          render json: user_json(user.reload)
        else
          render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "utilizador não encontrado" }, status: :not_found
      end

      private

      def user_params
        params.permit(:name, :email)
      end

      def user_json(user)
        wallet = user.wallet
        {
          id: user.id,
          name: user.name,
          email: user.email,
          balance: wallet ? format_decimal(wallet.balance) : "0.00",
        }
      end

      def format_decimal(value)
        format("%.2f", value.to_d)
      end
    end
  end
end
