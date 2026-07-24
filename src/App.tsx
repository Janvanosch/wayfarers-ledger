function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#f8f5ef",
        color: "#2d2418",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>The Wayfarer's Ledger</h1>

        <p>A Practical Handbook for Fantasy Festivals</p>

        <hr
          style={{
            width: "8rem",
            margin: "2rem auto",
            border: 0,
            borderTop: "1px solid #b9ab90",
          }}
        />

        <small>Build 1.1 • First Entry</small>
      </div>
    </main>
  );
}

export default App;