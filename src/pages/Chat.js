import React, { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [name, setName] = useState("");
  const [terminals, setTerminals] = useState([]);
  const [allTerminals, setAllTerminals] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsResponse, terminalsResponse] = await Promise.all([
          axios.get("/api/chats"),
          axios.get("/api/terminales"),
        ]);
        setChats(chatsResponse.data);
        setAllTerminals(terminalsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Hubo un error al obtener los datos.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (terminals.length === 0) {
      setError("Un chat debe tener al menos un terminal.");
      return;
    }
    setError("");
    const chatData = {
      name,
      terminals,
      isActive,
      participants: terminals.length,
    };
    console.log("Enviando datos del chat:", chatData);
    try {
      if (editId) {
        await axios.put(`/api/chats/${editId}`, chatData);
      } else {
        await axios.post("/api/chats", chatData);
      }
      fetchChats();
      resetForm();
    } catch (error) {
      console.error("Error al guardar el chat:", error);
      setError("Hubo un error al guardar el chat.");
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/chats");
      setChats(response.data);
    } catch (error) {
      console.error("Error al obtener chats:", error);
      setError("Hubo un error al obtener los chats.");
    }
  };

  const handleEdit = (chat) => {
    setName(chat.name);
    setTerminals(chat.terminals ? chat.terminals.map((t) => t._id) : []);
    setIsActive(chat.isActive);
    setEditId(chat._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/chats/${id}`);
      fetchChats();
    } catch (error) {
      console.error("Error al eliminar el chat:", error);
      setError("Hubo un error al eliminar el chat.");
    }
  };

  const handleTerminalChange = (terminalId) => {
    setTerminals((prevTerminals) =>
      prevTerminals.includes(terminalId)
        ? prevTerminals.filter((id) => id !== terminalId)
        : [...prevTerminals, terminalId]
    );
  };

  const filterAvailableTerminals = () => {
    const assignedTerminalIds = new Set(
      chats.flatMap((chat) =>
        chat.terminals ? chat.terminals.map((t) => t._id) : []
      )
    );
    return allTerminals.filter(
      (terminal) =>
        !assignedTerminalIds.has(terminal._id) ||
        terminals.includes(terminal._id)
    );
  };

  const resetForm = () => {
    setName("");
    setTerminals([]);
    setIsActive(false);
    setEditId(null);
  };

  const availableTerminals = filterAvailableTerminals();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-zinc-800 border-b-2 border-cyan-700">
        Gestión de Chats
      </h2>
      {error && (
        <p aria-live="polite" className="text-red-500 mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <fieldset>
          <legend className="text-xl font-semibold mb-4 text-zinc-800">
            Datos del Chat
          </legend>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-grow">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre del Chat:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="ml-4">
              <label
                htmlFor="isActive"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                ¿Está activo?
              </label>
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-checkbox h-5 w-5 text-cyan-700"
              />
            </div>
          </div>
          <div className="mb-4">
            <fieldset>
              <legend className="text-lg font-semibold mb-2 text-zinc-800">
                Terminales Disponibles
              </legend>
              <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTerminals.length > 0 ? (
                  availableTerminals.map((terminal) => (
                    <div key={terminal._id}>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={terminals.includes(terminal._id)}
                          onChange={() => handleTerminalChange(terminal._id)}
                          className="form-checkbox h-5 w-5 text-cyan-700"
                        />
                        <span className="ml-2">{terminal.name}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No hay terminales disponibles.
                  </p>
                )}
              </div>
            </fieldset>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar
          </button>
        </fieldset>
      </form>
      <section>
        <h3 className="text-2xl font-semibold mt-8 mb-4 text-zinc-800 border-b border-cyan-700">
          Lista de Chats
        </h3>
        {chats.length > 0 ? (
          <div className="flex flex-wrap -m-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <div className="bg-white shadow rounded p-4 flex flex-col h-full">
                  <header className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-zinc-800">
                      {chat.name}
                    </h4>
                    <span
                      className={`text-sm ${
                        chat.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {chat.isActive ? "Activado" : "Desactivado"}
                    </span>
                  </header>
                  <p className="text-gray-600 mb-4">
                    Participantes: {chat.participants}
                  </p>
                  <div className="mt-auto flex space-x-2">
                    <button
                      onClick={() => handleEdit(chat)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(chat._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aún no se han creado chats.</p>
        )}
      </section>
    </div>
  );
};

export default Chat;
