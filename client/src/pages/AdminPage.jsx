import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch('/api/admin-data')
        .then(response => response.json())
        .then(data => setAdminData(data))
        .catch(error => console.error('Error fetching admin data', error));
    }
  }, [user]);

  if (user && user.role !== 'admin') {
    return <div className="p-4">Access Denied</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
      {adminData ? (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(adminData, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AdminPage;