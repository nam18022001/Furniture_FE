import './App.css'
import Header from './Header/Header'
import Navbar from './Navbar/Navbar'

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <Navbar />
      </div>
      <div>{/* main part */}</div>
    </div>
  )
}

export default App
