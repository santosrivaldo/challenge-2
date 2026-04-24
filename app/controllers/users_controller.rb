
class UsersController < ApplicationController
  before_action :set_user, only: %i[show edit update wallet_transaction]

  def index
    @users = User.order(:name)
  end

  def show
    @wallet = @user.wallet
    @entries = @wallet&.wallet_entries&.order(occurred_at: :desc, id: :desc) || WalletEntry.none
  end

  def new
    @user = User.new
  end

  def edit; end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user, notice: "Usuário criado com sucesso."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      redirect_to @user, notice: "Usuário atualizado."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def wallet_transaction
    wallet = @user.wallet
    unless wallet
      redirect_to users_path, alert: "Carteira não encontrada."
      return
    end

    Wallets::CreditDebitService.new(
      wallet: wallet,
      kind: params[:kind],
      amount: params[:amount]
    ).call
    redirect_to @user, notice: "Operação registrada."
  rescue Wallets::CreditDebitService::Error => e
    redirect_to @user, alert: e.message
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email)
  end
end