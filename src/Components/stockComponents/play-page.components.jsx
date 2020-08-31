import React, { useState, useEffect, useContext } from "react"
import StockCard from "../stockCards/stock-cards.components"
import UserStocks from "../userStocks/user-stocks.components"
import Container from "../ChatComponents/Container"
import AllStocksContext from "../../helpers/contexts/stock-detail.contexts"
import UserStocksContext from "../../helpers/contexts/user-stocks.contexts"
import UserDetailContext from "../../helpers/contexts/user-detail.contexts"
import ChannelContext from "../../helpers/contexts/chat-channel.contexts"
import ConnectionContext from "../../helpers/contexts/chat-connection.contexts"
import Wallet from "../wallet/wallet.component"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import '../../App.css'

function PlayPage() {
  const { setUserDetails } = useContext(UserDetailContext)
  const [stockList, setStockList] = useState([])
  const [userStocksList, setUserStocksList] = useState([])
  const [userWalletDetails, setUserWalletDetails] = useState(0)
  const [allStockSearchField, setAllStockSearchField] = useState("")
  const [userStockSearchField, setUserStockSearchField] = useState("")
  const { userDetails } = useContext(UserDetailContext)
  const [connection, setconnection] = useState(null)
  const [channel, setChannel] = useState(null)
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
          console.log(JSON.parse(e.data))
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
          `https://stock-raid-basic-server.herokuapp.com/api/userstocks/${userDetails.email}`
        )
        userStocksData.onmessage = (e) => {
          const userStocksJson = JSON.parse(e.data)
          console.log(userStocksJson.userStocks)
          setUserStocksList(userStocksJson.userStocks)
        }
      } catch (error) {
        const err = new Error("Cannot get stocks data", 500)
        return err
      }
    }
    const getUserWallet = async () => {
      try {
        const userWallet = new EventSource(
          `https://stock-raid-basic-server.herokuapp.com/api/wallet/${userDetails.email}`
        )
        userWallet.onmessage = (e) => {
          const userWalletJson = JSON.parse(e.data)
          console.log(userWalletJson)
          setUserWalletDetails(userWalletJson.wallet)
        }
        // const userWalletJson = await userWallet.json();
      } catch (error) {
        const err = new Error("Can not get user's wallet balance data", 500)
        return err
      }
    }
    getAllStocks()
    currentUserStocks()
    getUserWallet()
  }, [userDetails.email])
  const signOut = () => {
    setUserDetails({});
    localStorage.clear();
  }
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
    <div className='main'>
        
          <CustomButton className='header' onClick={signOut}>Sign Out</CustomButton>
          <AllStocksContext.Provider
            value={{
              userWalletDetails,
            }}
          >
            <div className='header'>
            <Wallet />
            </div>
          </AllStocksContext.Provider>
        {/* </div> */}
        <div className='stock-cards'>
          <h2>BUY STOCKS</h2>
          <FormInput
            value={allStockSearchField}
            label="Search Stocks To Buy"
            onChange={onAllStockSearchChange}
          />
          {filteredStockList.map((stock) => (
            <AllStocksContext.Provider
              value={{
                stock,
                userWalletDetails,
              }}
            >
                <div className="inside-stocks">
                  <StockCard key={stock.id} />
                </div>
            </AllStocksContext.Provider>
          ))}
        </div>
        <div className='user-stocks'>
          <h2>Stocks You Have</h2>
          <FormInput
            value={userStockSearchField}
            label="Search Stocks To Sell"
            onChange={onUserStockSearchChange}
          />
          {filteredUserStocksList.map((userStock) => (
            <UserStocksContext.Provider
              value={{
                userStock,
                userWalletDetails,
                stockList,
              }}
            >
            
                <div className='inside-user-stocks'>
                  <UserStocks key={userStock.id} />
                </div>
            </UserStocksContext.Provider>
          ))}
        </div>
        <div id='side-chat'>
          <ConnectionContext.Provider value={{ connection, updateConnection }}>
            <ChannelContext.Provider value={{ channel, updateChannel }}>
              <Container />
            </ChannelContext.Provider>
          </ConnectionContext.Provider>
        </div>
    </div>
  )
}

export const ConnectionConsumer = ConnectionContext.Consumer
export const ChannelConsumer = ChannelContext.Consumer
export default PlayPage
