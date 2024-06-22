import React, { useEffect, useState } from "react";
import axios from "axios";

const Terminal = () => {
  const [terminals, setTerminals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    batteryLevel: 0,
    wifiLevel: 0,
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTerminals();
  }, []);

  const fetchTerminals = async () => {
    try {
      const response = await axios.get("/api/terminales");
      setTerminals(response.data);
    } catch (error) {
      console.error("Error al obtener terminales:", error);
      setError("Hubo un error al obtener los terminales.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const terminalData = { ...formData };
    try {
      if (editId) {
        await axios.put(`/api/terminales/${editId}`, terminalData);
      } else {
        await axios.post("/api/terminales", terminalData);
      }
      fetchTerminals();
      resetForm();
    } catch (error) {
      console.error("Error al guardar terminal:", error);
      setError("Hubo un error al guardar el terminal.");
    }
  };

  const handleEdit = (terminal) => {
    setFormData({
      name: terminal.name,
      batteryLevel: terminal.batteryLevel,
      wifiLevel: terminal.wifiLevel,
    });
    setEditId(terminal._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/terminales/${id}`);
      fetchTerminals();
    } catch (error) {
      console.error("Error al eliminar terminal:", error);
      setError("Hubo un error al eliminar el terminal.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "batteryLevel" || name === "wifiLevel" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      batteryLevel: 0,
      wifiLevel: 0,
    });
    setEditId(null);
  };

  const getBatteryColor = (batteryLevel) => {
    if (batteryLevel > 75) return "text-green-500";
    if (batteryLevel > 50) return "text-yellow-500";
    if (batteryLevel > 25) return "text-orange-500";
    return "text-red-500";
  };

  const getWifiColor = (wifiLevel) => {
    if (wifiLevel > 75) return "text-green-500";
    if (wifiLevel > 50) return "text-yellow-500";
    if (wifiLevel > 25) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-zinc-800 border-b-2 border-cyan-700">
        Gestión de Terminales
      </h2>
      {error && (
        <p aria-live="polite" className="text-red-500 mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <fieldset>
          <legend className="text-xl font-semibold mb-4 text-zinc-800">
            Datos del Terminal
          </legend>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nombre del terminal:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="batteryLevel"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nivel de la batería: {formData.batteryLevel}%
            </label>
            <input
              id="batteryLevel"
              type="range"
              name="batteryLevel"
              min="0"
              max="100"
              value={formData.batteryLevel}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="wifiLevel"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nivel del wifi: {formData.wifiLevel}%
            </label>
            <input
              id="wifiLevel"
              type="range"
              name="wifiLevel"
              min="0"
              max="100"
              value={formData.wifiLevel}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
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
          Lista de Terminales
        </h3>
        {terminals.length > 0 ? (
          <div className="flex flex-wrap -m-2">
            {terminals.map((terminal) => (
              <div
                key={terminal._id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <div className="bg-white shadow rounded p-4 flex flex-col">
                  <h4 className="text-lg font-semibold text-zinc-800 mb-2">
                    {terminal.name}
                  </h4>
                  <p
                    className={`mb-2 ${getBatteryColor(terminal.batteryLevel)}`}
                  >
                    Batería: {terminal.batteryLevel}%
                  </p>
                  <p className={`mb-2 ${getWifiColor(terminal.wifiLevel)}`}>
                    Wifi: {terminal.wifiLevel}%
                  </p>
                  <div className="mt-auto flex space-x-2">
                    <button
                      onClick={() => handleEdit(terminal)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(terminal._id)}
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
          <p className="text-gray-500">Aún no se han creado terminales.</p>
        )}
      </section>
    </div>
  );
};

export default Terminal;
