import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Header from './components/Header';
import Footer from './components/Footer';

import Content from './components/Containers';
import { Container, Image } from 'semantic-ui-react';
import iconDevx from "./assets/icon-devx.svg"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CreateSong from './admin/pages/CreateSong';
import { createContext, useState } from 'react';
import LoginContext from './LoginContext';

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};


function App() {
  const [user, setUser] = useState({ address: '', token: '', loggedIn: false });

  return (
    <Router>
      <LoginContext.Provider value={{ user, setUser }}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <div className="App">
            <Header />
            <Content>
              <Container>
                <Routes>
                  <Route path="/admin/upload-song" element={<CreateSong />} />
                </Routes>
              </Container>
            </Content>
            <Footer />
          </div>
        </Web3ReactProvider>
      </LoginContext.Provider>
    </Router>
  );
}

export default App;
