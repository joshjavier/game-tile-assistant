import { Link, Navigate, Route, Routes } from "react-router"
import Home from "@/pages/Home"

const App = () => {
  return (
    <div className="App">
      {/* <header>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/betmgm/nj">Bet NJ</Link>
          <Link to="/betmgm/pa">Bet PA</Link>
          <Link to="/betmgm/mi">Bet MI</Link>
          <Link to="/betmgm/wv">Bet WV</Link>
          <Link to="/betmgm/on">Bet ON</Link>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/borgata/nj">Borg NJ</Link>
          <Link to="/borgata/pa">Borg PA</Link>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/partycasino/nj">PartyCasino NJ</Link>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/wof/nj">WOF NJ</Link>
          <Link to="/wof/on">WOF ON</Link>
        </div>
      </header> */}
      <Routes>
        <Route index element={<Navigate to="betmgm/nj" />} />
        <Route path=":brand">
          <Route index element={<Navigate to="nj" />} />
          <Route path=":state" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
