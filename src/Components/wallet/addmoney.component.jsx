import React, { useContext, useState } from 'react';
import AllStocksContext from '../../helpers/contexts/stock-detail.contexts';
import FormInput from '../../helpers/form-input/form-input.component';
import CustomButton from '../../helpers/custom-button/custom-button.component';


const MoneyAdder = (props) => {
    const { cancelAdding } = props
    const { userWalletDetails } = useContext(AllStocksContext);
    const [amountToAdd, setAmountToAdd] = useState("");

    console.log(userWalletDetails);
    const updatedWalletBalance = Number(userWalletDetails.walletBalance) + Number(amountToAdd) >= 0
    ? Number(userWalletDetails.walletBalance) + Number(amountToAdd)
    : 0
    const handleChange = (event) => {
      const { value } = event.target
      setAmountToAdd(value)
    }
    const addMoney = async (event) => {
        event.preventDefault();
      if (amountToAdd <= 0) {
        const err = new Error("Enter correct amount to add");
        return err;
      }
      try {
        const walletUpdate = await fetch(
          `http://localhost:5001/api/wallet/${userWalletDetails.email}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletBalance: updatedWalletBalance,
            }),
          }
        )
        const walletUpdateJson = await walletUpdate.json();
        cancelButton();
        // console.log(walletUpdateJson)
      } catch (error) {
        const err = new Error("Transaction failed", 500)
        return err;
      }
    }
  
    const cancelButton = () => {
      cancelAdding()
      setAmountToAdd("")
    }
    return (
      <form onSubmit={addMoney}>
        <FormInput
          type="number"
          name="money"
          label="Enter Amount"
          value={amountToAdd}
          onChange={handleChange}
          min={0}
          max={100000000}
        />
        <CustomButton type="submit">ADD MONEY TO WALLET</CustomButton>
        <CustomButton onClick={cancelButton}>CANCEL</CustomButton>
      </form>
    )
  }

export default MoneyAdder;