
module Wallets
  class CreditDebitService
    class Error < StandardError; end

    def initialize(wallet:, kind:, amount:)
      @wallet = wallet
      @kind = kind.to_s
      @amount = BigDecimal(amount.to_s)
    end

    def call
      raise Error, "tipo inválido" unless WalletEntry.kinds.key?(@kind)
      raise Error, "valor deve ser positivo" if @amount <= 0

      ApplicationRecord.transaction do
        locked = Wallet.lock.find(@wallet.id)
        delta = @kind == "credit" ? @amount : -@amount
        new_balance = locked.balance + delta
        raise Error, "saldo insuficiente" if new_balance.negative?

        locked.wallet_entries.create!(
          kind: @kind,
          amount: @amount,
          occurred_at: Time.current
        )
        locked.update!(balance: new_balance)
        locked
      end
    end
  end
end