import React, { useEffect, useState } from "react";
import axios from "axios";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [terminals, setTerminals] = useState([]);
  const [allTerminals, setAllTerminals] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsResponse, terminalsResponse] = await Promise.all([
          axios.get("/api/grupos"),
          axios.get("/api/terminales"),
        ]);
        setGroups(groupsResponse.data);
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
      setError("Un grupo debe tener al menos un terminal.");
      return;
    }
    setError("");
    const groupData = { name, terminals, isConnected };
    try {
      if (editId) {
        await axios.put(`/api/grupos/${editId}`, groupData);
      } else {
        await axios.post("/api/grupos", groupData);
      }
      fetchGroups();
      resetForm();
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
      setError("Hubo un error al guardar el grupo.");
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("/api/grupos");
      setGroups(response.data);
    } catch (error) {
      console.error("Error al obtener grupos:", error);
      setError("Hubo un error al obtener los grupos.");
    }
  };

  const handleEdit = (group) => {
    setName(group.name);
    setTerminals(group.terminals.map((t) => t._id));
    setIsConnected(group.isConnected);
    setEditId(group._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/grupos/${id}`);
      fetchGroups();
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
      setError("Hubo un error al eliminar el grupo.");
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
      groups.flatMap((group) => group.terminals.map((t) => t._id))
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
    setIsConnected(false);
    setEditId(null);
  };

  const availableTerminals = filterAvailableTerminals();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 border-b-2 border-cyan-700">
        Gestión de Grupos
      </h2>
      {error && (
        <p aria-live="polite" className="text-red-500 mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <fieldset>
          <legend className="text-xl font-semibold mb-4 text-zinc-800">
            Datos del Grupo
          </legend>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex-grow">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre del Grupo:
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
                htmlFor="isConnected"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                ¿Está conectado?
              </label>
              <input
                id="isConnected"
                type="checkbox"
                checked={isConnected}
                onChange={(e) => setIsConnected(e.target.checked)}
                className="form-checkbox h-5 w-5 text-cyan-700 bg-cyan-700"
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
        <h3 className="text-xl font-semibold mt-8 mb-4 text-zinc-800 border-b border-cyan-700">
          Lista de Grupos
        </h3>
        {groups.length > 0 ? (
          <div className="flex flex-wrap -m-2">
            {groups.map((group) => (
              <div
                key={group._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <div className="bg-white shadow rounded p-4 flex flex-col h-full">
                  <header className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-zinc-800">
                      {group.name}
                    </h4>
                    <span
                      className={`text-sm ${
                        group.isConnected ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {group.isConnected ? "Conectado" : "Desconectado"}
                    </span>
                  </header>
                  <ul className="mb-4 text-zinc-800 max-h-24 overflow-y-auto">
                    {group.terminals.map((terminal) => (
                      <li key={terminal._id}>{terminal.name}</li>
                    ))}
                  </ul>
                  <div className="mt-auto flex space-x-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(group._id)}
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
          <p className="text-gray-500">Aún no se han creado grupos.</p>
        )}
      </section>
    </div>
  );
};

export default Group;
