import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [terminals, setTerminals] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [terminalsResponse, groupsResponse, chatsResponse] =
          await Promise.all([
            axios.get("/api/terminales"),
            axios.get("/api/grupos"),
            axios.get("/api/chats"),
          ]);
        setTerminals(terminalsResponse.data);
        setGroups(groupsResponse.data);
        setChats(chatsResponse.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(
          "Hubo un error al obtener los datos. Por favor, inténtalo de nuevo más tarde."
        );
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const groupCounts = {
    connected: groups.filter((group) => group.isConnected).length,
    disconnected: groups.filter((group) => !group.isConnected).length,
  };

  const chatCounts = {
    active: chats.filter((chat) => chat.isActive).length,
    inactive: chats.filter((chat) => !chat.isActive).length,
  };

  const pieData = {
    labels: [
      "Terminales",
      "Grupos Conectados",
      "Grupos Desconectados",
      "Chats Activados",
      "Chats Desactivados",
    ],
    datasets: [
      {
        label: "Cantidad",
        data: [
          terminals.length,
          groupCounts.connected,
          groupCounts.disconnected,
          chatCounts.active,
          chatCounts.inactive,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-cyan-700">
        Dashboard
      </h2>

      <section className="mb-8 flex flex-wrap">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <h3 className="text-xl font-semibold mb-4 border-b border-cyan-700">
            Grupos
          </h3>
          <div className="max-h-96 overflow-y-auto">
            {groups.length > 0 ? (
              <GroupList groups={groups} />
            ) : (
              <p>Aún no se han creado grupos.</p>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <h3 className="text-xl font-semibold mb-4 border-b border-cyan-700">
            Resumen de Actividad
          </h3>
          <div className="w-full max-w-md mx-auto">
            <Pie data={pieData} />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap -mx-2">
        <section className="w-full md:w-1/2 px-2 mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-cyan-700">
            Terminales
          </h3>
          {terminals.length > 0 ? (
            <TerminalList terminals={terminals} />
          ) : (
            <p>Aún no se han creado terminales.</p>
          )}
        </section>

        <section className="w-full md:w-1/2 px-2 mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-cyan-700">
            Chats
          </h3>
          {chats.length > 0 ? (
            <ChatList chats={chats} />
          ) : (
            <p>Aún no se han creado chats.</p>
          )}
        </section>
      </div>
    </div>
  );
};

const GroupList = ({ groups }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
    {groups.map((group) => (
      <div
        key={group._id}
        className="bg-white shadow rounded p-4 max-h-40 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold truncate">{group.name}</h4>
          <span
            className={group.isConnected ? "text-green-500" : "text-red-500"}
          >
            {group.isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
        <ul className="text-sm mt-2 max-h-20 overflow-y-auto">
          {group.terminals.map((terminal) => (
            <li key={terminal._id} className="truncate">
              {terminal.name}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const TerminalList = ({ terminals }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {terminals.map((terminal) => (
      <div
        key={terminal._id}
        className="bg-white shadow rounded p-4 flex flex-col justify-between max-h-40 overflow-y-auto"
      >
        <h4 className="text-lg font-semibold mb-2 text-zinc-800 truncate">
          {terminal.name}
        </h4>
        <div className="flex justify-between text-sm text-zinc-800">
          <span className={getBatteryColor(terminal.batteryLevel)}>
            Batería: {terminal.batteryLevel}%
          </span>
          <span className={getWifiColor(terminal.wifiLevel)}>
            Wifi: {terminal.wifiLevel}%
          </span>
        </div>
      </div>
    ))}
  </div>
);

const ChatList = ({ chats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
    {chats.map((chat) => (
      <div
        key={chat._id}
        className="bg-white shadow rounded p-4 flex flex-col justify-between max-h-40 overflow-y-auto"
      >
        <h4 className="text-lg font-semibold mb-2 text-zinc-800 truncate">
          {chat.name}
        </h4>
        <div className="flex justify-between text-sm text-zinc-800">
          <span className={chat.isActive ? "text-green-500" : "text-red-500"}>
            {chat.isActive ? "Activado" : "Desactivado"}
          </span>
        </div>
        <p className="text-sm text-zinc-800">
          Participantes: {chat.participants}
        </p>
      </div>
    ))}
  </div>
);

const getBatteryColor = (level) => {
  if (level > 75) return "text-green-500";
  if (level > 50) return "text-yellow-500";
  if (level > 25) return "text-orange-500";
  return "text-red-500";
};

const getWifiColor = (level) => {
  if (level > 75) return "text-green-500";
  if (level > 50) return "text-yellow-500";
  if (level > 25) return "text-orange-500";
  return "text-red-500";
};

export default Dashboard;
