import { useSearchParams } from "react-router-dom";
import VideoList from './VideoList';

function Main() {
    
    const [searchParams] = useSearchParams();
    const user = searchParams.get('author');
    const search = searchParams.get('search')
    return (
        <div className="mx-5">
            <VideoList user={user} search={search} />
        </div>
    );
}

export default Main;