import db from "./db";

function run(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function resetDatabase() {
    await run(`DELETE FROM organisation_cache`);

    console.log("✔ organisation_cache cleared");

    await run(
        `DELETE FROM sqlite_sequence WHERE name='organisation_cache'`
    );

    console.log("✔ sqlite_sequence reset");
}

resetDatabase()
    .then(() => {
        console.log("✔ DB reset complete");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ DB reset failed:", err);
        process.exit(1);
    });