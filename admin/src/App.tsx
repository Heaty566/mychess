import './App.css';
import Login from './containers/login';
import Navbar from './components/navbar';
import Layout from 'antd/lib/layout/layout';

function App() {
    return (
        <div className="App h-screen ">
            <Layout className="h-full">
                <Navbar />
                <Login />
            </Layout>
        </div>
    );
}

export default App;
