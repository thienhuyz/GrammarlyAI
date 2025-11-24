import { useSelector } from "react-redux";
import { Intro, Doc } from "../../components";


const Home = () => {
    const { isLoggedIn } = useSelector((state) => state.user);

    if (isLoggedIn) {
        return <Doc />;
    }

    return <Intro />;
};

export default Home;
