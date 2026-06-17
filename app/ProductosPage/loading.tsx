export default function Loading() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            gap: "16px",
        }}>
            <div style={{
                width: "40px",
                height: "40px",
                border: "3px solid #eee",
                borderTopColor: "#0b8783",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "#888", fontSize: "14px" }}>Cargando productos...</p>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}