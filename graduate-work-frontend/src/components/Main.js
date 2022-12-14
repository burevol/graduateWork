import { useSearchParams } from "react-router-dom";
import Navigation from './Navbar'
import VideoList from './VideoList';

function Main() {
    
    const [searchParams] = useSearchParams();
    const user = searchParams.get('author');
    const search = searchParams.get('search')
    return (
        <div>
            <Navigation />
            <VideoList user={user} search={search} />
        </div>
    );
}

export default Main;