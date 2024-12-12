import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Games } from "./features/games/Games"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"

const App = () => {
  return (
    <div className="App">
      <Games />
    </div>
  )
}

export default App
