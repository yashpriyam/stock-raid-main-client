import React, { useState, useContext, useEffect } from "react"
import moment from 'moment'
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import BuyStocks from "../stockComponents/buy-stocks.components"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import Chart from '../charts/chart'
import Modal from 'react-modal';
// import Modal from '../../helpers/modal/modal.component';
import "./stock-cards.styles.css"
import { SimpleSpinner } from "../../helpers/LoadingSpinner/loadingSpinner.component"

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

function StockCard() {
  const { stock, userWalletDetails } = useContext(AllStocksContext)
  const { stockname, stocksymbol, pershareprice, lastPrices } = stock
  const value = Number(pershareprice).toFixed(2);
  const [numberOfStocks, setNumberOfStocks] = useState("")
  const [isPurchaseAble, setIsPurchaseAble] = useState(false)
  const [currentWalletBalance, setCurrentWalletBalance] = useState("")
  const [totalCostOfPurchase, setTotalCostOfPurchase] = useState(0)
  const [chartVisible, setChartVisible] = useState(false)
  const [stockPriceClass, setStockPriceClass] = useState('')
  const [chartButtonTitle, setChartButtonTitle] = useState('OPEN CHART');
  const [buyButtonTitle, setBuyButtonTitle] = useState('BUY');
  const [profitLoss, setprofitLoss] = useState('')
  const handleChange = (event) => {
    const { value } = event.target
    setNumberOfStocks(Number(value))
  }

  const buyStockFunction = () => {
    setCurrentWalletBalance(Number(userWalletDetails.walletBalance))
    setTotalCostOfPurchase(Number(pershareprice) * Number(numberOfStocks))
    if (Number(currentWalletBalance).toFixed(2) < Number(totalCostOfPurchase).toFixed(2)) {
      return alert(`You dont have enough balance in your wallet to make this transaction \n\n
      add ${
        totalCostOfPurchase - userWalletDetails.walletBalance
      } more to your wallet to do this transaction`);
    } else {
      setIsPurchaseAble(!isPurchaseAble);
    }
  }

  useEffect(() => {
    isPurchaseAble ? setBuyButtonTitle('CANCEL') : setBuyButtonTitle('BUY') && setNumberOfStocks("")
  }, [isPurchaseAble])
  
  // const seeChart = () => {
  //   setChartVisible(!chartVisible);
  // }
  useEffect(() => {
    chartVisible === true ? setChartButtonTitle('CLOSE CHART') : setChartButtonTitle('OPEN CHART')
  }, [chartVisible])

  let priceDataArray;
  let price;
    priceDataArray = lastPrices.map(eachTransaction => {
      const unixTimeStamp = moment.unix(eachTransaction.unixTime);
      price = eachTransaction.price;
      // setprofitLoss(pershareprice - price)
      return [unixTimeStamp, price];
    })

    useEffect(() => {
      if (priceDataArray !== []) {
        setprofitLoss((pershareprice - price).toFixed(2))
      }
    }, [price])

  

  // console.log(priceDataArray[0][1])
  // priceDataArray[0][1] >= value ? setStockPriceClass('loss') : setStockPriceClass('profit')


  return (
    <div className="card-container">
      <div className='stock-detail-container'>
        <div>{stockname}</div>
        <div>{stocksymbol}</div>
      </div>
      <div className='stock-price-container'>Current Price: <span className={stockPriceClass}>${value}</span></div>
      {!profitLoss ? <SimpleSpinner/> : <div className={profitLoss > 0 ? 'profit' : 'loss'}>{`${profitLoss}`}</div>}
      <div className='buy-stock-container'>
        <FormInput
          type="number"
          name="stockquantity"
          label="Number of stocks"
          value={numberOfStocks}
          onChange={handleChange}
        />
        <CustomButton onClick={buyStockFunction}>{buyButtonTitle}</CustomButton>
      </div>
      <CustomButton onClick={() => setChartVisible(!chartVisible)}>{chartButtonTitle}</CustomButton>
      <Modal isOpen={chartVisible} style={customStyles} onRequestClose={() => setChartVisible(false)}>
        <Chart name={stockname} priceData={priceDataArray}/>
        {/* <CustomButton onClick={() => setChartVisible(!chartVisible)}>CLOSE</CustomButton> */}
      </Modal>
      <Modal isOpen={isPurchaseAble} style={customStyles} onRequestClose={() => setIsPurchaseAble(false)}>
        <BuyStocks
          stock={stock}
          currentWalletBalance={currentWalletBalance}
          totalCostOfPurchase={totalCostOfPurchase}
          numberOfStocks={numberOfStocks}
          closeModal={() => {
            setIsPurchaseAble(false)
            setNumberOfStocks('')
          }}
        />
        <CustomButton onClick={() => setIsPurchaseAble(false)}>CLOSE</CustomButton>
      </Modal>
    </div>
  )
}

export default StockCard
