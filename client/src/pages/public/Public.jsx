import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../../components';
import { useSelector } from 'react-redux';

const Public = () => {

    const { isLoggedIn } = useSelector((state) => state.user);

    return (
        <div>
            <div className="bg-white min-h-screen">
                <Header />
                <main className="w-main mx-auto pt-18">
                    <Outlet />
                </main>
                {!isLoggedIn && <Footer />}
            </div>
        </div>
    )
}

export default Public
