import React, { useState, useContext, useEffect } from "react"
import UserStocksContext from "../../helpers/contexts/user-stocks.contexts"
import SellStock from "../stockComponents/sell-stocks.components"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import Modal from 'react-modal'
import "./user-stocks.styles.css"

function UserStocks() {
  const { userStock, stockList } = useContext(UserStocksContext)
  const { numberOfStocks, stockName, totalCostOfPurchase = 0 } = userStock
  const [numberOfStocksToSell, setNumberOfStocksToSell] = useState("")
  const [sellingConfirmation, setSellingConfirmation] = useState(false)
  const [profitLoss, setProfitLoss] = useState('Profit');
  const sellStock = () => setSellingConfirmation(true)
  const handleChange = (event) => {
    const { value } = event.target
    setNumberOfStocksToSell(value)
  }

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  // console.log(stockList);
  const stockBeingSold = stockList.filter(
    (stock) => stock.stockname === userStock.stockName
  )
  console.log(stockBeingSold[0]);

  // let percentProfitLoss;
  // let currentAmount;
  // useEffect(() => {
  //   currentAmount = stockBeingSold[0].pershareprice * numberOfStocks;
  //   if (currentAmount > totalCostOfPurchase) {
  //     setProfitLoss('profit');
  //     percentProfitLoss = ((currentAmount - totalCostOfPurchase)/totalCostOfPurchase)*100
  //   }
  //   if (currentAmount < totalCostOfPurchase) {
  //     setProfitLoss('loss')
  //     percentProfitLoss = ((currentAmount - totalCostOfPurchase)/totalCostOfPurchase)*100
  //   }
  //   if (currentAmount === totalCostOfPurchase) {
  //     setProfitLoss('no-profit-no-loss')
  //   }
  // }, [])
  
  // console.log(stockBeingSold[0].pershareprice * numberOfStocks);


  return (
    <div className="card-container">
      <div className='stock-detail-container'>
        <div>{stockName}</div>
        {/* <div>{stockBeingSold[0].stocksymbol}</div> */}
      </div>
      {/* <div className={`stock-performance ${profitLoss}`}>
        <div>{`%${percentProfitLoss}`}</div>
      </div> */}
      <div>Number Of Stocks: <span>{userStock.numberOfStocks}</span></div>
      <div>Value Of Stocks: <span>${(totalCostOfPurchase).toFixed(2)}</span></div>
      <div className='buy-stock-container'>
        <FormInput
          type="number"
          name="stockquantity"
          label="Number of stocks"
          value={numberOfStocksToSell}
          onChange={handleChange}
          min={1}
          max={numberOfStocks}
        />
        <CustomButton onClick={sellStock}>SELL</CustomButton>
      </div>
      <Modal isOpen={sellingConfirmation} style={customStyles} onRequestClose={() => setSellingConfirmation(false)}>
        <SellStock
          numberOfStocksToSell={numberOfStocksToSell}
          stockBeingSold={stockBeingSold}
          closeModal={() => setSellingConfirmation(false)}
        />
        <CustomButton onClick={() => {
          setSellingConfirmation(false)
          setNumberOfStocksToSell('')
        }}>
          CLOSE
        </CustomButton>
      </Modal>
    </div>
  )
}

export default UserStocks
