const testSubmit = async () => {
    try {
        const res = await fetch("http://localhost:3013/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User",
                email: "test@example.com",
                company: "Test Co",
                message: "This is a test message from the debugger",
                source: "backend_test"
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

testSubmit();
