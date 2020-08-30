import React, { useState, useContext } from "react"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import MoneyAdder from './addmoney.component';
import "./wallet.styles.css";
import "../../App.css";


function Wallet() {
  const { userWalletDetails } = useContext(AllStocksContext)
  const { walletBalance } = userWalletDetails
  const [moreMoneyNeeded, setMoreMoneyNeeded] = useState(false)
  const addAmount = () => setMoreMoneyNeeded(true)

  const cancelAdding = () => {
    setMoreMoneyNeeded(false)
  }

  return (
    <div className="wallet-container wallet">
      <h3>Wallet Details</h3>
      <h2>${walletBalance}</h2>
      <CustomButton onClick={addAmount}>Add More Money</CustomButton>
      {moreMoneyNeeded && <MoneyAdder cancelAdding={cancelAdding} />}
    </div>
  )
}

export default Wallet
