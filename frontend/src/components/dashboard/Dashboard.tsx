import { useEffect, useState } from "react";
import { getUsers } from "../../lib/endpoints";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {users.map(u => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}
