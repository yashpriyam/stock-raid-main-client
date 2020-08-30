import React, { useState, useContext } from "react"
import moment from 'moment'
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import BuyStocks from "../stockComponents/buy-stocks.components"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import Chart from '../charts/chart'
// import Modal from '../../helpers/modal/modal.component';
import "./stock-cards.styles.css"

function StockCard() {
  const { stock, userWalletDetails } = useContext(AllStocksContext)
  const { stockname, stocksymbol, pershareprice, lastPrices } = stock
  const value = Number(pershareprice).toFixed(2);
  const [numberOfStocks, setNumberOfStocks] = useState("")
  const [isPurchaseAble, setIsPurchaseAble] = useState(false)
  const [currentWalletBalance, setCurrentWalletBalance] = useState("")
  const [totalCostOfPurchase, setTotalCostOfPurchase] = useState(0)
  const handleChange = (event) => {
    const { value } = event.target
    setNumberOfStocks(Number(value))
  }

  const buyStockFunction = () => {
    setCurrentWalletBalance(Number(userWalletDetails.walletBalance))
    setTotalCostOfPurchase(Number(pershareprice) * Number(numberOfStocks))
    setTimeout(() => {
      if (Number(currentWalletBalance).toFixed(2) < Number(totalCostOfPurchase).toFixed(2)) {
        return alert(`You dont have enough balance in your wallet to make this transaction \n\n
        add ${
          totalCostOfPurchase - userWalletDetails.walletBalance
        } more to your wallet to do this transaction`);
      } else {
        setIsPurchaseAble(true);
      }
    }, 0)
  }
  const cancelTransaction = () => {
    setIsPurchaseAble(false)
    setNumberOfStocks("")
  }

  const priceDataArray = lastPrices.map(eachTransaction => {
    const unixTimeStamp = moment.unix(eachTransaction.unixTime);
    const price = eachTransaction.price;
    return [unixTimeStamp, price];
  })


  return (
    <div className="card-container">
      <h3>{stockname}</h3>
      <h4>{stocksymbol}</h4>
      <h4>${value}</h4>
      <Chart priceData={priceDataArray}/>
      <FormInput
        type="number"
        name="stockquantity"
        label="Number of stocks"
        value={numberOfStocks}
        onChange={handleChange}
      />
      <CustomButton onClick={buyStockFunction}>BUY</CustomButton>
      {isPurchaseAble && 
        <BuyStocks
          stock={stock}
          currentWalletBalance={currentWalletBalance}
          totalCostOfPurchase={totalCostOfPurchase}
          numberOfStocks={numberOfStocks}
          cancelTransaction={cancelTransaction}
        />
      }
    </div>
  )
}

export default StockCard
