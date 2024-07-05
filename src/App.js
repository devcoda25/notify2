import BroadcastBody from "./Component/Broadcast/BroadcastBody";
import Footer from "./Component/Footer/Footer";
import Navbar from "./Component/Navbar/Navbar";

function App() {
  return (
    <div className="container">
      <Navbar/>
      <BroadcastBody/>
      <Footer/>
    </div>
  );
}

export default App;
