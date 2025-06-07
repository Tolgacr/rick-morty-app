import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        let all = [];
        let page = 1;
        console.log(all.length);

        while (all.length < 800) {
          const res = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
          all = [...all, ...res.data.results];
          page++;
        }
        setCharacters(all.slice(0, 800));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    const result = characters.filter((char) =>
      char.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (statusFilter ? char.status === statusFilter : true) &&
      (genderFilter ? char.gender === genderFilter : true)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [characters, nameFilter, statusFilter, genderFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rick and Morty Characters</h1>

      {/* Filtreleme */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>
        <select value={pageSize} onChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(1);
        }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Tablo */}
      {paginated.length === 0 ? (
        <p>No characters match your filters.</p>
      ) : (
        <>
          <table border="1" cellPadding="6" style={{ width: "100%", cursor: "pointer" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((char) => (
                <tr key={char.id}>
                  <td
                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => {
                      console.log("Tıklanan karakter:", char);
                      setSelectedCharacter((prev) => prev?.id === char.id ? null : char);
                    }}
                  >
                    {char.name}
                  </td>
                  <td>{char.status}</td>
                  <td>{char.species}</td>
                  <td>{char.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sayfalama */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}

      {/* Detay Kartı */}
      {selectedCharacter && (
        <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "6px", display: "flex", gap: "20px", alignItems: "center" }}>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} width="150" height="150" style={{ borderRadius: "8px" }} />
          <div>
            <h2>{selectedCharacter.name}</h2>
            <p><strong>Status:</strong> {selectedCharacter.status}</p>
            <p><strong>Species:</strong> {selectedCharacter.species}</p>
            <p><strong>Gender:</strong> {selectedCharacter.gender}</p>
            <p><strong>Location:</strong> {selectedCharacter.location.name}</p>
            <p><strong>Origin:</strong> {selectedCharacter.origin.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
