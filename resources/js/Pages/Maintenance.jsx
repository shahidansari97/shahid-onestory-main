export default function Maintenance() {
    return (
        <div style={styles.body}>
            <div style={styles.container}>
                
                <div style={styles.icon}>🔧</div>

                <h1 style={styles.h1}>We'll Be Back Soon!</h1>

                <p style={styles.p}>
                    Our website is currently under scheduled maintenance.<br />
                    We're working hard to bring you the best experience.
                </p>

                <div style={styles.info}>
                    <strong>Expected Downtime:</strong>
                    <br />
                    30 - 60 minutes
                </div>

                <a href="#" style={styles.btn}>
                    Notify Me When Back
                </a>

                <footer style={styles.footer}>
                    Thank you for your patience ❤️<br />
                    &copy; 2026 Onestoryplanet
                </footer>
            </div>
        </div>
    );
}

const styles = {
    body: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        color: "white",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden"
    },
    container: {
        maxWidth: "600px",
        padding: "40px 20px"
    },
    icon: {
        fontSize: "100px",
        marginBottom: "20px",
        animation: "spin 10s linear infinite"
    },
    h1: {
        fontSize: "48px",
        marginBottom: "15px"
    },
    p: {
        fontSize: "20px",
        marginBottom: "30px",
        opacity: 0.9
    },
    info: {
        background: "rgba(255,255,255,0.1)",
        padding: "25px",
        borderRadius: "15px",
        margin: "30px 0",
        backdropFilter: "blur(10px)"
    },
    btn: {
        display: "inline-block",
        padding: "12px 30px",
        background: "white",
        color: "#1e3a8a",
        textDecoration: "none",
        borderRadius: "50px",
        fontWeight: "bold",
        marginTop: "20px"
    },
    footer: {
        marginTop: "50px",
        fontSize: "14px",
        opacity: 0.7
    }
};