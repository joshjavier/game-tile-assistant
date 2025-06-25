import { Navigate, Route, Routes } from 'react-router'
import Home from '@/pages/Home'
import { DeprecationBanner } from './components/DeprecationBanner'

const App = () => {
  return (
    <div className="App">
      <DeprecationBanner />
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
