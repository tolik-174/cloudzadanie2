import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'
import MeetingDetails from './pages/MeetingDetails'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/meetings/:id" element={<MeetingDetails />} />
      </Routes>
    </BrowserRouter>
  )
}
