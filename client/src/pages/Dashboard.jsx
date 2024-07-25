import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(state => state.user);

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {user && user.role === 'admin' && (
          <a href="/admin" className="text-blue-500 underline">
            Go to Admin Page
          </a>
        )}
        <div className="mt-4 text-lg">
          Welcome, {user ? user.username : 'Guest'}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;