import React, { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useEagerConnect, useInactiveListener } from '../../hooks'
import connectorList, { resetWalletConnectConnector } from '../../lib/connectors'
import { Dropdown } from 'semantic-ui-react'
import LoginContext from '../../LoginContext';

import Axios from 'axios';

const ConnectWallet = () => {
  const { activate, deactivate, active, address, error, account } = useWeb3React();
  const { user, setUser } = useContext(LoginContext);
  console.log(user)
  console.log(account)
  if (user.address != account) {
    if (account) {
      console.log("Hello")
      login()
    } else if (user.address) {
      console.log("a");
      setUser({ address: '', token: '', loggedIn: false });
    }
  }

  async function login() {
    const { data: { message } } = await Axios.get(`http://localhost:8000/auth/get-nonce-message/${account}`);
    console.log(message);
  }
  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  const handleClick = (connectorName) => async () => {
    await activate(connectorList[connectorName]);
  };

  const connectServer = () => {
    setTimeout(() => console.log(account), 1000);
  }

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    resetWalletConnectConnector(connectorList['WalletConnect']);
    deactivate();
  };

  return (
    <Dropdown text='Wallet' pointing className='link item'>


      {(() => {
        if (active) {
          return <Dropdown.Menu>
            <Dropdown.Item className="button-disconnect" onClick={handleDisconnect}>
              Disconnect Wallet
            </Dropdown.Item>
          </Dropdown.Menu>
        } else {
          if (!error) {
            return <Dropdown.Menu>
              <Dropdown.Item onClick={handleClick('MetaMask')}>MetaMask</Dropdown.Item>
              <Dropdown.Item onClick={handleClick('WalletConnect')}>WalletConnect</Dropdown.Item>
              <Dropdown.Item onClick={handleClick('WalletLink')}>WalletLink</Dropdown.Item>
            </Dropdown.Menu>
          } else {
            return <Dropdown.Menu>
              <Dropdown.Item onClick={handleRetry}>Retry</Dropdown.Item>
            </Dropdown.Menu>
          }
        }
      })()}

    </Dropdown>
  );
};

export default ConnectWallet;
