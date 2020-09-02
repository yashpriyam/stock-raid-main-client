import React, { useEffect, useState, useContext } from "react"
import moment from 'moment'
import CustomButton from "../../helpers/custom-button/custom-button.component"
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import MoneyAdder from './addmoney.component';
import Chart from '../charts/chart';
import Modal from 'react-modal';
import { SimpleSpinner } from '../../helpers/LoadingSpinner/loadingSpinner.component';
import "./wallet.styles.css";
// import "../../App.css";


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

function Wallet() {
  const { userWalletDetails } = useContext(AllStocksContext)
  const { walletBalance, lastBalances } = userWalletDetails
  // const [moreMoneyNeeded, setMoreMoneyNeeded] = useState(false)
  const [chartVisible, setChartVisible] = useState(false)
  const [chartButtonTitle, setChartButtonTitle] = useState('YOUR WALLET TREND');
  // const addAmount = () => setMoreMoneyNeeded(true)
  const [modalOpen, setModalOpen] = useState(false);

  const seeChart = () => {
    setChartVisible(!chartVisible);
  }
  useEffect(() => {
    chartVisible === true ? setChartButtonTitle('CLOSE') : setChartButtonTitle('YOUR WALLET TREND')
  }, [chartVisible])

  // const cancelAdding = () => {
  //   setMoreMoneyNeeded(false)
  // }

  // console.log(userWalletDetails);
  // console.log(walletBalance);
  // console.log(lastBalances);
  // console.log(userWalletDetails.email);
  console.log(userWalletDetails.lastBalances);


  let priceDataArray;
  if (lastBalances) {
    priceDataArray = lastBalances.map(eachTransaction => {
      const unixTimeStamp = moment.unix(eachTransaction.unixTime);
      const balance = eachTransaction.balance;
      return [unixTimeStamp, balance];
    })
  }

  return (
    <div className='wallet-container'>
        <div className='balanace-btn'>
          {walletBalance ? <div className='wallet-bln'>${walletBalance}</div> : <SimpleSpinner/>}
          
          <button className='nav-button' onClick={() => setModalOpen(true)}>Add Money</button>
        </div>
        <button className='nav-button' onClick={seeChart}>{chartButtonTitle}</button>
      <Modal isOpen={chartVisible} style={customStyles} onRequestClose={() => setChartVisible(false)}>
        <Chart name={`Your Income`} priceData={priceDataArray} closeModal={() => setChartVisible(false)}/>
      </Modal>
      <Modal isOpen={modalOpen} style={customStyles} onRequestClose={() => setModalOpen(false)}>
        <MoneyAdder closeModal={() => setModalOpen(false)} />
        <CustomButton onClick={() => setModalOpen(false)}>CLOSE</CustomButton>
      </Modal>
      {/* {moreMoneyNeeded && <MoneyAdder />} */}
    </div>
  )
}

export default Wallet
