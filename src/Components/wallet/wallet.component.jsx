import React, { useEffect, useState, useContext } from "react"
import moment from 'moment'
import CustomButton from "../../helpers/custom-button/custom-button.component"
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import MoneyAdder from './addmoney.component';
import Chart from '../charts/chart';
import "./wallet.styles.css";
import "../../App.css";


function Wallet() {
  const { userWalletDetails } = useContext(AllStocksContext)
  const { walletBalance, username, lastBalances } = userWalletDetails
  const [moreMoneyNeeded, setMoreMoneyNeeded] = useState(false)
  const [chartVisible, setChartVisible] = useState(false)
  const [chartButtonTitle, setChartButtonTitle] = useState('OPEN CHART');
  const addAmount = () => setMoreMoneyNeeded(true)

  const seeChart = () => {
    setChartVisible(!chartVisible);
  }
  useEffect(() => {
    chartVisible === true ? setChartButtonTitle('CLOSE CHART') : setChartButtonTitle('OPEN CHART')
  }, [chartVisible])

  const cancelAdding = () => {
    setMoreMoneyNeeded(false)
  }

  const priceDataArray = lastBalances.map(eachTransaction => {
    const unixTimeStamp = moment.unix(eachTransaction.unixTime);
    const balance = eachTransaction.balance;
    return [unixTimeStamp, balance];
  })

  return (
    <div className={`wallet-container wallet `}>
      <h3>Wallet Details</h3>
      <h2>${walletBalance}</h2>
      <CustomButton onClick={seeChart}>{chartButtonTitle}</CustomButton>
      {chartVisible && <Chart username={username} priceData={priceDataArray}/>}
      <CustomButton onClick={addAmount}>Add More Money</CustomButton>
      {moreMoneyNeeded && <MoneyAdder cancelAdding={cancelAdding} />}
    </div>
  )
}

export default Wallet
