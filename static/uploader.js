async function saveClientSide(file) {
    try {
        const folderHandle = await window.showDirectoryPicker();
        const newFileHandle = await folderHandle.getFileHandle(file.name, { create: true });
        const writable = await newFileHandle.createWritable();
        await writable.write(await file.arrayBuffer());
        await writable.close();
        alert("Saved locally to your chosen folder");
        return true;
    } catch (err) {
        console.warn("Client-side save failed:", err);
        return false;
    }
}

async function saveServerSide(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    alert("Saved on server desktop: " + data.saved_to);
}

document.getElementById("saveBtn").onclick = async () => {
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
        alert("Choose a file first");
        return;
    }

    // Try browser save first
    if ("showDirectoryPicker" in window) {
        const ok = await saveClientSide(file);
        if (ok) return;
    }

    // Fallback to server
    await saveServerSide(file);
};
