"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import api from "@/services/api";

const ListPage = ({
  keys,
  modelName,
  onEdit,
  setListUpdateHandler,
  extraColumns = [],
}) => {
  const router = useRouter();

  let token = null;

  if (globalThis.localStorage !== undefined) {
    token = globalThis.localStorage.getItem("token");
  }

  const [listData, setListData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [sizePerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const paginationDto = {
    page,
    sizePerPage,
    keyword: searchTerm.trim(),
  };

  const getItemIdentifier = (item, rowIndex) =>
    item?.identifier ??
    item?.id ??
    item?.username ??
    `${modelName}-${rowIndex}`;

  const filteredData = listData.map((item, rowIndex) => ({
    item,
    rowIndex,
  }));

  const fetchList = async () => {
    try {
      const res = await api.post(`/${modelName}/list`, paginationDto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setListData(res.data.dtoList || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong";

      setErrorModal({
        open: true,
        title: `Error ${err.response?.status || ""}`,
        message,
      });
    }
  };

  const handleToggleStatus = (rowIndex) => {
    const updatedList = [...listData];

    updatedList[rowIndex].status = !updatedList[rowIndex].status;
    setListData(updatedList);

    api.put(
      `/${modelName}/toggle`,
      {
        identifier: updatedList[rowIndex].identifier,
        status: updatedList[rowIndex].status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  const handleDelete = async (identifier) => {
    if (globalThis.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/${modelName}/delete?identifier=${identifier}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(`${modelName} deleted successfully`);
        setTimeout(() => setMessage(""), 3000);

        fetchList();
      } catch (err) {
        console.log(err)
        setMessage("Delete failed");
      }
    }
  };

  const handleUpdateSuccess = (updatedItem) => {
    setListData((prev) =>
      prev.map((item, rowIndex) =>
        getItemIdentifier(item, rowIndex) ===
        getItemIdentifier(updatedItem, rowIndex)
          ? updatedItem
          : item,
      ),
    );
  };

  useEffect(() => {
    fetchList();
  }, [modelName, page, searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    setListUpdateHandler?.(() => handleUpdateSuccess);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {modelName.charAt(0).toUpperCase() + modelName.slice(1)} List
        </h2>

        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-lg px-6 py-3 rounded-xl shadow-lg text-sm">
            {message}
          </div>
        )}

        <div className="bg-white/90 rounded-2xl shadow-xl p-6">
          <div className="mb-5 flex justify-end">
            <div className="relative w-full max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${modelName}`}
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center text-gray-600">
              No data found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {keys.map((key) => (
                      <th key={key} className="py-3 px-3 text-left">
                        {key}
                      </th>
                    ))}
                    {extraColumns.map((col) => (
                      <th key={col.header} className="py-3 px-3 text-left">
                        {col.header}
                      </th>
                    ))}
                    <th className="py-3 px-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map(({ item, rowIndex }) => {
                    const displayedRowIndex = page * sizePerPage + rowIndex;
                    return (
                      <tr
                        key={getItemIdentifier(item, rowIndex)}
                        className="border-b hover:bg-blue-100/40 transition"
                      >
                        {keys.map((key) =>
                          key === "status" ? (
                            <td
                              key={`${getItemIdentifier(item, rowIndex)}-${key}`}
                              className="py-3 px-3"
                            >
                              <label
                                className="relative inline-flex items-center cursor-pointer"
                                aria-label="Toggle status"
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={item[key] === true}
                                  onChange={() => handleToggleStatus(rowIndex)}
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300" />
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-5" />
                              </label>
                            </td>
                          ) : (
                            <td
                              key={`${getItemIdentifier(item, rowIndex)}-${key}`}
                              className="py-3 px-3"
                            >
                              {key === "id"
                                ? displayedRowIndex + 1
                                : String(item[key] ?? "")}
                            </td>
                          ),
                        )}

                        {extraColumns.map((col) => (
                          <td
                            key={`${getItemIdentifier(item, rowIndex)}-${col.header}`}
                            className="py-3 px-3"
                          >
                            {col.render(item)}
                          </td>
                        ))}

                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                onEdit(
                                  getItemIdentifier(item, rowIndex),
                                  fetchList,
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow"
                            >
                              Update
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(getItemIdentifier(item, rowIndex))
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-center gap-3 mt-4">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Prev
                  </button>

                  <span className="px-2">
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Next
                  </button>
                </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => router.push("/home")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Home
          </button>

          <button
            onClick={() => router.push(`/${modelName}/Add`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add {modelName}
          </button>
        </div>
      </div>
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-red-600">
              {errorModal.title}
            </h2>

            <p className="mb-6 text-gray-700">
              {errorModal.message}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  setErrorModal({
                    open: false,
                    title: "",
                    message: "",
                  })
                }
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ListPage.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  modelName: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  setListUpdateHandler: PropTypes.func,
  extraColumns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    }),
  ),
};

export default ListPage;
