

import './App.css';
import { BrowserRouter, Route } from "react-router-dom"
import HomePage from './screens/HomePage';
import ChatPage from './screens/ChatPage';
import ChatProvider from './context/ChatProvider';

import AllPosts from './screens/AllPosts';
import SinglePost from './screens/SinglePost';
import MainPage from './screens/MainPage';
import ErrorPage from './screens/ErrorPage/ErrorPage';




function App() {
  return (
    <div className='App'>

      <BrowserRouter>
        <ChatProvider>
          <Route path="https://algoarena-frontend.onrender.com/" component={HomePage} exact />
          <Route path="https://algoarena-frontend.onrender.com/chats" component={ChatPage} exact />
          <Route path="https://algoarena-frontend.onrender.com/single" component={SinglePost} exact />
          <Route path="https://algoarena-frontend.onrender.com/main" component={MainPage} exact />




        </ChatProvider>

      </BrowserRouter>

    </div>
  );
}

export default App;
