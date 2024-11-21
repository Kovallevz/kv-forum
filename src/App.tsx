import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import UserProfile from './pages/UserProfile';
import PostList from './pages/PostList';
import { ROUTES } from './constants/routes';
import Auth from './pages/Auth';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.AUTH} />} />
        <Route path={ROUTES.AUTH} element={<Auth />} />
        <Route element={<Layout />}>
          <Route path={ROUTES.POSTS} element={<PostList />} />
          <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
          <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;