import React, { useState, useContext } from "react"
import UserStocksContext from "../../helpers/contexts/user-stocks.contexts"
import SellStock from "../stockComponents/sell-stocks.components"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import "./user-stocks.styles.css"

function UserStocks() {
  const { userStock } = useContext(UserStocksContext)
  const { numberOfStocks, stockName, totalCostOfPurchase } = userStock
  const [numberOfStocksToSell, setNumberOfStocksToSell] = useState("")
  const [sellingConfirmation, setSellingConfirmation] = useState(false)
  const sellStock = () => setSellingConfirmation(true)
  const handleChange = (event) => {
    const { value } = event.target
    setNumberOfStocksToSell(value)
  }
  // console.log(`usersStockList = ${stockList}`);

  const cancelSell = () => {
    setSellingConfirmation(false)
    setNumberOfStocksToSell("")
  }

  return (
    <div className='user-stock-card-container'>
      <h2>Stocks You Have</h2>
      <div>{stockName}</div>
      <div>{userStock.numberOfStocks}</div>
      <div>{(totalCostOfPurchase).toFixed(2)}</div>
      <FormInput
        type="number"
        name="stockquantity"
        label="Number of stocks"
        value={numberOfStocksToSell}
        onChange={handleChange}
        min={1}
        max={numberOfStocks}
        step="1"
        oninput="validity.valid||(value='');"
      />
      <CustomButton onClick={sellStock}>SELL</CustomButton>
      {sellingConfirmation && (
        <SellStock
          numberOfStocksToSell={numberOfStocksToSell}
          cancelSell={cancelSell}
        />
      )}
    </div>
  )
}

export default UserStocks
