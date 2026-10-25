import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      {/* <main>
        <Gallery activeCategory={activeCategory} />
      </main>       */}
      {/* <PhotoCard /> */}
      <Gallery />

    </div>
  );
}

export default App;
