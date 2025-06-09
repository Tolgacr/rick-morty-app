import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "./App.css";

// Uygulama ana bileşeni
function App() {
  // State'ler
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtreler
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Sayfa ayarları
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Seçili karakter
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Karakterleri API'den çek
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

  // Filtreleri uygula
  useEffect(() => {
    const result = characters.filter((char) =>
      char.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (statusFilter ? char.status === statusFilter : true) &&
      (genderFilter ? char.gender === genderFilter : true)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [characters, nameFilter, statusFilter, genderFilter]);

  // Sayfa hesaplamaları
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Yükleniyor ekranı
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rick and Morty Characters</h1>

      {/* Filtre alanı */}
      <div className="filters">
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
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={(i + 1) * 5}>
              {(i + 1) * 5}
            </option>
          ))}
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
                <React.Fragment key={char.id}>
                  <tr>
                    {/* İsme tıkla, detay aç/kapat */}
                    <td
                      style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() =>
                        setSelectedCharacter((prev) => prev?.id === char.id ? null : char)
                      }
                    >
                      {char.name}
                    </td>
                    <td>{char.status}</td>
                    <td>{char.species}</td>
                    <td>{char.gender}</td>
                  </tr>

                  {/* Seçili karakterin detayları */}
                  {selectedCharacter?.id === char.id && (
                    <tr>
                      <td colSpan="4">
                        <div
                          style={{
                            marginTop: "10px",
                            border: "1px solid #ccc",
                            padding: "15px",
                            borderRadius: "6px",
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={char.image}
                            alt={char.name}
                            width="120"
                            height="120"
                            style={{ borderRadius: "8px" }}
                          />
                          <div>
                            <h2>{char.name}</h2>
                            <p>
                              <strong>Status:</strong> {char.status}
                            </p>
                            <p>
                              <strong>Species:</strong> {char.species}
                            </p>
                            <p>
                              <strong>Gender:</strong> {char.gender}
                            </p>
                            <p>
                              <strong>Location:</strong> {char.location.name}
                            </p>
                            <p>
                              <strong>Origin:</strong> {char.origin.name}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Sayfalama */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default App;
