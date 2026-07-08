import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Calculator from './pages/Calculator';
import TaxLaws from './pages/TaxLaws';
import Benefits from './pages/Benefits';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Calculator />} />
        <Route path="tax-laws" element={<TaxLaws />} />
        <Route path="benefits" element={<Benefits />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
