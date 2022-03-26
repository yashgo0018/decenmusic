import React, { Component, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Image,
  Menu,
  Visibility,
} from 'semantic-ui-react'

import logo from '../../assets/polygon-logo.svg'
import ConnectWallet from '../Wallet/ConnectWallet'

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '4em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};


export default function Header() {
  const [menuFixed,] = useState(true);
  const { pathname } = useLocation();

  return (
    <div>
      <Visibility
        once={false}
      >
        <Menu
          borderless
          fixed={menuFixed ? 'top' : undefined}
          style={menuFixed ? fixedMenuStyle : menuStyle}
        >
          <Container>
            <Menu.Item>
              <Image size='small' src={logo} />
            </Menu.Item>
            {/* <Menu.Item header>Start-Kit</Menu.Item> */}
            {
              pathname.includes('admin') ? <>
                <Menu.Item as={Link} to='/admin/upload-song' name="upload-song">Upload Song</Menu.Item>
                <Menu.Item as={Link} to='/admin/pending-song' name="pending-song">Pending Song Upload Requests</Menu.Item>
              </>
                : <>
                  <Menu.Item as='a' link={true} href="https://docs.matic.network/docs/develop/getting-started" target="_blank">Docs</Menu.Item>
                  <Menu.Item as='a' link={true} href="https://polygon-tutorial.solidstake.net" target="_blank">Tutorial</Menu.Item>
                </>
            }


            <Menu.Menu position='right'>
              <ConnectWallet />
            </Menu.Menu>
          </Container>
        </Menu>
      </Visibility>
    </div>
  )
}
