import React, { useState, useEffect, useContext, useCallback } from "react"
import StockCard from "../stockCards/stock-cards.components"
import UserStocks from "../userStocks/user-stocks.components"
import Wallet from "../wallet/wallet.component"
import Container from "../ChatComponents/Container"
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import UserStocksContext from "../../helpers/contexts/user-stocks.contexts"
import UserDetailContext from "../../helpers/contexts/user-detail.contexts"
import ChannelContext from "../../helpers/contexts/chat-channel.contexts"
import ConnectionContext from "../../helpers/contexts/chat-connection.contexts"
import FormInput from "../../helpers/form-input/form-input.component"
import { WithSpinner, SimpleSpinner } from '../../helpers/LoadingSpinner/loadingSpinner.component';
// import CustomButton from "../../helpers/custom-button/custom-button.component"
import './play-page.styles.scss'


const WalletWithSpinner = WithSpinner(Wallet);




function PlayPage() {
  const { userDetails = {}, logOut } = useContext(UserDetailContext)
  const [stockList, setStockList] = useState([])
  const [userStocksList, setUserStocksList] = useState([])
  const [userWalletDetails, setUserWalletDetails] = useState({})
  const [allStockSearchField, setAllStockSearchField] = useState("")
  const [userStockSearchField, setUserStockSearchField] = useState("")
  const [connection, setconnection] = useState(null)
  const [channel, setChannel] = useState(null)

  // let userStocksList = [];
  // console.log(userDetails);
  // const { userData, token } = userDetails;
  // console.log(Object.values(userData)[0], token);
  const updateConnection = (conn) => {
    setconnection(conn)
  }
  const updateChannel = (chn) => {
    setChannel(chn)
  }

  useEffect(() => {
    const getAllStocks = () => {
      try {
        const allStocksData = new EventSource(
          "https://stock-raid-basic-server.herokuapp.com/api/stocks"
        )
        allStocksData.onmessage = (e) => {
          // console.log(JSON.parse(e.data))
          const allStocksJson = JSON.parse(e.data)
          setStockList(allStocksJson.stocks)
        }
      } catch (error) {
        const err = new Error("Cannot get stocks data", 500)
        return err
      }
    }
    const currentUserStocks = () => {
      try {
        const userStocksData = new EventSource(
          "https://stock-raid-basic-server.herokuapp.com/api/userstocks"
        )
        userStocksData.onmessage = (e) => {
          const userStocksJson = JSON.parse(e.data)
          // console.log(userStocksJson.userStocks)
          const userStocksList = userStocksJson.userStocks;
          const currentUserStocks = userStocksList.filter(stock => stock.email === userDetails.email)
          // console.log(currentUserStocks)
          setUserStocksList(currentUserStocks);
        }
      } catch (error) {
        const err = new Error("Cannot get stocks data", 500)
        return err
      }
    }
    
    const getUserWallet = async () => {
      try {
        const userWallet = new EventSource(
          "https://stock-raid-basic-server.herokuapp.com/api/wallet"
        )
        userWallet.onmessage = (e) => {
          const userWalletJson = JSON.parse(e.data)
          const currentUserWallet = userWalletJson.wallet
          const userWallet = currentUserWallet.filter(walletData => walletData.email === userDetails.email)
          // console.log(userWallet)
          setUserWalletDetails(userWallet[0])
        }
        // const userWalletJson = await userWallet.json();
      } catch (error) {
        const err = new Error("Can not get user's wallet balance data", 500)
        return err
      }
    }
    getUserWallet()
    getAllStocks()
    currentUserStocks()
  }, []);


  // const userStockData = useCallback((stockList) => {
  //   setUserStocksList(stockList);
  // },[stockList])

  const onAllStockSearchChange = (event) => {
    setAllStockSearchField(event.target.value)
  }
  const onUserStockSearchChange = (event) => {
    setUserStockSearchField(event.target.value)
  }

  const filteredStockList = stockList.filter(
    (stocks) =>
      stocks.stockname
        .toLowerCase()
        .includes(allStockSearchField.toLowerCase()) ||
      stocks.stocksymbol
        .toLowerCase()
        .includes(allStockSearchField.toLowerCase())
  )
  const filteredUserStocksList = userStocksList.filter((stocks) =>
    stocks.stockName.toLowerCase().includes(userStockSearchField.toLowerCase())
  )

  return (
    <div className='stock-raid-container'>
      <div className='header'>
        <div className='head-title'>
          <div className='play-page-title'>STOCK RAID</div>
          <div className='play-page-subtitle'>Trade FAST. Win BIG</div>
        </div>
        <AllStocksContext.Provider
          value={{
            userWalletDetails,
          }}
        >
          <WalletWithSpinner isLoading={userWalletDetails !== {} ? false : true} />
        </AllStocksContext.Provider>
        {userDetails.username ? <div className='user-name'>{`Trader: ${userDetails.username.toUpperCase()}`}</div> : <SimpleSpinner/>}
        <button className='nav-button' onClick={logOut}>Sign Out</button>
      </div>
      <div className='stock-cards'>
        <FormInput
          value={allStockSearchField}
          label="Search Stocks To Buy"
          onChange={onAllStockSearchChange}
        />
      </div>
      <div className='content-subcontainer'>
        <div>
          <div className='stock-cards-container'>
            {filteredStockList.map((stock) => (
              <AllStocksContext.Provider
                value={{
                  stock,
                  userWalletDetails,
                }}
              >
                <StockCard key={stock.id} />
              </AllStocksContext.Provider>
            ))}
            </div>
          <h2>Your Portfolio</h2>
          <FormInput
            value={userStockSearchField}
            label="Search Stocks To Sell"
            onChange={onUserStockSearchChange}
          />
        <div className='stock-cards-container'>
          {filteredUserStocksList.map((userStock) => (
            <UserStocksContext.Provider
              value={{
                userStock,
                userWalletDetails,
                stockList,
              }}
            >
              {userStock ? <UserStocks key={userStock.id} /> : <SimpleSpinner/>}
            </UserStocksContext.Provider>
          ))}
        </div>
      </div>
      <div className='side-chat'>
        <ConnectionContext.Provider value={{ connection, updateConnection, userDetails }}>
          <ChannelContext.Provider value={{ channel, updateChannel }}>
            <Container />
          </ChannelContext.Provider>
        </ConnectionContext.Provider>
      </div>
      </div>    
    </div>
  )
}

export const ConnectionConsumer = ConnectionContext.Consumer
export const ChannelConsumer = ChannelContext.Consumer
export default PlayPage
