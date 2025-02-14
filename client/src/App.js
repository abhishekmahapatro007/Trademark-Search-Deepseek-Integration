import { Route,Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Results from './components/Results';

function App() {
  return (
    <div>
      <Navbar />
      <div className='bg-slate-200 min-h-screen'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/search" element={<Results />} />
        </Routes>
      </div>
      <Footer/>
    </div>

  );
}

export default App;
