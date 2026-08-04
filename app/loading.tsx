export default function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "5rem 1rem" }}>
      <span
        aria-label="Loading"
        role="status"
        style={{
          display: "inline-block",
          width: 34,
          height: 34,
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}
