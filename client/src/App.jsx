import './App.css'
import Auth from './components/Auth'
import HangAnim from './components/HangAnim'
import Leaderboard from './components/Leaderboard'
import Game from './components/Game'
import GameChoice from './components/GameChoice'
import Navbar from './components/Navbar'
import Rules from './components/Rules'
import Profile from './components/Profile'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//testing
// import Win from './components/Win'
// import Lost from './components/Lost'
// import WordDisplay from './components/GameComp/WordDisplay'
// import Input from './components/GameComp/Input'
// import Hangman from './components/GameComp/Hangman'
// import Deadman from './components/Deadman'

const router= createBrowserRouter(
  [
    {
      path: '/login', //Done
      element: 
      <div>
        <Auth />
      </div>
    },
    {
      path: '/signUp', //Done
      element: 
      <div>
        <Auth />
      </div>
    },
    {
      path: '/', //Done
      element:
      <div>
        <Navbar />
        <HangAnim />
      </div>
    },
    {
      path: '/play',
      element:
      <div>
        <Navbar />
        {/* <Game /> */}
        <GameChoice/>
      </div>
    },
    {
      path: '/game', 
      element:
      <div>
        <Navbar />
        <Game />
      </div>
    },
    {
      path: '/profile', //Done
      element:
      <div>
        <Navbar />
        <Profile />
      </div>
    },
    {
      path: '/leaderboard', //DONE
      element: 
      <div>
        <Navbar />
        <Leaderboard />
      </div>
    },
    {
      path: '/rules',
      element: 
      <div>
        <Navbar />
        <Rules/>
      </div>
    },
    // {
    //   path:'/testing',
    //   element: 
    //   <div>
    //     <Navbar />
    //     {/* <Win /> */}
    //     {/* <Lost word={"music"}/> */}
    //     {/* <Input /> */}
    //     {/* <Hangman attempts={0}/> */}
    //     <Deadman />
    //   </div>
      // <div>
      //   {/* <Win onClose={()=>navigate('/leaderboard')} word={word}/> */}
      //   <Win onClose={()=>console.log("win")} word="Hello"/>
      // </div>
    // }
  ]
)

function App() {
  return (
    <div>
      <RouterProvider router={router}/>    
      <Toaster />  
    </div>
  )
}

export default App
